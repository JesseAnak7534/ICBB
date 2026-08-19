/**
 * Quantitative Data Analysis (Part 2) — Units 1-4: getting from a pile of
 * questionnaires to a dataset that can be analysed, and describing it.
 *
 * Unit shape matches Part 1:
 *   id, number, title, duration, summary
 *   objectives[], sections[] ({ heading, points[], note?, table? })
 *   keyTerms[], activity, readings[], quiz[]
 */

const unitsAPreparing = [
  {
    id: 'unit-01',
    number: 1,
    title: 'From Questionnaire to Dataset',
    duration: '120 minutes',
    summary:
      'Turning completed forms into a rectangular dataset a computer can read: ' +
      'the codebook, variable naming, data entry, and the decisions that are ' +
      'expensive to reverse later.',
    objectives: [
      'Build a codebook that documents every variable and its coding',
      'Name and type variables so the dataset survives being handed to someone else',
      'Choose between wide and long layout for your design',
      'Set up double entry or electronic capture to control transcription error',
      'Import a dataset into SPSS and R and confirm it arrived intact'
    ],
    sections: [
      {
        heading: 'The codebook',
        points: [
          'One row per variable: name, label, type, coding, permitted range, and the question it came from',
          'Write it before data entry begins, not afterwards — it is the specification, not the documentation',
          'Record the exact wording of the question, because "income" means nothing six months later',
          'Note the unit of measurement: kilograms or pounds, cedis or dollars, days or weeks',
          'Every recode you invent later gets added to the codebook, so the file always describes the data you actually have'
        ],
        note:
          'The codebook is what lets someone else — a supervisor, a co-author, a ' +
          'reviewer, or you in a year — understand the dataset without asking you. ' +
          'A study without one is a study only its author can analyse.'
      },
      {
        heading: 'Structuring the dataset',
        points: [
          'One row per unit of analysis, one column per variable, one value per cell',
          'The unit of analysis is usually the participant, but may be the visit, the household or the sample',
          'Wide format: one row per participant, repeated measures in separate columns (bp_baseline, bp_6months)',
          'Long format: one row per participant per occasion, with a time variable — required by most mixed-model and repeated-measures procedures',
          'Never store two pieces of information in one column ("35M" for age and sex)',
          'Never use colour or bold to encode meaning; a computer cannot read formatting'
        ]
      },
      {
        heading: 'Naming and typing variables',
        points: [
          'Short, lowercase, no spaces, no accents: age_years, sex, bp_systolic',
          'Do not start a name with a digit, and avoid names that are reserved words in R or SPSS',
          'Prefix grouped items consistently: phq_1 to phq_9, so they can be selected as a block',
          'Types: numeric for measurements, integer for counts, factor or categorical for groups, date for dates',
          'Coding categories as numbers with value labels is standard in SPSS; in R prefer factors with meaningful levels',
          'Reserve a consistent code for missing — and never use 0, 9 or 99 if those are plausible real values'
        ],
        table: {
          caption: 'A codebook extract',
          headers: ['Variable', 'Label', 'Type', 'Coding / range'],
          rows: [
            ['id', 'Participant ID', 'integer', '1-600, unique'],
            ['sex', 'Sex', 'categorical', '1 = male, 2 = female'],
            ['age_years', 'Age at interview', 'numeric', '18-95'],
            ['edu', 'Highest education', 'ordinal', '1 = none, 2 = primary, 3 = JHS, 4 = SHS, 5 = tertiary'],
            ['bp_systolic', 'Systolic BP (mmHg)', 'numeric', '70-260'],
            ['nhis', 'Has NHIS cover', 'binary', '0 = no, 1 = yes'],
            ['—', 'Missing value code', '—', '-99 across all variables']
          ]
        }
      },
      {
        heading: 'Getting the data in',
        points: [
          'Electronic capture (KoBoToolbox, REDCap, ODK) enforces ranges and skip logic at the point of entry and removes transcription entirely',
          'On paper, use double entry: two people enter independently, then compare and reconcile differences',
          'Single entry with a 10% verification sample is the minimum defensible alternative',
          'Enter data exactly as recorded; correct implausible values as a documented cleaning step, not silently during entry',
          'Keep the raw file untouched and read-only — all cleaning happens in a script or a documented copy',
          'Back up before you start: three copies, two media, one off-site'
        ]
      },
      {
        heading: 'Reading it into your software',
        points: [
          'CSV is the safest interchange format; Excel silently reformats dates and long ID numbers',
          'In R: dat <- read.csv("survey.csv", na.strings = "-99")',
          'In SPSS: File > Import Data > CSV, then set measurement level and missing values in Variable View',
          'Immediately check dimensions, variable names and types against the codebook',
          'str(dat) in R, or Variable View in SPSS, will show a numeric variable that arrived as text',
          'A variable that should be numeric but imported as character almost always means a stray value — "N/A", a comment, or a thousands separator'
        ]
      }
    ],
    keyTerms: [
      { term: 'Codebook', definition: 'A document defining every variable, its type, coding and permitted values.' },
      { term: 'Unit of analysis', definition: 'The entity each row of the dataset represents — participant, visit, household.' },
      { term: 'Wide format', definition: 'One row per participant, with repeated measures held in separate columns.' },
      { term: 'Long format', definition: 'One row per participant per occasion, with an explicit time variable.' },
      { term: 'Double entry', definition: 'Entering paper data twice independently and reconciling differences to catch transcription error.' },
      { term: 'Missing value code', definition: 'A reserved value marking absent data, chosen so it cannot be confused with a real observation.' }
    ],
    activity:
      'Take one page of your own questionnaire and write the codebook rows for ' +
      'every variable on it: name, label, type, coding and permitted range. ' +
      'Swap with a partner and try to enter three fictional respondents using only ' +
      'their codebook. Every question you have to ask them is a gap in it.',
    readings: [
      { label: 'Broman & Woo (2018) — "Data Organization in Spreadsheets"', note: 'Short, free, and the best thing written on this. Read it before you enter any data.' },
      { label: 'Wickham (2014) — "Tidy Data"', note: 'Why one variable per column matters, with examples of what goes wrong.' },
      { label: 'REDCap and KoBoToolbox documentation', note: 'Both free for academic use; either removes a whole class of entry error.' }
    ],
    quiz: [
      {
        question: 'A column in your dataset contains entries like "35M" and "42F". The problem is that it:',
        options: [
          'Uses the wrong missing value code',
          'Holds two variables in one column, so neither can be analysed',
          'Is in long format',
          'Should have been entered in Excel'
        ],
        answer: 1,
        explanation:
          'Age and sex are separate variables and need separate columns. As stored, ' +
          'you cannot compute a mean age or cross-tabulate by sex without first ' +
          'splitting the column — work that should never have been necessary.'
      },
      {
        question: 'Why is 99 a poor choice of missing value code for a variable recording age?',
        options: [
          'SPSS cannot handle two-digit codes',
          '99 is a plausible real age, so genuine and missing values become indistinguishable',
          'It must always be negative',
          'It conflicts with the participant ID'
        ],
        answer: 1,
        explanation:
          'A missing code must be impossible as a real observation. For age, 99 is ' +
          'attainable; -99 is not. The same logic rules out 0 for variables where zero ' +
          'is a genuine value.'
      },
      {
        question: 'You measure blood pressure at baseline, 3 months and 6 months, and plan a repeated-measures analysis. The dataset should be in:',
        options: ['Wide format only', 'Long format, one row per participant per occasion', 'Whatever format it was entered in', 'Neither — repeated measures cannot be stored in a rectangle'],
        answer: 1,
        explanation:
          'Repeated-measures and mixed-model procedures expect long format: a row per ' +
          'observation with an explicit time variable. Wide is convenient for entry and ' +
          'for computing change scores, and converting between them is routine.'
      },
      {
        question: 'A variable you know is numeric imports into R as character. The most likely cause is:',
        options: [
          'The file was too large',
          'A stray non-numeric entry somewhere in the column, such as "N/A" or a comment',
          'R cannot read CSV files',
          'The variable name starts with a letter'
        ],
        answer: 1,
        explanation:
          'A single non-numeric value forces the whole column to character. Find it with ' +
          'something like unique(dat$var[is.na(as.numeric(dat$var))]) — it is usually a ' +
          'typed note, a unit, or a missing marker the import did not know about.'
      },
      {
        question: 'The strongest reason to keep the raw data file untouched is that:',
        options: [
          'It saves disk space',
          'Every cleaning decision stays reversible and auditable, because the original still exists',
          'SPSS requires it',
          'It makes the analysis run faster'
        ],
        answer: 1,
        explanation:
          'Cleaning in place destroys the record of what the data originally said. Keeping ' +
          'the raw file read-only and doing all changes in a script means any decision can ' +
          'be revisited, and a reviewer can see exactly what you altered.'
      },
      {
        question: 'When should the codebook be written?',
        options: [
          'After analysis, as documentation',
          'Before data entry begins, because it is the specification for the dataset',
          'Only if the study is published',
          'At the same time as the discussion chapter'
        ],
        answer: 1,
        explanation:
          'The codebook defines what will be entered and how. Written afterwards it is ' +
          'archaeology, and it will not match the file, because entry decisions were made ' +
          'ad hoc while typing.'
      }
    ]
  },

  {
    id: 'unit-02',
    number: 2,
    title: 'Cleaning and Preparing Data',
    duration: '150 minutes',
    summary:
      'Finding what is wrong with a real dataset — impossible values, duplicates, ' +
      'inconsistent categories — and building the derived variables the analysis ' +
      'actually needs, all as a script you can rerun.',
    objectives: [
      'Screen every variable for implausible and out-of-range values',
      'Detect and resolve duplicate records',
      'Recode, collapse and reverse-score variables correctly',
      'Compute derived variables such as BMI and scale totals',
      'Decide whether an outlier is an error or a real observation',
      'Keep cleaning reproducible by scripting it rather than editing cells'
    ],
    sections: [
      {
        heading: 'First look at a new dataset',
        points: [
          'Check dimensions against expectation: does the row count match the number of questionnaires?',
          'Run a frequency table for every categorical variable and a min/max for every continuous one',
          'In R: summary(dat) then table(dat$sex, useNA = "ifany") for each factor',
          'In SPSS: Analyze > Descriptive Statistics > Frequencies, ticking Minimum and Maximum',
          'Look for categories that should not exist — a sex coded 3, an education level of 7',
          'Look for values at the boundaries: an age of 0, a blood pressure of 999'
        ]
      },
      {
        heading: 'Impossible, implausible and duplicate',
        points: [
          'Impossible: outside the physically possible range — a diastolic BP of 400, a date of birth in the future',
          'Implausible: possible but unlikely enough to warrant checking — a 3-year-old with three children',
          'Cross-variable checks catch what single-variable checks miss: pregnant men, ages inconsistent with dates of birth',
          'Duplicates may be exact (entered twice) or partial (same participant, two IDs)',
          'Check for duplicates on the identifier and on a combination of key fields',
          'Resolve against the paper form where possible; where not, document the decision'
        ],
        note:
          'Return to the source before you "correct" anything. A value that looks ' +
          'impossible is sometimes a real and interesting observation, and sometimes ' +
          'a data entry slip — and only the original form tells you which.'
      },
      {
        heading: 'Recoding and deriving',
        points: [
          'Collapse categories only with a reason, and state it: small cell counts, or a clinically meaningful threshold',
          'Reverse-score negatively worded items before summing a scale, or the total is meaningless',
          'For a 1-5 item, the reversed value is 6 minus the original',
          'Compute scale totals only when the required number of items is present, and say how you handled partial scales',
          'Derived variables get their own names and codebook entries — never overwrite the source variable',
          'BMI in R: dat$bmi <- dat$weight_kg / (dat$height_m)^2',
          'Banding continuous variables loses information; do it for presentation, not for the primary analysis'
        ]
      },
      {
        heading: 'Outliers',
        points: [
          'An outlier is an observation far from the others; it is not automatically an error',
          'Detect with boxplots, standardised scores beyond about ±3, or simply sorting the variable',
          'Ask first whether it is plausible: a systolic BP of 210 is high but real; 2100 is a typing slip',
          'If it is an error and the true value is recoverable, correct it and document it',
          'If it is a genuine extreme value, keep it — and report a sensitivity analysis with and without it',
          'Deleting inconvenient observations because they weaken a result is data manipulation, not cleaning'
        ]
      },
      {
        heading: 'Doing it reproducibly',
        points: [
          'Every change goes in a script: R, SPSS syntax, or Stata do-file',
          'Point-and-click cleaning cannot be checked, cannot be rerun, and cannot be corrected when you find a mistake at step three',
          'Structure the script: read raw, clean, derive, save analysis dataset',
          'Never overwrite the raw file; write a separate cleaned file',
          'Keep a running count so you can report how many records were excluded and why',
          'Rerunning the whole script from raw data should reproduce the analysis dataset exactly'
        ]
      }
    ],
    keyTerms: [
      { term: 'Range check', definition: 'Verifying every value of a variable falls within its permitted minimum and maximum.' },
      { term: 'Cross-variable check', definition: 'Testing that combinations of values are logically consistent with each other.' },
      { term: 'Reverse scoring', definition: 'Inverting negatively worded items so that all items on a scale point the same way.' },
      { term: 'Derived variable', definition: 'A new variable computed from existing ones, such as BMI or a scale total.' },
      { term: 'Outlier', definition: 'An observation distant from the rest of the distribution; an error or a genuine extreme.' },
      { term: 'Sensitivity analysis', definition: 'Repeating an analysis under a different assumption to see whether the conclusion holds.' }
    ],
    activity:
      'You are given a dataset of 600 records. Write down the checks you would run ' +
      'before analysing anything — list them variable by variable, including at ' +
      'least three cross-variable checks. Then write the R or SPSS syntax for two ' +
      'of them.',
    readings: [
      { label: 'Van den Broeck et al. (2005) — "Data Cleaning: Detecting, Diagnosing, and Editing Data Abnormalities"', note: 'Open access, and the clearest framework: screening, diagnosis, treatment.' },
      { label: 'Osborne — Best Practices in Data Cleaning', note: 'Practical, with worked examples of what goes wrong.' },
      { label: 'R for Data Science, chapters on data transformation', note: 'Free online; dplyr makes cleaning scripts readable.' }
    ],
    quiz: [
      {
        question: 'A participant is recorded as male and 6 months pregnant. This is caught by:',
        options: [
          'A range check on sex',
          'A cross-variable consistency check',
          'A test for outliers',
          'Cronbach\'s alpha'
        ],
        answer: 1,
        explanation:
          'Both values are individually permissible — the impossibility only appears when ' +
          'they are considered together. Range checks alone would pass this record.'
      },
      {
        question: 'On a 1-5 agreement scale, the reversed value of a response of 2 is:',
        options: ['3', '4', '5', '2'],
        answer: 1,
        explanation:
          'For a 1-k scale the reversed value is (k + 1) minus the original, so 6 - 2 = 4. ' +
          'Forgetting to reverse negatively worded items is one of the most common scale ' +
          'errors and quietly destroys the total.'
      },
      {
        question: 'A systolic blood pressure of 210 mmHg appears in your data. You should:',
        options: [
          'Delete it as an outlier',
          'Check it against the source, and if genuine keep it and consider a sensitivity analysis',
          'Replace it with the mean',
          'Round it down to the next plausible value'
        ],
        answer: 1,
        explanation:
          'It is high but entirely possible — this is exactly the kind of participant a study ' +
          'of hypertension exists to capture. Verify it, keep it, and show that the conclusion ' +
          'does not depend on it.'
      },
      {
        question: 'The strongest argument for scripting all cleaning rather than editing cells is that:',
        options: [
          'Scripts run faster',
          'The whole process can be rerun, checked and corrected, and the raw data stays intact',
          'SPSS does not allow manual editing',
          'It uses less memory'
        ],
        answer: 1,
        explanation:
          'Manual edits are invisible and unrepeatable. If you discover an error in step three, ' +
          'a script lets you fix it and rerun; hand-edited cells mean starting over with no ' +
          'record of what was changed.'
      },
      {
        question: 'A total score is computed for participants who answered only 4 of 9 items. The safest approach is to:',
        options: [
          'Sum whatever is present and treat it as a full score',
          'Set a minimum number of completed items, apply it consistently, and report the rule',
          'Always exclude anyone with any missing item',
          'Replace missing items with zero'
        ],
        answer: 1,
        explanation:
          'Summing four items gives a total that is not comparable to a nine-item total. ' +
          'Common practice is to require a stated proportion complete, prorate or impute the ' +
          'remainder, and say exactly what was done.'
      },
      {
        question: 'Which of these is data manipulation rather than cleaning?',
        options: [
          'Correcting a transcription error against the paper form',
          'Removing genuine observations because they weaken the association you expected',
          'Flagging an impossible date of birth for checking',
          'Documenting that three records were excluded as duplicates'
        ],
        answer: 1,
        explanation:
          'The distinction is whether the decision is driven by the data being wrong or by the ' +
          'result being unwelcome. Excluding valid observations to improve a finding is ' +
          'misconduct, however it is described in the write-up.'
      }
    ]
  },

  {
    id: 'unit-03',
    number: 3,
    title: 'Missing Data',
    duration: '120 minutes',
    summary:
      'Why data are missing determines what you may do about it. Deletion, ' +
      'single imputation and multiple imputation, and what each assumes.',
    objectives: [
      'Quantify and display the pattern of missingness in a dataset',
      'Distinguish MCAR, MAR and MNAR and explain why the distinction matters',
      'State the cost of listwise and pairwise deletion',
      'Explain why mean substitution understates uncertainty',
      'Describe what multiple imputation does and when it is appropriate',
      'Report missing data handling so a reader can judge it'
    ],
    sections: [
      {
        heading: 'Look before you decide',
        points: [
          'Report the amount missing per variable, not just overall',
          'Look at the pattern: is missingness concentrated in a few participants, or spread thinly?',
          'A variable missing for 40% of participants is a different problem from 40 variables each missing 1%',
          'In R: colMeans(is.na(dat)) gives the proportion missing per variable',
          'Compare respondents and non-respondents on the variables you do have — this is the evidence for whether missingness is random',
          'Item non-response (a skipped question) and unit non-response (a participant who never took part) are different problems'
        ]
      },
      {
        heading: 'Three mechanisms',
        points: [
          'MCAR — Missing Completely At Random: missingness unrelated to anything, observed or not. A dropped test tube.',
          'MAR — Missing At Random: missingness explained by variables you observed. Older participants skip the income question more often, and you recorded age.',
          'MNAR — Missing Not At Random: missingness depends on the unobserved value itself. The highest earners decline to state income.',
          'MCAR is testable in part; MAR is an assumption; MNAR cannot be verified from the data at hand',
          'Most real missingness is MAR at best, which is precisely the case imputation is built for',
          'MNAR requires sensitivity analysis under different assumptions rather than a single fix'
        ],
        table: {
          caption: 'What each mechanism permits',
          headers: ['Mechanism', 'Example', 'Deletion gives', 'Preferred handling'],
          rows: [
            ['MCAR', 'Sample lost in transit', 'Unbiased, less precise', 'Complete cases acceptable'],
            ['MAR', 'Older people skip income', 'Biased', 'Multiple imputation'],
            ['MNAR', 'High earners refuse income', 'Biased', 'Sensitivity analysis; model the mechanism']
          ]
        }
      },
      {
        heading: 'Deletion',
        points: [
          'Listwise (complete case) deletion drops any participant missing any analysis variable — the default in most software',
          'With 10 variables each 5% missing, complete cases can lose 40% of the sample',
          'It is unbiased only under MCAR; under MAR it biases estimates',
          'Pairwise deletion uses all available data for each computation, so different coefficients rest on different subsamples',
          'Pairwise can produce a correlation matrix that is mathematically impossible, which breaks regression and factor analysis',
          'Deletion is defensible when missingness is genuinely tiny — say under 5% and plausibly MCAR — and you say so'
        ],
        note:
          'Report how many participants each analysis actually used. A table saying ' +
          'n = 600 in the methods and a regression silently fitted on 380 is one of ' +
          'the easiest things for a reviewer to catch.'
      },
      {
        heading: 'Imputation',
        points: [
          'Mean substitution fills gaps with the variable mean; it preserves the mean, shrinks the variance, and biases standard errors downwards',
          'Because it pretends imputed values are as certain as observed ones, it manufactures significance',
          'Regression imputation predicts the missing value from other variables — better, but still too certain',
          'Multiple imputation creates several completed datasets, analyses each, and pools the results, so the uncertainty of imputation is carried into the standard errors',
          'Rubin\'s rules do the pooling; 5-20 imputations is typical, more if missingness is heavy',
          'In R: mice(dat, m = 20) then pool(with(imp, lm(y ~ x)))',
          'Include the outcome and any variable predictive of missingness in the imputation model, or you bias towards the null',
          'Last observation carried forward is not recommended for longitudinal data — it assumes no change, which is rarely true'
        ]
      },
      {
        heading: 'Reporting',
        points: [
          'State the amount missing per variable',
          'State the assumed mechanism and the evidence for it',
          'State the method used and the number of imputations if applicable',
          'State the analysis sample size for every model reported',
          'Where missingness is substantial, present a complete-case analysis alongside as a sensitivity check',
          'A reader should be able to judge whether your conclusion could plausibly be an artefact of the missing data'
        ]
      }
    ],
    keyTerms: [
      { term: 'MCAR', definition: 'Missing Completely At Random — missingness unrelated to observed or unobserved values.' },
      { term: 'MAR', definition: 'Missing At Random — missingness explained by observed variables.' },
      { term: 'MNAR', definition: 'Missing Not At Random — missingness depends on the unobserved value itself.' },
      { term: 'Listwise deletion', definition: 'Excluding any case with a missing value on any variable in the analysis.' },
      { term: 'Multiple imputation', definition: 'Creating several plausible completed datasets and pooling the results, so imputation uncertainty is reflected in the standard errors.' },
      { term: "Rubin's rules", definition: 'The formulae for combining estimates and standard errors across multiply imputed datasets.' }
    ],
    activity:
      'For your own dataset, tabulate the percentage missing for every variable. ' +
      'Pick the worst one and argue, from what you know about how the data were ' +
      'collected, whether it is plausibly MCAR, MAR or MNAR — and say what that ' +
      'implies for how you should handle it.',
    readings: [
      { label: 'Sterne et al. (2009) — "Multiple imputation for missing data in epidemiological and clinical research"', note: 'BMJ, open access, and the standard practical reference.' },
      { label: 'van Buuren — Flexible Imputation of Missing Data', note: 'Free online; author of the mice package.' },
      { label: 'Little & Rubin — Statistical Analysis with Missing Data', note: 'The theoretical foundation, if you need it.' }
    ],
    quiz: [
      {
        question: 'Older participants are more likely to leave the income question blank, and you recorded everyone\'s age. This missingness is:',
        options: ['MCAR', 'MAR', 'MNAR', 'Not missing data at all'],
        answer: 1,
        explanation:
          'Missingness depends on age, which you observed. That is MAR — and it is exactly ' +
          'the condition under which multiple imputation performs well, because the ' +
          'imputation model can use age.'
      },
      {
        question: 'The people who decline to state income are those with the highest incomes. This is:',
        options: ['MCAR', 'MAR', 'MNAR', 'Listwise deletion'],
        answer: 2,
        explanation:
          'Missingness depends on the unobserved value itself. No amount of imputation from ' +
          'observed variables fixes this; it calls for sensitivity analysis under different ' +
          'assumptions about the missing values.'
      },
      {
        question: 'Replacing missing values with the variable mean primarily causes:',
        options: [
          'The mean to shift',
          'The variance to shrink and standard errors to be too small, overstating significance',
          'The sample size to fall',
          'No problem, provided under 10% is missing'
        ],
        answer: 1,
        explanation:
          'Mean substitution leaves the mean unchanged but piles values at the centre, ' +
          'shrinking variance. Treating imputed values as if they were observed manufactures ' +
          'precision the data do not support.'
      },
      {
        question: 'Ten variables each have 5% missing, roughly independently. Complete-case analysis will retain approximately:',
        options: ['95% of the sample', '60% of the sample', '50% of the sample', '5% of the sample'],
        answer: 1,
        explanation:
          '0.95 to the power of 10 is about 0.60. Small amounts of missingness across many ' +
          'variables compound, which is why complete-case analysis so often discards far more ' +
          'data than researchers expect.'
      },
      {
        question: 'The essential advantage of multiple imputation over single imputation is that it:',
        options: [
          'Produces a larger sample',
          'Carries the uncertainty of the imputation into the standard errors',
          'Requires no assumptions',
          'Works even when data are MNAR'
        ],
        answer: 1,
        explanation:
          'Multiple completed datasets, analysed separately and pooled, propagate the fact that ' +
          'the imputed values were estimates. Single imputation treats a guess as data.'
      },
      {
        question: 'The outcome variable should be included in the imputation model because omitting it:',
        options: [
          'Makes the imputation run more slowly',
          'Biases associations towards the null by imputing predictors as unrelated to the outcome',
          'Is forbidden by Rubin\'s rules',
          'Has no effect'
        ],
        answer: 1,
        explanation:
          'Leaving the outcome out imputes predictor values that carry no relationship to it, ' +
          'diluting the very association you are estimating. It feels like circularity but is ' +
          'the correct procedure.'
      }
    ]
  },

  {
    id: 'unit-04',
    number: 4,
    title: 'Describing Data and Building Table 1',
    duration: '120 minutes',
    summary:
      'Summarising variables honestly: which measure of centre and spread fits ' +
      'which distribution, and how to assemble the participant characteristics ' +
      'table that opens almost every quantitative paper.',
    objectives: [
      'Choose an appropriate summary for each level of measurement',
      'Judge distribution shape and pick mean or median accordingly',
      'Compute and interpret standard deviation, IQR and confidence intervals',
      'Build a Table 1 of participant characteristics',
      'Decide when a p-value belongs in Table 1 and when it does not',
      'Produce the table in SPSS and in R'
    ],
    sections: [
      {
        heading: 'Matching the summary to the variable',
        points: [
          'Nominal: counts and percentages only — a mean blood group is meaningless',
          'Ordinal: median and interquartile range; means of Likert items are common but contested',
          'Continuous and roughly symmetric: mean and standard deviation',
          'Continuous and skewed: median and interquartile range',
          'Always report the denominator alongside a percentage — 60% of 5 is not 60% of 500',
          'Report percentages to at most one decimal place; more implies precision you do not have'
        ]
      },
      {
        heading: 'Judging the distribution',
        points: [
          'Look at a histogram before choosing a summary; do not rely on a test alone',
          'Right skew is common for income, length of stay, biomarker concentrations and cost',
          'A mean far from the median signals skew',
          'Formal normality tests (Shapiro-Wilk) are oversensitive in large samples and underpowered in small ones',
          'In R: hist(dat$x) and boxplot(dat$x); in SPSS, Analyze > Descriptive Statistics > Explore',
          'The question is not "is it exactly normal" but "is a mean a fair description of this distribution"'
        ],
        note:
          'Reporting a mean and standard deviation for a badly skewed variable is not ' +
          'wrong arithmetic — it is a misleading description. A mean income of GHS 4,200 ' +
          'with an SD of GHS 9,000 tells the reader almost nothing useful.'
      },
      {
        heading: 'Spread and uncertainty',
        points: [
          'Standard deviation describes the spread of the observations',
          'Standard error describes the precision of the estimate, and shrinks as the sample grows',
          'A confidence interval is the interval estimate that goes with a point estimate: mean ± 1.96 × SE for a large sample',
          'Reporting SE instead of SD to make a figure look tidier misrepresents variability',
          'Interquartile range is the 25th to 75th percentile, and is robust to outliers',
          'Say which you are reporting: "mean (SD)" and "median (IQR)" are not interchangeable'
        ],
        table: {
          caption: 'Choosing a summary',
          headers: ['Variable', 'Shape', 'Report', 'Example'],
          rows: [
            ['Age', 'Roughly symmetric', 'Mean (SD)', '42.3 (11.8) years'],
            ['Income', 'Right skewed', 'Median (IQR)', 'GHS 1,800 (900-3,400)'],
            ['Sex', 'Nominal', 'n (%)', '312 (52.0%) female'],
            ['Education', 'Ordinal', 'n (%) by level', '104 (17.3%) tertiary'],
            ['Length of stay', 'Right skewed', 'Median (IQR)', '4 (2-9) days']
          ]
        }
      },
      {
        heading: 'Table 1',
        points: [
          'One row per characteristic, columns for the whole sample and for each comparison group',
          'Give the denominator for every column, and note where it differs because of missing data',
          'Order rows sensibly: demographics, then clinical, then exposure',
          'Include the unit of measurement in the row label, not in every cell',
          'In R: the tableone or gtsummary package builds this directly from the data frame',
          'In SPSS: Analyze > Descriptive Statistics > Explore, split by group, then assemble'
        ]
      },
      {
        heading: 'Should Table 1 contain p-values?',
        points: [
          'In a randomised trial, no: any baseline difference is by definition due to chance, so testing it answers a question nobody asked',
          'CONSORT explicitly discourages significance testing of baseline characteristics',
          'In an observational study, a p-value can flag imbalance worth adjusting for, but the decision to adjust should be driven by subject knowledge, not by p < 0.05',
          'Standardised differences are a better measure of imbalance and do not depend on sample size',
          'Whatever you report, describe the comparison in the table footnote'
        ]
      }
    ],
    keyTerms: [
      { term: 'Standard deviation', definition: 'The typical distance of observations from their mean; describes spread in the data.' },
      { term: 'Standard error', definition: 'The standard deviation of an estimate; describes precision, and shrinks as n grows.' },
      { term: 'Interquartile range', definition: 'The 25th to 75th percentile — a spread measure robust to outliers.' },
      { term: 'Skew', definition: 'Asymmetry in a distribution, pulling the mean away from the median.' },
      { term: 'Table 1', definition: 'The participant characteristics table summarising the sample, overall and by group.' },
      { term: 'Standardised difference', definition: 'A measure of group imbalance independent of sample size, used instead of a p-value.' }
    ],
    activity:
      'Build Table 1 for your own dataset, or a supplied one: overall column plus ' +
      'one column per group. For every row, justify in one line why you chose mean ' +
      'or median. Then decide whether a p-value column belongs, and defend it.',
    readings: [
      { label: 'Altman & Bland — Statistics Notes series, BMJ', note: 'Short, free, and unmatched on describing data properly.' },
      { label: 'Assel et al. (2019) — "Guidelines for Reporting of Statistics"', note: 'Concrete rules for tables and decimal places.' },
      { label: 'gtsummary package vignette (R)', note: 'Produces a publication-ready Table 1 in a few lines.' }
    ],
    quiz: [
      {
        question: 'Household income in your sample has a mean of GHS 4,200 and a median of GHS 1,800. You should report:',
        options: [
          'Mean and standard deviation',
          'Median and interquartile range, because the distribution is clearly right skewed',
          'Either, they are equivalent',
          'The mode'
        ],
        answer: 1,
        explanation:
          'A mean more than double the median indicates strong right skew, typical of income. ' +
          'The median describes the typical household; the mean is pulled up by a few high earners.'
      },
      {
        question: 'Standard error differs from standard deviation in that standard error:',
        options: [
          'Is always larger',
          'Describes the precision of an estimate and shrinks as the sample grows',
          'Can only be used for normal distributions',
          'Is the square of the standard deviation'
        ],
        answer: 1,
        explanation:
          'SD describes variability among observations and does not systematically shrink with ' +
          'n. SE describes how precisely the mean is estimated and falls as the square root of ' +
          'n. Substituting SE for SD makes data look less variable than it is.'
      },
      {
        question: 'A reviewer objects to p-values in Table 1 of your randomised trial. They are:',
        options: [
          'Wrong — testing baseline balance is standard',
          'Right — any baseline difference in a randomised trial arose by chance, so the test answers no useful question',
          'Right only if the trial is small',
          'Wrong, provided the test is non-parametric'
        ],
        answer: 1,
        explanation:
          'Randomisation guarantees that baseline differences are chance. CONSORT discourages ' +
          'the practice; standardised differences are more informative if imbalance needs ' +
          'describing.'
      },
      {
        question: 'Reporting "34.6% of participants" when the group contains 26 people is poor practice because:',
        options: [
          'Percentages should never be used',
          'One decimal place implies precision the denominator cannot support, and the count should be shown',
          '34.6% is mathematically impossible',
          'SPSS cannot compute it'
        ],
        answer: 1,
        explanation:
          'With n = 26 each participant is 3.8 percentage points. Report "9 (35%)" so the reader ' +
          'sees what the percentage rests on.'
      },
      {
        question: 'A Shapiro-Wilk test on 3,000 observations returns p < 0.001. The most sensible response is:',
        options: [
          'Immediately switch to non-parametric tests',
          'Look at a histogram — in large samples the test detects trivial departures from normality',
          'Transform the variable regardless of its shape',
          'Delete the outliers until it passes'
        ],
        answer: 1,
        explanation:
          'Normality tests are oversensitive in large samples: a departure too small to matter ' +
          'still returns a tiny p-value. Judge the shape visually and ask whether the mean is a ' +
          'fair description.'
      },
      {
        question: 'For an ordinal education variable with five levels, the appropriate summary is:',
        options: [
          'Mean and standard deviation',
          'Counts and percentages for each level',
          'Standard error only',
          'Correlation coefficient'
        ],
        answer: 1,
        explanation:
          'The categories are ordered but the intervals between them are not equal, so a mean is ' +
          'not interpretable. Report n (%) per level, or a median category if a single summary ' +
          'is needed.'
      }
    ]
  }
];

export default unitsAPreparing;
