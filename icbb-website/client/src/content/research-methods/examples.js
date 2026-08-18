/**
 * Worked examples, keyed by unit id.
 *
 * These are the "show me" half of the module. Each one takes a concrete study —
 * mostly drawn from Ghanaian and West African research settings — and walks the
 * decision through step by step, ending with the point that is easy to get
 * wrong. They are merged onto their units in index.js, and appear on the unit
 * pages, in the handouts and as slides.
 *
 * Shape: { title, scenario, steps[], lesson }
 */

const examples = {
  'unit-01': [
    {
      title: 'Audit or research? The same data, two different studies',
      scenario:
        'A district hospital notices that 1 in 5 women who book antenatal care ' +
        'never return for a second visit. The medical director asks a midwife to ' +
        '"look into it".',
      steps: [
        'If she compares the return rate against the national target of 4+ visits, that is audit — the standard already exists and she is measuring compliance.',
        'If she asks why women do not return, and the answer is not already known, that is research.',
        'The same appointment records serve both. What separates them is the question, not the data.',
        'The research version needs ethical approval, a sampling strategy and a defined method; the audit does not.',
        'She could do both: audit to establish the size of the problem, then research to explain it.'
      ],
      lesson:
        'Decide which one you are doing before you collect anything. Teams that ' +
        'start as audit and later try to publish are routinely told the work ' +
        'needed ethical approval it never obtained.'
    },
    {
      title: 'When the paradigm and the method do not match',
      scenario:
        'A master\'s student writes that she takes an interpretivist position ' +
        'because "reality is socially constructed". Her method section then ' +
        'describes a 40-item Likert questionnaire administered to 300 nurses, ' +
        'analysed with chi-square tests.',
      steps: [
        'Interpretivism treats meaning as constructed and context-specific, so it points towards interviews or observation.',
        'A fixed-response questionnaire assumes the researcher already knows the categories that matter — a positivist assumption.',
        'Neither choice is wrong on its own. The problem is that they contradict each other in one study.',
        'Two honest fixes: keep the survey and state a post-positivist position, or keep interpretivism and switch to interviews.',
        'A third option is a genuine mixed methods design, but then the integration has to be planned, not implied.'
      ],
      lesson:
        'Examiners read the paradigm statement and the method side by side. This ' +
        'mismatch is one of the most common reasons for a viva correction.'
    }
  ],

  'unit-02': [
    {
      title: 'Narrowing a topic until it can actually be answered',
      scenario:
        'A student arrives with the topic "mental health of students in Ghana". ' +
        'It is a real problem, but as written it cannot be studied.',
      steps: [
        'Population: which students? Settle on final-year nursing students at one university.',
        'Exposure or concept: what about them? Choose academic workload, measured in timetabled contact hours.',
        'Outcome: what will you measure? Depressive symptoms on the PHQ-9.',
        'Setting and time: one campus, one semester.',
        'The question becomes: "Is timetabled workload associated with PHQ-9 score among final-year nursing students at [University] in the 2026 second semester?"',
        'Now name the analysis: linear regression of PHQ-9 score on contact hours, adjusted for age, sex and financial stress. If you cannot name it, the question is still too vague.'
      ],
      lesson:
        'The test of a finished question is that it dictates the analysis. If two ' +
        'people would analyse your data differently, the question is not specific yet.'
    },
    {
      title: 'An objective that produces no result',
      scenario:
        'A proposal lists four objectives. The third is "to explore the ' +
        'perceptions of health workers". The study is a cross-sectional survey ' +
        'with a closed-response questionnaire.',
      steps: [
        '"Explore perceptions" implies qualitative work — interviews or focus groups.',
        'The instrument collects no free text, so nothing in the data can answer this objective.',
        'At write-up the student will either drop the objective, or pad the results with a frequency table that does not address it.',
        'Either outcome invites the examiner question: why did you state an objective you never met?',
        'The fix at proposal stage is cheap: rewrite it as "to describe health workers\' reported barriers", or add a qualitative strand and design for it.'
      ],
      lesson:
        'Map every objective to the specific analysis that will answer it before ' +
        'submitting the proposal. An unanswerable objective costs nothing to fix ' +
        'now and a chapter of trouble later.'
    }
  ],

  'unit-03': [
    {
      title: 'Turning five papers into one paragraph',
      scenario:
        'A student has read five studies on adherence to hypertension medication ' +
        'and has written five paragraphs, one per study, each beginning with an ' +
        'author name.',
      steps: [
        'Build a matrix: rows are the five studies, columns are design, setting, sample, adherence measure and main finding.',
        'Reading down the "adherence measure" column shows three used self-report and two used pill counts.',
        'Reading down "main finding" shows the self-report studies all report higher adherence than the pill-count studies.',
        'That comparison is the paragraph: "Reported adherence varies with how it was measured, with self-report consistently higher than objective measures (refs) — a pattern that complicates comparison across settings."',
        'No sentence in that paragraph has an author as its subject. The studies are evidence for a claim, not the topic of the writing.'
      ],
      lesson:
        'Synthesis is what you see reading down the columns. Summary is what you ' +
        'get reading across the rows. Reviewers can tell instantly which one you did.'
    },
    {
      title: 'Choosing the review your timeline can survive',
      scenario:
        'A student with nine months until submission proposes "a systematic ' +
        'review and meta-analysis of interventions to reduce malaria in ' +
        'under-fives across sub-Saharan Africa".',
      steps: [
        'A proper systematic review needs a protocol, two independent screeners, dual data extraction and risk-of-bias assessment.',
        'That question would return several thousand records to screen at title and abstract.',
        'She is working alone, so the second screener does not exist — and without one it is not a systematic review by PRISMA standards.',
        'A scoping review of the same area is defensible, achievable solo, and still publishable.',
        'Alternatively, narrow the question hard: one intervention, one age band, one country — which can make a systematic review feasible.'
      ],
      lesson:
        'Pick the review type from your resources and question, not from which ' +
        'label sounds most impressive. A finished scoping review beats an ' +
        'abandoned systematic one.'
    }
  ],

  'unit-04': [
    {
      title: 'Building a PubMed search line by line',
      scenario:
        'The question is whether community health worker home visits reduce ' +
        'childhood malaria in rural Ghana. Typing the whole sentence into PubMed ' +
        'returns almost nothing useful.',
      steps: [
        'Split into concepts: (1) community health workers, (2) home visits, (3) malaria in children.',
        'Concept 1: "Community Health Workers"[Mesh] OR community health worker*[tiab] OR CHW[tiab] OR "village health volunteer*"[tiab]',
        'Concept 2: "House Calls"[Mesh] OR home visit*[tiab] OR domiciliary[tiab]',
        'Concept 3: "Malaria"[Mesh] AND ("Child"[Mesh] OR child*[tiab] OR under-five*[tiab])',
        'Combine: #1 AND #2 AND #3. Record the date, the number of hits and the exact strings.',
        'Then rerun the concepts in AJOL and Google Scholar — the Ghanaian and regional literature is thin in PubMed and you will otherwise miss it.'
      ],
      lesson:
        'Search concepts, never sentences. And a search you cannot reproduce next ' +
        'month, because you did not record it, is not a method — it is a memory.'
    },
    {
      title: 'What truncation actually costs you',
      scenario:
        'A researcher searches nurs* expecting to capture nurse, nurses and ' +
        'nursing. The result set balloons and is full of irrelevant records.',
      steps: [
        'nurs* also matches nursery, nurseries and nursed, none of which are wanted.',
        'Truncating too early is the usual cause: nurs* cuts before the stem is distinctive.',
        'nurse* OR nursing captures what is needed without the nursery records.',
        'Check the effect: run both and compare the hit counts and a sample of titles.',
        'Where a database offers it, a field tag narrows further — nurse*[tiab] rather than a free-text search of the whole record.'
      ],
      lesson:
        'Truncate at the point where the stem is still unambiguous, then look at ' +
        'what you actually retrieved. Wildcards are not free.'
    }
  ],

  'unit-05': [
    {
      title: 'One question, four designs, four different answers',
      scenario:
        'Does using an insecticide-treated net reduce malaria in under-fives? ' +
        'The design chosen changes what can honestly be claimed.',
      steps: [
        'Cross-sectional: survey households, record net use and current infection. Shows association only — sick children may have been given nets because they were sick.',
        'Case-control: take children with malaria and matched controls, ask about past net use. Efficient, but caregivers of sick children recall exposure differently (recall bias).',
        'Cohort: enrol net users and non-users, follow for a season. Establishes sequence, but families choosing nets differ from those who do not.',
        'Cluster-randomised trial: randomise villages to receive nets. Balances known and unknown confounders — and answers the causal question.',
        'The trial is strongest and also the slowest and most expensive; the cross-sectional study is fastest and answers least.'
      ],
      lesson:
        'Choose the weakest design that still answers your question honestly, then ' +
        'state plainly what it cannot establish. Overclaiming from a cross-sectional ' +
        'study is the most common criticism in peer review.'
    },
    {
      title: 'Why per-protocol analysis quietly breaks a trial',
      scenario:
        'In a trial of a six-month TB treatment regimen, 15% of the intervention ' +
        'arm stopped taking the drug. The analyst proposes excluding them "so we ' +
        'measure the drug\'s true effect".',
      steps: [
        'Ask who stopped. Typically those with worse side effects, more advanced disease, or less social support.',
        'Those same characteristics predict worse outcomes independently of the drug.',
        'Removing them leaves a healthier intervention arm compared against an intact control arm.',
        'Randomisation guaranteed comparable groups at baseline; this exclusion destroys that guarantee.',
        'Intention to treat keeps everyone in the arm they were assigned, and answers the question a clinician actually faces: what happens if I prescribe this?'
      ],
      lesson:
        'Intention to treat is the primary analysis. Report per-protocol as a ' +
        'secondary sensitivity analysis if at all, and never as the headline result.'
    }
  ],

  'unit-06': [
    {
      title: 'The same topic in four qualitative traditions',
      scenario:
        'The topic is the experience of women living with obstetric fistula. Four ' +
        'traditions would produce four genuinely different studies.',
      steps: [
        'Phenomenology: what is it like to live with fistula? 8-12 in-depth interviews, focused on lived experience.',
        'Grounded theory: how do women come to seek or avoid repair? Theoretical sampling, constant comparison, ending in a theory of care-seeking.',
        'Ethnography: how does the community treat these women? Months of observation in a village, fieldnotes as primary data.',
        'Case study: how did one repair programme work? Interviews, records, observation and policy documents on a single bounded programme.',
        'Each demands its own sampling, data collection and analysis. You cannot claim one and execute another.'
      ],
      lesson:
        'Name your tradition and then live by its rules. "Grounded theory" ' +
        'followed by six interviews and a thematic analysis is the mismatch ' +
        'examiners look for first.'
    },
    {
      title: 'Rewriting an interview guide that will not work',
      scenario:
        'A student\'s first interview guide opens with: "Don\'t you agree that ' +
        'the long waiting times and rude staff are the main problems at this clinic?"',
      steps: [
        'It is leading — it supplies the answer the interviewer expects.',
        'It is double-barrelled — waiting times and staff attitude are two different things.',
        'It is closed — it can be answered "yes", ending the topic.',
        'It opens on a complaint, before any rapport exists, which shapes everything that follows.',
        'Rewrite: "Tell me about the last time you came to this clinic. Walk me through the day." Then probe: "What was the waiting like?", "How did you find the staff?"'
      ],
      lesson:
        'Open wide, then narrow with probes. Pilot the guide on two people — you ' +
        'will change it, and that is a sign the piloting worked, not that the ' +
        'guide was bad.'
    }
  ],

  'unit-07': [
    {
      title: 'Calculating a sample size, then adjusting it honestly',
      scenario:
        'A prevalence survey of anaemia among pregnant women in one district. ' +
        'Previous work suggests roughly 35% prevalence. You want a 5% margin of ' +
        'error at 95% confidence, sampling by health facility.',
      steps: [
        'Base formula: n = Z²p(1-p)/d² = (1.96² x 0.35 x 0.65) / 0.05²',
        'That is (3.8416 x 0.2275) / 0.0025 = 0.8740 / 0.0025 = 350 (rounding up).',
        'Cluster sampling by facility: multiply by a design effect of 1.5 → 350 x 1.5 = 525.',
        'Expect 10% non-response: 525 / 0.90 = 584.',
        'Final target: 584 women. In R: ceiling(1.96^2 * 0.35 * 0.65 / 0.05^2 * 1.5 / 0.9)',
        'Report every input — Z, p, d, design effect and non-response — not just the number 584.'
      ],
      lesson:
        'Reviewers check the arithmetic. A sample size stated without its inputs ' +
        'reads as though it was chosen first and justified afterwards.'
    },
    {
      title: 'Two studies in one document is not mixed methods',
      scenario:
        'A thesis reports a 600-household survey in Chapter 4 and 20 interviews ' +
        'in Chapter 5. The conclusion summarises both. The student calls it a ' +
        'mixed methods study.',
      steps: [
        'Ask the integration question: what did combining them reveal that neither gave alone?',
        'If the answer is "nothing — they are both about the same topic", it is two studies bound together.',
        'Real integration would be: the survey found low clinic attendance in one sub-district; the interviews were sampled from there specifically to explain why.',
        'Or a joint display: a table with survey findings in one column and the interview themes that explain or contradict them alongside.',
        'The interview sample can be drawn from the survey respondents, which ties the strands together by design rather than by assertion.'
      ],
      lesson:
        'Integration is the defining feature. Plan the point where the strands ' +
        'meet at proposal stage — it cannot be added convincingly at write-up.'
    }
  ],

  'unit-08': [
    {
      title: 'A questionnaire item pulled apart',
      scenario:
        'A draft patient satisfaction survey includes: "How satisfied were you ' +
        'with the cost and quality of care? (Very satisfied / Satisfied / ' +
        'Dissatisfied)"',
      steps: [
        'Double-barrelled: a patient happy with quality but not cost cannot answer truthfully.',
        'The response options are unbalanced — two positive, one negative — which pushes answers upward.',
        'There is no neutral option and no "not applicable", so someone who paid nothing must still choose.',
        'Split into two items, each with a balanced 5-point scale from Very dissatisfied to Very satisfied.',
        'Add "Not applicable" to the cost item for patients covered by the NHIS.',
        'Pilot on 20 patients and ask them to say aloud what they thought each item meant.'
      ],
      lesson:
        'Every faulty item produces data you cannot interpret, and no analysis ' +
        'later can repair it. An hour spent on wording saves the whole variable.'
    },
    {
      title: 'What a translated instrument really requires',
      scenario:
        'A validated English depression scale is to be used with Twi-speaking ' +
        'participants. The student translates it herself the week before ' +
        'fieldwork.',
      steps: [
        'Forward translation by two independent bilingual translators, working separately.',
        'Reconciliation of the two versions by a panel, resolving each difference deliberately.',
        'Back translation into English by a third translator who has never seen the original.',
        'Compare back translation with the original; where meaning has drifted, revise and repeat.',
        'Cognitive interviewing with 5-10 target participants: ask what each item means to them in their own words.',
        'Re-check reliability in the new population — the original Cronbach\'s alpha does not transfer.'
      ],
      lesson:
        'A self-translated instrument has unknown validity, which means the study ' +
        'built on it does too. This is one of the most common fatal flaws in ' +
        'multilingual research.'
    }
  ],

  'unit-09': [
    {
      title: 'Consent when the researcher holds power over the participant',
      scenario:
        'A lecturer wants to survey her own final-year students about their ' +
        'experience of the programme. She will administer it herself, at the end ' +
        'of a lecture she teaches.',
      steps: [
        'Students may reasonably fear that declining, or answering critically, could affect their marks.',
        'That fear compromises voluntariness even if the lecturer would never act on it — the perception is enough.',
        'Fix one: an independent colleague, with no assessment role, administers and holds the data.',
        'Fix two: collect responses anonymously, and only after final marks are released.',
        'The information sheet must state plainly that participation has no bearing on assessment.',
        'Name the power relationship explicitly in the ethics application. Committees notice when it is left out.'
      ],
      lesson:
        'Whenever the researcher can affect the participant\'s grades, treatment ' +
        'or employment, address it in the design. Saying "participation was ' +
        'voluntary" does not make it so.'
    },
    {
      title: 'How a quotation identifies someone with no name attached',
      scenario:
        'A report on medical errors quotes: "As the only male theatre nurse at ' +
        'the district hospital, I felt I could not challenge the surgeon."',
      steps: [
        'No name appears, yet anyone in that district can identify the speaker immediately.',
        'Role, gender, setting and seniority combine into an identifier even when each alone would not.',
        'The consequences here are real — this nurse could face professional retaliation.',
        'Options: remove the role detail, aggregate the setting to "a district hospital in the region", or paraphrase rather than quote.',
        'Where the detail is essential to the point, go back to the participant and ask before publishing.',
        'Say in the information sheet how quotations will be handled, so consent covers what you actually do.'
      ],
      lesson:
        'Anonymisation means removing what identifies, not just removing names. ' +
        'Read every quotation as someone in that workplace would read it.'
    }
  ],

  'unit-10': [
    {
      title: 'A limitations section that earns marks instead of losing them',
      scenario:
        'A student writes: "Limitations included time and financial constraints, ' +
        'and a small sample size. More research is needed."',
      steps: [
        'Time and money are constraints on the researcher, not limitations of the evidence — they tell the reader nothing.',
        '"Small sample" is unquantified: small relative to what, and with what consequence?',
        'Name the specific threat: the sample came from one urban clinic.',
        'State the likely direction: urban patients are more literate and closer to care, so adherence is probably overestimated.',
        'State the mitigation: findings are presented as applying to urban facility attenders, not to the district population.',
        'Rewritten: "Recruitment from a single urban clinic likely over-represents literate, higher-income patients and probably overstates adherence; results should be read as applying to urban facility attenders."'
      ],
      lesson:
        'A good limitation names the threat, its direction, and what you did ' +
        'about it. Examiners reward the researcher who saw the problem first.'
    },
    {
      title: 'Building the timeline backwards from the deadline',
      scenario:
        'A student has 12 months and plans: "Months 1-2 proposal, 3-8 data ' +
        'collection, 9-10 analysis, 11-12 writing." It is already unrealistic.',
      steps: [
        'Ethical approval commonly takes 1-3 months and cannot start until the proposal is finished — so fieldwork cannot begin in month 3.',
        'For 20 interviews at 1 hour each, transcription alone is 80-120 hours of work, which is weeks not days.',
        'Analysis cannot begin until cleaning is done, and cleaning always takes longer than planned.',
        'Supervisors need time to read: allow two weeks per full draft, and expect at least three drafts.',
        'Working backwards from submission: writing 3 months, analysis 2, transcription 1, fieldwork 3, approval 2, proposal 1 — that is 12 with no contingency.',
        'So either reduce scope now, or accept the plan will slip.'
      ],
      lesson:
        'Build the schedule backwards from the deadline and put the dependencies ' +
        'in a Gantt chart. Most overruns are visible at proposal stage to anyone ' +
        'who does the arithmetic.'
    }
  ]
};

export default examples;
