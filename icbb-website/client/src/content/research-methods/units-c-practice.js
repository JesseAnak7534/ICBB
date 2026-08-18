/**
 * Research Methods (Part 1) — Units 8-10: instruments and data collection,
 * research ethics and integrity, and writing the proposal.
 */

const unitsCPractice = [
  {
    id: 'unit-08',
    number: 8,
    title: 'Data Collection, Instruments and Measurement',
    duration: '120 minutes',
    summary:
      'Turning abstract constructs into things you can actually record, and the ' +
      'validity and reliability evidence needed before anyone believes the ' +
      'numbers your instrument produces.',
    objectives: [
      'Operationalise a construct into measurable variables and indicators',
      'Identify levels of measurement and their analytical consequences',
      'Design questionnaire items that avoid the common wording faults',
      'Distinguish the main types of validity and reliability and how each is evidenced',
      'Plan and report a pilot study',
      'Choose between paper and electronic data capture and set up basic data quality controls'
    ],
    sections: [
      {
        heading: 'From construct to variable',
        points: [
          'A construct is an abstraction — stigma, food insecurity, quality of care — that cannot be observed directly',
          'Operationalisation defines the observable indicators that will stand for it',
          'A conceptual definition says what you mean; an operational definition says exactly how it will be measured',
          'Prefer an existing validated instrument over inventing your own — validation takes a study of its own',
          'If you adapt an instrument, report what you changed and re-examine its reliability in your population',
          'Instruments validated elsewhere may behave differently after translation or in a different culture, and should be re-tested'
        ],
        note:
          'Translation requires forward translation, back translation by an ' +
          'independent translator, reconciliation by a panel, and cognitive ' +
          'interviewing with a few target participants. Translating a questionnaire ' +
          'yourself the night before is the single most common source of unusable data.'
      },
      {
        heading: 'Levels of measurement',
        points: [
          'Nominal — unordered categories (blood group, district); only counts and proportions are meaningful',
          'Ordinal — ordered categories with unequal or unknown intervals (Likert responses, disease stage)',
          'Interval — equal intervals but no true zero (temperature in Celsius)',
          'Ratio — equal intervals with a true zero (weight, income, count of visits)',
          'The level determines which summary statistics and which tests are legitimate',
          'Record data at the finest level available: exact age can always be collapsed into bands later, but bands can never be recovered into exact ages'
        ]
      },
      {
        heading: 'Writing good items',
        points: [
          'One idea per item — "Was the staff friendly and efficient?" is double-barrelled and unanswerable if one was and one was not',
          'Avoid leading wording, loaded terms and negatives, especially double negatives',
          'Match vocabulary to the least literate respondent you expect',
          'Make response options exhaustive and mutually exclusive; check for gaps and overlaps in age bands',
          'Offer "don\'t know" and "prefer not to answer" where forcing a choice would fabricate data',
          'Decide deliberately whether a Likert scale has a midpoint — removing it forces a direction, which may or may not be what you want',
          'Order matters: put sensitive items late, once rapport exists, and beware of earlier items priming later ones'
        ]
      },
      {
        heading: 'Validity and reliability',
        points: [
          'Face validity — does it look appropriate? The weakest form, but worth checking',
          'Content validity — does it cover the whole construct? Established by expert panel, often with a content validity index',
          'Construct validity — does it behave as theory predicts? Evidenced by convergent and discriminant correlations and factor analysis',
          'Criterion validity — does it agree with a gold standard, concurrently or predictively?',
          'Internal consistency — do items measure the same thing? Cronbach\'s alpha, where roughly 0.70-0.95 is acceptable and above 0.95 suggests redundant items',
          'Test-retest reliability — does it give the same answer on a stable characteristic over a short interval?',
          'Inter-rater reliability — do different observers agree? Reported as Cohen\'s kappa or an intraclass correlation',
          'An instrument can be reliable but not valid — consistently measuring the wrong thing'
        ],
        table: {
          caption: 'Which evidence to report',
          headers: ['Property', 'Statistic', 'Rough benchmark'],
          rows: [
            ['Internal consistency', "Cronbach's alpha", '0.70 - 0.95'],
            ['Test-retest', 'ICC or Pearson r', '≥ 0.70'],
            ['Inter-rater agreement', "Cohen's kappa", '≥ 0.60 substantial'],
            ['Content validity', 'CVI', '≥ 0.78 per item'],
            ['Construct validity', 'Factor loadings', '≥ 0.40']
          ]
        }
      },
      {
        heading: 'Piloting and data capture',
        points: [
          'Pilot on 10% of the intended sample, or at least 20-30 respondents, drawn from the same population but excluded from the main study',
          'The pilot tests comprehension, timing, flow, skip logic, coding and the analysis plan — run your intended analysis on pilot data',
          'Electronic capture (KoBoToolbox, REDCap, ODK, CommCare) enforces ranges and skip logic at the point of entry and removes a transcription step',
          'Paper remains appropriate where power, connectivity or literacy make devices impractical; plan double entry if so',
          'Build validation rules: allowed ranges, required fields, logical consistency checks between related items',
          'Train and standardise data collectors, then check inter-rater agreement rather than assuming it',
          'Anonymise at collection where possible, keeping any identifier link in a separate secured file'
        ]
      }
    ],
    keyTerms: [
      { term: 'Operationalisation', definition: 'Specifying the observable indicators and procedures by which an abstract construct will be measured.' },
      { term: 'Construct validity', definition: 'Evidence that an instrument measures the theoretical concept it claims to measure.' },
      { term: "Cronbach's alpha", definition: 'A coefficient of internal consistency among the items of a scale.' },
      { term: "Cohen's kappa", definition: 'A measure of agreement between raters that corrects for agreement expected by chance.' },
      { term: 'Skip logic', definition: 'Rules routing a respondent past items that do not apply to them.' },
      { term: 'Double entry', definition: 'Entering paper data twice independently and reconciling differences to catch transcription error.' }
    ],
    activity:
      'Take one construct from your study and write three candidate items for it. ' +
      'Exchange with a partner, who must identify any double-barrelled, leading or ' +
      'ambiguous wording and check the response options are exhaustive and mutually ' +
      'exclusive. Then state which reliability evidence you would report and why.',
    readings: [
      { label: 'DeVellis — Scale Development: Theory and Applications', note: 'The standard reference for constructing and validating scales.' },
      { label: 'Boateng et al. (2018) — "Best Practices for Developing and Validating Scales"', note: 'Open access, health-focused, and unusually practical.' },
      { label: 'Beaton et al. (2000) — Guidelines for cross-cultural adaptation', note: 'The forward/back translation process, done properly.' }
    ],
    quiz: [
      {
        question: '"How satisfied were you with the cost and quality of care?" is faulty because it is:',
        options: ['Leading', 'Double-barrelled', 'Too open', 'Correctly written'],
        answer: 1,
        explanation:
          'It asks about two distinct things at once. A respondent satisfied with ' +
          'quality but not cost cannot answer, and their response cannot be interpreted. ' +
          'Split it into two items.'
      },
      {
        question: 'A scale consistently gives the same score on repeat administration but correlates poorly with every established measure of the construct. It is:',
        options: ['Valid but unreliable', 'Reliable but not valid', 'Both reliable and valid', 'Neither'],
        answer: 1,
        explanation:
          'Consistency is reliability. Failing to relate to the construct it claims to ' +
          'measure is a validity failure. An instrument can measure the wrong thing very ' +
          'consistently.'
      },
      {
        question: 'Recording age in five-year bands rather than exact years is generally inadvisable because:',
        options: [
          'Bands are harder for respondents to answer',
          'Exact values can always be collapsed into bands later, but bands cannot be recovered',
          'Bands are not a valid level of measurement',
          'It always reduces the response rate'
        ],
        answer: 1,
        explanation:
          'Collecting at the finest available level preserves analytical options. ' +
          'Categorising at collection discards information permanently and forecloses ' +
          'analyses you may later need.'
      },
      {
        question: 'A Cronbach\'s alpha of 0.98 on a 20-item scale most likely indicates:',
        options: [
          'Excellent construct validity',
          'Redundant items that are near-duplicates of one another',
          'Poor internal consistency',
          'A sample that is too small'
        ],
        answer: 1,
        explanation:
          'Very high alpha usually means items are asking essentially the same question ' +
          'in different words. It inflates apparent consistency while narrowing the ' +
          'construct actually covered.'
      },
      {
        question: 'The primary purpose of a pilot study is to:',
        options: [
          'Increase the total sample size',
          'Test comprehension, timing, flow, coding and the analysis plan before full data collection',
          'Publish preliminary findings',
          'Satisfy the ethics committee'
        ],
        answer: 1,
        explanation:
          'A pilot is a rehearsal of the whole process, including running the intended ' +
          'analysis on pilot data. Pilot participants are excluded from the main study ' +
          'and do not add to its sample.'
      },
      {
        question: 'When adapting a validated English instrument for use in Twi, the minimum acceptable process includes:',
        options: [
          'Direct translation by the researcher',
          'Forward translation, independent back translation, expert reconciliation and cognitive interviewing',
          'Using an online translation tool and checking it reads well',
          'No adaptation is needed if respondents understand some English'
        ],
        answer: 1,
        explanation:
          'Cross-cultural adaptation is a defined procedure. Skipping it means the ' +
          'translated instrument\'s validity is unknown, and any psychometric evidence ' +
          'from the original version no longer applies.'
      }
    ]
  },

  {
    id: 'unit-09',
    number: 9,
    title: 'Research Ethics and Integrity',
    duration: '120 minutes',
    summary:
      'The principles governing research with human participants, how ethical ' +
      'review actually works, and the integrity questions — authorship, ' +
      'plagiarism, data fabrication and the use of AI — that decide whether your ' +
      'work stands.',
    objectives: [
      'State the four principles of research ethics and apply them to a scenario',
      'Explain what makes consent genuinely informed, voluntary and documented',
      'Assemble an ethics application and anticipate what a committee will query',
      'Distinguish anonymity from confidentiality and implement both',
      'Identify vulnerable groups and the additional safeguards they require',
      'Apply authorship criteria and recognise research misconduct',
      'State a defensible position on the use of AI tools in research'
    ],
    sections: [
      {
        heading: 'Principles and their origins',
        points: [
          'The Nuremberg Code followed the Nazi medical experiments; the Declaration of Helsinki and the Belmont Report followed later abuses, including Tuskegee',
          'Autonomy — people decide for themselves whether to take part, having understood what is involved',
          'Beneficence — maximise benefit; Non-maleficence — minimise harm; the two are weighed together',
          'Justice — burdens and benefits are distributed fairly, and no group is used as a convenient subject pool for research that will benefit others',
          'Justice has particular weight in African research settings, where communities have historically borne research burden without sharing in benefit',
          'Ethical conduct is not a form to be completed; it is a continuing obligation through the study'
        ]
      },
      {
        heading: 'Informed consent',
        points: [
          'Information — purpose, procedures, duration, risks, benefits, alternatives, confidentiality limits, and who to contact',
          'Comprehension — in the participant\'s language, at an appropriate reading level, with opportunity to ask questions',
          'Voluntariness — free from coercion or undue inducement; compensation should cover cost and time, not act as an incentive that overrides judgement',
          'Documentation — signature, thumbprint or witnessed verbal consent, as appropriate to context and literacy',
          'The right to withdraw at any time, without giving a reason and without penalty, must be stated and honoured',
          'Children give assent while a parent or guardian gives consent; the age of assent varies by jurisdiction',
          'Consent is a process, not a signature: it should be revisited in longitudinal and ethnographic work',
          'Waiver of consent may be granted for anonymised secondary data or minimal-risk record review, but only by the committee'
        ],
        note:
          'Where a clinician recruits their own patients, or a lecturer their own ' +
          'students, the power relationship can make refusal feel impossible. Address ' +
          'this explicitly in the application — usually by having someone independent ' +
          'take consent.'
      },
      {
        heading: 'Review and approval',
        points: [
          'Institutional Review Boards and Research Ethics Committees review before any data are collected',
          'In Ghana, approvals commonly involve institutional RECs and, depending on the work, the Ghana Health Service Ethics Review Committee or the FDA',
          'A typical application requires the protocol, instruments, information sheet, consent form, translations, CVs and a data management plan',
          'Committees most often query: unclear risk-benefit, weak consent for vulnerable groups, inadequate data protection, undisclosed conflicts, and underpowered designs',
          'Approval is time-limited; amendments and extensions must be submitted, and adverse events reported',
          'Publishing without approval is a serious breach — many journals require the approval number, and retraction follows if it was never obtained'
        ]
      },
      {
        heading: 'Confidentiality and data protection',
        points: [
          'Anonymity means even the researcher cannot link data to a person; confidentiality means the researcher can but will not disclose',
          'Most studies offer confidentiality, not anonymity — say which, accurately',
          'De-identify at the earliest point; keep any linking key in a separate, encrypted, access-controlled file',
          'Ghana\'s Data Protection Act 2012 (Act 843) governs personal data, requiring lawful basis, purpose limitation and security',
          'State retention periods and how data will be destroyed or archived',
          'Qualitative data are especially re-identifiable — a role plus a district can identify someone even without a name',
          'Confidentiality has limits: disclosure of imminent harm or of certain crimes may compel action, and participants must be told this in advance'
        ]
      },
      {
        heading: 'Integrity, authorship and AI',
        points: [
          'Fabrication (inventing data), falsification (altering data) and plagiarism are the three classical forms of misconduct',
          'Self-plagiarism and duplicate publication are also breaches, even though the text is your own',
          'ICMJE authorship requires all four: substantial contribution, drafting or critical revision, final approval, and accountability for the work',
          'Supervisors are not automatically authors; funders and heads of department are not authors by virtue of position — gift authorship is a breach',
          'Agree the authorship order in writing at the start, not after the results arrive',
          'Declare funding and conflicts of interest; register trials prospectively and consider preregistering observational protocols',
          'Report negative and null results — suppressing them distorts the literature and wastes participants\' contribution',
          'AI tools may assist with language, structure and code, but the researcher remains accountable for every claim; AI cannot be an author, must not be used to generate data or references, and its use should be disclosed as journals and institutions increasingly require',
          'Never paste identifiable participant data into a public AI service — that is a data protection breach regardless of the research value'
        ]
      }
    ],
    keyTerms: [
      { term: 'Autonomy', definition: 'The principle that competent people decide for themselves whether to participate.' },
      { term: 'Beneficence', definition: 'The obligation to maximise benefit and minimise harm to participants.' },
      { term: 'Justice', definition: 'Fair distribution of the burdens and benefits of research across groups.' },
      { term: 'Assent', definition: 'A child\'s own agreement to take part, alongside a guardian\'s consent.' },
      { term: 'Anonymity', definition: 'Data cannot be linked to an individual by anyone, including the researcher.' },
      { term: 'Confidentiality', definition: 'Identifiable data exist but access is restricted and disclosure prevented.' },
      { term: 'Gift authorship', definition: 'Naming as author someone who has not met the criteria for authorship.' },
      { term: 'Equipoise', definition: 'Genuine uncertainty about which trial arm is superior, the ethical basis for randomising.' }
    ],
    activity:
      'You plan to interview nurses about errors they have witnessed. Draft the ' +
      'confidentiality paragraph of your information sheet, including its limits. ' +
      'Then list every way a reader might identify a participant from a quotation, ' +
      'and state how you would prevent each.',
    readings: [
      { label: 'World Medical Association — Declaration of Helsinki', note: 'Short, foundational and worth reading in full at least once.' },
      { label: 'The Belmont Report (1979)', note: 'The origin of respect for persons, beneficence and justice.' },
      { label: 'ICMJE Recommendations — authorship criteria', note: 'The four-part test, and what disqualifies a contributor.' },
      { label: 'Ghana Data Protection Act 2012 (Act 843)', note: 'The legal framework for personal data in Ghana.' }
    ],
    quiz: [
      {
        question: 'A researcher offers unemployed participants an amount equal to two weeks\' wages to join a study with real risk. The principal concern is:',
        options: [
          'The budget is too large',
          'Undue inducement compromising voluntariness',
          'A breach of confidentiality',
          'Nothing — compensation is always acceptable'
        ],
        answer: 1,
        explanation:
          'Payment large enough to override a person\'s judgement about risk undermines ' +
          'voluntariness. Compensation should reasonably cover time and costs, not act ' +
          'as an incentive that makes refusal unrealistic.'
      },
      {
        question: 'A study records names and phone numbers so participants can be followed up, storing them securely and never disclosing them. This offers:',
        options: ['Anonymity', 'Confidentiality', 'Both', 'Neither'],
        answer: 1,
        explanation:
          'Because identifiers exist and the researcher can link data to individuals, ' +
          'this is confidentiality. Anonymity would require that no one, including the ' +
          'researcher, could make that link.'
      },
      {
        question: 'A head of department who provided no intellectual input asks to be listed as an author. Under ICMJE criteria this is:',
        options: [
          'Acceptable, as departmental support is a contribution',
          'Gift authorship, which is a breach of publication ethics',
          'Acceptable if they are listed last',
          'Required by most institutions'
        ],
        answer: 1,
        explanation:
          'Authorship requires substantial contribution, drafting or critical revision, ' +
          'final approval and accountability. Position or provision of facilities does ' +
          'not qualify; acknowledgement is the appropriate place.'
      },
      {
        question: 'Data collection began before ethical approval was granted, though approval was later obtained. The likely consequence is:',
        options: [
          'None, since approval was eventually granted',
          'The data collected beforehand are unusable and publication may be refused or retracted',
          'A brief delay only',
          'The committee will backdate the approval'
        ],
        answer: 1,
        explanation:
          'Approval cannot be retrospective. Data gathered before it lack ethical ' +
          'authorisation, journals require the approval date, and discovering the ' +
          'discrepancy after publication commonly leads to retraction.'
      },
      {
        question: 'Which use of an AI tool is clearly unacceptable?',
        options: [
          'Improving the grammar of a paragraph you wrote',
          'Generating plausible-looking references you do not verify',
          'Explaining a statistical concept to you',
          'Helping debug your analysis code'
        ],
        answer: 1,
        explanation:
          'Generated references are frequently fabricated. Citing sources you have not ' +
          'verified and read is a fabrication of the evidentiary record, regardless of ' +
          'how the citation was produced.'
      },
      {
        question: 'A trial finds the new intervention no better than standard care, and the team decides not to publish. This is problematic because:',
        options: [
          'Null results are always publishable in high-impact journals',
          'Suppressing null findings distorts the evidence base and wastes participants\' contribution',
          'The funder requires a positive result',
          'It has no ethical implications'
        ],
        answer: 1,
        explanation:
          'Selective publication of positive findings produces publication bias, ' +
          'misleading later reviews and clinical decisions. Participants accepted burden ' +
          'on the understanding the knowledge would be shared.'
      }
    ]
  },

  {
    id: 'unit-10',
    number: 10,
    title: 'Writing the Proposal, Rigour and Dissemination',
    duration: '120 minutes',
    summary:
      'Assembling everything into a proposal that will be approved and funded, ' +
      'building in rigour rather than claiming it, and planning how findings will ' +
      'reach the people who can act on them.',
    objectives: [
      'Structure a research proposal to the standard expected by committees and funders',
      'Write a methods section detailed enough to be reproduced',
      'Build a realistic timeline and budget',
      'State limitations honestly without undermining the study',
      'Plan a data management strategy',
      'Design a dissemination plan that reaches participants and decision makers, not only journals'
    ],
    sections: [
      {
        heading: 'Proposal structure',
        points: [
          'Title — specific, informative, usually naming design, population and setting',
          'Abstract — written last, covering background, aim, methods, expected outcomes; respect the word limit exactly',
          'Introduction and background — the problem, its magnitude, and the gap',
          'Literature review — the argument leading to your question',
          'Aim, objectives, research questions and hypotheses',
          'Methodology — design, setting, population, sampling, sample size, instruments, procedures, analysis plan',
          'Ethical considerations — approvals sought, consent, confidentiality, risk mitigation',
          'Timeline, budget, references, appendices with instruments and consent forms',
          'Reviewers commonly read the aim, then jump to sampling, sample size and analysis — those must survive isolated scrutiny'
        ]
      },
      {
        heading: 'The methods section',
        points: [
          'The test is reproducibility: could a competent stranger repeat this from what you wrote?',
          'Specify inclusion and exclusion criteria at the level of the individual participant',
          'State the sample size calculation with every input, not just the result',
          'Name the statistical tests against each objective, and say how missing data and confounding will be handled',
          'Pre-specify the analysis plan; deciding tests after seeing the data invites accusations of p-hacking',
          'For qualitative work, state the analytic approach, who will code, and how disagreements will be resolved',
          'Use the relevant reporting checklist while writing rather than afterwards: CONSORT for trials, STROBE for observational studies, COREQ or SRQR for qualitative work, PRISMA for reviews'
        ],
        note:
          'Reporting checklists are usually treated as a publication chore. Used at ' +
          'the proposal stage they function as a design checklist, and they surface ' +
          'the omissions reviewers would have found later.'
      },
      {
        heading: 'Timeline, budget and feasibility',
        points: [
          'Build the timeline backwards from the deadline, and add contingency — ethical approval alone commonly takes one to three months',
          'A Gantt chart makes dependencies visible: recruitment cannot begin before approval, analysis cannot begin before data cleaning',
          'Budget lines typically include personnel, transport, materials, participant compensation, data collection tools, software, transcription and translation, dissemination',
          'Transcription is routinely underestimated — an hour of interview takes roughly four to six hours to transcribe',
          'Justify every line; unexplained round numbers attract scrutiny',
          'State what you will do if recruitment is slower than planned — reviewers ask'
        ]
      },
      {
        heading: 'Rigour and limitations',
        points: [
          'Rigour is designed in, not asserted at the end',
          'Quantitative: adequate power, valid instruments, control of confounding, pre-specified analysis, appropriate handling of missing data',
          'Qualitative: audit trail, reflexivity, triangulation, thick description, transparent coding',
          'Limitations should name the threat, its likely direction, and what you did to reduce it',
          '"Time and financial constraints" is not a limitation; a convenience sample that may over-represent urban, literate respondents is',
          'Do not list limitations so severe they undermine the study — if one does, redesign rather than disclose and proceed'
        ]
      },
      {
        heading: 'Data management and dissemination',
        points: [
          'A data management plan states what data are collected, how stored, who has access, how backed up, how long retained and what is shared',
          'Follow the 3-2-1 rule: three copies, two media, one off-site',
          'Version your files by date and never overwrite raw data — all cleaning happens in a script or a documented copy',
          'FAIR principles — Findable, Accessible, Interoperable, Reusable — increasingly required by funders',
          'Dissemination should reach participants and their communities, not only journals: policy briefs, community feedback meetings, radio, professional bodies',
          'Feeding results back to the community that provided them is an ethical obligation, and it is what makes the next study possible',
          'Plan dissemination in the proposal, and budget for it'
        ]
      }
    ],
    keyTerms: [
      { term: 'Gantt chart', definition: 'A bar chart showing project activities against time, making dependencies and overlaps visible.' },
      { term: 'STROBE', definition: 'The reporting checklist for observational epidemiological studies.' },
      { term: 'COREQ', definition: 'The 32-item reporting checklist for qualitative interview and focus group research.' },
      { term: 'Data management plan', definition: 'A document specifying how data will be collected, stored, protected, retained and shared.' },
      { term: 'FAIR principles', definition: 'Findable, Accessible, Interoperable, Reusable — standards for research data stewardship.' },
      { term: 'p-hacking', definition: 'Trying analyses until a significant result appears, then reporting only that one.' },
      { term: 'Policy brief', definition: 'A short, non-technical summary of findings and recommendations aimed at decision makers.' }
    ],
    activity:
      'Assemble a two-page proposal skeleton for your own study: title, aim, three ' +
      'objectives, design, sampling and sample size, analysis plan, and three ' +
      'limitations each stating direction and mitigation. Exchange with a partner ' +
      'and mark it against the relevant reporting checklist.',
    readings: [
      { label: 'EQUATOR Network — reporting guidelines', note: 'Free index of every checklist; find yours before you write.' },
      { label: 'von Elm et al. (2007) — STROBE statement', note: 'What an observational study must report.' },
      { label: 'Tong, Sainsbury & Craig (2007) — COREQ', note: 'The qualitative reporting standard.' },
      { label: 'Wilkinson et al. (2016) — FAIR Guiding Principles', note: 'Increasingly cited in funder data requirements.' }
    ],
    quiz: [
      {
        question: 'The best test of whether a methods section is adequate is:',
        options: [
          'It exceeds 1,000 words',
          'A competent researcher could reproduce the study from it alone',
          'It cites the most recent literature',
          'It names the statistical software'
        ],
        answer: 1,
        explanation:
          'Reproducibility is the standard. Length, citation currency and software names ' +
          'are incidental if a reader still could not repeat what you did.'
      },
      {
        question: 'Which is a properly stated limitation?',
        options: [
          'Time and financial constraints limited the study.',
          'The convenience sample was drawn from one urban clinic and likely over-represents literate, higher-income patients, probably overstating treatment adherence.',
          'More research is needed in this area.',
          'The sample size was small.'
        ],
        answer: 1,
        explanation:
          'A useful limitation names the specific threat, its likely direction of bias, ' +
          'and lets the reader judge its effect. The others are generic statements that ' +
          'give the reader nothing to work with.'
      },
      {
        question: 'Choosing statistical tests after inspecting the data and reporting only the significant ones is:',
        options: ['Exploratory analysis', 'p-hacking', 'Sensitivity analysis', 'Intention to treat'],
        answer: 1,
        explanation:
          'Selecting analyses based on which produced significance inflates the false ' +
          'positive rate. Pre-specifying the analysis plan in the proposal is the ' +
          'protection against it; genuine exploratory work must be labelled as such.'
      },
      {
        question: 'A proposal budgets three days to transcribe 20 interviews averaging one hour. This is:',
        options: [
          'Generous',
          'Unrealistic — transcription typically takes four to six hours per recorded hour',
          'About right',
          'Irrelevant to reviewers'
        ],
        answer: 1,
        explanation:
          'Twenty hours of audio implies roughly 80-120 hours of transcription. ' +
          'Underestimating this is one of the most common feasibility errors in ' +
          'qualitative proposals, and reviewers look for it.'
      },
      {
        question: 'The 3-2-1 backup rule means:',
        options: [
          'Three researchers, two supervisors, one committee',
          'Three copies, on two types of media, with one stored off-site',
          'Three years of retention, two backups, one archive',
          'Three drafts before submission'
        ],
        answer: 1,
        explanation:
          'Three copies on two different media with one off-site protects against ' +
          'device failure, theft and fire — each of which has ended postgraduate ' +
          'projects that had only a laptop copy.'
      },
      {
        question: 'Feeding findings back to the community that provided the data is best understood as:',
        options: [
          'Optional courtesy if funds remain',
          'An ethical obligation that should be planned and budgeted from the start',
          'A task for the funder',
          'Necessary only for clinical trials'
        ],
        answer: 1,
        explanation:
          'Participants contributed time and risk on the understanding that knowledge ' +
          'would result. Returning findings respects that, and it is what sustains ' +
          'community willingness to take part in future research.'
      }
    ]
  }
];

export default unitsCPractice;
