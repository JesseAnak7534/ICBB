/**
 * Research Methods (Part 1) — Units 1-4: foundations, the research problem,
 * the literature review, and literature databases.
 *
 * Unit shape:
 *   id, number, title, duration, summary
 *   objectives[]  — what the participant can do afterwards
 *   sections[]    — teaching content: { heading, points[], note? , table? }
 *   keyTerms[]    — { term, definition }
 *   activity      — the in-session exercise
 *   readings[]    — { label, note }
 *   quiz[]        — { question, options[], answer (index), explanation }
 */

const unitsAFoundations = [
  {
    id: 'unit-01',
    number: 1,
    title: 'Foundations of Research',
    duration: '90 minutes',
    summary:
      'What separates research from other ways of knowing, the main types of ' +
      'research, and the philosophical positions that quietly shape every ' +
      'methodological choice you will make later.',
    objectives: [
      'Define research and distinguish it from opinion, audit and routine reporting',
      'Classify research by purpose, approach and time dimension',
      'Explain the difference between positivist, interpretivist and pragmatic paradigms',
      'Trace how a paradigm constrains the designs available to you',
      'Describe the stages of the research process end to end'
    ],
    sections: [
      {
        heading: 'What research is, and is not',
        points: [
          'Research is systematic, planned enquiry that produces evidence capable of being checked by someone else',
          'Three features distinguish it: a clear question, a documented method, and conclusions that follow from the data',
          'It is not: summarising what others said, confirming an opinion you already hold, or collecting data because it is available',
          'Audit asks "are we meeting an agreed standard?"; research asks "what is the case, and why?"',
          'The test of research is reproducibility — could a competent stranger follow your method and reach comparable conclusions?'
        ],
        note:
          'A great deal of published work fails this test. Reviewers increasingly ' +
          'ask for the protocol, the raw data and the analysis code precisely ' +
          'because the written method alone often is not enough to reproduce.'
      },
      {
        heading: 'Classifying research',
        points: [
          'By purpose: exploratory (what is going on here?), descriptive (what is the pattern?), explanatory (why does it happen?), evaluative (did it work?)',
          'By approach: quantitative (numbers, measurement, statistical inference), qualitative (meaning, context, interpretation), mixed methods (both, deliberately integrated)',
          'By time: cross-sectional (a snapshot), longitudinal (repeated over time), retrospective (looking back), prospective (following forward)',
          'By setting: laboratory, field, clinical, desk-based or secondary analysis',
          'By application: basic (extends knowledge) versus applied (solves a defined problem)'
        ]
      },
      {
        heading: 'Paradigms: the assumptions underneath the method',
        points: [
          'Ontology asks what reality is: a single objective reality, or multiple realities constructed by participants?',
          'Epistemology asks how we can know it: by measuring from the outside, or by interpreting from within?',
          'Positivism assumes an objective reality that can be measured — it leads naturally to experiments, surveys and statistical inference',
          'Interpretivism assumes reality is socially constructed — it leads to interviews, observation and thematic interpretation',
          'Pragmatism asks what works for the question at hand, and is the usual justification for mixed methods',
          'Critical and transformative paradigms foreground power and aim at change, common in participatory and action research'
        ],
        note:
          'You do not need to win the philosophical argument. You do need your ' +
          'paradigm, question, design and analysis to be consistent with one ' +
          'another — examiners notice when they are not.'
      },
      {
        heading: 'The research process',
        points: [
          'Identify a problem worth solving and confirm it is not already solved',
          'Review the literature and locate the gap precisely',
          'State the question, aims, objectives and (if quantitative) hypotheses',
          'Choose a design, population, sample and instruments',
          'Obtain ethical approval before collecting anything',
          'Collect, manage and analyse data',
          'Interpret against the literature, then report and disseminate',
          'The process is iterative in practice — the literature review continues until you submit'
        ]
      }
    ],
    keyTerms: [
      { term: 'Paradigm', definition: 'A set of shared assumptions about the nature of reality and how it can be known, which shapes what counts as legitimate evidence.' },
      { term: 'Ontology', definition: 'Assumptions about the nature of reality — whether it is single and objective, or multiple and constructed.' },
      { term: 'Epistemology', definition: 'Assumptions about what knowledge is and how it can legitimately be acquired.' },
      { term: 'Basic research', definition: 'Research undertaken to extend understanding, without a specific application in view.' },
      { term: 'Applied research', definition: 'Research directed at solving an identified practical problem.' },
      { term: 'Reproducibility', definition: 'The property that another researcher, following the reported method with the same data, obtains the same result.' }
    ],
    activity:
      'In pairs, take a recent paper from your own field. Identify its purpose, ' +
      'approach, time dimension and implied paradigm. Then argue whether the ' +
      'design actually matches the paradigm the authors claim.',
    readings: [
      { label: 'Creswell & Creswell — Research Design (Ch. 1: The Selection of a Research Approach)', note: 'The clearest short treatment of paradigm-to-design fit.' },
      { label: 'Bryman — Social Research Methods (Ch. 1-2)', note: 'Strong on ontology and epistemology without becoming abstract.' },
      { label: 'Kothari — Research Methodology: Methods and Techniques', note: 'Widely used across African and South Asian universities; good on classification.' }
    ],
    quiz: [
      {
        question: 'A hospital collects readmission rates each quarter and compares them against a national standard to check compliance. This is best described as:',
        options: ['Explanatory research', 'Clinical audit', 'Exploratory research', 'A cohort study'],
        answer: 1,
        explanation:
          'Measuring performance against an agreed external standard is audit. It ' +
          'becomes research only when it asks a question whose answer is not already ' +
          'defined by the standard — for example, why readmission varies between wards.'
      },
      {
        question: 'A researcher believes patient experience of stigma cannot be captured by a scale because it differs between individuals and settings. Which paradigm is closest to this position?',
        options: ['Positivism', 'Interpretivism', 'Post-positivism', 'Determinism'],
        answer: 1,
        explanation:
          'Treating reality as constructed and specific to person and context is the ' +
          'interpretivist position, which leads towards interviews and observation ' +
          'rather than measurement instruments.'
      },
      {
        question: 'Which sequence correctly orders the research process?',
        options: [
          'Collect data → review literature → state question → obtain ethical approval',
          'State question → collect data → obtain ethical approval → analyse',
          'Review literature → state question → obtain ethical approval → collect data',
          'Obtain ethical approval → review literature → collect data → state question'
        ],
        answer: 2,
        explanation:
          'Ethical approval must precede data collection, and the question must be ' +
          'settled before approval can be sought. Collecting first and seeking approval ' +
          'afterwards is a common and serious error that can render data unusable.'
      },
      {
        question: 'A study follows a group of 400 newly diagnosed patients forward for three years, measuring outcomes annually. On the time dimension this is:',
        options: ['Cross-sectional', 'Retrospective', 'Prospective longitudinal', 'Case-control'],
        answer: 2,
        explanation:
          'Participants are enrolled and then followed forward with repeated ' +
          'measurement, which is prospective and longitudinal. A cross-sectional study ' +
          'would measure once.'
      },
      {
        question: 'The main reason paradigm matters practically is that it:',
        options: [
          'Determines which journals will accept the paper',
          'Constrains which designs and forms of evidence are coherent for your question',
          'Decides whether ethical approval is required',
          'Sets the required sample size'
        ],
        answer: 1,
        explanation:
          'A paradigm is not decoration. It governs what counts as evidence, and ' +
          'therefore which designs, instruments and analyses hang together. Mismatches ' +
          'between stated paradigm and actual method are a frequent examiner criticism.'
      }
    ]
  },

  {
    id: 'unit-02',
    number: 2,
    title: 'The Research Problem, Questions and Objectives',
    duration: '90 minutes',
    summary:
      'How to move from a broad interest to a question that is specific enough ' +
      'to answer, and how aims, objectives, hypotheses and conceptual frameworks ' +
      'fit together.',
    objectives: [
      'Write a problem statement that establishes magnitude, consequence and gap',
      'Convert a broad topic into a focused, answerable research question',
      'Apply FINER and PICO to test whether a question is worth asking',
      'Distinguish aims, objectives, research questions and hypotheses',
      'Draw a conceptual framework linking your key variables or concepts'
    ],
    sections: [
      {
        heading: 'The problem statement',
        points: [
          'A problem statement answers four things in order: what is the problem, how big is it, what follows if it is not addressed, and what is not yet known',
          'Magnitude needs evidence — prevalence, incidence, cost, or documented reports, each cited',
          'The gap is the pivot of the whole proposal: it must be a gap in knowledge, not merely a gap in your own reading',
          'A gap can be empirical (nobody has measured this), methodological (measured badly), theoretical (no adequate explanation) or contextual (established elsewhere but never tested here)',
          'Contextual gaps are legitimate and are often the strongest basis for research in Ghana and across Africa'
        ],
        note:
          '"No study has been done in my district" is only a gap if there is reason ' +
          'to expect the local answer might differ. Say why it might — different ' +
          'health system, different exposure, different population structure.'
      },
      {
        heading: 'From topic to question',
        points: [
          'Narrow along four axes: population, concept or exposure, outcome, and setting or time',
          '"Malaria in children" is a topic; "Does distance to a health facility predict delayed treatment for malaria in under-fives in the Upper East Region?" is a question',
          'A good question is answerable with the data and time you actually have',
          'If you cannot name the analysis that would answer it, the question is not yet specific enough',
          'Quantitative questions specify variables and their relationship; qualitative questions specify experience, process or meaning'
        ]
      },
      {
        heading: 'Testing the question: FINER and PICO',
        points: [
          'FINER — Feasible, Interesting, Novel, Ethical, Relevant',
          'Feasibility is the most commonly overlooked: participants, time, funding, skills and access',
          'PICO structures comparative quantitative questions: Population, Intervention or exposure, Comparison, Outcome',
          'Add T for timeframe (PICOT) when duration matters',
          'For qualitative work, SPIDER is a better fit: Sample, Phenomenon of Interest, Design, Evaluation, Research type'
        ],
        table: {
          caption: 'Framing the same topic three ways',
          headers: ['Element', 'Quantitative (PICO)', 'Qualitative (SPIDER)'],
          rows: [
            ['Who', 'Under-fives with confirmed malaria', 'Caregivers of under-fives treated for malaria'],
            ['What', 'Distance greater than 5 km to facility', 'Experience of seeking and delaying care'],
            ['Compared with', 'Distance of 5 km or less', 'Not applicable'],
            ['Outcome', 'Treatment delayed beyond 24 hours', 'How caregivers account for delay'],
            ['Analysis implied', 'Logistic regression, odds ratio', 'Thematic analysis of interviews']
          ]
        }
      },
      {
        heading: 'Aims, objectives and hypotheses',
        points: [
          'The aim is one sentence stating the overall purpose — usually beginning "To determine…", "To explore…", "To evaluate…"',
          'Objectives break the aim into specific, ordered, measurable steps, each starting with an action verb',
          'Three to five objectives is usual; more than six normally signals an unfocused study',
          'A hypothesis is a testable statement of an expected relationship, stated for quantitative work only',
          'The null hypothesis states no difference or no association; the alternative states the expected effect',
          'Qualitative studies state research questions rather than hypotheses, because they do not set out to test a prediction'
        ],
        note:
          'Objectives must map one-to-one onto your analysis plan and, later, onto ' +
          'your results section. If an objective produces no result, or a result ' +
          'answers no objective, something has gone wrong.'
      },
      {
        heading: 'Conceptual and theoretical frameworks',
        points: [
          'A theoretical framework borrows an existing theory (Health Belief Model, Theory of Planned Behaviour, Social Cognitive Theory) to explain your phenomenon',
          'A conceptual framework is your own diagram of how the variables in your study relate',
          'It should distinguish independent, dependent, mediating, moderating and confounding variables',
          'Drawing it early exposes variables you would otherwise forget to measure',
          'The framework is also what tells you which variables must be adjusted for in analysis'
        ]
      }
    ],
    keyTerms: [
      { term: 'Research gap', definition: 'A specific limitation in existing knowledge that the proposed study will address.' },
      { term: 'Aim', definition: 'A single statement of the overall purpose of the study.' },
      { term: 'Objective', definition: 'A specific, measurable step that contributes to achieving the aim.' },
      { term: 'Null hypothesis', definition: 'The testable statement that no difference or association exists in the population.' },
      { term: 'Conceptual framework', definition: 'A diagram or model of the presumed relationships among the study variables.' },
      { term: 'Confounder', definition: 'A variable associated with both exposure and outcome that can produce a spurious association.' }
    ],
    activity:
      'Write a one-paragraph problem statement and one research question for your ' +
      'own study. Exchange with a partner, who must identify the gap type and ' +
      'name the analysis your question implies. If they cannot, revise it.',
    readings: [
      { label: 'Hulley et al. — Designing Clinical Research (Ch. 2)', note: 'Origin of the FINER criteria; concise and practical.' },
      { label: 'Cooke, Smith & Booth (2012) — "Beyond PICO: The SPIDER Tool"', note: 'The qualitative counterpart to PICO.' },
      { label: 'Ravitch & Riggan — Reason & Rigor', note: 'The best treatment of conceptual frameworks as an argument rather than a diagram.' }
    ],
    quiz: [
      {
        question: 'Which of the following is a research question rather than a topic?',
        options: [
          'Adolescent mental health in Ghana',
          'The effect of social media on young people',
          'Is daily social media use of more than three hours associated with depressive symptoms among senior high school students in Accra?',
          'Investigating depression and technology'
        ],
        answer: 2,
        explanation:
          'Only option C specifies population, exposure, outcome and setting, and it ' +
          'implies a definite analysis. The others name areas of interest without ' +
          'stating what would be measured or compared.'
      },
      {
        question: 'In FINER, the criterion most often underestimated by postgraduate students is:',
        options: ['Interesting', 'Novel', 'Feasible', 'Relevant'],
        answer: 2,
        explanation:
          'Feasibility — access to participants, time, funding and skills — is where ' +
          'most over-ambitious proposals fail. A question can be novel, ethical and ' +
          'relevant and still be impossible within a one-year programme.'
      },
      {
        question: 'Which statement is a correctly framed null hypothesis?',
        options: [
          'Distance to a health facility increases treatment delay.',
          'There is no association between distance to a health facility and treatment delay.',
          'Does distance to a health facility affect treatment delay?',
          'Treatment delay is an important problem in rural districts.'
        ],
        answer: 1,
        explanation:
          'The null hypothesis asserts the absence of an association. Option A is the ' +
          'alternative hypothesis, C is a question, and D is a background claim.'
      },
      {
        question: 'A study on a topic well established in Europe but never examined in West Africa is justified by which type of gap?',
        options: ['Methodological gap', 'Theoretical gap', 'Contextual gap', 'No gap exists'],
        answer: 2,
        explanation:
          'This is a contextual gap. It is legitimate, but the proposal must explain ' +
          'why the local answer could plausibly differ — different health system, ' +
          'exposure profile or population structure — rather than merely noting absence.'
      },
      {
        question: 'The relationship between objectives and the results section should be:',
        options: [
          'Independent — results may cover whatever the data show',
          'One-to-one — each objective yields a result and each result answers an objective',
          'Objectives are for the proposal only and need not appear later',
          'Results should exceed the objectives to show thoroughness'
        ],
        answer: 1,
        explanation:
          'Objectives are the skeleton of the study. An objective with no result ' +
          'suggests work not done; a result answering no objective suggests analysis ' +
          'that drifted, which invites accusations of fishing for findings.'
      }
    ]
  },

  {
    id: 'unit-03',
    number: 3,
    title: 'The Literature Review',
    duration: '120 minutes',
    summary:
      'What a literature review is for, the main types and when each is ' +
      'appropriate, and how to build one that argues rather than merely lists.',
    objectives: [
      'Explain the four functions a literature review performs in a research project',
      'Distinguish narrative, scoping, systematic, rapid and integrative reviews',
      'Select the review type appropriate to your purpose and resources',
      'Organise a review thematically rather than source by source',
      'Use a synthesis matrix to move from reading to argument',
      'Recognise and avoid the most common review failures'
    ],
    sections: [
      {
        heading: 'What the review is for',
        points: [
          'To establish what is already known, so you do not repeat settled work',
          'To locate and justify the gap your study will fill',
          'To inform your method — which designs, instruments and measures others found workable',
          'To supply the framework against which you will later interpret your own findings',
          'A review is an argument leading to your question, not a catalogue of everything published'
        ],
        note:
          'The single most common examiner criticism is a review that summarises ' +
          'twenty studies in twenty paragraphs and never says what they collectively ' +
          'mean. If a paragraph begins with an author name rather than an idea, ' +
          'suspect this failure.'
      },
      {
        heading: 'Types of review',
        points: [
          'Narrative review — broad, expert overview; flexible but vulnerable to selection bias',
          'Scoping review — maps the extent and nature of evidence and identifies gaps; ideal when a field is new or heterogeneous',
          'Systematic review — answers a focused question using a pre-registered protocol and exhaustive search; the highest standard, and the most work',
          'Meta-analysis — statistical pooling of results across studies; only valid when studies are sufficiently comparable',
          'Rapid review — systematic methods with deliberate, documented shortcuts, used under time pressure',
          'Integrative review — combines experimental and non-experimental evidence, common in nursing and health services research'
        ],
        table: {
          caption: 'Choosing a review type',
          headers: ['If your purpose is…', 'Use', 'Typical effort'],
          rows: [
            ['Introduce a thesis chapter', 'Narrative or integrative', '4-8 weeks'],
            ['Map an emerging or scattered field', 'Scoping review', '3-6 months'],
            ['Answer a focused effectiveness question', 'Systematic review', '6-12 months'],
            ['Pool effect estimates numerically', 'Systematic review with meta-analysis', '9-18 months'],
            ['Inform an urgent policy decision', 'Rapid review', '4-12 weeks']
          ]
        }
      },
      {
        heading: 'Building the review',
        points: [
          'Define the scope first: concepts, populations, date range, languages and study types, with a reason for each limit',
          'Search systematically even for a narrative review — record databases, terms and dates so the search can be repeated',
          'Screen in two passes: title and abstract, then full text against explicit criteria',
          'Extract into a synthesis matrix: rows are studies, columns are the themes, methods and findings you care about',
          'Reading the matrix down the columns rather than across the rows is what turns reading into synthesis',
          'Organise the written review by theme, debate or chronology of ideas — never by author'
        ]
      },
      {
        heading: 'Appraising what you find',
        points: [
          'Not all evidence carries equal weight; state how you judged quality',
          'Evidence hierarchies place systematic reviews and randomised trials above cohort, case-control and cross-sectional designs for effectiveness questions',
          'Hierarchies apply to questions of effectiveness, not to questions of meaning or experience — a qualitative study is not "low quality" evidence for how patients understand illness',
          'Use a structured tool: CASP checklists, the Newcastle-Ottawa Scale, or Cochrane Risk of Bias 2',
          'Watch for predatory journals — check indexing, editorial board, and whether the publisher appears in DOAJ or on Cabells lists',
          'Note conflicts of interest and funding sources'
        ]
      },
      {
        heading: 'Common failures',
        points: [
          'Listing rather than synthesising — the "annotated bibliography" review',
          'Relying only on what is freely available, producing a review biased towards open-access journals',
          'Citing abstracts without reading the full paper, and repeating a misreading from a secondary source',
          'Ignoring evidence that contradicts your position, which reviewers will notice',
          'Reviewing only recent work and losing the origin of a debate',
          'Letting the review stop when data collection begins — it must be updated before submission'
        ]
      }
    ],
    keyTerms: [
      { term: 'Synthesis matrix', definition: 'A table with studies as rows and themes or attributes as columns, used to compare across sources rather than summarise each in turn.' },
      { term: 'Scoping review', definition: 'A structured review that maps the extent, range and nature of evidence on a topic and identifies gaps.' },
      { term: 'Grey literature', definition: 'Material outside commercial publishing — theses, government and NGO reports, working papers, conference abstracts.' },
      { term: 'Publication bias', definition: 'The tendency for studies with positive or significant results to be published more often, distorting the apparent evidence.' },
      { term: 'Predatory journal', definition: 'A journal charging publication fees while providing little or no genuine peer review or editorial service.' },
      { term: 'Saturation (in reviewing)', definition: 'The point at which additional searching returns no new relevant concepts.' }
    ],
    activity:
      'Take five papers you have already read. Build a synthesis matrix with ' +
      'columns for design, sample, setting, key finding and limitation. Then write ' +
      'one paragraph that compares across the column "key finding" without naming ' +
      'an author as the subject of any sentence.',
    readings: [
      { label: 'Booth, Sutton & Papaioannou — Systematic Approaches to a Successful Literature Review', note: 'The best single book on choosing and executing a review type.' },
      { label: 'Arksey & O\'Malley (2005) — scoping review framework', note: 'The foundational scoping methodology, refined later by Levac and by JBI.' },
      { label: 'Page et al. (2021) — PRISMA 2020 statement', note: 'The reporting standard; read it before you start searching, not after.' }
    ],
    quiz: [
      {
        question: 'A review that maps how much and what kind of research exists on a broad, emerging topic, without pooling results, is a:',
        options: ['Meta-analysis', 'Scoping review', 'Rapid review', 'Narrative review'],
        answer: 1,
        explanation:
          'Scoping reviews are designed to map extent, range and nature of evidence ' +
          'and to identify gaps. They deliberately do not pool effects or usually ' +
          'appraise quality in the way a systematic review does.'
      },
      {
        question: 'The clearest sign that a literature review is listing rather than synthesising is that:',
        options: [
          'It cites more than fifty sources',
          'Most paragraphs begin with an author name and describe one study each',
          'It includes grey literature',
          'It is organised chronologically'
        ],
        answer: 1,
        explanation:
          'Paragraph-per-study structure signals summary rather than synthesis. A ' +
          'synthesising review organises paragraphs around ideas and cites several ' +
          'studies within each to support, qualify or contest a claim.'
      },
      {
        question: 'Judging a qualitative study of patient experience as "weak evidence" because it sits low on the evidence hierarchy is:',
        options: [
          'Correct — hierarchies apply to all research',
          'A misapplication, because hierarchies rank evidence for effectiveness questions',
          'Correct only if the sample is under 30',
          'Correct because qualitative work is not generalisable'
        ],
        answer: 1,
        explanation:
          'Evidence hierarchies rank designs for answering questions about whether an ' +
          'intervention works. They say nothing about the quality of evidence for ' +
          'questions of meaning, experience or process, where qualitative designs are ' +
          'the appropriate choice.'
      },
      {
        question: 'Excluding studies that are not freely available online risks introducing:',
        options: ['Recall bias', 'Access bias, skewing the review towards open-access sources', 'Confounding', 'Attrition bias'],
        answer: 1,
        explanation:
          'Restricting to what you can download for free is a selection problem. Use ' +
          'your institutional library, interlibrary loan, HINARI or AJOL, or write to ' +
          'the corresponding author, and state any unavoidable restriction explicitly.'
      },
      {
        question: 'When should the literature review be considered finished?',
        options: [
          'When the proposal is approved',
          'When data collection begins',
          'Shortly before submission, after a final updating search',
          'After fifty sources have been cited'
        ],
        answer: 2,
        explanation:
          'The field continues publishing while you work. A final updating search ' +
          'before submission protects you from the examiner who knows of a directly ' +
          'relevant paper published during your fieldwork.'
      }
    ]
  },

  {
    id: 'unit-04',
    number: 4,
    title: 'Literature Databases, Searching and Reference Management',
    duration: '150 minutes',
    summary:
      'The databases that matter, how to build a search that is both sensitive ' +
      'and precise, how to document it for PRISMA, and how to manage references ' +
      'so the bibliography is never done by hand.',
    objectives: [
      'Select appropriate databases for a given topic and justify the choice',
      'Construct a Boolean search using controlled vocabulary and field tags',
      'Use MeSH terms, truncation, phrase searching and proximity operators',
      'Balance sensitivity against precision and explain the trade-off',
      'Document a search so that another researcher can reproduce it exactly',
      'Set up Zotero or Mendeley and generate a formatted bibliography automatically'
    ],
    sections: [
      {
        heading: 'The major databases',
        points: [
          'PubMed / MEDLINE — biomedical and life sciences; free; indexed with MeSH controlled vocabulary',
          'Scopus and Web of Science — large multidisciplinary citation databases; subscription; best for citation tracking and bibliometrics',
          'Cochrane Library — controlled trials and systematic reviews; essential for effectiveness questions',
          'CINAHL — nursing and allied health; EMBASE — stronger European and pharmacological coverage than PubMed',
          'PsycINFO — psychology and behavioural sciences; ERIC — education',
          'African Journals Online (AJOL) — the largest collection of African-published scholarship, poorly covered by the big indexes',
          'Google Scholar — very broad and useful for finding grey literature and chasing citations, but the algorithm is opaque and results are not reproducible, so it should supplement rather than replace a structured search'
        ],
        note:
          'For work on African populations, searching only PubMed and Scopus will ' +
          'systematically miss regionally published evidence. AJOL, national journal ' +
          'portals and institutional repositories are not optional extras here.'
      },
      {
        heading: 'Building the search',
        points: [
          'Break the question into concepts — usually the P, I/E and O of PICO; do not search the whole question as a sentence',
          'For each concept, gather synonyms, spelling variants, abbreviations and older terminology',
          'Combine synonyms within a concept using OR; combine concepts using AND; use NOT sparingly, as it discards relevant records',
          'Truncation: malari* retrieves malaria, malarial, malariae',
          'Phrase searching: "mobile money" keeps the words adjacent',
          'Field tags restrict where a term is searched, e.g. [tiab] for title and abstract in PubMed',
          'Proximity operators (NEAR, W/n, ADJn) find terms near each other and vary by database'
        ]
      },
      {
        heading: 'Controlled vocabulary',
        points: [
          'MeSH is the National Library of Medicine\'s controlled vocabulary; each PubMed record is tagged by indexers',
          'Searching a MeSH term retrieves records regardless of the authors\' wording',
          'Explosion automatically includes narrower terms beneath a heading in the tree',
          'Major topic restricts to records where the concept is a main focus',
          'MeSH indexing lags publication, so very recent papers are found only by free-text terms',
          'The reliable strategy combines both: MeSH OR free-text, for each concept',
          'Emtree in EMBASE and CINAHL Headings serve the same purpose in their databases'
        ],
        table: {
          caption: 'Sensitivity versus precision',
          headers: ['Goal', 'Strategy', 'Cost'],
          rows: [
            ['High sensitivity (systematic review)', 'Many synonyms, truncation, explode MeSH, no limits', 'Thousands of records to screen'],
            ['High precision (quick scoping)', 'Few terms, major topic, title field, recent years', 'Relevant studies will be missed'],
            ['Balanced (thesis chapter)', 'MeSH OR free-text per concept, sensible date limit', 'Manageable; state the limits used']
          ]
        }
      },
      {
        heading: 'Documenting the search',
        points: [
          'Record for each database: its name, the platform, the date searched, the full strategy line by line, and the number of records returned',
          'The date matters because databases change daily and the search must be reproducible',
          'Report screening with a PRISMA flow diagram: identified, duplicates removed, screened, excluded with reasons, included',
          'Keep the exclusion reasons — reviewers ask for them',
          'Save the strategy in the database\'s own account feature and export it, rather than retyping later',
          'Set up email alerts so new hits arrive during your fieldwork'
        ]
      },
      {
        heading: 'Reference management',
        points: [
          'Zotero — free and open source, excellent browser capture, best default for most researchers',
          'Mendeley — free, good PDF annotation, owned by Elsevier',
          'EndNote — paid, common in institutions with a site licence, strong for very large libraries',
          'All three insert citations into Word or LibreOffice and reformat the entire bibliography when you change style',
          'Deduplicate on import, and fix metadata at import time — a wrong year propagates into every citation',
          'Use collections per chapter and tags per theme; attach the PDF and your notes to the record',
          'Back up the library, and sync it — a lost reference library near submission is a genuine disaster',
          'Never type a bibliography by hand: it wastes days and introduces errors that examiners do notice'
        ],
        note:
          'Set your citation style once at the beginning. Switching from APA to ' +
          'Vancouver later is a single dropdown in the reference manager, and a week ' +
          'of manual work without one.'
      }
    ],
    keyTerms: [
      { term: 'MeSH', definition: 'Medical Subject Headings — the controlled vocabulary used to index MEDLINE and PubMed records.' },
      { term: 'Boolean operators', definition: 'AND, OR and NOT, used to combine search concepts.' },
      { term: 'Truncation', definition: 'A wildcard symbol (usually *) retrieving all word endings from a common stem.' },
      { term: 'Sensitivity', definition: 'The proportion of all relevant records that a search retrieves.' },
      { term: 'Precision', definition: 'The proportion of retrieved records that are actually relevant.' },
      { term: 'PRISMA flow diagram', definition: 'The standard figure reporting how records moved from identification through screening to inclusion.' },
      { term: 'Grey literature', definition: 'Reports, theses and working papers published outside commercial channels and often outside major indexes.' }
    ],
    activity:
      'Build a full PubMed strategy for your own question. Produce at least two ' +
      'concepts, each with MeSH and free-text synonyms combined by OR, then joined ' +
      'by AND. Record the date and the number of hits. Import the first twenty ' +
      'results into Zotero and generate a bibliography in APA, then switch it to ' +
      'Vancouver.',
    readings: [
      { label: 'PubMed User Guide — search field tags and MeSH', note: 'Free, authoritative and short.' },
      { label: 'Bramer et al. (2018) — "A systematic approach to searching"', note: 'A practical, reproducible method for building strategies.' },
      { label: 'Cochrane Handbook, Chapter 4 — Searching for studies', note: 'The reference standard for exhaustive searching.' },
      { label: 'Zotero documentation — Quick Start Guide', note: 'Enough to be productive in under an hour.' }
    ],
    quiz: [
      {
        question: 'To find records using either term for the same concept, you should combine "adolescent" and "teenager" with:',
        options: ['AND', 'OR', 'NOT', 'NEAR'],
        answer: 1,
        explanation:
          'OR broadens by retrieving records containing either synonym, so it combines ' +
          'terms within a concept. AND narrows and is used between different concepts.'
      },
      {
        question: 'The main advantage of searching with MeSH terms rather than free text alone is that:',
        options: [
          'MeSH searches are faster',
          'Records are retrieved regardless of the wording the authors chose',
          'MeSH always returns fewer results',
          'MeSH includes the most recently published papers first'
        ],
        answer: 1,
        explanation:
          'Indexers assign MeSH consistently, so a MeSH search captures records however ' +
          'the authors phrased it. Its weakness is the opposite: very recent records are ' +
          'not yet indexed, which is why MeSH and free text are combined with OR.'
      },
      {
        question: 'A researcher studying maternal health services in Ghana searches only PubMed and Scopus. The most likely consequence is that they:',
        options: [
          'Retrieve too many irrelevant records',
          'Miss regionally published African evidence indexed in AJOL and national repositories',
          'Violate PRISMA reporting rules',
          'Introduce recall bias'
        ],
        answer: 1,
        explanation:
          'Coverage of African-published journals in the major international indexes is ' +
          'incomplete. AJOL, institutional repositories and national portals are needed ' +
          'to avoid systematically missing local evidence.'
      },
      {
        question: 'A systematic review search should favour:',
        options: [
          'Precision, to keep screening manageable',
          'Sensitivity, accepting a larger screening burden',
          'Google Scholar alone, for breadth',
          'Only papers published in the last five years'
        ],
        answer: 1,
        explanation:
          'Systematic reviews aim to find all relevant studies, so they prioritise ' +
          'sensitivity and accept screening thousands of titles. Missing eligible ' +
          'studies biases the conclusion; screening extra records only costs time.'
      },
      {
        question: 'Why must the date of each database search be recorded?',
        options: [
          'To calculate the response rate',
          'Because databases are updated continuously, so the search is only reproducible as at a given date',
          'It is required for ethical approval',
          'To determine the citation style'
        ],
        answer: 1,
        explanation:
          'New records are added daily. Without the search date, another researcher ' +
          'rerunning your strategy cannot explain why their result count differs, and ' +
          'reproducibility is lost.'
      },
      {
        question: 'The strongest practical reason to use a reference manager is that it:',
        options: [
          'Improves the quality of your writing',
          'Reformats every citation and the whole bibliography when the required style changes',
          'Guarantees you avoid plagiarism',
          'Finds relevant papers for you'
        ],
        answer: 1,
        explanation:
          'Style switching is the decisive practical gain — a dropdown instead of days ' +
          'of manual reformatting. It does not write for you, and it does not by itself ' +
          'prevent plagiarism.'
      }
    ]
  }
];

export default unitsAFoundations;
