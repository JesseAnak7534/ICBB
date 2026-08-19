/**
 * Worked examples for Quantitative Data Analysis (Part 2), keyed by unit id.
 *
 * Each takes a concrete analysis decision, walks it through, and ends with the
 * point that is easy to get wrong. R commands are included where they carry
 * the explanation; the same operations exist in SPSS and are named in the units.
 *
 * Shape: { title, scenario, steps[], lesson }
 */

const examples = {
  'unit-01': [
    {
      title: 'The spreadsheet that cannot be analysed',
      scenario:
        'A student arrives with 340 completed questionnaires typed into Excel. ' +
        'Ages are recorded as "35 yrs", "about 40" and "1987". Sex is coded M, F, ' +
        'm, f and Male. Missing answers are blank in some columns and "N/A" in others.',
      steps: [
        'Nothing can be computed yet: age is text, so R will not take a mean and SPSS will treat it as nominal.',
        '"1987" is a birth year, not an age — two different variables were entered into one column.',
        'Five spellings of two categories means table(sex) returns five groups instead of two.',
        'Blank and "N/A" both mean missing, but only blank will be recognised on import.',
        'The fix is not cleverer code, it is a codebook and re-entry: age_years numeric, sex coded 1/2, one missing code throughout.',
        'Re-entering 340 records takes two days. Untangling this by script takes longer and leaves doubt about every value.'
      ],
      lesson:
        'Data entry decisions are analysis decisions. An hour spent on the codebook ' +
        'before entry saves days afterwards, and the days afterwards never fully ' +
        'restore confidence in the data.'
    },
    {
      title: 'Wide or long: the same data, two shapes',
      scenario:
        'Blood pressure measured at baseline, 3 and 6 months for 120 patients. ' +
        'The student wants a repeated-measures analysis and the procedure refuses ' +
        'to run.',
      steps: [
        'The data are wide: one row per patient with bp_0, bp_3, bp_6 as three columns.',
        'Wide is convenient for computing change scores: dat$change <- dat$bp_6 - dat$bp_0.',
        'Mixed models and most repeated-measures procedures need long: one row per patient per occasion.',
        'In R: long <- reshape(dat, direction = "long", varying = c("bp_0","bp_3","bp_6"), v.names = "bp", timevar = "month")',
        'Or with tidyr: pivot_longer(dat, cols = starts_with("bp_"), names_to = "month", values_to = "bp")',
        'Keep both. They are the same data, and converting between them is two lines.'
      ],
      lesson:
        'Neither shape is correct in general — the analysis decides. Knowing how to ' +
        'convert takes the argument away entirely.'
    }
  ],

  'unit-02': [
    {
      title: 'Six checks that catch most entry errors',
      scenario:
        'A district survey of 600 households arrives as a clean-looking CSV. ' +
        'Before analysing anything, it needs screening.',
      steps: [
        'Dimensions: nrow(dat) should be 600. It is 603 — three extra rows.',
        'Duplicates: sum(duplicated(dat$id)) returns 3. The same households were entered twice.',
        'Ranges: summary(dat$age_years) shows a maximum of 199. A typing slip for 19 or 99.',
        'Categories: table(dat$edu) shows a level 7 that the codebook does not define.',
        'Cross-variable: sum(dat$sex == 1 & dat$pregnant == 1) returns 2 pregnant men.',
        'Missing codes: min(dat$income) is -99, so the missing code was imported as a real value and every mean is wrong.'
      ],
      lesson:
        'Every one of these passes a casual look at the spreadsheet. Six commands, ' +
        'run before any analysis, catch them all — and the last one would otherwise ' +
        'have silently corrupted every income statistic in the paper.'
    },
    {
      title: 'The outlier that was real',
      scenario:
        'In a study of hypertension, one participant has a systolic pressure of ' +
        '218 mmHg. It sits far above the rest and weakens the association the ' +
        'student expected. They ask whether to remove it.',
      steps: [
        'First: is it possible? 218 mmHg is high but entirely attainable, and this is a hypertension study.',
        'Second: check the source. The paper form says 218, recorded twice, with a note that the patient was referred.',
        'So it is not an error. It is precisely the kind of participant the study exists to capture.',
        'Removing it because it weakens the finding would be data manipulation, not cleaning.',
        'Keep it, and run the analysis with and without it as a sensitivity check.',
        'Report both: "excluding the participant with SBP 218, the association was 4.1 mmHg (95% CI 0.8 to 7.4) rather than 5.2".'
      ],
      lesson:
        'The question is never "does this point help my result" but "is this value ' +
        'real". A sensitivity analysis lets you keep an honest observation and still ' +
        'show it is not driving the conclusion.'
    }
  ],

  'unit-03': [
    {
      title: 'How 5% missing becomes 40% lost',
      scenario:
        'A regression uses 10 variables, each with about 5% missing values, ' +
        'roughly independently. The dataset has 600 participants. The output says ' +
        'n = 358.',
      steps: [
        'SPSS and R both delete any case missing any variable in the model — listwise deletion, silently.',
        'The chance a participant is complete on all ten is 0.95^10, about 0.60.',
        '600 × 0.60 is 360, which matches the 358 reported.',
        'So 40% of the sample was discarded without a warning appearing anywhere.',
        'Worse, if missingness relates to age or income, the remaining 358 are not a random subset — the estimates are biased, not just imprecise.',
        'Multiple imputation with mice(dat, m = 20) uses all 600 and carries the imputation uncertainty into the standard errors.'
      ],
      lesson:
        'Always report the analysis n for every model, and compare it with the ' +
        'recruited n. A gap that large should be explained, not left for a reviewer ' +
        'to find.'
    },
    {
      title: 'Why the outcome goes into the imputation model',
      scenario:
        'A student imputes missing income values but deliberately leaves the ' +
        'outcome — depression score — out of the imputation model, reasoning that ' +
        'including it would be circular.',
      steps: [
        'The instinct is understandable but the statistics say the opposite.',
        'Imputation is not prediction of the truth; it is generating values with the right joint distribution.',
        'Omitting the outcome imputes incomes that carry no relationship to depression.',
        'Those imputed cases then dilute the real association, biasing the estimate towards the null.',
        'Include the outcome, and any variable that predicts missingness, in the imputation model.',
        'Include more variables in the imputation model than in the analysis model — that is the recommended practice, not a mistake.'
      ],
      lesson:
        'Leaving the outcome out feels cautious and is actively harmful. It is one of ' +
        'the most common imputation errors, and it always pushes results towards ' +
        'finding nothing.'
    }
  ],

  'unit-04': [
    {
      title: 'Mean or median: an income variable',
      scenario:
        'Monthly household income in a sample of 600: mean GHS 4,200, median ' +
        'GHS 1,800, standard deviation GHS 9,100, maximum GHS 180,000.',
      steps: [
        'The mean is more than twice the median, which signals strong right skew.',
        'The standard deviation exceeds the mean, so mean ± SD runs negative — impossible for income.',
        'A histogram confirms it: most households below GHS 3,000, a long tail of a few very high earners.',
        'Reporting "mean GHS 4,200 (SD 9,100)" describes almost nobody in the sample.',
        'Report median GHS 1,800 (IQR 900 to 3,400), which describes the typical household.',
        'If a mean is needed for a total or a cost calculation, report it separately and say why.'
      ],
      lesson:
        'The arithmetic is fine either way; the description is not. When mean and ' +
        'median disagree sharply, the median is almost always the honest summary.'
    },
    {
      title: 'The p-value column that should not be there',
      scenario:
        'A randomised trial submits Table 1 with a p-value column comparing ' +
        'baseline characteristics between arms. One row shows p = 0.04 for age, ' +
        'and the student wants to adjust for it.',
      steps: [
        'Randomisation guarantees that any baseline difference arose by chance.',
        'So the p-value tests a hypothesis known to be true, and 1 in 20 rows will be "significant" by construction.',
        'CONSORT explicitly discourages significance testing of baseline characteristics.',
        'The real question is not whether the difference is significant but whether it is large enough to matter.',
        'A standardised difference answers that and does not depend on sample size.',
        'Adjusting for a prognostic variable is fine — but decide that in advance from subject knowledge, not from a baseline p-value.'
      ],
      lesson:
        'In a randomised trial, a baseline p-value answers a question nobody asked. ' +
        'In an observational study it can flag imbalance, but the decision to adjust ' +
        'still belongs to the conceptual framework, not the output.'
    }
  ],

  'unit-05': [
    {
      title: 'Four datasets, one bar chart',
      scenario:
        'Three groups are compared on a continuous outcome. The bar chart of means ' +
        'with error bars looks clean and shows a clear difference. The reviewer asks ' +
        'to see the data.',
      steps: [
        'Group A is tightly clustered around its mean.',
        'Group B is bimodal — two subgroups, and almost nobody near the mean itself.',
        'Group C is skewed with three extreme values pulling the mean up.',
        'All three produce a nearly identical bar and error bar.',
        'Replacing it with ggplot(dat, aes(group, y)) + geom_boxplot() + geom_jitter(width = 0.15) shows all of this at once.',
        'The bimodality in group B turns out to be sex, which was the real finding.'
      ],
      lesson:
        'A bar chart shows two numbers and hides everything else. Plotting the points ' +
        'costs nothing and sometimes hands you the actual result.'
    },
    {
      title: 'The axis that exaggerated a difference',
      scenario:
        'A slide shows attendance rising from 78% to 82% after an intervention. ' +
        'The bars make it look like a doubling.',
      steps: [
        'The vertical axis starts at 76, so the visible bar heights are 2 and 6 — a threefold difference.',
        'Bar length encodes magnitude from zero, so the eye reads the ratio of the drawn heights.',
        'Redrawn from zero, the bars are nearly the same height, which is the honest picture.',
        'If the difference genuinely matters at that scale, a line or dot plot with a restricted axis is acceptable — position, not length, carries the meaning there.',
        'Either way, show the confidence intervals: 78% (95% CI 74 to 82) and 82% (95% CI 78 to 86) overlap substantially.',
        'The 4-point difference may be real, but the chart was claiming far more than the data support.'
      ],
      lesson:
        'Truncating a bar axis is the most common way an honest researcher produces a ' +
        'misleading figure. If the effect only looks impressive on a cropped axis, it ' +
        'is not impressive.'
    }
  ],

  'unit-06': [
    {
      title: 'Two non-significant results that mean opposite things',
      scenario:
        'Two trials of the same drug both report "no significant difference" ' +
        '(p = 0.31 and p = 0.28). A reviewer treats them as equivalent evidence ' +
        'that the drug does not work.',
      steps: [
        'Trial A: difference 0.4 mmHg, 95% CI -0.8 to 1.6. Narrow, centred near zero.',
        'Trial B: difference 6.0 mmHg, 95% CI -5.5 to 17.5. Wide, spanning clinically important effects in both directions.',
        'Trial A has effectively excluded a meaningful effect — its interval contains nothing that would change practice.',
        'Trial B is simply uninformative; it is compatible with the drug being useless or highly effective.',
        'The p-values are almost identical and tell you none of this.',
        'Reporting only "p > 0.05" would make the two studies indistinguishable in a review.'
      ],
      lesson:
        'Absence of significance is not evidence of absence. The confidence interval ' +
        'is what separates "we showed there is no meaningful effect" from "we could ' +
        'not tell", and it is why intervals belong in every result.'
    },
    {
      title: 'Twenty tests, one press release',
      scenario:
        'A study measures 20 outcomes, finds one significant at p = 0.04, and the ' +
        'abstract reports it as the main finding.',
      steps: [
        'With 20 independent tests at the 5% level, the chance of at least one false positive is 1 - 0.95^20, about 64%.',
        'So finding one significant result among twenty is the expected outcome under no effect at all.',
        'A Bonferroni-adjusted threshold would be 0.05/20 = 0.0025; p = 0.04 does not come close.',
        'Benjamini-Hochberg is less conservative and controls the false discovery rate instead.',
        'The cleaner protection is to pre-specify one primary outcome in the protocol, before seeing data.',
        'The finding is not worthless — it is hypothesis-generating, and should be reported as exploratory.'
      ],
      lesson:
        'Testing many things and reporting the winner inverts the meaning of the ' +
        'p-value. Pre-specifying the primary outcome is the cheapest defence, and it ' +
        'has to happen before the analysis, not after.'
    }
  ],

  'unit-07': [
    {
      title: 'Choosing a test in three questions',
      scenario:
        'Four analyses are needed, and the student wants to know which test each ' +
        'requires.',
      steps: [
        'Mean BP in intervention vs control, different people: continuous, two groups, independent → independent t-test (Welch).',
        'Anxiety score before and after in the same patients: continuous, two measurements, paired → paired t-test.',
        'Mean score across four clinics: continuous, four groups, independent → one-way ANOVA, then Tukey.',
        'Proportion adhering in two groups: categorical outcome, two groups → chi-square, or Fisher if expected counts are small.',
        'Each answer came from three questions: outcome type, number of groups, paired or independent.',
        'Only then check assumptions and consider a non-parametric alternative.'
      ],
      lesson:
        'Test choice is a short decision tree, not memorisation. Getting the paired ' +
        'versus independent question wrong is the most common error, and it changes ' +
        'both the test and the power.'
    },
    {
      title: 'Pupils in schools are not independent',
      scenario:
        'Test scores from 600 pupils across 20 schools are compared between two ' +
        'teaching methods with an independent t-test. The result is p = 0.004.',
      steps: [
        'Pupils in the same school share teachers, resources and intake — their scores are correlated.',
        'A t-test assumes 600 independent observations. In effect there are closer to 20.',
        'Treating correlated observations as independent understates the standard error, so p is far too small.',
        'The design effect quantifies it: with an intra-class correlation of 0.15 and 30 pupils per school, variance inflates by about 5.',
        'The right analysis is a mixed model with a random intercept for school: lmer(score ~ method + (1 | school), data = dat)',
        'Refitted properly, the same data give p = 0.14 — the original finding was an artefact of ignoring clustering.'
      ],
      lesson:
        'Independence is the one assumption no test survives losing, and no ' +
        'transformation repairs. Whenever observations are grouped — schools, ' +
        'clinics, villages, repeated visits — the clustering must be in the model.'
    }
  ],

  'unit-08': [
    {
      title: 'Reading a regression table out loud',
      scenario:
        'A model of systolic blood pressure gives: age 0.42 (0.28 to 0.56); ' +
        'female -3.10 (-5.9 to -0.3); BMI 0.88 (0.55 to 1.21); tertiary education ' +
        '-2.40 (-5.1 to 0.3).',
      steps: [
        'Age: each additional year is associated with 0.42 mmHg higher SBP, holding sex, BMI and education constant.',
        'Female: women average 3.1 mmHg lower than men, adjusted for the others. The reference category is male.',
        'BMI: each additional kg/m² adds 0.88 mmHg — over 5 units, about 4.4 mmHg.',
        'Tertiary education: 2.4 mmHg lower than the reference level, but the interval crosses zero, so this is compatible with no difference.',
        'Every statement needs "holding the others constant" — that is what adjustment means.',
        'Reporting only "age was significant" throws away the magnitude, which is the part a clinician can use.'
      ],
      lesson:
        'A coefficient is a sentence in the units of the problem, not a p-value. If ' +
        'you cannot say it out loud in those units, you cannot yet interpret your own ' +
        'model.'
    },
    {
      title: 'The education variable entered as a number',
      scenario:
        'Education has five categories coded 1 to 5. It is entered into the ' +
        'regression as numeric and returns a neat coefficient of -1.2 per level.',
      steps: [
        'That single coefficient assumes each step has the same effect: none→primary equals SHS→tertiary.',
        'It also assumes the categories are equally spaced on some underlying scale, which nobody has established.',
        'Declaring it a factor — dat$edu <- factor(dat$edu) — estimates four coefficients against a reference.',
        'Refitted, the effect turns out to be flat across the first three levels and then drops sharply at tertiary.',
        'The linear version averaged that into a misleading constant slope and understated the tertiary effect.',
        'If a single-number summary is genuinely wanted, test for trend explicitly and say that is what you did.'
      ],
      lesson:
        'Numeric coding of an unordered or unequally spaced categorical variable ' +
        'imposes a straight line nobody checked. Use factors, and let the data show ' +
        'the shape.'
    }
  ],

  'unit-09': [
    {
      title: 'An odds ratio read as a risk ratio',
      scenario:
        'A study of a common outcome — 40% of the unexposed group — reports OR = 3.0. ' +
        'The abstract says the exposure "triples the risk".',
      steps: [
        'Odds in the unexposed: 0.40 / 0.60 = 0.67.',
        'Odds in the exposed: 0.67 × 3.0 = 2.0, so probability = 2.0 / 3.0 = 0.67.',
        'So risk goes from 40% to 67% — a risk ratio of about 1.7, not 3.0.',
        'The odds ratio and risk ratio converge only when the outcome is rare, under roughly 10%.',
        'At a 40% baseline they diverge substantially, and the abstract overstates the effect by nearly double.',
        'Where the design allows, report a risk ratio or risk difference for a common outcome.'
      ],
      lesson:
        'Logistic regression naturally produces odds ratios, and they are routinely ' +
        'described as risks. For common outcomes that is a real and large ' +
        'overstatement, and it appears in print constantly.'
    },
    {
      title: 'Adjusting for a mediator by accident',
      scenario:
        'A study of smoking and mortality adjusts for age, sex, income and lung ' +
        'function. The smoking effect shrinks sharply, and the authors conclude ' +
        'smoking matters less than thought.',
      steps: [
        'Age, sex and income plausibly cause both smoking and mortality — they are confounders, and adjusting is right.',
        'Lung function is different: smoking damages it, and that damage causes mortality.',
        'So lung function lies on the causal path from exposure to outcome — it is a mediator.',
        'Adjusting for it removes the part of smoking\'s effect that operates through lung damage, which is most of it.',
        'The adjusted estimate answers "the effect of smoking not acting through lung function", which is not the question asked.',
        'Drawing a causal diagram before choosing covariates would have separated the confounders from the mediator.'
      ],
      lesson:
        'Adjusting for everything available is not the cautious choice. Which ' +
        'variables to adjust for is a causal question answered from subject ' +
        'knowledge, not a statistical one answered from the data.'
    }
  ],

  'unit-10': [
    {
      title: 'A results paragraph rewritten',
      scenario:
        'A draft reads: "The intervention group had significantly lower blood ' +
        'pressure (p < 0.05), showing that the programme works well and should be ' +
        'rolled out nationally."',
      steps: [
        'No estimate: how much lower? The reader cannot tell if it is 1 mmHg or 20.',
        'No interval: no sense of precision.',
        'p < 0.05 rather than the exact value, which discards information.',
        '"Showing that the programme works well" is interpretation, and belongs in the discussion.',
        '"Should be rolled out nationally" is a recommendation, and belongs in the conclusion — supported by more than one trial.',
        'Rewritten: "Mean systolic BP was 8.4 mmHg lower in the intervention group (95% CI 3.1 to 13.7; t(118) = 3.12, p = 0.002; d = 0.57)."'
      ],
      lesson:
        'The results section reports what was found, in numbers, with uncertainty. ' +
        'Every clause of interpretation that creeps in is a clause a reviewer will ' +
        'ask you to move.'
    },
    {
      title: 'The table that no longer matched the analysis',
      scenario:
        'Two weeks before submission a data error is found and corrected. The ' +
        'analysis is rerun. The manuscript is submitted, and a co-author notices ' +
        'Table 3 still carries the old numbers.',
      steps: [
        'The tables had been typed by hand from earlier output.',
        'Rerunning the analysis updated the output files but not the manuscript.',
        'Three of eleven numbers in Table 3 changed; two did not, so nothing looked obviously wrong.',
        'In Quarto or R Markdown the table is generated from the data at render time, so this cannot happen.',
        'Inline code puts results into prose too: the mean was `r round(mean(dat$age), 1)` years.',
        'Re-rendering after the correction would have updated every number, table and figure at once.'
      ],
      lesson:
        'Copying numbers by hand and later changing the analysis is the most common ' +
        'source of error in a results section. Generating the document from the data ' +
        'makes the failure impossible rather than unlikely.'
    }
  ]
};

export default examples;
