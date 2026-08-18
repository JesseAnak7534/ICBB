/**
 * Research Methods (Part 1) — Units 5-7: quantitative designs, qualitative
 * designs, and mixed methods with sampling.
 */

const unitsBDesigns = [
  {
    id: 'unit-05',
    number: 5,
    title: 'Quantitative Research Designs',
    duration: '120 minutes',
    summary:
      'The main observational and experimental designs, what each can and cannot ' +
      'establish, and how to choose the weakest design that still answers your ' +
      'question honestly.',
    objectives: [
      'Describe cross-sectional, case-control, cohort and experimental designs',
      'Match a design to a research question and justify the choice',
      'Explain why association does not establish causation and what would',
      'Identify the principal biases threatening each design',
      'Explain randomisation, blinding and allocation concealment',
      'Recognise quasi-experimental designs and when they are the honest option'
    ],
    sections: [
      {
        heading: 'Observational designs',
        points: [
          'Cross-sectional — exposure and outcome measured at the same moment; fast and cheap; gives prevalence but cannot establish which came first',
          'Case-control — starts from the outcome and looks backward at exposure; efficient for rare outcomes; vulnerable to recall and selection bias; yields an odds ratio',
          'Cohort — starts from exposure and follows forward to outcome; establishes temporal sequence; expensive and vulnerable to loss to follow-up; yields relative risk and incidence',
          'Ecological — units of analysis are groups rather than individuals; cheap but subject to the ecological fallacy',
          'Case series and case reports — descriptive only, no comparison group, hypothesis-generating at best'
        ],
        table: {
          caption: 'Choosing an observational design',
          headers: ['Design', 'Starts from', 'Best for', 'Main weakness'],
          rows: [
            ['Cross-sectional', 'A population at one time', 'Prevalence, associations', 'No temporal sequence'],
            ['Case-control', 'The outcome', 'Rare outcomes, long latency', 'Recall and selection bias'],
            ['Cohort', 'The exposure', 'Incidence, temporal sequence', 'Cost, attrition'],
            ['Ecological', 'Groups', 'Population-level hypotheses', 'Ecological fallacy']
          ]
        }
      },
      {
        heading: 'Experimental designs',
        points: [
          'The investigator assigns the exposure, which is what permits causal inference',
          'Randomisation distributes both known and unknown confounders across arms — its unique strength',
          'Allocation concealment stops the recruiter from knowing the next assignment, preventing selection bias at entry',
          'Blinding stops participants, providers or assessors from knowing the assignment, preventing performance and detection bias',
          'Randomised controlled trials may be parallel, crossover, factorial or cluster-randomised',
          'Cluster randomisation assigns groups (schools, clinics, villages) and requires a larger sample because responses within a cluster are correlated',
          'Analyse by intention to treat: participants are analysed in the arm to which they were assigned, whatever they actually received'
        ],
        note:
          'Per-protocol analysis, which counts only those who complied, quietly ' +
          'destroys randomisation and reintroduces confounding. Report it as a ' +
          'secondary analysis if at all.'
      },
      {
        heading: 'Quasi-experimental designs',
        points: [
          'Used when randomisation is impossible, unethical or politically unacceptable',
          'Non-equivalent control group — an untreated comparison group not formed by randomisation',
          'Interrupted time series — repeated measures before and after an intervention, strong when many time points exist',
          'Difference-in-differences — compares change over time between exposed and unexposed groups',
          'Stepped wedge — all clusters eventually receive the intervention, in a randomised order; ethically attractive for programme rollout',
          'These designs support weaker causal claims and must state the residual threats explicitly'
        ]
      },
      {
        heading: 'Causation and bias',
        points: [
          'Association is necessary but not sufficient for causation',
          'The Bradford Hill considerations — strength, consistency, temporality, biological gradient, plausibility and others — aid judgement but prove nothing individually',
          'Temporality is the only genuinely necessary condition: the cause must precede the effect',
          'Selection bias arises when those included differ systematically from those not included',
          'Information bias arises from measurement error — including recall bias and interviewer bias',
          'Confounding arises when a third variable explains the apparent relationship',
          'Confounding can be handled by design (randomisation, restriction, matching) or by analysis (stratification, regression adjustment)'
        ]
      }
    ],
    keyTerms: [
      { term: 'Incidence', definition: 'The rate of new cases arising in a population over a defined period.' },
      { term: 'Prevalence', definition: 'The proportion of a population having the condition at a point in time.' },
      { term: 'Odds ratio', definition: 'The ratio of the odds of exposure in cases to the odds in controls; the standard measure from case-control studies.' },
      { term: 'Allocation concealment', definition: 'Preventing those enrolling participants from knowing the upcoming assignment.' },
      { term: 'Intention to treat', definition: 'Analysing participants in the arm to which they were randomised, regardless of adherence.' },
      { term: 'Ecological fallacy', definition: 'Wrongly inferring something about individuals from a relationship observed between groups.' },
      { term: 'Confounding', definition: 'Distortion of an exposure-outcome association by a third variable related to both.' }
    ],
    activity:
      'You are asked whether a new community health worker programme reduced ' +
      'under-five mortality. Randomisation is refused by the district. Propose two ' +
      'quasi-experimental designs, state what each can and cannot establish, and ' +
      'name the biases you would have to acknowledge.',
    readings: [
      { label: 'Rothman — Epidemiology: An Introduction', note: 'Short, rigorous and readable on design and bias.' },
      { label: 'Hulley et al. — Designing Clinical Research', note: 'Practical chapters on each design with worked examples.' },
      { label: 'Schulz, Altman & Moher (2010) — CONSORT 2010 statement', note: 'What a trial must report, and therefore what it must do.' }
    ],
    quiz: [
      {
        question: 'A researcher surveys 500 adults, measuring current salt intake and current blood pressure on the same day. The fundamental limitation is that:',
        options: [
          'The sample is too small',
          'Temporal sequence cannot be established, so it is unclear which came first',
          'An odds ratio cannot be calculated',
          'Ethical approval is not possible'
        ],
        answer: 1,
        explanation:
          'This is a cross-sectional design. Exposure and outcome are measured ' +
          'simultaneously, so it can show association but cannot establish that the ' +
          'exposure preceded the outcome.'
      },
      {
        question: 'For a rare cancer with a 20-year latency, the most efficient design is:',
        options: ['Prospective cohort', 'Case-control', 'Randomised controlled trial', 'Cross-sectional survey'],
        answer: 1,
        explanation:
          'A cohort study would need an enormous sample followed for decades to ' +
          'accumulate enough cases. Case-control starts from existing cases and looks ' +
          'backward, making rare, slow-developing outcomes tractable.'
      },
      {
        question: 'The unique advantage of randomisation over statistical adjustment is that it:',
        options: [
          'Increases the sample size',
          'Balances unknown and unmeasured confounders as well as known ones',
          'Removes the need for a control group',
          'Guarantees blinding'
        ],
        answer: 1,
        explanation:
          'Regression can only adjust for confounders you measured. Randomisation ' +
          'distributes confounders you never thought of, which no analysis can do.'
      },
      {
        question: 'In a trial, participants who stopped taking the drug are excluded from analysis. This:',
        options: [
          'Is correct practice, known as intention to treat',
          'Breaks randomisation and can reintroduce confounding',
          'Improves the precision of the estimate',
          'Is required by CONSORT'
        ],
        answer: 1,
        explanation:
          'Excluding non-adherers is per-protocol analysis. Adherence is often related ' +
          'to prognosis, so removing those participants destroys the comparability ' +
          'randomisation created. Intention to treat is the primary analysis.'
      },
      {
        question: 'Countries with higher average chocolate consumption have more Nobel laureates per capita. Concluding that chocolate improves individual cognition commits:',
        options: ['Recall bias', 'The ecological fallacy', 'Selection bias', 'Attrition bias'],
        answer: 1,
        explanation:
          'The data describe countries, not people. Inferring an individual-level ' +
          'relationship from a group-level association is the ecological fallacy — and ' +
          'here national wealth confounds both variables.'
      },
      {
        question: 'Which condition is genuinely necessary for a causal claim?',
        options: ['A large sample', 'Statistical significance', 'Temporality — the cause precedes the effect', 'Biological plausibility'],
        answer: 2,
        explanation:
          'Temporality is the one Bradford Hill consideration that cannot be dispensed ' +
          'with. The others strengthen a causal argument but none is individually ' +
          'necessary or sufficient.'
      }
    ]
  },

  {
    id: 'unit-06',
    number: 6,
    title: 'Qualitative Research Designs',
    duration: '120 minutes',
    summary:
      'The major qualitative traditions, the data collection methods attached to ' +
      'each, and how rigour is established when the aim is understanding rather ' +
      'than measurement.',
    objectives: [
      'Distinguish phenomenology, grounded theory, ethnography, case study and narrative inquiry',
      'Match a qualitative tradition to a research question',
      'Design an interview guide and a focus group schedule',
      'Explain sampling logic in qualitative work and the concept of information power',
      'Apply the criteria of trustworthiness and explain reflexivity',
      'Recognise when a qualitative design is the right answer and when it is an evasion'
    ],
    sections: [
      {
        heading: 'The major traditions',
        points: [
          'Phenomenology — describes the lived experience of a phenomenon; asks what it is like to live through this; small purposive samples, in-depth interviews',
          'Grounded theory — builds theory from data through constant comparison and theoretical sampling; data collection and analysis proceed together',
          'Ethnography — describes culture and practice through prolonged immersion and participant observation; fieldnotes are primary data',
          'Case study — examines a bounded system in depth using multiple data sources; may be single or multiple case, and is strong for "how" and "why" questions',
          'Narrative inquiry — treats the story itself as the unit of analysis, attending to how people construct accounts of their lives',
          'Descriptive qualitative — a legitimate, atheoretical option when the aim is a straightforward account of views and experiences'
        ],
        note:
          'Choosing a tradition commits you to its sampling, data collection and ' +
          'analysis. Claiming grounded theory and then running six interviews with ' +
          'thematic analysis is a mismatch examiners look for specifically.'
      },
      {
        heading: 'Data collection',
        points: [
          'In-depth interviews — best for sensitive topics and individual experience; typically 45-90 minutes',
          'Focus groups — 6-10 participants; strong for surfacing shared norms and disagreement; poor for sensitive or stigmatised topics',
          'Participant and non-participant observation — captures what people do rather than what they say they do',
          'Document analysis — policies, records, media; unobtrusive and useful for institutional questions',
          'Photovoice and participatory methods — shift some control to participants and suit community-based work',
          'Triangulation combines sources or methods so that a finding does not rest on one type of evidence'
        ]
      },
      {
        heading: 'Interview guides',
        points: [
          'Structure the guide in funnels: open broadly, then probe specifics, then close',
          'Ask open questions — "tell me about…", "walk me through…", "what was that like?"',
          'Avoid leading questions, double-barrelled questions and jargon',
          'Plan probes in advance: "can you say more?", "what happened next?", "can you give an example?"',
          'Six to ten main questions is usually enough for a 60-minute interview',
          'Pilot the guide and expect to revise it — this is a strength, not a failure',
          'In focus groups, plan how you will manage a dominant speaker and draw out quiet participants'
        ]
      },
      {
        heading: 'Sampling and sample size',
        points: [
          'Sampling is purposive: participants are chosen because they can illuminate the question, not to represent a population statistically',
          'Maximum variation sampling seeks diversity; homogeneous sampling seeks depth within a defined group',
          'Theoretical sampling, specific to grounded theory, selects the next participant based on what the emerging analysis requires',
          'Snowball sampling reaches hidden populations but tends to stay within one network',
          'Saturation is the point where new data generate no new codes or themes',
          'Information power is the more defensible modern concept: narrow aim, dense sample specificity, strong theory and strong dialogue all reduce the number needed',
          'Typical ranges: 6-12 for a homogeneous phenomenological study, 20-30 for grounded theory, but justify rather than cite a number'
        ],
        note:
          'Declaring saturation after a fixed number of interviews planned in advance ' +
          'is not saturation. Saturation is something you observe during analysis and ' +
          'must be able to evidence.'
      },
      {
        heading: 'Rigour and reflexivity',
        points: [
          'Credibility — do the findings represent the participants\' reality? Supported by member checking, triangulation and prolonged engagement',
          'Transferability — could findings apply elsewhere? Supported by thick description of context so readers can judge',
          'Dependability — would the process be consistent if repeated? Supported by an audit trail',
          'Confirmability — do findings follow from the data rather than the researcher\'s preferences? Supported by memos and reflexive notes',
          'Reflexivity means recording your own position — profession, assumptions, relationship to participants — and how it shaped the work',
          'Generalisability in the statistical sense is not the aim, and apologising for its absence misunderstands the design'
        ]
      }
    ],
    keyTerms: [
      { term: 'Purposive sampling', definition: 'Selecting participants deliberately for their capacity to inform the research question.' },
      { term: 'Saturation', definition: 'The point at which further data collection yields no new codes, categories or themes.' },
      { term: 'Information power', definition: 'The principle that the richer and more specific the sample and aim, the fewer participants are needed.' },
      { term: 'Reflexivity', definition: 'Systematic attention to how the researcher shapes and is shaped by the research.' },
      { term: 'Thick description', definition: 'Detailed account of context and meaning sufficient for a reader to judge transferability.' },
      { term: 'Triangulation', definition: 'Using multiple sources, methods or investigators to strengthen confidence in a finding.' },
      { term: 'Audit trail', definition: 'A documented record of decisions taken through the research, allowing the process to be followed.' }
    ],
    activity:
      'Draft a six-question interview guide for your own topic. Swap with a ' +
      'partner, who must flag every leading, closed or double-barrelled question ' +
      'and rewrite one of them. Then role-play the first two questions and note ' +
      'where the guide fails in practice.',
    readings: [
      { label: 'Braun & Clarke — Successful Qualitative Research', note: 'Practical, opinionated and reliable throughout.' },
      { label: 'Malterud, Siersma & Guassora (2016) — "Sample Size in Qualitative Interview Studies"', note: 'The information power concept; short and worth reading in full.' },
      { label: 'Lincoln & Guba — Naturalistic Inquiry', note: 'The origin of the trustworthiness criteria.' },
      { label: 'Creswell & Poth — Qualitative Inquiry and Research Design', note: 'Compares the five traditions side by side.' }
    ],
    quiz: [
      {
        question: 'A researcher wants to build a theory of how nurses develop resilience, collecting and analysing data simultaneously and choosing later participants based on emerging categories. This is:',
        options: ['Phenomenology', 'Grounded theory', 'Ethnography', 'Narrative inquiry'],
        answer: 1,
        explanation:
          'Simultaneous collection and analysis, constant comparison and theoretical ' +
          'sampling are the defining features of grounded theory, whose explicit aim is ' +
          'to generate theory.'
      },
      {
        question: 'Focus groups are a poor choice for which topic?',
        options: [
          'Community attitudes to a new clinic',
          'Individual experiences of intimate partner violence',
          'Shared norms about handwashing',
          'Reactions to a proposed health policy'
        ],
        answer: 1,
        explanation:
          'Stigmatised or sensitive individual experiences are unlikely to be disclosed ' +
          'in front of peers, and disclosure could put participants at risk. In-depth ' +
          'individual interviews are appropriate here.'
      },
      {
        question: '"Don\'t you think the long waiting times are the main problem at the clinic?" is flawed because it is:',
        options: ['Too open', 'Leading, and also closed', 'Double-barrelled only', 'Appropriately probing'],
        answer: 1,
        explanation:
          'It supplies the answer and invites agreement, and it can be answered yes or ' +
          'no. "What is it like attending this clinic?" opens the topic without ' +
          'directing the response.'
      },
      {
        question: 'A student writes: "Saturation was achieved as 15 interviews had been planned." This is unsatisfactory because:',
        options: [
          'Fifteen interviews is too few',
          'Saturation is observed during analysis, not decided by a prior plan',
          'Saturation applies only to grounded theory',
          'Saturation requires at least 30 participants'
        ],
        answer: 1,
        explanation:
          'Saturation is an empirical observation that new data are producing no new ' +
          'codes. Announcing it because a planned number was reached inverts the logic ' +
          'and cannot be evidenced.'
      },
      {
        question: 'Providing detailed description of setting, participants and context primarily supports which criterion?',
        options: ['Credibility', 'Transferability', 'Dependability', 'Confirmability'],
        answer: 1,
        explanation:
          'Thick description lets readers judge whether findings might apply in their ' +
          'own setting, which is how transferability works — the reader makes the ' +
          'judgement, not the researcher.'
      },
      {
        question: 'A qualitative thesis states: "A limitation is that findings cannot be generalised to the wider population." The best response is that this:',
        options: [
          'Is an appropriate limitation to acknowledge',
          'Misapplies a quantitative criterion; transferability is the relevant concept',
          'Means the sample size was too small',
          'Requires a statistical power calculation'
        ],
        answer: 1,
        explanation:
          'Statistical generalisation was never the aim of the design. Framing its ' +
          'absence as a limitation suggests the researcher has not understood the ' +
          'logic of the method they used.'
      }
    ]
  },

  {
    id: 'unit-07',
    number: 7,
    title: 'Mixed Methods and Sampling',
    duration: '120 minutes',
    summary:
      'How quantitative and qualitative strands are combined deliberately rather ' +
      'than decoratively, and the full range of sampling strategies with the ' +
      'arithmetic of sample size.',
    objectives: [
      'Describe convergent, explanatory sequential and exploratory sequential designs',
      'Explain what integration means and why it is the defining feature of mixed methods',
      'Distinguish probability from non-probability sampling and state when each is appropriate',
      'Calculate a sample size for a prevalence study and for comparing two proportions',
      'Explain power, effect size and the consequences of an underpowered study',
      'Adjust a sample size for non-response and design effect'
    ],
    sections: [
      {
        heading: 'Mixed methods designs',
        points: [
          'Convergent parallel — both strands run at the same time and are compared at interpretation; used when each answers a different facet of one question',
          'Explanatory sequential — quantitative first, then qualitative to explain surprising or unexplained results',
          'Exploratory sequential — qualitative first to develop an instrument or identify constructs, then quantitative to test at scale',
          'Embedded — one strand sits inside a larger design, such as a process evaluation within a trial',
          'Integration is the defining feature: strands must be brought together, not merely reported in adjacent chapters',
          'Integration techniques include joint displays, following a thread, and merging in a triangulation matrix'
        ],
        note:
          'A study that runs a survey and some interviews and reports them ' +
          'separately is not mixed methods; it is two studies in one document. The ' +
          'examiner\'s question is always: what did you learn from combining them ' +
          'that neither strand gave you alone?'
      },
      {
        heading: 'Probability sampling',
        points: [
          'Simple random — every unit has an equal chance; requires a complete sampling frame',
          'Systematic — every kth unit from a random start; simple in the field but fails if the list has a periodic pattern',
          'Stratified — the population is divided into strata and sampled within each; improves precision and guarantees representation of small subgroups',
          'Cluster — whole groups are sampled; cheaper when the population is geographically dispersed, but less precise',
          'Multistage — combines the above, and is what national surveys such as the DHS actually use',
          'Only probability sampling supports statistical generalisation to the population'
        ]
      },
      {
        heading: 'Non-probability sampling',
        points: [
          'Convenience — whoever is available; cheapest and weakest, with unknown bias',
          'Purposive — chosen for a defined characteristic; the standard for qualitative work',
          'Quota — fills preset category targets non-randomly; resembles stratification without randomisation',
          'Snowball — participants recruit others; necessary for hidden populations, but stays within networks',
          'Consecutive — every eligible patient over a defined period; the strongest non-probability option in clinical settings',
          'These cannot support statistical generalisation, and analyses reporting confidence intervals from them should be read cautiously'
        ]
      },
      {
        heading: 'Sample size',
        points: [
          'For a single proportion: n = Z²p(1-p)/d², where Z is 1.96 for 95% confidence, p the expected proportion, d the desired margin of error',
          'Worked example: p = 0.30, d = 0.05 gives n = (1.96² x 0.30 x 0.70)/0.05² = 323',
          'Using p = 0.50 when the proportion is unknown gives the largest, safest sample',
          'For comparing two proportions or means, size depends on the effect you wish to detect, the significance level and the power',
          'Power is the probability of detecting a real effect; 80% is conventional and 90% is preferable',
          'An underpowered study is not merely inconclusive — it is arguably unethical, since participants were exposed to burden for a result that could not have been informative',
          'Apply a finite population correction when the sample is a large fraction of a small population'
        ],
        table: {
          caption: 'Adjusting the calculated sample',
          headers: ['Adjustment', 'When it applies', 'Formula'],
          rows: [
            ['Non-response', 'Always, in surveys', 'n_final = n / (1 - expected non-response)'],
            ['Design effect', 'Cluster sampling', 'n_final = n x DEFF (often 1.5-2.0)'],
            ['Finite population', 'Sample exceeds ~5% of population', 'n_adj = n / (1 + (n-1)/N)'],
            ['Attrition', 'Longitudinal designs', 'Inflate by expected loss to follow-up']
          ]
        }
      },
      {
        heading: 'Putting it together',
        points: [
          'State the sampling frame explicitly, and say what it excludes',
          'Report the calculation with every input value, not just the final number',
          'Say who was excluded and why, and how non-response was handled',
          'Mixed methods studies size each strand by its own logic — power calculation for the quantitative strand, information power for the qualitative',
          'A nested qualitative sample is often drawn purposively from the quantitative sample, which strengthens integration'
        ]
      }
    ],
    keyTerms: [
      { term: 'Sampling frame', definition: 'The list or procedure from which the sample is actually drawn.' },
      { term: 'Design effect (DEFF)', definition: 'The factor by which variance increases because of cluster sampling rather than simple random sampling.' },
      { term: 'Power', definition: 'The probability that a study will detect an effect of a specified size if it truly exists.' },
      { term: 'Effect size', definition: 'The magnitude of a difference or association, independent of sample size.' },
      { term: 'Integration', definition: 'The deliberate bringing together of quantitative and qualitative strands to produce insight neither gives alone.' },
      { term: 'Joint display', definition: 'A table or figure presenting quantitative and qualitative results side by side to show how they relate.' }
    ],
    activity:
      'Calculate the sample size for a prevalence study in your own field: choose ' +
      'p, set d = 0.05, then inflate for 15% non-response and a design effect of ' +
      '1.5. Show every step. Then state, in one sentence each, the sampling frame ' +
      'and what it excludes.',
    readings: [
      { label: 'Creswell & Plano Clark — Designing and Conducting Mixed Methods Research', note: 'The standard text; strong on integration and joint displays.' },
      { label: 'Fetters, Curry & Creswell (2013) — "Achieving Integration in Mixed Methods Designs"', note: 'The clearest short account of what integration actually requires.' },
      { label: 'Lwanga & Lemeshow — Sample Size Determination in Health Studies (WHO)', note: 'Free from WHO; tables for most common situations.' }
    ],
    quiz: [
      {
        question: 'A team surveys 600 households, finds unexpectedly low clinic attendance, then interviews 20 non-attenders to understand why. This design is:',
        options: ['Convergent parallel', 'Explanatory sequential', 'Exploratory sequential', 'Embedded'],
        answer: 1,
        explanation:
          'The quantitative strand comes first and the qualitative strand is used to ' +
          'explain its findings. That ordering and purpose define an explanatory ' +
          'sequential design.'
      },
      {
        question: 'What most clearly distinguishes genuine mixed methods from simply doing two studies?',
        options: [
          'Using a larger sample',
          'Deliberate integration of the strands to produce insight neither gives alone',
          'Publishing both in the same journal',
          'Collecting both types of data at the same time'
        ],
        answer: 1,
        explanation:
          'Integration is the defining criterion. Reporting a survey and some ' +
          'interviews in adjacent chapters, with no point where they speak to each ' +
          'other, is not a mixed methods design.'
      },
      {
        question: 'For a prevalence study with expected proportion 0.30 and margin of error 0.05 at 95% confidence, the required sample is approximately:',
        options: ['196', '323', '384', '512'],
        answer: 1,
        explanation:
          'n = Z²p(1-p)/d² = (3.8416 x 0.30 x 0.70)/0.0025 = 0.8067/0.0025 ≈ 323. ' +
          'The familiar 384 comes from using p = 0.50, the most conservative value.'
      },
      {
        question: 'Which strategy guarantees that a small subgroup is adequately represented?',
        options: ['Simple random sampling', 'Stratified sampling', 'Convenience sampling', 'Systematic sampling'],
        answer: 1,
        explanation:
          'Stratification divides the population first and samples within each stratum, ' +
          'so small subgroups are represented by design. Simple random sampling may by ' +
          'chance include very few of them.'
      },
      {
        question: 'Cluster sampling requires a larger sample than simple random sampling because:',
        options: [
          'Clusters are harder to find',
          'Responses within a cluster are correlated, which increases variance',
          'It is a non-probability method',
          'Non-response is always higher'
        ],
        answer: 1,
        explanation:
          'People within the same village, school or clinic tend to resemble one ' +
          'another, so each observation carries less independent information. The design ' +
          'effect quantifies this and inflates the required sample.'
      },
      {
        question: 'The strongest argument that a seriously underpowered study is unethical is that:',
        options: [
          'It will not be published',
          'Participants bore burden and risk for a study incapable of producing an informative answer',
          'It wastes the researcher\'s time',
          'It cannot obtain ethical approval'
        ],
        answer: 1,
        explanation:
          'Ethical justification for research rests on the prospect of useful knowledge. ' +
          'If the design could not have detected a meaningful effect, participants were ' +
          'exposed to burden with no realistic prospect of benefit.'
      }
    ]
  }
];

export default unitsBDesigns;
