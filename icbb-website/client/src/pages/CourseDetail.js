import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiAward,
  FiCheck,
  FiClock,
  FiLayers,
  FiMonitor,
  FiUsers
} from 'react-icons/fi';
import SEO from '../components/SEO';
import NotFound from './NotFound';
import { getCourseById, getSeriesCourses, RESEARCH_METHODS_SERIES } from '../data/courses';
import './CourseDetail.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const course = getCourseById(courseId);

  // An unknown id renders the 404 page in place, keeping the bad URL visible
  // so the visitor can see what they mistyped.
  if (!course) {
    return <NotFound />;
  }

  const seriesCourses = course.series ? getSeriesCourses(course.series.slug) : [];
  const isResearchMethods =
    course.series && course.series.slug === RESEARCH_METHODS_SERIES.slug;

  return (
    <div className="course-detail-page">
      <SEO
        title={course.title}
        description={course.summary || course.description}
        keywords={course.topics.join(', ')}
      />

      {/* Hero */}
      <section className="course-hero">
        <div className="container">
          <Link to="/training" className="course-back-link">
            <FiArrowLeft /> All training programs
          </Link>

          <motion.div
            className="course-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {course.series && (
              <span className="course-series-badge">
                Part {course.series.part} of {course.series.totalParts}
                {isResearchMethods ? ' — Research Methods series' : ''}
              </span>
            )}
            <h1>{course.title}</h1>
            <p className="course-hero-summary">{course.summary || course.description}</p>

            <div className="course-meta-row">
              <span><FiLayers /> {course.type}</span>
              <span><FiClock /> {course.duration}</span>
              <span><FiUsers /> {course.level}</span>
              {course.deliveryMode && <span><FiMonitor /> {course.deliveryMode}</span>}
            </div>

            <Link to="/training#registration-form" className="btn btn-white btn-lg">
              Register your interest <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="course-body section">
        <div className="container">
          <div className="course-layout">
            <div className="course-main">
              {/* Outcomes */}
              {course.outcomes && (
                <div className="course-block">
                  <h2>What you will be able to do</h2>
                  <ul className="course-check-list">
                    {course.outcomes.map((outcome, i) => (
                      <li key={i}><FiCheck /> <span>{outcome}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Curriculum */}
              {course.sessions && (
                <div className="course-block">
                  <h2>Curriculum</h2>
                  <div className="course-sessions">
                    {course.sessions.map((session, i) => (
                      <div className="course-session" key={i}>
                        <div className="course-session-number">{i + 1}</div>
                        <div className="course-session-content">
                          <h3>{session.title}</h3>
                          <ul>
                            {session.items.map((item, j) => (
                              <li key={j}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback for catalogue entries without a full curriculum yet */}
              {!course.sessions && (
                <div className="course-block">
                  <h2>Topics covered</h2>
                  <ul className="course-check-list">
                    {course.topics.map((topic, i) => (
                      <li key={i}><FiCheck /> <span>{topic}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Audience */}
              {course.audience && (
                <div className="course-block">
                  <h2>Who this is for</h2>
                  <ul className="course-check-list">
                    {course.audience.map((item, i) => (
                      <li key={i}><FiCheck /> <span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="course-sidebar">
              <div className="course-card">
                <h3>At a glance</h3>
                <dl>
                  <dt>Format</dt>
                  <dd>{course.format || course.type}</dd>
                  <dt>Duration</dt>
                  <dd>{course.duration}</dd>
                  <dt>Level</dt>
                  <dd>{course.level}</dd>
                  {course.assessment && (
                    <>
                      <dt>Assessment</dt>
                      <dd>{course.assessment}</dd>
                    </>
                  )}
                </dl>
              </div>

              {course.prerequisites && (
                <div className="course-card">
                  <h3>Prerequisites</h3>
                  <ul>
                    {course.prerequisites.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {course.software && (
                <div className="course-card">
                  <h3>Software used</h3>
                  <ul>
                    {course.software.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {course.certificate && (
                <div className="course-card course-card-accent">
                  <h3><FiAward /> Certificate</h3>
                  <p>{course.certificate}</p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Sibling parts in the same series */}
      {seriesCourses.length > 1 && (
        <section className="course-series section">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-badge">Full sequence</span>
              <h2>{RESEARCH_METHODS_SERIES.name}</h2>
              <p>{RESEARCH_METHODS_SERIES.description}</p>
            </div>

            <div className="course-series-grid">
              {seriesCourses.map((item) => {
                const isCurrent = item.id === course.id;
                return (
                  <div
                    className={`course-series-card${isCurrent ? ' is-current' : ''}`}
                    key={item.id}
                  >
                    <span className="course-series-part">Part {item.series.part}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="course-series-meta">
                      <span><FiClock /> {item.duration}</span>
                      <span><FiUsers /> {item.level}</span>
                    </div>
                    {isCurrent ? (
                      <span className="course-series-current">You are here</span>
                    ) : (
                      <Link className="btn btn-outline" to={`/training/${item.id}`}>
                        View Part {item.series.part}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CourseDetail;
