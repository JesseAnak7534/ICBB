/**
 * Research Methods (Part 1) — module definition.
 *
 * This is the single source of truth for the module. The course listing, the
 * course detail page, the module pages and the generated slides, handouts and
 * PDFs are all built from it, so a change here propagates everywhere rather
 * than needing to be repeated.
 */

import unitsAFoundations from './units-a-foundations';
import unitsBDesigns from './units-b-designs';
import unitsCPractice from './units-c-practice';

export const units = [
  ...unitsAFoundations,
  ...unitsBDesigns,
  ...unitsCPractice
];

const researchMethodsModule = {
  courseId: 'research-methods-design',
  code: 'ICBB-RM101',
  title: 'Research Methods: Quantitative & Qualitative Design',
  subtitle: 'Part 1 of the Research Methods Professional Certificate',

  overview:
    'A complete foundation in research methods, from framing an answerable ' +
    'question through reviewing the literature, choosing a design, sampling, ' +
    'building instruments and meeting ethical obligations, to writing a proposal ' +
    'that will be approved. Quantitative and qualitative approaches are taught ' +
    'side by side rather than as separate worlds, because most real research ' +
    'questions require judgement about which one — or both — actually fits.',

  // Contact hours are the sum of the unit durations, rounded to the nearest hour.
  contactHours: 20,
  weeks: 2,
  level: 'Beginner to Intermediate',
  language: 'English',
  deliveryMode: 'Live online sessions with a workbook, slides and self-check quizzes',

  audience: [
    'Postgraduate students preparing a thesis or dissertation proposal',
    'Early-career researchers, research assistants and research nurses',
    'Health, social science and laboratory professionals starting a study',
    'Programme and M&E staff who commission or interpret research',
    'Anyone who has been asked to "just add a methods section"'
  ],

  prerequisites: [
    'No prior statistics, software or research experience is required',
    'Bring a research idea if you have one — the activities build towards a proposal'
  ],

  outcomes: [
    'State a research question with clear aims, objectives and scope',
    'Conduct and document a reproducible literature search across the major databases',
    'Manage references and generate a bibliography automatically',
    'Choose a quantitative, qualitative or mixed design and justify it against alternatives',
    'Select a sampling strategy and calculate or defend your sample size',
    'Build or adapt an instrument and evidence its validity and reliability',
    'Meet the ethical obligations of research with human participants',
    'Write a proposal that an ethics committee and a supervisor will accept'
  ],

  assessment: {
    summary:
      'Assessment is continuous and formative, ending in a short proposal that ' +
      'you can take directly into your own work.',
    components: [
      {
        name: 'Unit quizzes',
        weight: '30%',
        detail:
          'A self-check quiz after each of the ten units, with immediate feedback ' +
          'and an explanation for every option. Unlimited attempts.'
      },
      {
        name: 'Unit activities',
        weight: '30%',
        detail:
          'A short practical task per unit, built around your own research idea and ' +
          'reviewed in pairs during the live session.'
      },
      {
        name: 'Final proposal',
        weight: '40%',
        detail:
          'A two-page proposal skeleton: title, aim, objectives, design, sampling ' +
          'and sample size, analysis plan and limitations. Marked against the rubric ' +
          'below with written feedback.'
      }
    ],
    passMark: 60,
    rubric: [
      { criterion: 'Problem statement and gap', weight: 15, descriptor: 'Magnitude evidenced; gap specific and of an identifiable type.' },
      { criterion: 'Question, aim and objectives', weight: 20, descriptor: 'Answerable question; objectives measurable and mapping to the analysis.' },
      { criterion: 'Design and justification', weight: 20, descriptor: 'Design fits the question; alternatives considered and rejected with reasons.' },
      { criterion: 'Sampling and sample size', weight: 20, descriptor: 'Strategy appropriate; calculation shown with all inputs, or saturation logic defended.' },
      { criterion: 'Ethics and rigour', weight: 15, descriptor: 'Consent, confidentiality and risk addressed; limitations state direction and mitigation.' },
      { criterion: 'Clarity and structure', weight: 10, descriptor: 'Coherent, concise, correctly referenced.' }
    ]
  },

  certificate:
    'ICBB Certificate of Completion — Research Methods (Part 1). Awarded on ' +
    'achieving 60% overall and submitting the final proposal.',

  units
};

export default researchMethodsModule;
