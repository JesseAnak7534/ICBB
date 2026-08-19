/**
 * Quantitative Data Analysis (Part 2) — module definition.
 *
 * Single source of truth for the module. The course listing, the detail page,
 * the module pages and the generated slides and handouts are all built from
 * it, so a change here propagates everywhere.
 */

import unitsAPreparing from './units-a-preparing';
import unitsBInference from './units-b-inference';
import unitsCModelling from './units-c-modelling';
import examples from './examples';

export const units = [
  ...unitsAPreparing,
  ...unitsBInference,
  ...unitsCModelling
].map((unit) => ({ ...unit, examples: examples[unit.id] || [] }));

const quantitativeAnalysisModule = {
  courseId: 'quantitative-data-analysis',
  code: 'ICBB-RM201',
  title: 'Quantitative Data Analysis',
  subtitle: 'Part 2 of the Research Methods Professional Certificate',

  overview:
    'What to do once the data are collected. This part starts where real ' +
    'analysis starts — a messy spreadsheet — and works through cleaning, ' +
    'missing data, description, inference and regression modelling to a written ' +
    'results section. The emphasis throughout is on choosing the right method ' +
    'for your design and interpreting what comes out, not on memorising ' +
    'formulas. Every technique is demonstrated in both SPSS and R, so you can ' +
    'work in whichever your institution uses.',

  // Sum of the unit durations, rounded to the nearest hour.
  contactHours: 25,
  weeks: 2,
  level: 'Intermediate',
  language: 'English',
  deliveryMode: 'Live online sessions with hands-on labs on real datasets',

  audience: [
    'Researchers with data collected and no clear analysis plan',
    'Postgraduate students at the analysis stage of a thesis',
    'Monitoring and evaluation officers working with survey data',
    'Clinicians and laboratory scientists analysing their own studies',
    'Anyone reporting numbers who wants to stop guessing at the statistics'
  ],

  prerequisites: [
    'Part 1, or an equivalent understanding of research design and sampling',
    'Comfortable working with a spreadsheet',
    'No programming experience assumed — R is taught from the first command'
  ],

  outcomes: [
    'Build a codebook and turn completed questionnaires into an analysable dataset',
    'Screen data for impossible values, duplicates and inconsistencies',
    'Choose a defensible strategy for missing data and report it',
    'Summarise variables honestly and build a publication-ready Table 1',
    'Produce figures that show the data rather than hiding them',
    'Interpret p-values, confidence intervals and effect sizes accurately',
    'Select the correct test for your design, outcome and assumptions',
    'Fit and diagnose linear and logistic regression models',
    'Distinguish confounders, mediators and colliders when choosing covariates',
    'Write a results section that matches the analysis you actually ran'
  ],

  software: ['SPSS', 'R (with RStudio)', 'Excel', 'Stata (on request)'],

  assessment: {
    summary:
      'Assessment is continuous and practical, ending in an analysis of a ' +
      'supplied dataset written up as a short results section.',
    components: [
      {
        name: 'Unit quizzes',
        weight: '30%',
        detail:
          'A quiz after each of the ten units, with immediate feedback and an ' +
          'explanation for every option. Unlimited attempts.'
      },
      {
        name: 'Analysis labs',
        weight: '30%',
        detail:
          'A practical task per unit carried out on a real dataset in SPSS or R, ' +
          'reviewed during the live session.'
      },
      {
        name: 'Final analysis report',
        weight: '40%',
        detail:
          'A complete analysis of a supplied dataset: cleaning decisions, Table 1, ' +
          'a regression model with diagnostics, and a written results section. ' +
          'Marked against the rubric below with written feedback.'
      }
    ],
    passMark: 60,
    rubric: [
      { criterion: 'Data preparation and cleaning', weight: 15, descriptor: 'Checks documented; decisions justified; raw data preserved.' },
      { criterion: 'Missing data handling', weight: 15, descriptor: 'Mechanism considered; method appropriate and reported with analysis n.' },
      { criterion: 'Descriptive statistics', weight: 15, descriptor: 'Summaries match distribution shape; Table 1 complete and correctly formatted.' },
      { criterion: 'Choice of test or model', weight: 25, descriptor: 'Method fits design and outcome; assumptions checked; alternatives considered.' },
      { criterion: 'Interpretation', weight: 20, descriptor: 'Estimates, intervals and effect sizes read correctly in the units of the problem.' },
      { criterion: 'Reporting and reproducibility', weight: 10, descriptor: 'Results section complete and free of interpretation; analysis rerunnable from script.' }
    ]
  },

  certificate:
    'ICBB Certificate of Completion — Quantitative Data Analysis (Part 2). ' +
    'Awarded on achieving 60% overall and submitting the final analysis report.',

  units
};

export default quantitativeAnalysisModule;
