/**
 * Quantitative Data Analysis (Part 2) — Units 5-7: showing data, the logic of
 * inference, and choosing the right test to compare groups.
 */

const unitsBInference = [
  {
    id: 'unit-05',
    number: 5,
    title: 'Visualising Data',
    duration: '120 minutes',
    summary:
      'Choosing a chart that shows what the data actually do, and avoiding the ' +
      'plots that hide the very thing a reader needs to see.',
    objectives: [
      'Match a chart type to the variables being shown',
      'Read a histogram, boxplot and scatterplot for shape, spread and outliers',
      'Explain why bar charts of means conceal distribution',
      'Build publication-quality figures in R and SPSS',
      'Apply the conventions that make a figure readable in print and to colour-blind readers'
    ],
    sections: [
      {
        heading: 'Which chart for which variables',
        points: [
          'One continuous variable: histogram or density plot for shape; boxplot for summary and outliers',
          'One categorical variable: bar chart of counts — never a pie chart with more than three slices',
          'Continuous by categorical: boxplot, violin plot, or a dot plot showing every observation',
          'Two continuous: scatterplot, with a fitted line only if you are claiming a relationship',
          'Change over time: line plot with time on the horizontal axis',
          'Two categorical: grouped or stacked bar chart, or a mosaic plot'
        ]
      },
      {
        heading: 'The bar chart of means problem',
        points: [
          'A bar with an error bar shows two numbers and hides the entire distribution',
          'Radically different datasets — bimodal, skewed, or containing outliers — produce identical bars',
          'It also implies the bar length is meaningful from zero, which is false for many measurements',
          'For group comparisons prefer a boxplot, or a dot plot with every point drawn',
          'With small n, plot every observation; there is no reason to summarise 12 points',
          'If you must use bars, state whether the error bar is SD, SE or a confidence interval — they differ by a factor of several'
        ],
        note:
          'Journals in several fields now refuse bar charts of continuous data for ' +
          'exactly this reason. Showing the points costs nothing and lets a reader ' +
          'see what you saw.'
      },
      {
        heading: 'Making figures honest',
        points: [
          'Start a bar chart axis at zero; truncating it exaggerates differences',
          'For line and scatter plots a non-zero axis is acceptable, but say so if the range is narrow',
          'Label both axes with the variable and its unit',
          'Do not use a second vertical axis to imply a relationship between two series',
          'Avoid three-dimensional effects entirely — they distort area and length',
          'Aspect ratio changes the apparent steepness of a slope; keep it consistent when comparing panels'
        ]
      },
      {
        heading: 'Colour and accessibility',
        points: [
          'Roughly 1 in 12 men has some form of colour vision deficiency, most commonly red-green',
          'Never use red and green as the only distinction between two series',
          'Use the viridis palette, or vary shape and line type as well as colour',
          'Check a figure by converting it to greyscale — if it still reads, it will survive printing',
          'Keep the palette consistent across every figure in a paper or deck',
          'Use colour to encode data, not for decoration'
        ],
        table: {
          caption: 'Chart choice at a glance',
          headers: ['You have', 'Show shape with', 'Compare groups with'],
          rows: [
            ['One continuous variable', 'Histogram, density plot', 'Boxplot by group'],
            ['One categorical variable', 'Bar chart of counts', 'Grouped bar chart'],
            ['Two continuous variables', 'Scatterplot', 'Scatterplot coloured by group'],
            ['Continuous over time', 'Line plot', 'One line per group'],
            ['Small samples (n < 20)', 'Plot every point', 'Dot plot with median line']
          ]
        }
      },
      {
        heading: 'Doing it in software',
        points: [
          'R base: hist(dat$bp), boxplot(bp ~ group, data = dat), plot(x, y)',
          'ggplot2 gives publication quality: ggplot(dat, aes(group, bp)) + geom_boxplot() + geom_jitter(width = 0.15)',
          'geom_jitter over a boxplot shows both the summary and the raw observations',
          'SPSS: Graphs > Chart Builder, then double-click the chart to edit elements',
          'Export at 300 dpi or higher, or as a vector format (PDF, EPS, SVG), never a screenshot',
          'Set the figure size at export rather than resizing afterwards, or the text will not scale with it'
        ]
      }
    ],
    keyTerms: [
      { term: 'Histogram', definition: 'A chart of the distribution of one continuous variable, using binned counts.' },
      { term: 'Boxplot', definition: 'A summary showing median, quartiles and outliers, useful for comparing groups.' },
      { term: 'Jitter', definition: 'Small random horizontal displacement so overlapping points become visible.' },
      { term: 'Truncated axis', definition: 'An axis not starting at zero, which exaggerates apparent differences in a bar chart.' },
      { term: 'Viridis', definition: 'A perceptually uniform colour palette that remains readable in greyscale and to colour-blind viewers.' },
      { term: 'Vector format', definition: 'A figure stored as shapes rather than pixels, so it stays sharp at any size.' }
    ],
    activity:
      'Take one finding from your own data and draw it three different ways — for ' +
      'example a bar of means, a boxplot, and a dot plot of every observation. ' +
      'Decide which one a sceptical reader would trust most, and say why the other ' +
      'two are less honest.',
    readings: [
      { label: 'Weissgerber et al. (2015) — "Beyond Bar and Line Graphs"', note: 'PLOS Biology, open access. The paper that changed several journals\' policies.' },
      { label: 'Wilke — Fundamentals of Data Visualization', note: 'Free online, and the best single reference on chart choice.' },
      { label: 'ggplot2 documentation and the R Graph Gallery', note: 'Copyable examples for almost any chart you need.' }
    ],
    quiz: [
      {
        question: 'The main criticism of a bar chart showing group means with error bars is that it:',
        options: [
          'Is difficult to produce in R',
          'Hides the distribution, so very different datasets can produce identical bars',
          'Cannot show more than two groups',
          'Requires the data to be normally distributed'
        ],
        answer: 1,
        explanation:
          'Two numbers cannot describe a distribution. Bimodal data, skewed data and data with ' +
          'an extreme outlier can all yield the same bar and error bar, which is why boxplots or ' +
          'plotting every point are preferred.'
      },
      {
        question: 'You are comparing a continuous outcome across three groups with 15 participants each. The best chart is:',
        options: [
          'A bar chart of means',
          'A boxplot or dot plot showing every observation',
          'A pie chart',
          'A line plot'
        ],
        answer: 1,
        explanation:
          'With 15 per group there is no reason to hide the data. A boxplot with jittered points ' +
          'shows the summary and every observation at once.'
      },
      {
        question: 'Using only red and green to distinguish two lines is a problem because:',
        options: [
          'Those colours print poorly',
          'Red-green deficiency is the most common form of colour blindness, affecting roughly 1 in 12 men',
          'Journals charge extra for colour',
          'It violates copyright'
        ],
        answer: 1,
        explanation:
          'A substantial minority of readers cannot separate them. Vary line type or shape as ' +
          'well as colour, and check the figure in greyscale.'
      },
      {
        question: 'A bar chart with a vertical axis starting at 45 instead of 0:',
        options: [
          'Is standard practice for clarity',
          'Exaggerates the apparent difference between bars',
          'Is required when values are large',
          'Has no effect on interpretation'
        ],
        answer: 1,
        explanation:
          'Bar length encodes magnitude from zero. Truncating the axis makes a small difference ' +
          'look dramatic. For line and scatter plots a non-zero axis is acceptable, because ' +
          'position rather than length carries the meaning.'
      },
      {
        question: 'Which R code overlays the raw observations on a boxplot?',
        options: [
          'geom_boxplot() + geom_bar()',
          'geom_boxplot() + geom_jitter(width = 0.15)',
          'geom_histogram() + geom_density()',
          'geom_line() + geom_point()'
        ],
        answer: 1,
        explanation:
          'geom_jitter displaces points slightly so overlapping observations become visible. ' +
          'Layered over a boxplot it gives both the summary and the underlying data.'
      }
    ]
  },

  {
    id: 'unit-06',
    number: 6,
    title: 'The Logic of Inference',
    duration: '150 minutes',
    summary:
      'What a p-value is and is not, what a confidence interval actually tells ' +
      'you, and why an effect size belongs in every result you report.',
    objectives: [
      'Explain sampling variation and the sampling distribution',
      'Interpret a confidence interval correctly, and reject the common misreadings',
      'State precisely what a p-value measures',
      'Distinguish statistical significance from practical importance',
      'Calculate and interpret common effect sizes',
      'Explain Type I and Type II error, power, and the cost of multiple testing'
    ],
    sections: [
      {
        heading: 'Why samples vary',
        points: [
          'Any sample is one of many that could have been drawn; each gives a slightly different estimate',
          'The sampling distribution is the distribution of an estimate across all possible samples',
          'Its standard deviation is the standard error of the estimate',
          'The central limit theorem says that for a large enough sample the sampling distribution of the mean is approximately normal, whatever the shape of the underlying data',
          'This is why means can be handled with normal-theory methods even when the raw data are skewed',
          'It says nothing about the data being normal — a persistent confusion'
        ]
      },
      {
        heading: 'Confidence intervals',
        points: [
          'A 95% confidence interval is constructed so that, over repeated sampling, 95% of such intervals contain the true value',
          'It is not "a 95% probability the true value lies in this interval" — the true value is fixed, the interval is what varies',
          'Its width reflects precision: wide means the study could not pin the effect down',
          'A CI that includes the null value corresponds to p > 0.05, but carries far more information',
          'Report intervals for every effect estimate, not just p-values',
          'A non-significant result with a narrow interval around zero is evidence of no meaningful effect; with a wide interval it is simply uninformative'
        ],
        note:
          '"No significant difference" and "no difference" are not the same claim. ' +
          'The confidence interval is what tells them apart, which is the single ' +
          'strongest argument for always reporting it.'
      },
      {
        heading: 'What a p-value is',
        points: [
          'The probability of observing data at least as extreme as yours, if the null hypothesis were true',
          'It is not the probability the null hypothesis is true',
          'It is not the probability your finding is a fluke',
          'It is not a measure of effect size — a tiny, unimportant difference gives a small p in a large enough sample',
          '0.05 is a convention, not a law of nature, and nothing decisive happens between 0.049 and 0.051',
          'Report exact values (p = 0.03), not thresholds (p < 0.05), and never "p = 0.000" — write p < 0.001'
        ]
      },
      {
        heading: 'Effect size',
        points: [
          'The effect size answers "how big", which is what a reader actually wants to know',
          "Cohen's d for a difference between two means: roughly 0.2 small, 0.5 medium, 0.8 large — as rough guides only",
          'Correlation r, or r-squared, for the strength of association',
          'Odds ratio, risk ratio and risk difference for binary outcomes',
          'Eta-squared or partial eta-squared for ANOVA',
          'Always interpret the effect in the units of the problem: "8 mmHg lower" means more to a clinician than "d = 0.42"',
          'Statistical significance with a trivial effect size is a large-sample artefact, not a finding'
        ],
        table: {
          caption: 'What each number tells you',
          headers: ['Quantity', 'Answers', 'Depends on sample size?'],
          rows: [
            ['p-value', 'Is this compatible with no effect?', 'Yes, strongly'],
            ['Effect size', 'How big is the effect?', 'No'],
            ['Confidence interval', 'How precisely do we know it?', 'Yes, width shrinks with n'],
            ['Power', 'Could this study have detected it?', 'Yes']
          ]
        }
      },
      {
        heading: 'Errors, power and multiplicity',
        points: [
          'Type I error: concluding there is an effect when there is none. Its rate is the significance level, conventionally 5%',
          'Type II error: missing a real effect. Its rate is beta; power is 1 minus beta',
          '80% power is conventional, meaning a 1 in 5 chance of missing a real effect of the size you specified',
          'An underpowered study that finds nothing has not shown absence of an effect',
          'Testing 20 hypotheses at 5% gives roughly a 64% chance of at least one false positive',
          'Adjust for multiplicity (Bonferroni is simple and conservative; Benjamini-Hochberg controls false discovery rate), or pre-specify one primary outcome',
          'Pre-specifying the primary analysis is the cleanest defence against fishing'
        ]
      }
    ],
    keyTerms: [
      { term: 'Sampling distribution', definition: 'The distribution of an estimate across all possible samples of a given size.' },
      { term: 'Standard error', definition: 'The standard deviation of the sampling distribution; the precision of an estimate.' },
      { term: 'Confidence interval', definition: 'A range constructed so that a stated proportion of such intervals contain the true value over repeated sampling.' },
      { term: 'p-value', definition: 'The probability of data at least as extreme as observed, assuming the null hypothesis is true.' },
      { term: 'Effect size', definition: 'A measure of the magnitude of an effect, independent of sample size.' },
      { term: 'Power', definition: 'The probability of detecting an effect of a specified size when it genuinely exists.' },
      { term: 'Multiplicity', definition: 'The inflation of false positive risk that comes from testing many hypotheses.' }
    ],
    activity:
      'Find a paper in your field that reports "no significant difference". Locate ' +
      'the confidence interval. Decide whether the study showed there was no ' +
      'meaningful effect, or simply could not tell — and write one sentence ' +
      'explaining how the interval settles it.',
    readings: [
      { label: 'Greenland et al. (2016) — "Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations"', note: 'Open access. Twenty-five common misreadings, each corrected. Essential.' },
      { label: 'Wasserstein & Lazar (2016) — ASA Statement on p-Values', note: 'The profession\'s own statement of what p-values cannot do.' },
      { label: 'Sullivan & Feinn (2012) — "Using Effect Size — or Why the P Value Is Not Enough"', note: 'Short and practical.' }
    ],
    quiz: [
      {
        question: 'A 95% confidence interval for a mean difference is 2.1 to 8.7 mmHg. Which statement is correct?',
        options: [
          'There is a 95% probability the true difference lies between 2.1 and 8.7',
          'If the study were repeated many times, 95% of such intervals would contain the true difference',
          '95% of participants had a difference in that range',
          'The result is not statistically significant'
        ],
        answer: 1,
        explanation:
          'The confidence statement is about the procedure across repeated sampling, not about ' +
          'this one interval. The true value is fixed; the interval is what varies. Option C ' +
          'confuses a confidence interval with a reference range.'
      },
      {
        question: 'p = 0.03 means:',
        options: [
          'There is a 3% probability the null hypothesis is true',
          'If the null were true, data at least this extreme would occur 3% of the time',
          'There is a 97% probability the finding is real',
          'The effect is small'
        ],
        answer: 1,
        explanation:
          'The p-value is computed assuming the null is true, so it cannot be the probability ' +
          'that the null is true. It is a statement about the data given a hypothesis, not about ' +
          'a hypothesis given the data.'
      },
      {
        question: 'A study of 50,000 people finds a mean difference of 0.4 mmHg with p < 0.001. The most sensible reading is:',
        options: [
          'A clinically important effect has been demonstrated',
          'The effect is statistically detectable but far too small to matter clinically',
          'The analysis must be wrong',
          'The sample was too small'
        ],
        answer: 1,
        explanation:
          'Large samples make trivial differences statistically significant. 0.4 mmHg is well ' +
          'inside measurement error and would change no decision. This is exactly why effect ' +
          'sizes must be reported alongside p-values.'
      },
      {
        question: 'Testing 20 independent hypotheses at the 5% level gives roughly what chance of at least one false positive?',
        options: ['5%', '20%', '64%', '95%'],
        answer: 2,
        explanation:
          '1 - 0.95^20 is about 0.64. Running many tests and reporting the significant ones is ' +
          'why pre-specifying a primary outcome, or adjusting for multiplicity, matters.'
      },
      {
        question: 'A trial with 30% power finds no significant difference. You should conclude:',
        options: [
          'The treatment does not work',
          'The study was too small to detect an effect of the size expected, so it is uninformative',
          'The null hypothesis is proven',
          'The p-value must be wrong'
        ],
        answer: 1,
        explanation:
          'With 30% power the study would miss a real effect 70% of the time. Absence of evidence ' +
          'here is not evidence of absence; the confidence interval will be wide and consistent ' +
          'with an important effect.'
      },
      {
        question: 'Reporting "p = 0.000" is poor practice because:',
        options: [
          'p-values cannot be reported to three decimals',
          'A p-value is never exactly zero; it should be written p < 0.001',
          'It implies the sample was too large',
          'SPSS never produces that output'
        ],
        answer: 1,
        explanation:
          'Software rounds a very small value to 0.000. The probability is small, not zero, so ' +
          'the correct notation is p < 0.001.'
      }
    ]
  },

  {
    id: 'unit-07',
    number: 7,
    title: 'Comparing Groups',
    duration: '180 minutes',
    summary:
      'Choosing the right test for your design, outcome and assumptions — ' +
      't-tests, ANOVA, chi-square and their non-parametric alternatives — and ' +
      'running them in SPSS and R.',
    objectives: [
      'Select a test from the design, the outcome type and the number of groups',
      'Check the assumptions each test relies on',
      'Distinguish paired from independent comparisons',
      'Run and interpret t-tests, ANOVA with post-hoc tests, and chi-square',
      'Choose a non-parametric alternative when assumptions fail',
      'Report a comparison completely: estimate, interval, test statistic and effect size'
    ],
    sections: [
      {
        heading: 'Choosing the test',
        points: [
          'Three questions settle it: what type is the outcome, how many groups, and are the groups independent or paired?',
          'Continuous outcome, two independent groups: independent samples t-test',
          'Continuous outcome, two paired measurements: paired t-test',
          'Continuous outcome, three or more independent groups: one-way ANOVA',
          'Categorical outcome, two or more groups: chi-square test of independence',
          'Small expected counts in a contingency table: Fisher\'s exact test',
          'Paired binary outcome: McNemar\'s test'
        ],
        table: {
          caption: 'Test selection',
          headers: ['Outcome', 'Groups', 'Parametric', 'Non-parametric'],
          rows: [
            ['Continuous', '2 independent', 'Independent t-test', 'Mann-Whitney U'],
            ['Continuous', '2 paired', 'Paired t-test', 'Wilcoxon signed-rank'],
            ['Continuous', '3+ independent', 'One-way ANOVA', 'Kruskal-Wallis'],
            ['Continuous', '3+ repeated', 'Repeated-measures ANOVA', 'Friedman'],
            ['Categorical', '2+ independent', 'Chi-square', "Fisher's exact"],
            ['Binary', '2 paired', "McNemar's test", '—']
          ]
        }
      },
      {
        heading: 'Assumptions, and what to do when they fail',
        points: [
          'Independence of observations — the one assumption no test survives losing, and no fix repairs after the fact',
          'Approximate normality of the outcome within groups; matters most in small samples',
          'Equal variances for the classic t-test — but Welch\'s t-test drops this and is a sensible default',
          'For chi-square, expected counts of at least 5 in most cells',
          'Judge normality from a histogram, not only a significance test',
          'When assumptions fail: transform the outcome, use a non-parametric test, or use a bootstrap',
          'Non-parametric tests compare distributions or ranks, not means, so interpret accordingly'
        ],
        note:
          'Clustered data — pupils within schools, patients within clinics, repeated ' +
          'visits per person — violate independence. A t-test on such data reports ' +
          'standard errors that are far too small. That needs a mixed model or a ' +
          'cluster-robust approach, not a different t-test.'
      },
      {
        heading: 'ANOVA and post-hoc tests',
        points: [
          'A significant ANOVA says the groups are not all equal; it does not say which differ',
          'Running every pairwise t-test afterwards without adjustment inflates the false positive rate',
          'Post-hoc tests control it: Tukey HSD for all pairwise comparisons, Dunnett when comparing several groups against one control',
          'Bonferroni is simple and conservative; it divides the significance level by the number of comparisons',
          'Two-way ANOVA tests two factors and their interaction — an interaction means the effect of one factor depends on the level of the other',
          'Interpret main effects with care in the presence of a significant interaction'
        ]
      },
      {
        heading: 'Running it',
        points: [
          'R, independent t-test: t.test(bp ~ group, data = dat) — Welch by default',
          'R, paired: t.test(before, after, paired = TRUE)',
          'R, ANOVA: fit <- aov(bp ~ group, data = dat); summary(fit); TukeyHSD(fit)',
          'R, chi-square: chisq.test(table(dat$group, dat$outcome))',
          'SPSS: Analyze > Compare Means > Independent-Samples T Test, or One-Way ANOVA with Post Hoc',
          'SPSS chi-square lives under Analyze > Descriptive Statistics > Crosstabs > Statistics',
          'In SPSS always read the Levene test row to decide which t-test line to quote'
        ]
      },
      {
        heading: 'Reporting a comparison',
        points: [
          'Give the group summaries first: mean (SD) or median (IQR) with n per group',
          'Give the estimated difference with its confidence interval — the interval is the finding',
          'Give the test statistic, degrees of freedom and exact p-value',
          'Give an effect size',
          'Example: "Mean systolic BP was 8.4 mmHg lower in the intervention group (95% CI 3.1 to 13.7; t(118) = 3.12, p = 0.002; d = 0.57)."',
          'Name the test used and state that its assumptions were checked'
        ]
      }
    ],
    keyTerms: [
      { term: "Welch's t-test", definition: 'A t-test that does not assume equal variances; a safe default for two independent groups.' },
      { term: 'Paired test', definition: 'A comparison of two measurements on the same units, analysing the within-pair differences.' },
      { term: 'Post-hoc test', definition: 'A follow-up comparison after a significant ANOVA, adjusted for multiple testing.' },
      { term: 'Interaction', definition: 'When the effect of one factor depends on the level of another.' },
      { term: "Fisher's exact test", definition: 'An exact test for a contingency table, used when expected counts are small.' },
      { term: "Cohen's d", definition: 'A standardised difference between two means, expressed in pooled standard deviations.' },
      { term: 'Clustering', definition: 'Non-independence arising when observations are grouped within units such as schools or clinics.' }
    ],
    activity:
      'For three research questions from your own study, write down: the outcome ' +
      'type, the number of groups, whether they are paired, and the test you would ' +
      'use. Then name the one assumption most likely to fail in each, and what you ' +
      'would do about it.',
    readings: [
      { label: 'Altman & Bland — "Parametric v non-parametric methods"', note: 'BMJ Statistics Notes, one page, settles most arguments.' },
      { label: 'Delacre, Lakens & Leys (2017) — "Why Psychologists Should by Default Use Welch\'s t-test"', note: 'The case for dropping the equal-variance assumption.' },
      { label: 'Field — Discovering Statistics Using IBM SPSS Statistics', note: 'Step-by-step SPSS with output interpretation.' }
    ],
    quiz: [
      {
        question: 'You measure anxiety in the same 40 patients before and after a programme. The appropriate test is:',
        options: ['Independent samples t-test', 'Paired t-test', 'One-way ANOVA', 'Chi-square'],
        answer: 1,
        explanation:
          'The two measurements come from the same people, so they are paired. A paired t-test ' +
          'analyses the within-person differences, which removes between-person variation and is ' +
          'more powerful than treating the groups as independent.'
      },
      {
        question: 'A one-way ANOVA across four groups gives p = 0.004. You may conclude:',
        options: [
          'All four groups differ from each other',
          'The groups are not all equal, but a post-hoc test is needed to say which differ',
          'Group 1 differs from group 4',
          'The largest and smallest means are significantly different'
        ],
        answer: 1,
        explanation:
          'ANOVA is an omnibus test. It rejects the hypothesis that all means are equal without ' +
          'identifying where the differences lie — that requires an adjusted post-hoc comparison ' +
          'such as Tukey.'
      },
      {
        question: 'A 2×2 table has expected counts of 3, 4, 12 and 15. The appropriate test is:',
        options: ['Chi-square', "Fisher's exact test", 'Independent t-test', 'Kruskal-Wallis'],
        answer: 1,
        explanation:
          "Chi-square relies on an approximation that becomes unreliable when expected counts fall " +
          "below about 5. Fisher's exact test computes the probability directly and has no such " +
          'requirement.'
      },
      {
        question: 'You analyse test scores from 600 pupils across 20 schools with an ordinary t-test. The main problem is that:',
        options: [
          'The sample is too large',
          'Pupils within a school are not independent, so standard errors will be too small',
          'Test scores cannot be compared',
          'A t-test cannot handle 600 observations'
        ],
        answer: 1,
        explanation:
          'Pupils in the same school share teachers, intake and environment. Ignoring that ' +
          'clustering treats correlated observations as independent, understating standard errors ' +
          'and overstating significance. A mixed model or cluster-robust errors are needed.'
      },
      {
        question: 'Levene\'s test in your SPSS output is significant. This tells you:',
        options: [
          'The data are not normally distributed',
          'The group variances differ, so the equal-variances-not-assumed (Welch) row should be read',
          'The result is not significant',
          'You must use a chi-square test'
        ],
        answer: 1,
        explanation:
          "Levene tests homogeneity of variance, not normality. When it is significant, quote the " +
          "Welch row. Many statisticians now recommend Welch's t-test as the default regardless."
      },
      {
        question: 'Which reported result is complete?',
        options: [
          'The difference was significant (p < 0.05).',
          'Mean BP was 8.4 mmHg lower in the intervention group (95% CI 3.1 to 13.7; t(118) = 3.12, p = 0.002; d = 0.57).',
          'There was a significant effect of the intervention on blood pressure.',
          'ANOVA showed p = 0.002.'
        ],
        answer: 1,
        explanation:
          'A complete report gives the estimate, its confidence interval, the test statistic with ' +
          'degrees of freedom, the exact p-value and an effect size. The others tell the reader ' +
          'almost nothing about magnitude or precision.'
      }
    ]
  }
];

export default unitsBInference;
