import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiAward,
  FiCheck,
  FiClock,
  FiDownload,
  FiFileText,
  FiLayers,
  FiMonitor
} from 'react-icons/fi';
import SEO from '../components/SEO';
import NotFound from './NotFound';
import { getCourseById } from '../data/courses';
import { getModule, materialsFolderByCourse } from '../content/modules';
import MaterialDownload from '../components/MaterialDownload';
import { useParticipantAuth } from '../context/ParticipantAuth';
import './ModulePage.css';

/**
 * Module syllabus — the course's teaching content, as opposed to the marketing
 * overview at /training/:courseId.
 */
const ModulePage = () => {
  const { courseId } = useParams();
  const { isSignedIn, hasPaidFor } = useParticipantAuth();
  const course = getCourseById(courseId);
  const module = getModule(courseId);
  const folder = materialsFolderByCourse[courseId];

  if (!course || !module) {
    return <NotFound />;
  }

  return (
    <div className="module-page">
      <SEO
        title={`${module.title} — Module`}
        description={module.overview}
        keywords="research methods, literature review, study design, sampling, research ethics"
      />

      <section className="module-hero">
        <div className="container">
          <Link to={`/training/${courseId}`} className="module-back-link">
            <FiArrowLeft /> Course overview
          </Link>

          <span className="module-code">{module.code}</span>
          <h1>{module.title}</h1>
          <p className="module-subtitle">{module.subtitle}</p>

          <div className="module-meta-row">
            <span><FiLayers /> {module.units.length} units</span>
            <span><FiClock /> {module.contactHours} contact hours</span>
            <span><FiMonitor /> {module.level}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="module-layout">
            <div className="module-main">
              <div className="module-block">
                <h2>About this module</h2>
                <p className="module-overview">{module.overview}</p>
              </div>

              <div className="module-block">
                <h2>Learning outcomes</h2>
                <ul className="module-check-list">
                  {module.outcomes.map((outcome, i) => (
                    <li key={i}><FiCheck /> <span>{outcome}</span></li>
                  ))}
                </ul>
              </div>

              <div className="module-block">
                <h2>Units</h2>
                <ol className="module-units">
                  {module.units.map((unit) => (
                    <li key={unit.id}>
                      <Link to={`/training/${courseId}/module/${unit.id}`} className="module-unit">
                        <span className="module-unit-number">{unit.number}</span>
                        <span className="module-unit-body">
                          <span className="module-unit-title">{unit.title}</span>
                          <span className="module-unit-summary">{unit.summary}</span>
                          <span className="module-unit-meta">
                            <FiClock /> {unit.duration}
                            <span aria-hidden="true"> · </span>
                            {unit.quiz.length} quiz questions
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="module-block">
                <h2>Assessment</h2>
                <p>{module.assessment.summary}</p>

                <div className="module-assessment">
                  {module.assessment.components.map((component, i) => (
                    <div className="module-assessment-item" key={i}>
                      <div className="module-assessment-head">
                        <h3>{component.name}</h3>
                        <span className="module-weight">{component.weight}</span>
                      </div>
                      <p>{component.detail}</p>
                    </div>
                  ))}
                </div>

                <h3 className="module-rubric-heading">Final proposal marking rubric</h3>
                <div className="module-table-wrap">
                  <table className="module-table">
                    <thead>
                      <tr>
                        <th scope="col">Criterion</th>
                        <th scope="col">Weight</th>
                        <th scope="col">What earns the marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {module.assessment.rubric.map((row, i) => (
                        <tr key={i}>
                          <td>{row.criterion}</td>
                          <td>{row.weight}%</td>
                          <td>{row.descriptor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="module-passmark">
                  Pass mark: <strong>{module.assessment.passMark}%</strong> overall.
                </p>
              </div>
            </div>

            <aside className="module-sidebar">
              <div className="module-card">
                <h3>Course materials</h3>
                <p className="module-card-note">
                  Slides and handouts for every unit, ready to project or print.
                </p>
                <MaterialDownload
                  folder={folder}
                  courseId={courseId}
                  file="research-methods-workbook.pdf"
                  label="Complete workbook"
                  note="All ten units · PDF"
                  icon={<FiDownload />}
                />
                <MaterialDownload
                  folder={folder}
                  courseId={courseId}
                  file="research-methods-slides.pptx"
                  label="Full slide deck"
                  note="All ten units · PowerPoint"
                  icon={<FiMonitor />}
                />
                <MaterialDownload
                  folder={folder}
                  courseId={courseId}
                  file="research-methods-syllabus.pdf"
                  label="Syllabus"
                  note="Outline and assessment · PDF"
                  icon={<FiFileText />}
                />
              </div>

              <div className="module-card">
                <h3>Who it is for</h3>
                <ul>
                  {module.audience.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="module-card">
                <h3>Prerequisites</h3>
                <ul>
                  {module.prerequisites.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="module-card module-card-accent">
                <h3><FiAward /> Certificate</h3>
                <p>{module.certificate}</p>

                {!isSignedIn ? (
                  <Link
                    to="/learn/register"
                    state={{ from: `/training/${courseId}/module`, courseId }}
                    className="btn btn-primary"
                  >
                    Register for this course
                  </Link>
                ) : hasPaidFor(courseId) ? (
                  <Link to="/learn" className="btn btn-primary">
                    View my progress
                  </Link>
                ) : (
                  <Link to={`/learn/pay/${courseId}`} className="btn btn-primary">
                    Complete payment to unlock materials
                  </Link>
                )}

              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModulePage;
