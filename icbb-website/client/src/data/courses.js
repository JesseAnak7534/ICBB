/**
 * Single source of truth for the ICBB training catalogue.
 *
 * Both the /training listing and the /training/:courseId detail pages read from
 * here, so a course only has to be described once.
 *
 * `iconKey` is a string rather than a component so that this module stays free
 * of JSX and can also be imported by non-React tooling. Training.js maps the
 * key to an icon.
 *
 * Fields used by the listing cards:
 *   id, title, type, duration, level, iconKey, description, topics
 *
 * Optional fields, rendered on the detail page when present:
 *   series, summary, format, deliveryMode, audience, prerequisites,
 *   outcomes, software, sessions, assessment, certificate
 */

/**
 * Course fees, in Ghana cedis.
 *
 * PLACEHOLDER VALUES — set these to the real prices before taking payments.
 * The server reads them from the generated data/course-prices.json, so the
 * amount charged never comes from the browser.
 */
export const PRICES = {
  'research-methods-design': 300,
  'quantitative-data-analysis': 400,
  'qualitative-data-analysis': 400
};

export const CURRENCY = 'GHS';

export const getPrice = (courseId) => PRICES[courseId] || null;

export const RESEARCH_METHODS_SERIES = {
  slug: 'research-methods',
  name: 'Research Methods Professional Certificate',
  totalParts: 3,
  description:
    'A three-part sequence covering research design first, then the analysis ' +
    'of quantitative and qualitative data. Each part can be taken on its own, ' +
    'or all three can be completed for the full certificate.'
};

const courses = [
  // ---------------------------------------------------------------------------
  // Research Methods series
  // ---------------------------------------------------------------------------
  {
    id: 'research-methods-design',
    title: 'Research Methods: Quantitative & Qualitative Design',
    type: 'Short Course',
    duration: '2 weeks',
    level: 'Beginner',
    iconKey: 'book',
    series: { slug: 'research-methods', part: 1, totalParts: 3 },

    // A full teaching module exists for this course. The detail page loads its
    // units from src/content/research-methods rather than repeating them here.
    hasModule: true,
    moduleCode: 'ICBB-RM101',

    description:
      'Design a study that can actually answer your research question — covering ' +
      'the literature review, research databases, and both quantitative and ' +
      'qualitative traditions.',
    topics: [
      'Research questions & design',
      'Literature review & databases',
      'Sampling & instruments',
      'Ethics & proposal writing'
    ],
    summary:
      'Most analysis problems are really design problems that surfaced too late. ' +
      'This first part builds the foundation: how to turn a broad interest into ' +
      'an answerable research question, how to find and synthesise what is already ' +
      'known, how to choose a design that fits, how to sample, and how to measure ' +
      'well. It covers quantitative and qualitative approaches side by side so you ' +
      'can tell which one your question calls for — and recognise when the honest ' +
      'answer is both.',
    format: 'Ten units of live online teaching, with a workbook, slides and quizzes',
    deliveryMode: 'Online (live cohort)',
    audience: [
      'Postgraduate students preparing a thesis or dissertation proposal',
      'Early-career researchers and research assistants',
      'Health, social science and laboratory professionals starting a study',
      'Anyone who has been asked to "just add a methods section"'
    ],
    prerequisites: [
      'No prior statistics or software knowledge required',
      'Bring a research idea if you have one — the activities build towards a proposal'
    ],
    outcomes: [
      'State a research question with clear aims, objectives and scope',
      'Conduct and document a reproducible literature search across the major databases',
      'Manage references and generate a bibliography automatically',
      'Choose a design and justify it against alternatives',
      'Select a sampling strategy and defend your sample size or saturation logic',
      'Build or adapt an instrument and evidence its validity and reliability',
      'Meet the ethical obligations of research with human participants',
      'Draft a methods section a supervisor or ethics board will accept'
    ],
    software: ['Zotero or Mendeley', 'PubMed, Scopus, AJOL', 'No programming required'],
    assessment:
      'Unit quizzes (30%), unit activities (30%) and a final two-page proposal (40%).',
    certificate: 'ICBB Certificate of Completion — Research Methods (Part 1)'
  },

  {
    id: 'quantitative-data-analysis',
    title: 'Quantitative Data Analysis',
    type: 'Short Course',
    duration: '2 weeks',
    level: 'Intermediate',
    iconKey: 'chart',
    series: { slug: 'research-methods', part: 2, totalParts: 3 },
    description:
      'Clean, analyse and report numerical data — from descriptive statistics ' +
      'through regression modelling — with reproducible output.',
    topics: [
      'Data cleaning & preparation',
      'Hypothesis testing & effect sizes',
      'Regression modelling',
      'Reporting results'
    ],
    summary:
      'The second part turns data into defensible findings. It starts where real ' +
      'analysis starts — a messy spreadsheet — and works through cleaning, ' +
      'description, inference and modelling to a written results section. The ' +
      'emphasis throughout is on choosing the right test for your design and ' +
      'interpreting what comes out, not on memorising formulas.',
    format: 'Live online sessions with hands-on labs on real datasets',
    deliveryMode: 'Online (live cohort)',
    audience: [
      'Researchers with data collected and no clear analysis plan',
      'Postgraduate students at the analysis stage of a thesis',
      'Monitoring and evaluation officers working with survey data',
      'Anyone reporting numbers who wants to stop guessing at the statistics'
    ],
    prerequisites: [
      'Part 1, or equivalent understanding of research design',
      'Comfortable working with a spreadsheet',
      'No programming experience assumed'
    ],
    outcomes: [
      'Build a codebook and prepare a raw dataset for analysis',
      'Handle missing data and outliers with a defensible strategy',
      'Choose the correct test for your design, outcome and assumptions',
      'Interpret p-values, confidence intervals and effect sizes accurately',
      'Fit and diagnose linear and logistic regression models',
      'Produce publication-ready tables and figures',
      'Write a results section that matches what you actually did'
    ],
    software: ['SPSS', 'R (with RStudio)', 'Excel', 'Stata (on request)'],
    sessions: [
      {
        title: 'Data preparation and cleaning',
        items: [
          'From questionnaire to codebook',
          'Data entry, import and variable types',
          'Recoding, computing and transforming variables',
          'Finding and fixing implausible values'
        ]
      },
      {
        title: 'Missing data',
        items: [
          'Why the data are missing, and why it matters',
          'Listwise and pairwise deletion and their cost',
          'Simple and multiple imputation',
          'Reporting what you did'
        ]
      },
      {
        title: 'Descriptive statistics and visualisation',
        items: [
          'Measures of central tendency and spread',
          'Frequency tables and cross-tabulations',
          'Choosing the right chart for the variable',
          'Building the "Table 1" of participant characteristics'
        ]
      },
      {
        title: 'The logic of inference',
        items: [
          'Sampling distributions and standard error',
          'Confidence intervals',
          'What a p-value does and does not tell you',
          'Effect sizes and why they belong in every result'
        ]
      },
      {
        title: 'Comparing groups',
        items: [
          'One-sample, independent and paired t-tests',
          'One-way and two-way ANOVA with post-hoc tests',
          'Chi-square and Fisher’s exact test',
          'Mann-Whitney, Wilcoxon and Kruskal-Wallis alternatives'
        ]
      },
      {
        title: 'Correlation and linear regression',
        items: [
          'Pearson and Spearman correlation',
          'Simple and multiple linear regression',
          'Dummy coding categorical predictors',
          'Interpreting coefficients and R-squared'
        ]
      },
      {
        title: 'Logistic regression',
        items: [
          'Modelling binary outcomes',
          'Odds ratios and their confidence intervals',
          'Adjusting for confounders',
          'Model fit and classification'
        ]
      },
      {
        title: 'Model building and diagnostics',
        items: [
          'Checking assumptions',
          'Multicollinearity and influential observations',
          'Confounding, mediation and interaction',
          'Choosing which variables enter the model'
        ]
      },
      {
        title: 'Reporting and reproducibility',
        items: [
          'APA and journal-style statistical reporting',
          'Building tables and figures that need no explanation',
          'Reproducible reports with R Markdown or Quarto',
          'Common reviewer objections and how to pre-empt them'
        ]
      }
    ],
    assessment:
      'An analysis of a supplied dataset, submitted as a short results section.',
    certificate: 'ICBB Certificate of Completion — Quantitative Data Analysis (Part 2)'
  },

  {
    id: 'qualitative-data-analysis',
    title: 'Qualitative Data Analysis',
    type: 'Short Course',
    duration: '2 weeks',
    level: 'Intermediate',
    iconKey: 'users',
    series: { slug: 'research-methods', part: 3, totalParts: 3 },
    description:
      'Turn interviews, focus groups and field notes into themes you can defend, ' +
      'with a transparent audit trail from quote to conclusion.',
    topics: [
      'Transcription & data management',
      'Coding & codebook development',
      'Thematic & framework analysis',
      'Trustworthiness & write-up'
    ],
    summary:
      'The third part deals with the data that will not fit in a spreadsheet. It ' +
      'takes you from raw transcripts through systematic coding to a defensible ' +
      'set of themes, and shows how to keep an audit trail so a reader can trace ' +
      'every claim back to the evidence. Software is covered as a tool for the ' +
      'method, not as a substitute for it — the analysis stays yours.',
    format: 'Live online sessions with guided coding practice on real transcripts',
    deliveryMode: 'Online (live cohort)',
    audience: [
      'Researchers holding interview or focus group transcripts',
      'Postgraduate students doing qualitative or mixed methods work',
      'Programme staff analysing feedback, case notes or open-ended responses',
      'Quantitative researchers adding a qualitative component'
    ],
    prerequisites: [
      'Part 1, or equivalent understanding of qualitative design',
      'Access to your own data is useful but not required — transcripts are supplied'
    ],
    outcomes: [
      'Prepare, anonymise and manage a qualitative dataset ethically',
      'Move systematically from familiarisation to coding to themes',
      'Develop and apply a codebook, alone or across a team',
      'Carry out a full reflexive thematic analysis',
      'Apply framework analysis to policy and evaluation data',
      'Use NVivo or ATLAS.ti to support — not replace — your analysis',
      'Demonstrate trustworthiness and write up with evidence'
    ],
    software: ['NVivo', 'ATLAS.ti', 'Taguette (free)', 'Dedoose (on request)'],
    sessions: [
      {
        title: 'From fieldwork to analysable data',
        items: [
          'Transcription conventions and what to preserve',
          'Anonymisation and participant identifiers',
          'Working with translated and multilingual data',
          'Organising a project so it survives a laptop failure'
        ]
      },
      {
        title: 'Familiarisation and analytic memos',
        items: [
          'Reading for immersion rather than extraction',
          'Writing memos that become your findings',
          'Reflexivity and positionality in practice',
          'Keeping the audit trail from day one'
        ]
      },
      {
        title: 'Coding I — building the ground layer',
        items: [
          'Descriptive, in-vivo and process coding',
          'Inductive versus deductive coding',
          'Coding a first transcript together',
          'Drafting the initial codebook'
        ]
      },
      {
        title: 'Coding II — structure and consistency',
        items: [
          'Grouping codes into categories and hierarchies',
          'Refining and merging codes as understanding shifts',
          'Team coding and intercoder agreement',
          'Knowing when coding is finished'
        ]
      },
      {
        title: 'Reflexive thematic analysis',
        items: [
          'The six phases in full',
          'The difference between a theme and a topic summary',
          'Building, reviewing and naming themes',
          'Thematic maps'
        ]
      },
      {
        title: 'Framework analysis',
        items: [
          'When a matrix beats a theme',
          'Building the analytical framework',
          'Charting and summarising cases',
          'Comparing across groups and sites'
        ]
      },
      {
        title: 'Software workshop',
        items: [
          'Setting up a project in NVivo and ATLAS.ti',
          'Coding, queries, matrices and visualisations',
          'A free alternative with Taguette',
          'Exporting results without losing the context'
        ]
      },
      {
        title: 'Rigour, write-up and integration',
        items: [
          'Credibility, transferability, dependability, confirmability',
          'Member checking and triangulation',
          'Selecting and presenting quotations',
          'Integrating qualitative findings with quantitative results'
        ]
      }
    ],
    assessment:
      'A coded transcript and a short thematic analysis with supporting quotations.',
    certificate: 'ICBB Certificate of Completion — Qualitative Data Analysis (Part 3)'
  },

  // ---------------------------------------------------------------------------
  // Existing computational biology catalogue
  // ---------------------------------------------------------------------------
  {
    id: 'intro-bioinformatics',
    title: 'Introduction to Bioinformatics',
    type: 'Workshop',
    duration: '3 days',
    level: 'Beginner',
    iconKey: 'book',
    description:
      'Learn the fundamentals of bioinformatics, including sequence analysis and biological database usage.',
    topics: ['Sequence alignment', 'BLAST searches', 'Database navigation', 'Basic phylogenetics']
  },
  {
    id: 'data-analysis-r',
    title: 'Data Analysis with R',
    type: 'Short Course',
    duration: '2 weeks',
    level: 'Intermediate',
    iconKey: 'code',
    description:
      'Master statistical analysis and visualization using R programming language.',
    topics: ['R fundamentals', 'Statistical tests', 'Data visualization', 'Report generation']
  },
  {
    id: 'genomics-bootcamp',
    title: 'Genomics Analysis Bootcamp',
    type: 'Bootcamp',
    duration: '4 weeks',
    level: 'Intermediate',
    iconKey: 'chart',
    description:
      'Intensive training in genomic data analysis, from raw sequencing data to biological insights.',
    topics: ['NGS data processing', 'Variant calling', 'RNA-seq analysis', 'Pipeline development']
  },
  {
    id: 'python-biologists',
    title: 'Python for Biologists',
    type: 'Workshop',
    duration: '5 days',
    level: 'Beginner',
    iconKey: 'code',
    description:
      'Learn Python programming for biological data analysis and automation.',
    topics: ['Python basics', 'Biopython', 'Data manipulation', 'Automation scripts']
  },
  {
    id: 'ml-biology',
    title: 'Machine Learning in Biology',
    type: 'Short Course',
    duration: '3 weeks',
    level: 'Advanced',
    iconKey: 'chart',
    description:
      'Apply machine learning algorithms to biological and biomedical problems.',
    topics: ['ML fundamentals', 'Supervised learning', 'Deep learning basics', 'Biological applications']
  },
  {
    id: 'statistical-methods',
    title: 'Statistical Methods for Research',
    type: 'Short Course',
    duration: '2 weeks',
    level: 'Intermediate',
    iconKey: 'book',
    description:
      'Comprehensive training in statistical methods commonly used in biological research.',
    topics: ['Hypothesis testing', 'Regression analysis', 'Multivariate statistics', 'Study design']
  }
];

/** Program types accepted by the registration API. */
export const PROGRAM_TYPES = ['workshop', 'short-course', 'bootcamp', 'certification'];

/**
 * Normalise a display type ("Short Course") into the value the API validates
 * against ("short-course"). Doing this in one place is what stopped the two
 * sides drifting apart.
 */
export const toProgramType = (type) =>
  String(type || '').trim().toLowerCase().replace(/\s+/g, '-');

export const getCourseById = (id) => courses.find((course) => course.id === id);

export const getSeriesCourses = (slug) =>
  courses
    .filter((course) => course.series && course.series.slug === slug)
    .sort((a, b) => a.series.part - b.series.part);

export default courses;
