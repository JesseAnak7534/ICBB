import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiAward,
  FiBookOpen,
  FiCode,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';
import { getApiUrl } from '../config/api';
import courses, { toProgramType } from '../data/courses';
import './Training.css';

const Training = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    role: 'student',
    programType: '',
    programName: '',
    experienceLevel: 'beginner',
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Icons live here rather than in the data module so the catalogue stays
  // plain data and can be imported anywhere.
  const iconMap = {
    book: <FiBookOpen />,
    code: <FiCode />,
    chart: <FiAward />,
    users: <FiUsers />
  };

  const programs = courses.map((course) => ({
    ...course,
    icon: iconMap[course.iconKey] || <FiBookOpen />
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const next = { ...prev, [name]: value };

      // programType is required by the API but has no field of its own, so it
      // is derived from whichever course was picked.
      if (name === 'programName') {
        const selected = courses.find(course => course.title === value);
        next.programType = selected ? toProgramType(selected.type) : '';
      }

      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(getApiUrl('/api/training/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Registration submitted successfully! Check your email for confirmation.');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          institution: '',
          role: 'student',
          programType: '',
          programName: '',
          experienceLevel: 'beginner',
          motivation: ''
        });
      } else {
        // express-validator returns field errors under `errors`, with no
        // top-level `message` — without this the user only ever saw a generic
        // failure and had no idea which field was wrong.
        const validationError =
          Array.isArray(data.errors) && data.errors.length > 0
            ? data.errors.map(err => err.msg).join(' ')
            : null;
        toast.error(validationError || data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('Error submitting registration. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectProgram = (program) => {
    setFormData(prev => ({
      ...prev,
      programType: toProgramType(program.type),
      programName: program.title
    }));
    document.getElementById('registration-form').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="training-page">
      {/* Hero Section */}
      <section className="training-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">Training & Capacity Building</span>
            <h1>Build Your Skills in Computational Biology</h1>
            <p>
              Join our comprehensive training programs designed for researchers, 
              students, and professionals. From beginner workshops to advanced 
              bootcamps, we offer courses tailored to your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Program Types */}
      <section className="program-types section">
        <div className="container">
          <div className="types-grid">
            <div className="type-card">
              <div className="type-icon"><FiCalendar /></div>
              <h3>Workshops</h3>
              <p>Short, intensive 3-5 day programs focusing on specific skills and tools.</p>
            </div>
            <div className="type-card">
              <div className="type-icon"><FiClock /></div>
              <h3>Short Courses</h3>
              <p>2-3 week programs providing in-depth training on specialized topics.</p>
            </div>
            <div className="type-card">
              <div className="type-icon"><FiUsers /></div>
              <h3>Bootcamps</h3>
              <p>Immersive 4+ week programs with comprehensive hands-on training.</p>
            </div>
            <div className="type-card">
              <div className="type-icon"><FiAward /></div>
              <h3>Certifications</h3>
              <p>Professional certifications validating your computational biology skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section className="programs-section section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Our Programs</span>
            <h2>Available Training Programs</h2>
            <p>Choose from our range of programs designed for different skill levels</p>
          </div>
          
          <div className="programs-grid">
            {programs.map((program, index) => (
              <motion.div 
                key={program.id}
                className="program-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="program-header">
                  <div className="program-icon">{program.icon}</div>
                  <span className={`program-type ${program.type.toLowerCase().replace(' ', '-')}`}>
                    {program.type}
                  </span>
                </div>
                <h3>{program.title}</h3>
                <p className="program-desc">{program.description}</p>
                <div className="program-meta">
                  <span><FiClock /> {program.duration}</span>
                  <span><FiUsers /> {program.level}</span>
                </div>
                <div className="program-topics">
                  <h4>Topics Covered:</h4>
                  <ul>
                    {program.topics.map((topic, i) => (
                      <li key={i}><FiCheck /> {topic}</li>
                    ))}
                  </ul>
                </div>
                <div className="program-actions">
                  <Link className="btn btn-outline" to={`/training/${program.id}`}>
                    View Details
                  </Link>
                  <button
                    className="btn btn-primary"
                    onClick={() => selectProgram(program)}
                  >
                    Register Interest <FiArrowRight />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="registration-form" className="registration-section section">
        <div className="container">
          <div className="registration-grid">
            <div className="registration-info">
              <span className="section-badge">Get Started</span>
              <h2>Register Your Interest</h2>
              <p>
                Fill out the form to express your interest in our training programs. 
                We'll contact you with more details about upcoming sessions.
              </p>
              <div className="info-features">
                <div className="info-item">
                  <FiCheck />
                  <span>Expert instructors with industry experience</span>
                </div>
                <div className="info-item">
                  <FiCheck />
                  <span>Hands-on practical exercises</span>
                </div>
                <div className="info-item">
                  <FiCheck />
                  <span>Certificate upon completion</span>
                </div>
                <div className="info-item">
                  <FiCheck />
                  <span>Access to learning materials</span>
                </div>
                <div className="info-item">
                  <FiCheck />
                  <span>Post-training support</span>
                </div>
              </div>
            </div>
            <div className="registration-form-container">
              <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institution/Organization</label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="student">Student</option>
                      <option value="researcher">Researcher</option>
                      <option value="professional">Professional</option>
                      <option value="faculty">Faculty</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience Level</label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Program of Interest *</label>
                  <select
                    name="programName"
                    value={formData.programName}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select a program</option>
                    {programs.map(program => (
                      <option key={program.id} value={program.title}>
                        {program.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Why are you interested in this program?</label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Tell us about your goals and why you want to join..."
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="training-cta section">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Need Custom Training?</h2>
            <p>
              We also offer customized training programs for organizations and groups. 
              Contact us to discuss your specific training needs.
            </p>
            <Link to="/contact" className="btn btn-white btn-lg">
              Contact Us <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Training;
