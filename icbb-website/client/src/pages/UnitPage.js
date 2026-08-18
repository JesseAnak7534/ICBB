import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiDownload,
  FiEdit3,
  FiZap,
  FiMonitor,
  FiTarget
} from 'react-icons/fi';
import SEO from '../components/SEO';
import NotFound from './NotFound';
import Quiz from '../components/Quiz';
import { getCourseById } from '../data/courses';
import { getModule, materialsFolderByCourse } from '../content/modules';
import MaterialDownload from '../components/MaterialDownload';
import './ModulePage.css';

const UnitPage = () => {
  const { courseId, unitId } = useParams();
  const course = getCourseById(courseId);
  const module = getModule(courseId);

  if (!course || !module) {
    return <NotFound />;
  }

  const index = module.units.findIndex((u) => u.id === unitId);
  if (index === -1) {
    return <NotFound />;
  }

  const unit = module.units[index];
  const previous = index > 0 ? module.units[index - 1] : null;
  const next = index < module.units.length - 1 ? module.units[index + 1] : null;
  const folder = materialsFolderByCourse[courseId];

  return (
    <div className="module-page unit-page">
      <SEO
        title={`Unit ${unit.number}: ${unit.title}`}
        description={unit.summary}
        keywords={unit.keyTerms.map((t) => t.term).join(', ')}
      />

      <section className="module-hero unit-hero">
        <div className="container">
          <Link to={`/training/${courseId}/module`} className="module-back-link">
            <FiArrowLeft /> {module.code} — all units
          </Link>

          <span className="module-code">Unit {unit.number} of {module.units.length}</span>
          <h1>{unit.title}</h1>
          <p className="module-subtitle">{unit.summary}</p>

          <div className="module-meta-row">
            <span><FiClock /> {unit.duration}</span>
            <span><FiTarget /> {unit.objectives.length} objectives</span>
            <span><FiEdit3 /> {unit.quiz.length} quiz questions</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="module-layout">
            <div className="module-main">
              <div className="module-block">
                <h2>Learning objectives</h2>
                <p className="unit-lead">By the end of this unit you will be able to:</p>
                <ul className="module-check-list">
                  {unit.objectives.map((objective, i) => (
                    <li key={i}><FiTarget /> <span>{objective}</span></li>
                  ))}
                </ul>
              </div>

              {unit.sections.map((section, i) => (
                <div className="module-block unit-section" key={i}>
                  <h2>{section.heading}</h2>
                  <ul className="unit-points">
                    {section.points.map((point, j) => <li key={j}>{point}</li>)}
                  </ul>

                  {section.table && (
                    <div className="module-table-wrap">
                      <table className="module-table">
                        <caption>{section.table.caption}</caption>
                        <thead>
                          <tr>
                            {section.table.headers.map((header, h) => (
                              <th scope="col" key={h}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row, r) => (
                            <tr key={r}>
                              {row.map((cell, c) => <td key={c}>{cell}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {section.note && (
                    <aside className="unit-note">
                      <strong>In practice</strong>
                      <p>{section.note}</p>
                    </aside>
                  )}
                </div>
              ))}

              {unit.examples && unit.examples.length > 0 && (
                <div className="module-block">
                  <h2>Worked examples</h2>
                  <div className="unit-examples">
                    {unit.examples.map((example, i) => (
                      <article className="unit-example" key={i}>
                        <h3><FiZap /> {example.title}</h3>
                        <p className="unit-example-scenario">{example.scenario}</p>
                        <ol className="unit-example-steps">
                          {example.steps.map((step, j) => <li key={j}>{step}</li>)}
                        </ol>
                        {example.lesson && (
                          <p className="unit-example-lesson">
                            <strong>The point:</strong> {example.lesson}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}

              <div className="module-block">
                <h2>Key terms</h2>
                <dl className="unit-glossary">
                  {unit.keyTerms.map((item, i) => (
                    <div className="unit-term" key={i}>
                      <dt>{item.term}</dt>
                      <dd>{item.definition}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="module-block">
                <h2>Activity</h2>
                <div className="unit-activity">
                  <FiEdit3 />
                  <p>{unit.activity}</p>
                </div>
              </div>

              <div className="module-block">
                <Quiz
                  quizId={`${courseId}-${unit.id}`}
                  title={`Unit ${unit.number} quiz`}
                  questions={unit.quiz}
                  passMark={module.assessment.passMark}
                  courseId={courseId}
                  unitId={unit.id}
                />
              </div>

              <nav className="unit-nav" aria-label="Unit navigation">
                {previous ? (
                  <Link className="unit-nav-link is-prev" to={`/training/${courseId}/module/${previous.id}`}>
                    <FiArrowLeft />
                    <span>
                      <small>Previous</small>
                      <strong>{previous.number}. {previous.title}</strong>
                    </span>
                  </Link>
                ) : <span />}

                {next && (
                  <Link className="unit-nav-link is-next" to={`/training/${courseId}/module/${next.id}`}>
                    <span>
                      <small>Next</small>
                      <strong>{next.number}. {next.title}</strong>
                    </span>
                    <FiArrowRight />
                  </Link>
                )}
              </nav>
            </div>

            <aside className="module-sidebar">
              <div className="module-card">
                <h3>Unit materials</h3>
                <MaterialDownload
                  folder={folder}
                  courseId={courseId}
                  file={`${unit.id}-slides.pptx`}
                  label="Slides"
                  note={`Unit ${unit.number} · PowerPoint`}
                  icon={<FiMonitor />}
                />
                <MaterialDownload
                  folder={folder}
                  courseId={courseId}
                  file={`${unit.id}-handout.pdf`}
                  label="Handout"
                  note={`Unit ${unit.number} · PDF`}
                  icon={<FiDownload />}
                />
              </div>

              <div className="module-card">
                <h3><FiBookOpen /> Readings</h3>
                <ul className="unit-readings">
                  {unit.readings.map((reading, i) => (
                    <li key={i}>
                      <strong>{reading.label}</strong>
                      <small>{reading.note}</small>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="module-card">
                <h3>All units</h3>
                <ol className="unit-toc">
                  {module.units.map((item) => (
                    <li key={item.id} className={item.id === unit.id ? 'is-current' : ''}>
                      {item.id === unit.id ? (
                        <span>{item.number}. {item.title}</span>
                      ) : (
                        <Link to={`/training/${courseId}/module/${item.id}`}>
                          {item.number}. {item.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UnitPage;
