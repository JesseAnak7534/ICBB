/**
 * Quantitative Data Analysis (Part 2) — Units 8-10: regression modelling,
 * adjusting for confounding, and writing the results up.
 */

const unitsCModelling = [
  {
    id: 'unit-08',
    number: 8,
    title: 'Correlation and Linear Regression',
    duration: '180 minutes',
    summary:
      'Modelling a continuous outcome: what a regression coefficient means, how ' +
      'to handle categorical predictors, and how to check the model is entitled ' +
      'to the conclusions you want from it.',
    objectives: [
      'Distinguish correlation from regression and know when each is appropriate',
      'Interpret a slope, an intercept and R-squared in the units of the problem',
      'Include categorical predictors correctly using dummy coding',
      'Extend to multiple regression and interpret adjusted coefficients',
      'Check the assumptions using residual plots',
      'Report a regression model completely'
    ],
    sections: [
      {
        heading: 'Correlation',
        points: [
          'Pearson r measures the strength and direction of a linear relationship between two continuous variables',
          'It runs from -1 to +1; 0 means no linear relationship, not no relationship at all',
          'Spearman rho is the rank-based alternative for monotonic but non-linear relationships, or with outliers',
          'r-squared is the proportion of variance in one variable explained by the other',
          'Always plot the scatterplot before quoting r — very different patterns give identical coefficients',
          'Correlation is symmetric and makes no prediction; regression is directional and does'
        ]
      },
      {
        heading: 'Simple linear regression',
        points: [
          'The model is y = b0 + b1·x + error',
          'b1 is the estimated change in y for a one-unit increase in x',
          'b0 is the predicted y when x is zero — often meaningless, as with a predicted birth weight at age zero',
          'Centring a predictor (subtracting its mean) makes the intercept interpretable as the value at the average',
          'R-squared is the proportion of variance explained; a low value does not mean the model is wrong, only that much is unexplained',
          'In R: fit <- lm(bp ~ age, data = dat); summary(fit); confint(fit)',
          'Always report the coefficient with its confidence interval, not just its p-value'
        ]
      },
      {
        heading: 'Categorical predictors',
        points: [
          'A binary predictor enters as 0/1, and its coefficient is the difference between the two groups',
          'A k-category predictor needs k-1 dummy variables, with one level as the reference',
          'Every coefficient is then interpreted as the difference from that reference level',
          'Choose a reference that makes sense — usually the largest group, or the untreated one',
          'In R declare it a factor and lm() handles the coding: dat$edu <- factor(dat$edu)',
          'Entering an unordered categorical variable as a plain number is a common and serious error: it forces a straight-line effect across arbitrary category codes'
        ],
        note:
          'Coding education as 1 to 5 and putting it in as numeric assumes the step ' +
          'from none to primary equals the step from SHS to tertiary, and that both ' +
          'are one unit of the same thing. Almost never true — use factors.'
      },
      {
        heading: 'Multiple regression',
        points: [
          'Each coefficient is the effect of that predictor holding the others constant',
          '"Adjusted for" and "holding constant" mean the same thing here',
          'Adding a confounder changes the coefficient of interest; that change is the confounding',
          'Adjusted R-squared penalises adding predictors that do not help',
          'Do not select variables purely by p-value; stepwise selection produces unstable models and biased intervals',
          'Choose predictors from subject knowledge and the conceptual framework built in Part 1',
          'A rough guide: at least 10-15 observations per predictor, more for binary outcomes'
        ],
        table: {
          caption: 'Reading a regression table',
          headers: ['Predictor', 'b (95% CI)', 'p', 'Interpretation'],
          rows: [
            ['Age (years)', '0.42 (0.28 to 0.56)', '<0.001', 'Each extra year adds 0.42 mmHg'],
            ['Sex (female vs male)', '-3.10 (-5.9 to -0.3)', '0.030', 'Women 3.1 mmHg lower than men'],
            ['BMI (kg/m²)', '0.88 (0.55 to 1.21)', '<0.001', 'Each BMI unit adds 0.88 mmHg'],
            ['Education: tertiary vs none', '-2.40 (-5.1 to 0.3)', '0.081', 'Lower, but interval includes no difference']
          ]
        }
      },
      {
        heading: 'Checking the model',
        points: [
          'Linearity: residuals versus fitted values should show no pattern; a curve means the relationship is not linear',
          'Constant variance: the same plot should not fan out — a funnel shape is heteroscedasticity',
          'Normality of residuals: a Q-Q plot should follow the diagonal. It is the residuals that matter, not the raw data',
          'Independence: cannot be checked from residuals alone; it follows from the design',
          'Influential points: Cook\'s distance identifies observations that move the coefficients substantially',
          'Multicollinearity: a variance inflation factor above about 5 to 10 means predictors are too closely related to separate',
          'In R: plot(fit) gives the four diagnostic plots; vif(fit) from the car package gives VIFs'
        ]
      }
    ],
    keyTerms: [
      { term: 'Pearson r', definition: 'A measure of linear association between two continuous variables, from -1 to +1.' },
      { term: 'Regression coefficient', definition: 'The estimated change in the outcome per one-unit increase in a predictor.' },
      { term: 'Dummy variable', definition: 'A binary indicator representing one level of a categorical predictor against a reference.' },
      { term: 'Adjusted', definition: 'Estimated while holding the other predictors in the model constant.' },
      { term: 'Heteroscedasticity', definition: 'Non-constant variance of residuals across fitted values.' },
      { term: 'Multicollinearity', definition: 'Predictors so correlated that their separate effects cannot be estimated reliably.' },
      { term: "Cook's distance", definition: 'A measure of how much an observation influences the fitted coefficients.' }
    ],
    activity:
      'Fit a regression with one continuous and one categorical predictor on your ' +
      'own data or a supplied dataset. Write one sentence interpreting each ' +
      'coefficient in the units of the problem, then run the four diagnostic plots ' +
      'and say which assumption you are least comfortable with.',
    readings: [
      { label: 'Vittinghoff et al. — Regression Methods in Biostatistics', note: 'The standard applied text; strong on confounding and model building.' },
      { label: 'Altman & Bland — "Correlation, regression and repeated data"', note: 'BMJ Statistics Notes, short and corrective.' },
      { label: 'Harrell — Regression Modeling Strategies', note: 'Advanced; definitive on why stepwise selection should be avoided.' }
    ],
    quiz: [
      {
        question: 'In a regression of blood pressure on age, the coefficient for age is 0.42. This means:',
        options: [
          '42% of blood pressure is explained by age',
          'Each additional year of age is associated with a 0.42 mmHg higher blood pressure',
          'Age and blood pressure correlate at r = 0.42',
          'Blood pressure rises 0.42% per year'
        ],
        answer: 1,
        explanation:
          'A regression coefficient is the change in the outcome per one-unit change in the ' +
          'predictor, in the outcome\'s own units. Variance explained is R-squared; correlation is r.'
      },
      {
        question: 'Education has five ordered categories. Entering it as a numeric variable 1-5 assumes:',
        options: [
          'Nothing problematic',
          'That each step between adjacent categories has the same effect on the outcome',
          'That education is normally distributed',
          'That the reference category is "none"'
        ],
        answer: 1,
        explanation:
          'Numeric entry imposes a constant linear effect per category step. Declaring it a factor ' +
          'estimates a separate coefficient for each level against a reference, which is almost ' +
          'always the honest choice.'
      },
      {
        question: 'A residuals-versus-fitted plot shows a clear funnel widening to the right. This indicates:',
        options: [
          'Non-normal residuals',
          'Heteroscedasticity — the variance is not constant across fitted values',
          'Multicollinearity',
          'An omitted interaction'
        ],
        answer: 1,
        explanation:
          'A funnel means spread changes with the fitted value. Coefficients stay unbiased but ' +
          'standard errors are wrong; a transformation or robust standard errors is the usual fix.'
      },
      {
        question: 'Adding a confounder to a model changes the coefficient of interest from 5.2 to 2.1. This means:',
        options: [
          'The model is misspecified',
          'Much of the crude association was explained by that confounder',
          'The confounder should be removed',
          'The sample is too small'
        ],
        answer: 1,
        explanation:
          'That change is exactly what confounding looks like. The adjusted estimate is the ' +
          'effect holding the confounder constant, and reporting both crude and adjusted lets the ' +
          'reader see how much it mattered.'
      },
      {
        question: 'A Q-Q plot in regression diagnostics assesses the normality of:',
        options: [
          'The outcome variable',
          'The residuals',
          'The predictors',
          'The fitted values'
        ],
        answer: 1,
        explanation:
          'Linear regression assumes normally distributed errors, not normally distributed raw ' +
          'data. A skewed outcome can still yield well-behaved residuals once predictors are in ' +
          'the model.'
      },
      {
        question: 'Stepwise selection by p-value is discouraged mainly because it:',
        options: [
          'Is computationally slow',
          'Produces unstable models with biased coefficients and confidence intervals that are too narrow',
          'Cannot handle categorical predictors',
          'Requires very large samples'
        ],
        answer: 1,
        explanation:
          'Letting the data choose the model and then reporting intervals as if it had been ' +
          'pre-specified understates uncertainty, and small changes in the data can produce a ' +
          'different model. Choose predictors from subject knowledge instead.'
      }
    ]
  },

  {
    id: 'unit-09',
    number: 9,
    title: 'Logistic Regression and Confounding',
    duration: '180 minutes',
    summary:
      'Modelling binary outcomes: odds, odds ratios and what they do and do not ' +
      'mean, plus adjusting for confounding and recognising mediators and ' +
      'interactions.',
    objectives: [
      'Explain why linear regression is unsuitable for a binary outcome',
      'Interpret odds ratios and their confidence intervals correctly',
      'Distinguish odds ratio from risk ratio and know when they diverge',
      'Fit and interpret multivariable logistic regression',
      'Distinguish confounders, mediators and colliders, and adjust accordingly',
      'Assess model fit and predictive performance'
    ],
    sections: [
      {
        heading: 'Why not linear regression',
        points: [
          'A binary outcome is 0 or 1, but a linear model can predict below 0 and above 1',
          'The residuals cannot be normal or homoscedastic when the outcome takes two values',
          'Logistic regression models the log odds, which is unbounded and well behaved',
          'The fitted probability is then obtained by transforming back through the logistic function',
          'Odds are p / (1 - p): a probability of 0.2 corresponds to odds of 0.25',
          'The model is linear in the log odds, not in the probability — which is why effects are multiplicative'
        ]
      },
      {
        heading: 'Reading an odds ratio',
        points: [
          'exp(b) is the odds ratio for a one-unit increase in the predictor',
          'OR = 1 means no association; above 1 higher odds; below 1 lower odds',
          'The confidence interval is what matters: an OR of 3.2 with an interval of 0.8 to 12.6 is not evidence of much',
          'Odds ratios are not risk ratios. When the outcome is rare (under about 10%) they are close; when it is common they diverge sharply',
          'An OR of 3 for an outcome affecting 40% of people does not mean three times the risk',
          'Report the interval always, and consider a risk ratio or risk difference where the outcome is common and the design allows it',
          'In R: fit <- glm(y ~ x, family = binomial, data = dat); exp(cbind(OR = coef(fit), confint(fit)))'
        ],
        note:
          'The odds ratio is the coefficient logistic regression naturally produces, ' +
          'and it is often reported as though it were a risk ratio. For a common ' +
          'outcome that overstates the effect substantially — a mistake that appears ' +
          'in print constantly.'
      },
      {
        heading: 'Confounders, mediators and colliders',
        points: [
          'A confounder causes both the exposure and the outcome; adjusting for it removes bias',
          'A mediator lies on the causal path from exposure to outcome; adjusting for it removes part of the effect you are trying to measure',
          'A collider is caused by both exposure and outcome; adjusting for it creates bias where none existed',
          'The distinction cannot be made from the data — it comes from subject knowledge and the conceptual framework',
          'Draw a directed acyclic graph before choosing what to adjust for',
          'Adjusting for everything available is not conservative; it can actively introduce bias',
          'Example: adjusting smoking for lung function when estimating smoking\'s effect on mortality removes part of the very pathway of interest'
        ],
        table: {
          caption: 'What to do with a third variable',
          headers: ['Role', 'Relationship', 'Adjust?', 'Effect of adjusting'],
          rows: [
            ['Confounder', 'Causes exposure and outcome', 'Yes', 'Removes bias'],
            ['Mediator', 'On the path exposure → outcome', 'Usually no', 'Removes part of the effect'],
            ['Collider', 'Caused by exposure and outcome', 'No', 'Creates bias'],
            ['Competing cause', 'Causes outcome only', 'Optional', 'Improves precision']
          ]
        }
      },
      {
        heading: 'Building and checking the model',
        points: [
          'Rule of thumb: at least 10 events per predictor, counting the rarer outcome category, not the sample size',
          '40 events and 8 predictors is over-fitted regardless of how large the sample looks',
          'Check linearity of continuous predictors on the log-odds scale, not the probability scale',
          'Hosmer-Lemeshow tests calibration, though it is sensitive to sample size and grouping',
          'The C-statistic (area under the ROC curve) measures discrimination: 0.5 is chance, above 0.8 is good',
          'Report both discrimination and calibration for a prediction model; either alone is incomplete',
          'Check for separation — a predictor that perfectly predicts the outcome produces enormous coefficients and unusable intervals'
        ]
      },
      {
        heading: 'Reporting',
        points: [
          'Report the number of events and the number of observations, not only n',
          'Present crude and adjusted estimates side by side',
          'State which variables were adjusted for and why they were chosen',
          'Give odds ratios with confidence intervals to two decimal places',
          'Say whether continuous predictors were entered linearly, categorised, or modelled with splines',
          'If the outcome is common, note that the odds ratio overstates the risk ratio'
        ]
      }
    ],
    keyTerms: [
      { term: 'Odds', definition: 'The probability of an event divided by the probability of it not occurring.' },
      { term: 'Odds ratio', definition: 'The ratio of odds between two groups; the natural output of logistic regression.' },
      { term: 'Risk ratio', definition: 'The ratio of probabilities between two groups; diverges from the odds ratio when the outcome is common.' },
      { term: 'Confounder', definition: 'A variable causing both exposure and outcome, biasing the crude association.' },
      { term: 'Mediator', definition: 'A variable on the causal path between exposure and outcome.' },
      { term: 'Collider', definition: 'A variable caused by both exposure and outcome; adjusting for it introduces bias.' },
      { term: 'C-statistic', definition: 'Area under the ROC curve, measuring how well a model discriminates between outcomes.' },
      { term: 'Events per variable', definition: 'The number of outcome events divided by the number of predictors; a guide to over-fitting.' }
    ],
    activity:
      'For your own binary outcome, list every variable you might adjust for. ' +
      'Classify each as confounder, mediator, collider or competing cause, and ' +
      'justify the classification from what causes what — not from what the data ' +
      'show. Then state which you will adjust for.',
    readings: [
      { label: 'Hernán & Robins — Causal Inference: What If', note: 'Free online. The clearest treatment of confounders, mediators and colliders.' },
      { label: 'Knol et al. (2012) — "What do case-control studies estimate?"', note: 'On odds ratios versus risk ratios.' },
      { label: 'Peduzzi et al. (1996) — events per variable in logistic regression', note: 'The origin of the ten-events-per-predictor guide.' }
    ],
    quiz: [
      {
        question: 'A study reports OR = 3.0 for an outcome occurring in 40% of the unexposed group. Reading this as "three times the risk" is:',
        options: [
          'Correct',
          'An overstatement, because odds ratios exceed risk ratios when the outcome is common',
          'An understatement',
          'Correct only in case-control studies'
        ],
        answer: 1,
        explanation:
          'Odds and risk diverge as the outcome becomes common. With a 40% baseline, an OR of 3.0 ' +
          'corresponds to a risk ratio well under 2. The approximation only holds for rare outcomes.'
      },
      {
        question: 'You are estimating the effect of smoking on mortality and adjust for lung function. Lung function is most likely a:',
        options: [
          'Confounder, so adjustment is correct',
          'Mediator, so adjusting removes part of the effect you are trying to measure',
          'Collider',
          'Competing cause'
        ],
        answer: 1,
        explanation:
          'Smoking damages lung function, which contributes to mortality — it lies on the causal ' +
          'path. Adjusting for it answers a different question: the effect of smoking not acting ' +
          'through lung function.'
      },
      {
        question: 'Your dataset has 500 participants, 40 of whom had the outcome, and you fit 8 predictors. The concern is:',
        options: [
          'The sample is too small overall',
          'Only 5 events per predictor, so the model is over-fitted',
          'Logistic regression cannot handle 8 predictors',
          'The outcome is too common'
        ],
        answer: 1,
        explanation:
          'What limits a logistic model is the number of events, not the sample size. 40 events ' +
          'with 8 predictors is 5 per variable, below the usual guide of 10, giving unstable ' +
          'coefficients and intervals that are too narrow.'
      },
      {
        question: 'An odds ratio of 2.4 with a 95% CI of 0.7 to 8.1 should be described as:',
        options: [
          'A strong positive association',
          'Consistent with anything from a modest protective effect to a large harmful one — the study is uninformative here',
          'Evidence of no association',
          'Statistically significant'
        ],
        answer: 1,
        explanation:
          'The interval spans 1 and is very wide. The point estimate is not the finding; the ' +
          'interval is, and here it tells you the study could not pin the effect down.'
      },
      {
        question: 'A C-statistic of 0.52 indicates the model:',
        options: [
          'Discriminates well',
          'Discriminates barely better than chance',
          'Is perfectly calibrated',
          'Has too many predictors'
        ],
        answer: 1,
        explanation:
          '0.5 is a coin flip and 1.0 is perfect discrimination. 0.52 means the model can hardly ' +
          'separate those who had the outcome from those who did not, whatever its p-values say.'
      },
      {
        question: 'Which is the correct R call for logistic regression?',
        options: [
          'lm(y ~ x, data = dat)',
          'glm(y ~ x, family = binomial, data = dat)',
          'aov(y ~ x, data = dat)',
          'cor.test(y, x)'
        ],
        answer: 1,
        explanation:
          'glm with family = binomial fits the logistic model. Omitting the family argument fits a ' +
          'linear model instead — which runs without error and gives quietly wrong results.'
      }
    ]
  },

  {
    id: 'unit-10',
    number: 10,
    title: 'Reporting, Reproducibility and the Results Section',
    duration: '150 minutes',
    summary:
      'Turning output into a results section a reviewer will accept: what to ' +
      'report, how to lay out tables, and how to make the whole analysis ' +
      'reproducible by someone else.',
    objectives: [
      'Write a results section that matches the pre-specified analysis plan',
      'Report estimates, intervals and p-values to the right precision',
      'Lay out tables and figures to journal standards',
      'Apply the relevant reporting checklist',
      'Build a reproducible analysis with a script and a clear folder structure',
      'Produce a dynamic report with R Markdown or Quarto'
    ],
    sections: [
      {
        heading: 'What belongs in the results',
        points: [
          'Participant flow: how many were approached, included, excluded and analysed, and why',
          'Table 1 of participant characteristics',
          'The primary analysis, answering the primary objective, first',
          'Secondary analyses clearly labelled as secondary',
          'Any analysis not planned in advance labelled exploratory — not doing so is the difference between honest reporting and fishing',
          'No interpretation in the results section; that belongs in the discussion',
          'Every objective from the proposal produces a result, and every result answers an objective'
        ]
      },
      {
        heading: 'Precision and notation',
        points: [
          'Report to the precision the data support: a mean age of 42.3 years, not 42.3187',
          'Percentages to at most one decimal, and never for a denominator under about 20',
          'p-values to two or three decimals; below 0.001 write p < 0.001, never p = 0.000',
          'Effect estimates with confidence intervals, using "to" rather than a dash when values may be negative',
          'Give the unit of measurement in the row or column label, not repeated in every cell',
          'Be consistent about decimal places within a column so figures line up'
        ],
        table: {
          caption: 'Common reporting faults',
          headers: ['Written', 'Problem', 'Better'],
          rows: [
            ['p = 0.000', 'No p-value is zero', 'p < 0.001'],
            ['Mean 42.3187 years', 'False precision', 'Mean 42.3 years'],
            ['OR 2.4 (p < 0.05)', 'No interval', 'OR 2.4 (95% CI 1.3 to 4.5)'],
            ['33.3% (n = 3)', 'Percentage of a tiny denominator', '1 of 3'],
            ['A trend towards significance', 'p = 0.08 is not a trend', 'No significant difference (p = 0.08)']
          ]
        }
      },
      {
        heading: 'Checklists',
        points: [
          'STROBE for observational studies — cohort, case-control and cross-sectional',
          'CONSORT for randomised trials',
          'PRISMA for systematic reviews',
          'TRIPOD for prediction model studies',
          'SAMPL for statistical reporting generally',
          'Find them at the EQUATOR Network, and use one while writing rather than afterwards',
          'Most journals require the completed checklist at submission anyway'
        ]
      },
      {
        heading: 'Making the analysis reproducible',
        points: [
          'A reproducible analysis means someone else can run your script on your data and get your numbers',
          'Structure: data/raw (read-only), data/clean, scripts, output, and a README explaining the order',
          'Number scripts in running order: 01-clean.R, 02-describe.R, 03-model.R',
          'Never edit data by hand; every change is a line of code',
          'Set a seed before anything random so imputation and bootstrap results repeat exactly',
          'Record package versions — sessionInfo() in R, or renv for a full lockfile',
          'Use relative paths so the project runs on another machine'
        ],
        note:
          'The practical test: delete every output file, rerun the scripts from raw ' +
          'data, and check the numbers in your manuscript still match. Most analyses ' +
          'fail this the first time, which is exactly why it is worth doing before a ' +
          'reviewer asks.'
      },
      {
        heading: 'Dynamic reports',
        points: [
          'R Markdown and Quarto embed the code that produces each number in the document itself',
          'The manuscript is then generated from the data, so a table can never disagree with the analysis',
          'Inline code writes results into prose: the mean was `r round(mean(dat$age), 1)` years',
          'Re-running after a data correction updates every number, table and figure at once',
          'Output to Word for co-authors, PDF for submission, or HTML for sharing',
          'This removes the single most common source of error in a results section: copying a number by hand and later changing the analysis'
        ]
      }
    ],
    keyTerms: [
      { term: 'Primary analysis', definition: 'The pre-specified analysis answering the study\'s main objective.' },
      { term: 'Exploratory analysis', definition: 'An analysis not planned in advance, which must be labelled as such.' },
      { term: 'STROBE', definition: 'The reporting checklist for observational studies.' },
      { term: 'Reproducibility', definition: 'The property that another person can obtain your results from your data and code.' },
      { term: 'Seed', definition: 'A starting value for the random number generator, making stochastic procedures repeatable.' },
      { term: 'Dynamic report', definition: 'A document in which results are generated from the data at render time rather than pasted in.' }
    ],
    activity:
      'Take one table from a draft of your own results. Check it against the ' +
      'reporting faults table in this unit, fix every instance, and add a ' +
      'confidence interval to every estimate that lacks one. Then write the ' +
      'accompanying paragraph without a single word of interpretation.',
    readings: [
      { label: 'EQUATOR Network — reporting guidelines', note: 'Free index of every checklist. Find yours before you write.' },
      { label: 'Lang & Altman — SAMPL guidelines for statistical reporting', note: 'Concrete rules for numbers, tables and notation.' },
      { label: 'Quarto documentation', note: 'Works with R, Python and Stata; the successor to R Markdown.' },
      { label: 'The Turing Way — Guide for Reproducible Research', note: 'Free, community-written, practical on project structure.' }
    ],
    quiz: [
      {
        question: 'Your software reports p = 0.000. You should write:',
        options: ['p = 0.000', 'p < 0.001', 'p = 0', 'p is highly significant'],
        answer: 1,
        explanation:
          'The value has been rounded, not computed as zero. A probability of exactly zero would ' +
          'mean the data are impossible under the null, which is never the case.'
      },
      {
        question: 'You ran an unplanned subgroup analysis that produced an interesting finding. In the paper it must be:',
        options: [
          'Reported as a primary result',
          'Labelled exploratory, with the reader told it was not pre-specified',
          'Omitted entirely',
          'Reported without a p-value'
        ],
        answer: 1,
        explanation:
          'Unplanned analyses are legitimate and often valuable, but presenting one as though it ' +
          'had been planned misrepresents the false positive risk. Label it and let the reader ' +
          'weigh it accordingly.'
      },
      {
        question: '"There was a trend towards significance (p = 0.08)" is poor practice because:',
        options: [
          'p = 0.08 is not reportable',
          'A p-value is not a trend; the result either meets the threshold or does not, and the interval is what conveys the uncertainty',
          'Trends require at least three time points',
          'The threshold should have been 0.10'
        ],
        answer: 1,
        explanation:
          'The phrase implies the effect would have been significant with more data, which is not ' +
          'something the p-value says. Report the estimate and interval and let them speak.'
      },
      {
        question: 'The practical test of a reproducible analysis is that:',
        options: [
          'The code is commented',
          'Deleting all outputs and rerunning the scripts from raw data reproduces every number in the manuscript',
          'It was run in R rather than SPSS',
          'The data are publicly available'
        ],
        answer: 1,
        explanation:
          'Reproducibility is demonstrated, not asserted. Rerunning from raw data is the only ' +
          'check that catches hand-edited cells, undocumented steps and numbers that drifted after ' +
          'the analysis changed.'
      },
      {
        question: 'Setting a random seed before multiple imputation matters because:',
        options: [
          'It makes the imputation more accurate',
          'It makes the results exactly repeatable on a rerun',
          'It is required by Rubin\'s rules',
          'It reduces the number of imputations needed'
        ],
        answer: 1,
        explanation:
          'Imputation is stochastic, so results differ slightly each run. A seed fixes the random ' +
          'sequence so you and a reviewer obtain identical numbers. It does not affect validity.'
      },
      {
        question: 'The main advantage of writing results in Quarto or R Markdown is that:',
        options: [
          'It produces prettier documents',
          'Numbers are generated from the data at render time, so a table can never disagree with the analysis',
          'It runs the analysis faster',
          'It removes the need for a statistician'
        ],
        answer: 1,
        explanation:
          'Copying numbers by hand and then changing the analysis is the commonest source of ' +
          'inconsistency in a results section. Generating them from the data at render time makes ' +
          'that failure impossible.'
      }
    ]
  }
];

export default unitsCModelling;
