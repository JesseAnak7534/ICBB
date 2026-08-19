#!/usr/bin/env node
/**
 * Generates course materials from the module content.
 *
 *   node tools/build-materials.js
 *
 * Produces, in materials/<course>/ :
 *   unit-NN-slides.pptx      one PowerPoint deck per unit
 *   unit-NN-handout.pdf      printable unit handout
 *   <course>-slides.pptx     every unit in one deck
 *   <course>-workbook.pdf    every unit in one document
 *   <course>-syllabus.pdf    outline, outcomes, assessment and rubric
 *
 * Only .pptx and .pdf are shipped. The HTML used to lay the PDFs out is an
 * intermediate and goes to a scratch directory, not into materials/.
 *
 * The content is read from src/content/, the same source the website renders,
 * so the site, the slides and the handouts cannot disagree.
 *
 * PDFs are rendered by headless Chrome. Without Chrome the run stops rather
 * than quietly shipping a folder with no PDFs in it.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const Module = require('module');
const { execFileSync } = require('child_process');
const babel = require('@babel/core');
const { buildPptx, AUTHOR, ORG } = require('./build-pptx');

const clientDir = path.resolve(__dirname, '..');
const contentDir = path.join(clientDir, 'src', 'content');
const outputRoot = path.join(clientDir, '..', 'materials');
const serverDataDir = path.join(clientDir, '..', 'server', 'data');
const scratchDir = path.join(os.tmpdir(), 'icbb-materials-build');

const logoPath = path.join(clientDir, '..', '..', 'icbb_logo-removebg-preview.png');
const logoDataUri = fs.existsSync(logoPath)
  ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`
  : null;

/* ------------------------------------------------------------------ setup -- */

// The content modules are ES modules written for webpack. Transform them on the
// fly so this plain Node script can require them without a separate build step.
const originalJsLoader = Module._extensions['.js'];
Module._extensions['.js'] = function loadMaybeEsm(mod, filename) {
  if (filename.startsWith(contentDir) || filename.endsWith(path.join('src', 'data', 'courses.js'))) {
    const { code } = babel.transformFileSync(filename, {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
      babelrc: false,
      configFile: false
    });
    return mod._compile(code, filename);
  }
  return originalJsLoader(mod, filename);
};

const findChrome = () => {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
};

const chromePath = findChrome();

const escape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------------------------------------------ style -- */

/**
 * Ink and bronze on paper, matching the decks.
 *
 * Constantia carries the reading text and headings; Corbel carries the utility
 * layer — labels, table headings, the running foot. Both are locally installed,
 * so the build is reproducible and the PDFs match the decks exactly.
 */
const brand = {
  ink: '#1C3140',
  text: '#23282E',
  soft: '#5F6B76',
  bronze: '#9A6A3C',
  line: '#D8D3CB',
  panel: '#F6F4F0'
};

// No web fonts.
//
// Google Fonts proved unreliable here — only a family already in Chrome's cache
// rendered, so the same source produced different PDFs on different runs. These
// faces ship with Windows and Microsoft Office, are embedded into the PDF at
// render time, and are the same pair the PowerPoint decks use, so the handouts
// and the slides read as one set of materials.
const FONT_SERIF = "Constantia, 'Palatino Linotype', Georgia, serif";
const FONT_SANS = "Corbel, Candara, 'Segoe UI', sans-serif";
const FONT_LINK = '';

const printStyles = `
  @page { size: A4; margin: 20mm 19mm 18mm; }

  * { box-sizing: border-box; }

  body {
    font-family: ${FONT_SERIF};
    color: ${brand.text};
    line-height: 1.62;
    margin: 0;
    font-size: 10.6pt;
    -webkit-font-smoothing: antialiased;
  }

  .sheet { position: relative; z-index: 1; padding-bottom: 10mm; }

  /* ------------------------------------------------------------ masthead -- */
  .doc-header { margin-bottom: 16pt; }

  .doc-brand {
    font-family: ${FONT_SANS};
    font-size: 7.8pt;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${brand.bronze};
    margin-bottom: 5pt;
  }

  h1 {
    font-family: ${FONT_SERIF};
    font-weight: 600;
    font-size: 21pt;
    line-height: 1.16;
    color: ${brand.ink};
    margin: 0 0 6pt;
    letter-spacing: -0.005em;
  }

  .doc-rule {
    width: 34pt; height: 1.6pt;
    background: ${brand.bronze};
    margin: 9pt 0 10pt;
  }

  .meta, .byline {
    font-family: ${FONT_SANS};
    font-size: 8.4pt;
    color: ${brand.soft};
  }
  .byline { margin-top: 2pt; }
  .byline strong { color: ${brand.ink}; font-weight: 600; }

  .lede {
    font-size: 11.6pt;
    font-style: italic;
    color: ${brand.soft};
    line-height: 1.55;
    margin: 12pt 0 16pt;
  }

  /* ------------------------------------------------------------ headings -- */
  h2 {
    font-family: ${FONT_SERIF};
    font-weight: 600;
    font-size: 13.4pt;
    color: ${brand.ink};
    margin: 20pt 0 7pt;
    padding-top: 7pt;
    border-top: 0.6pt solid ${brand.line};
    page-break-after: avoid;
  }

  h3 {
    font-family: ${FONT_SANS};
    font-weight: 600;
    font-size: 10pt;
    color: ${brand.ink};
    margin: 13pt 0 5pt;
    page-break-after: avoid;
  }

  p { margin: 0 0 8pt; }

  ul, ol { margin: 0 0 10pt; padding-left: 15pt; }
  li { margin-bottom: 4.5pt; padding-left: 2pt; }
  li::marker { color: ${brand.bronze}; }

  /* --------------------------------------------------------------- notes -- */
  .note {
    background: ${brand.panel};
    border-left: 2pt solid ${brand.bronze};
    padding: 9pt 11pt;
    margin: 11pt 0;
    page-break-inside: avoid;
  }
  .note strong {
    display: block;
    font-family: ${FONT_SANS};
    font-size: 7.6pt; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.14em;
    color: ${brand.bronze};
    margin-bottom: 3pt;
  }
  .note p { margin: 0; font-style: italic; color: ${brand.ink}; }

  .activity {
    border: 0.6pt solid ${brand.line};
    border-top: 2pt solid ${brand.ink};
    padding: 10pt 12pt;
    margin: 11pt 0;
    page-break-inside: avoid;
  }
  .activity p { margin: 0; }

  /* ------------------------------------------------------------ examples -- */
  .example {
    border: 0.6pt solid ${brand.line};
    padding: 11pt 13pt;
    margin: 12pt 0;
    page-break-inside: avoid;
  }
  .example h3 { margin-top: 0; color: ${brand.ink}; font-size: 10.4pt; }
  .example-scenario { font-style: italic; color: ${brand.soft}; margin-bottom: 7pt; }
  .example ol { margin-bottom: 0; }
  .example-lesson {
    margin: 9pt 0 0; padding-top: 7pt;
    border-top: 0.6pt solid ${brand.line};
    font-size: 9.6pt;
  }
  .example-lesson strong {
    font-family: ${FONT_SANS};
    font-size: 8pt; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: ${brand.bronze};
  }

  /* -------------------------------------------------------------- tables -- */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 11pt 0;
    font-family: ${FONT_SANS};
    font-size: 8.8pt;
    page-break-inside: avoid;
  }
  caption {
    caption-side: top; text-align: left;
    font-family: ${FONT_SANS};
    font-size: 7.8pt; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.12em;
    color: ${brand.bronze};
    padding-bottom: 5pt;
  }
  th, td {
    padding: 6pt 7pt; text-align: left; vertical-align: top;
    border-bottom: 0.5pt solid ${brand.line};
    line-height: 1.45;
  }
  thead th {
    color: ${brand.ink}; font-weight: 600;
    border-bottom: 1pt solid ${brand.ink};
  }
  tbody tr:last-child td { border-bottom: 0.8pt solid ${brand.line}; }

  /* ------------------------------------------------------------ glossary -- */
  dl { margin: 0; }
  dt {
    font-family: ${FONT_SANS};
    font-weight: 600; font-size: 9.4pt;
    color: ${brand.ink}; margin-top: 8pt;
  }
  dd { margin: 1pt 0 0; }

  .answers {
    border-top: 0.6pt solid ${brand.line};
    margin-top: 15pt; padding-top: 9pt;
    font-size: 9.6pt;
  }

  .unit-break { page-break-before: always; }

  .footer-note {
    margin-top: 16pt; padding-top: 7pt;
    border-top: 0.6pt solid ${brand.line};
    font-family: ${FONT_SANS};
    font-size: 7.8pt;
    color: ${brand.soft};
  }

  /* ----------------------------------------------------------- furniture -- */
  /* position: fixed repeats on every printed page in Chrome, which is what
     puts the mark and the running foot on all pages of a long workbook. */
  .watermark {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-27deg);
    width: 112mm;
    opacity: 0.05;
    z-index: 0;
  }
  .page-mark {
    position: fixed;
    bottom: 5mm; left: 0; right: 0;
    text-align: center;
    font-family: ${FONT_SANS};
    font-size: 7pt;
    letter-spacing: 0.08em;
    color: #A9A29A;
  }
`;

/* ------------------------------------------------------------- documents -- */

const tableHtml = (table) => `
<table>
  <caption>${escape(table.caption)}</caption>
  <thead><tr>${table.headers.map((h) => `<th>${escape(h)}</th>`).join('')}</tr></thead>
  <tbody>${table.rows
    .map((row) => `<tr>${row.map((c) => `<td>${escape(c)}</td>`).join('')}</tr>`)
    .join('')}</tbody>
</table>`;

const unitHandout = (unit, module, { first = true } = {}) => `
<div class="sheet${first ? '' : ' unit-break'}">
  <div class="doc-header">
    <div class="doc-brand">${escape(module.code)} &middot; Unit ${unit.number} of ${module.units.length}</div>
    <h1>${escape(unit.title)}</h1>
    <div class="doc-rule"></div>
    <div class="meta">${escape(unit.duration)} &middot; ${unit.quiz.length} self-check questions</div>
    <div class="byline"><strong>${escape(AUTHOR)}</strong> &middot; ${escape(ORG)}</div>
  </div>

  <p class="lede">${escape(unit.summary)}</p>

  <h2>Learning objectives</h2>
  <ul>${unit.objectives.map((o) => `<li>${escape(o)}</li>`).join('')}</ul>

  ${unit.sections
    .map(
      (section) => `
  <h2>${escape(section.heading)}</h2>
  <ul>${section.points.map((p) => `<li>${escape(p)}</li>`).join('')}</ul>
  ${section.table ? tableHtml(section.table) : ''}
  ${section.note ? `<div class="note"><strong>In practice</strong><p>${escape(section.note)}</p></div>` : ''}`
    )
    .join('')}

  ${(unit.examples || []).length ? `
  <h2>Worked examples</h2>
  ${unit.examples
    .map(
      (example) => `
  <div class="example">
    <h3>${escape(example.title)}</h3>
    <p class="example-scenario">${escape(example.scenario)}</p>
    <ol>${example.steps.map((step) => `<li>${escape(step)}</li>`).join('')}</ol>
    ${example.lesson ? `<p class="example-lesson"><strong>The point</strong><br>${escape(example.lesson)}</p>` : ''}
  </div>`
    )
    .join('')}` : ''}

  <h2>Key terms</h2>
  <dl>${unit.keyTerms
    .map((t) => `<dt>${escape(t.term)}</dt><dd>${escape(t.definition)}</dd>`)
    .join('')}</dl>

  <h2>Activity</h2>
  <div class="activity"><p>${escape(unit.activity)}</p></div>

  <h2>Further reading</h2>
  <ul>${unit.readings
    .map((r) => `<li><strong>${escape(r.label)}</strong> &mdash; ${escape(r.note)}</li>`)
    .join('')}</ul>

  <h2>Self-check questions</h2>
  <ol>${unit.quiz
    .map(
      (q) => `<li><p>${escape(q.question)}</p><ol type="a">${q.options
        .map((o) => `<li>${escape(o)}</li>`)
        .join('')}</ol></li>`
    )
    .join('')}</ol>

  <div class="answers">
    <h3>Answers</h3>
    <ol>${unit.quiz
      .map(
        (q) =>
          `<li><strong>${String.fromCharCode(97 + q.answer)}.</strong> ${escape(q.explanation)}</li>`
      )
      .join('')}</ol>
  </div>

  <div class="footer-note">
    ${escape(module.title)} &middot; ${escape(module.code)} &middot; ${escape(ORG)}
  </div>
</div>`;

const printDoc = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${escape(title)}</title>
<meta name="author" content="${escape(AUTHOR)}">
<meta name="copyright" content="${escape(ORG)}">
${FONT_LINK}
<style>${printStyles}</style>
</head><body>
${logoDataUri ? `<img class="watermark" src="${logoDataUri}" alt="">` : ''}
<div class="page-mark">${escape(ORG)} &middot; ${escape(AUTHOR)} &middot; icbb-gh.com</div>
${body}
</body></html>`;

const syllabusHtml = (module) => `
<div class="sheet">
  <div class="doc-header">
    <div class="doc-brand">${escape(module.code)} &middot; Syllabus</div>
    <h1>${escape(module.title)}</h1>
    <div class="doc-rule"></div>
    <div class="meta">${escape(module.subtitle)} &middot; ${module.units.length} units &middot;
      ${module.contactHours} contact hours &middot; ${escape(module.level)}</div>
    <div class="byline"><strong>${escape(AUTHOR)}</strong> &middot; ${escape(ORG)}</div>
  </div>

  <p class="lede">${escape(module.overview)}</p>

  <h2>Who it is for</h2>
  <ul>${module.audience.map((a) => `<li>${escape(a)}</li>`).join('')}</ul>

  <h2>Prerequisites</h2>
  <ul>${module.prerequisites.map((p) => `<li>${escape(p)}</li>`).join('')}</ul>

  <h2>Learning outcomes</h2>
  <ul>${module.outcomes.map((o) => `<li>${escape(o)}</li>`).join('')}</ul>

  <h2>Schedule of units</h2>
  <table>
    <caption>Ten units</caption>
    <thead><tr><th>#</th><th>Unit</th><th>Duration</th><th>Focus</th></tr></thead>
    <tbody>${module.units
      .map(
        (u) =>
          `<tr><td>${u.number}</td><td>${escape(u.title)}</td><td>${escape(
            u.duration
          )}</td><td>${escape(u.summary)}</td></tr>`
      )
      .join('')}</tbody>
  </table>

  <h2>Assessment</h2>
  <p>${escape(module.assessment.summary)}</p>
  <table>
    <caption>Components</caption>
    <thead><tr><th>Component</th><th>Weight</th><th>Detail</th></tr></thead>
    <tbody>${module.assessment.components
      .map(
        (c) =>
          `<tr><td>${escape(c.name)}</td><td>${escape(c.weight)}</td><td>${escape(
            c.detail
          )}</td></tr>`
      )
      .join('')}</tbody>
  </table>

  <table>
    <caption>Final proposal marking rubric</caption>
    <thead><tr><th>Criterion</th><th>Weight</th><th>What earns the marks</th></tr></thead>
    <tbody>${module.assessment.rubric
      .map(
        (r) =>
          `<tr><td>${escape(r.criterion)}</td><td>${r.weight}%</td><td>${escape(
            r.descriptor
          )}</td></tr>`
      )
      .join('')}</tbody>
  </table>
  <p><strong>Pass mark:</strong> ${module.assessment.passMark}% overall.</p>

  <h2>Certificate</h2>
  <p>${escape(module.certificate)}</p>

  <div class="footer-note">${escape(ORG)} &middot; icbb-gh.com</div>
</div>`;

/* -------------------------------------------------------------- generated -- */

const writeCoursePrices = () => {
  fs.mkdirSync(serverDataDir, { recursive: true });
  const { PRICES, CURRENCY } = require(path.join(clientDir, 'src', 'data', 'courses.js'));

  fs.writeFileSync(
    path.join(serverDataDir, 'course-prices.json'),
    JSON.stringify(
      {
        generated: 'by client/tools/build-materials.js — do not edit by hand',
        currency: CURRENCY,
        prices: PRICES
      },
      null, 2
    ),
    'utf8'
  );
  console.log(`Prices: ${Object.keys(PRICES).length} courses -> server/data/course-prices.json`);
};

const writeQuizKeys = (modulesByCourse) => {
  fs.mkdirSync(serverDataDir, { recursive: true });

  const courses = {};
  let questionCount = 0;

  Object.entries(modulesByCourse).forEach(([courseId, module]) => {
    const units = {};
    module.units.forEach((unit) => {
      units[unit.id] = { title: unit.title, answers: unit.quiz.map((q) => q.answer) };
      questionCount += unit.quiz.length;
    });
    courses[courseId] = {
      code: module.code,
      title: module.title,
      passMark: module.assessment.passMark,
      units
    };
  });

  fs.writeFileSync(
    path.join(serverDataDir, 'quiz-keys.json'),
    JSON.stringify(
      { generated: 'by client/tools/build-materials.js — do not edit by hand', courses },
      null, 2
    ),
    'utf8'
  );
  console.log(`Answer key: ${questionCount} questions -> server/data/quiz-keys.json`);
};

/* ------------------------------------------------------------------ build -- */

const toPdf = (htmlPath, pdfPath) => {
  execFileSync(
    chromePath,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      // Enough for layout to settle; there are no network fetches to wait on.
      '--virtual-time-budget=3000',
      `--print-to-pdf=${pdfPath}`,
      `file:///${htmlPath.replace(/\\/g, '/')}`
    ],
    { stdio: 'pipe', timeout: 180000 }
  );

  if (!fs.existsSync(pdfPath)) {
    throw new Error(`Chrome produced no PDF for ${path.basename(htmlPath)}`);
  }
  return path.basename(pdfPath);
};

/** Lay the HTML out in scratch, render the PDF into the shipped folder. */
const renderPdf = (name, title, body, outDir) => {
  const htmlPath = path.join(scratchDir, `${name}.html`);
  fs.writeFileSync(htmlPath, printDoc(title, body), 'utf8');
  return toPdf(htmlPath, path.join(outDir, `${name}.pdf`));
};

const buildModule = async (module, folder) => {
  const outDir = path.join(outputRoot, folder);
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(scratchDir, { recursive: true });

  console.log(`\n${module.code} — ${module.title}`);

  const written = [];

  module.units.forEach((unit) => {
    written.push(
      renderPdf(
        `${unit.id}-handout`,
        `${module.code} — Unit ${unit.number} handout`,
        unitHandout(unit, module),
        outDir
      )
    );
  });
  console.log(`  ${written.length} unit handouts (PDF)`);

  written.push(
    renderPdf(
      `${folder}-workbook`,
      `${module.title} — workbook`,
      module.units.map((unit, i) => unitHandout(unit, module, { first: i === 0 })).join('\n'),
      outDir
    )
  );

  written.push(
    renderPdf(`${folder}-syllabus`, `${module.title} — syllabus`, syllabusHtml(module), outDir)
  );
  console.log('  workbook + syllabus (PDF)');

  const decks = await buildPptx(module, outDir, folder, logoPath);
  written.push(...decks);
  console.log(`  ${decks.length} PowerPoint decks`);

  return written;
};

/** Drop anything the generator no longer ships, so the folder stays clean. */
const pruneStaleOutputs = () => {
  if (!fs.existsSync(outputRoot)) return 0;

  let removed = 0;
  fs.readdirSync(outputRoot).forEach((folder) => {
    const dir = path.join(outputRoot, folder);
    if (!fs.statSync(dir).isDirectory()) return;

    fs.readdirSync(dir).forEach((file) => {
      if (!['.pdf', '.pptx'].includes(path.extname(file).toLowerCase())) {
        fs.unlinkSync(path.join(dir, file));
        removed++;
      }
    });
  });

  if (removed) {
    console.log(`Removed ${removed} file(s) no longer shipped (HTML intermediates).`);
  }
  return removed;
};

const main = async () => {
  if (!chromePath) {
    console.error('Chrome not found — cannot render PDFs. Set CHROME_PATH and retry.');
    process.exit(1);
  }

  const { default: modulesByCourse, materialsFolderByCourse } = require(
    path.join(contentDir, 'modules.js')
  );

  writeQuizKeys(modulesByCourse);
  writeCoursePrices();
  pruneStaleOutputs();

  let total = 0;
  for (const [courseId, module] of Object.entries(modulesByCourse)) {
    const folder = materialsFolderByCourse[courseId] || courseId;
    total += (await buildModule(module, folder)).length;
  }

  console.log(`\nDone. ${total} files in materials/ (.pptx and .pdf only).\n`);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
