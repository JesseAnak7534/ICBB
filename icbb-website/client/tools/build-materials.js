#!/usr/bin/env node
/**
 * Generates course materials from the module content.
 *
 *   node tools/build-materials.js
 *
 * Produces, in public/materials/<course>/ :
 *   unit-NN-slides.html      one deck per unit, keyboard navigable
 *   unit-NN-handout.html     printable unit handout
 *   unit-NN-handout.pdf      the same, as PDF
 *   <course>-slides.html     every unit in one deck
 *   <course>-workbook.pdf    every unit in one printable workbook
 *   <course>-syllabus.pdf    outline, outcomes, assessment and rubric
 *
 * The content is read from src/content/, which is the same source the website
 * renders. Nothing here restates the curriculum, so the slides, the handouts
 * and the site can never disagree.
 *
 * PDFs are produced with headless Chrome. If Chrome cannot be found the HTML is
 * still written and the PDF step is skipped with a warning.
 */

const fs = require('fs');
const path = require('path');
const Module = require('module');
const { execFileSync } = require('child_process');
const babel = require('@babel/core');

const clientDir = path.resolve(__dirname, '..');
const contentDir = path.join(clientDir, 'src', 'content');
const outputRoot = path.join(clientDir, 'public', 'materials');

/* ------------------------------------------------------------------ setup -- */

// The content modules are ES modules written for webpack. Transform them on the
// fly so this plain Node script can require them without a separate build step.
const originalJsLoader = Module._extensions['.js'];
Module._extensions['.js'] = function loadMaybeEsm(mod, filename) {
  if (filename.startsWith(contentDir)) {
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

const pad = (n) => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ styles -- */

const brand = {
  blue: '#0066cc',
  blueDark: '#004d99',
  green: '#00a86b',
  ink: '#111827',
  body: '#374151',
  muted: '#6b7280',
  line: '#e5e7eb'
};

const printStyles = `
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    color: ${brand.body};
    line-height: 1.6;
    margin: 0;
    font-size: 11pt;
  }
  .sheet { max-width: 190mm; margin: 0 auto; padding: 0 0 12mm; }
  .doc-header {
    border-bottom: 3px solid ${brand.blue};
    padding-bottom: 8pt;
    margin-bottom: 16pt;
  }
  .doc-brand {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8pt;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${brand.blue};
    font-weight: bold;
  }
  h1 { font-size: 20pt; color: ${brand.ink}; margin: 4pt 0 2pt; line-height: 1.2; }
  h2 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13pt; color: ${brand.blueDark};
    margin: 18pt 0 6pt; padding-bottom: 3pt;
    border-bottom: 1px solid ${brand.line};
    page-break-after: avoid;
  }
  h3 { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: ${brand.ink}; margin: 12pt 0 4pt; page-break-after: avoid; }
  p { margin: 0 0 8pt; }
  ul, ol { margin: 0 0 10pt; padding-left: 18pt; }
  li { margin-bottom: 4pt; }
  .lede { color: ${brand.muted}; font-style: italic; margin-bottom: 12pt; }
  .meta { font-family: Arial, Helvetica, sans-serif; font-size: 9pt; color: ${brand.muted}; }
  .note {
    background: #f3f7fc; border-left: 3px solid ${brand.blue};
    padding: 8pt 10pt; margin: 10pt 0; page-break-inside: avoid;
  }
  .note strong {
    display: block; font-family: Arial, Helvetica, sans-serif;
    font-size: 8pt; text-transform: uppercase; letter-spacing: 0.08em;
    color: ${brand.blueDark}; margin-bottom: 3pt;
  }
  .activity {
    border: 1px dashed #9ca3af; padding: 8pt 10pt; margin: 10pt 0;
    background: #fafafa; page-break-inside: avoid;
  }
  table { width: 100%; border-collapse: collapse; margin: 10pt 0; font-size: 9.5pt; page-break-inside: avoid; }
  caption { caption-side: top; text-align: left; font-size: 8.5pt; color: ${brand.muted}; font-style: italic; padding-bottom: 4pt; }
  th, td { border: 1px solid ${brand.line}; padding: 5pt 6pt; text-align: left; vertical-align: top; }
  th { background: #f9fafb; font-family: Arial, Helvetica, sans-serif; font-size: 9pt; }
  dl { margin: 0; }
  dt { font-weight: bold; color: ${brand.ink}; margin-top: 7pt; }
  dd { margin: 1pt 0 0; }
  .answers { border-top: 1px solid ${brand.line}; margin-top: 14pt; padding-top: 8pt; font-size: 9.5pt; }
  .unit-break { page-break-before: always; }
  .footer-note { margin-top: 14pt; font-size: 8.5pt; color: ${brand.muted}; border-top: 1px solid ${brand.line}; padding-top: 6pt; }
`;

const slideStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Inter, Arial, sans-serif;
    background: #0f172a; color: #f8fafc;
    height: 100vh; overflow: hidden;
  }
  .slide {
    display: none; height: 100vh; padding: 6vh 8vw 10vh;
    flex-direction: column; justify-content: center;
  }
  .slide.active { display: flex; }
  .slide.title-slide {
    background: linear-gradient(135deg, ${brand.blue} 0%, ${brand.green} 100%);
    justify-content: center; text-align: left;
  }
  .kicker {
    font-size: 0.85rem; letter-spacing: 0.16em; text-transform: uppercase;
    color: #7dd3fc; margin-bottom: 1rem; font-weight: 700;
  }
  .title-slide .kicker { color: rgba(255,255,255,0.9); }
  h1 { font-size: clamp(1.8rem, 4.5vw, 3.4rem); line-height: 1.1; margin-bottom: 1rem; }
  h2 { font-size: clamp(1.4rem, 3vw, 2.3rem); line-height: 1.2; margin-bottom: 1.6rem; color: #fff; }
  .subtitle { font-size: clamp(1rem, 1.6vw, 1.3rem); opacity: 0.92; max-width: 55ch; line-height: 1.6; }
  ul { list-style: none; max-width: 60ch; }
  li {
    font-size: clamp(0.95rem, 1.5vw, 1.35rem); line-height: 1.5;
    margin-bottom: 1rem; padding-left: 1.6rem; position: relative;
  }
  li::before {
    content: ''; position: absolute; left: 0; top: 0.62em;
    width: 0.55rem; height: 0.55rem; border-radius: 50%;
    background: ${brand.green};
  }
  .note-slide {
    background: #1e293b; border-left: 5px solid ${brand.green};
    padding: 1.5rem 2rem; max-width: 70ch; border-radius: 0 8px 8px 0;
  }
  table { border-collapse: collapse; font-size: clamp(0.75rem, 1.1vw, 1rem); max-width: 100%; }
  th, td { border: 1px solid #334155; padding: 0.55rem 0.8rem; text-align: left; }
  th { background: #1e293b; }
  .progress {
    position: fixed; bottom: 0; left: 0; height: 4px;
    background: ${brand.green}; transition: width 0.2s ease;
  }
  .chrome {
    position: fixed; bottom: 1.2rem; right: 1.6rem;
    font-size: 0.8rem; color: #64748b; display: flex; gap: 1rem; align-items: center;
  }
  .chrome button {
    background: #1e293b; color: #e2e8f0; border: 1px solid #334155;
    border-radius: 4px; padding: 0.3rem 0.7rem; cursor: pointer; font: inherit;
  }
  .hint { position: fixed; bottom: 1.2rem; left: 1.6rem; font-size: 0.78rem; color: #475569; }
  @media print {
    body { background: #fff; color: #000; height: auto; overflow: visible; }
    .slide { display: flex !important; height: auto; min-height: 0; page-break-after: always; padding: 1.5cm; }
    .chrome, .progress, .hint { display: none; }
    h1, h2 { color: #000; }
    li::before { background: #000; }
  }
`;

/* ------------------------------------------------------------- generators -- */

const slideNav = `
<div class="progress" id="progress"></div>
<div class="hint">Arrow keys or space to navigate · P to print</div>
<div class="chrome">
  <button type="button" onclick="go(-1)">Prev</button>
  <span id="counter"></span>
  <button type="button" onclick="go(1)">Next</button>
</div>
<script>
  var slides = document.querySelectorAll('.slide');
  var current = 0;
  function show(i) {
    current = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, n) { s.classList.toggle('active', n === current); });
    document.getElementById('counter').textContent = (current + 1) + ' / ' + slides.length;
    document.getElementById('progress').style.width =
      ((current + 1) / slides.length * 100) + '%';
    if (location.hash !== '#' + (current + 1)) history.replaceState(null, '', '#' + (current + 1));
  }
  function go(step) { show(current + step); }
  document.addEventListener('keydown', function (e) {
    if (['ArrowRight', 'PageDown', ' '].indexOf(e.key) > -1) { e.preventDefault(); go(1); }
    if (['ArrowLeft', 'PageUp'].indexOf(e.key) > -1) { e.preventDefault(); go(-1); }
    if (e.key === 'Home') show(0);
    if (e.key === 'End') show(slides.length - 1);
    if (e.key === 'p' || e.key === 'P') window.print();
  });
  show(parseInt((location.hash || '#1').slice(1), 10) - 1 || 0);
</script>`;

const slideDoc = (title, slidesHtml) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)}</title>
<style>${slideStyles}</style>
</head><body>
${slidesHtml}
${slideNav}
</body></html>`;

const tableHtml = (table) => `
<table>
  <caption>${escape(table.caption)}</caption>
  <thead><tr>${table.headers.map((h) => `<th>${escape(h)}</th>`).join('')}</tr></thead>
  <tbody>${table.rows
    .map((row) => `<tr>${row.map((c) => `<td>${escape(c)}</td>`).join('')}</tr>`)
    .join('')}</tbody>
</table>`;

/** Slides for one unit: title, objectives, one per section, key terms, activity. */
const unitSlides = (unit, module) => {
  const slides = [];

  slides.push(`
<section class="slide title-slide">
  <div class="kicker">${escape(module.code)} · Unit ${unit.number} of ${module.units.length}</div>
  <h1>${escape(unit.title)}</h1>
  <p class="subtitle">${escape(unit.summary)}</p>
</section>`);

  slides.push(`
<section class="slide">
  <div class="kicker">Unit ${unit.number}</div>
  <h2>Learning objectives</h2>
  <ul>${unit.objectives.map((o) => `<li>${escape(o)}</li>`).join('')}</ul>
</section>`);

  unit.sections.forEach((section) => {
    // Long bullet lists are split so nothing runs off the bottom of a slide.
    const chunks = [];
    for (let i = 0; i < section.points.length; i += 5) {
      chunks.push(section.points.slice(i, i + 5));
    }

    chunks.forEach((chunk, chunkIndex) => {
      slides.push(`
<section class="slide">
  <div class="kicker">Unit ${unit.number}</div>
  <h2>${escape(section.heading)}${chunks.length > 1 ? ` (${chunkIndex + 1}/${chunks.length})` : ''}</h2>
  <ul>${chunk.map((p) => `<li>${escape(p)}</li>`).join('')}</ul>
</section>`);
    });

    if (section.table) {
      slides.push(`
<section class="slide">
  <div class="kicker">Unit ${unit.number}</div>
  <h2>${escape(section.table.caption)}</h2>
  ${tableHtml(section.table)}
</section>`);
    }

    if (section.note) {
      slides.push(`
<section class="slide">
  <div class="kicker">In practice</div>
  <div class="note-slide"><p class="subtitle">${escape(section.note)}</p></div>
</section>`);
    }
  });

  slides.push(`
<section class="slide">
  <div class="kicker">Unit ${unit.number}</div>
  <h2>Key terms</h2>
  <ul>${unit.keyTerms
    .map((t) => `<li><strong>${escape(t.term)}</strong> — ${escape(t.definition)}</li>`)
    .join('')}</ul>
</section>`);

  slides.push(`
<section class="slide">
  <div class="kicker">Over to you</div>
  <h2>Activity</h2>
  <p class="subtitle">${escape(unit.activity)}</p>
</section>`);

  return slides.join('\n');
};

/** Printable handout for one unit. */
const unitHandout = (unit, module, { includeHeader = true } = {}) => `
<div class="sheet${includeHeader ? '' : ' unit-break'}">
  <div class="doc-header">
    <div class="doc-brand">${escape(module.code)} · Unit ${unit.number} of ${module.units.length}</div>
    <h1>${escape(unit.title)}</h1>
    <div class="meta">${escape(unit.duration)} · ${unit.quiz.length} self-check questions</div>
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

  <h2>Key terms</h2>
  <dl>${unit.keyTerms
    .map((t) => `<dt>${escape(t.term)}</dt><dd>${escape(t.definition)}</dd>`)
    .join('')}</dl>

  <h2>Activity</h2>
  <div class="activity"><p>${escape(unit.activity)}</p></div>

  <h2>Further reading</h2>
  <ul>${unit.readings
    .map((r) => `<li><strong>${escape(r.label)}</strong> — ${escape(r.note)}</li>`)
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
    ${escape(module.title)} · ${escape(module.code)} · Institute of Computational
    Biology and Bioinformatics (ICBB)
  </div>
</div>`;

const printDoc = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${escape(title)}</title>
<style>${printStyles}</style>
</head><body>${body}</body></html>`;

const syllabusHtml = (module) => `
<div class="sheet">
  <div class="doc-header">
    <div class="doc-brand">${escape(module.code)} · Syllabus</div>
    <h1>${escape(module.title)}</h1>
    <div class="meta">${escape(module.subtitle)} · ${module.units.length} units ·
      ${module.contactHours} contact hours · ${escape(module.level)}</div>
  </div>

  <h2>About this module</h2>
  <p>${escape(module.overview)}</p>

  <h2>Who it is for</h2>
  <ul>${module.audience.map((a) => `<li>${escape(a)}</li>`).join('')}</ul>

  <h2>Prerequisites</h2>
  <ul>${module.prerequisites.map((p) => `<li>${escape(p)}</li>`).join('')}</ul>

  <h2>Learning outcomes</h2>
  <ul>${module.outcomes.map((o) => `<li>${escape(o)}</li>`).join('')}</ul>

  <h2>Schedule of units</h2>
  <table>
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

  <h3>Final proposal marking rubric</h3>
  <table>
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

  <div class="footer-note">
    Institute of Computational Biology and Bioinformatics (ICBB) · icbb-gh.com
  </div>
</div>`;

/* ------------------------------------------------------------------- build -- */

const writeFile = (dir, name, contents) => {
  fs.writeFileSync(path.join(dir, name), contents, 'utf8');
  return name;
};

const toPdf = (htmlPath, pdfPath) => {
  if (!chromePath) return false;
  try {
    execFileSync(
      chromePath,
      [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--no-pdf-header-footer',
        `--print-to-pdf=${pdfPath}`,
        `file:///${htmlPath.replace(/\\/g, '/')}`
      ],
      { stdio: 'pipe', timeout: 120000 }
    );
    return fs.existsSync(pdfPath);
  } catch (error) {
    console.warn(`  ! PDF failed for ${path.basename(htmlPath)}: ${error.message}`);
    return false;
  }
};

const buildModule = (module, folder) => {
  const outDir = path.join(outputRoot, folder);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`\n${module.code} — ${module.title}`);
  console.log(`  output: public/materials/${folder}`);

  const written = [];

  // Per-unit slides and handouts
  module.units.forEach((unit) => {
    written.push(
      writeFile(outDir, `${unit.id}-slides.html`, slideDoc(`${module.code} — Unit ${unit.number}: ${unit.title}`, unitSlides(unit, module)))
    );

    const handoutName = `${unit.id}-handout.html`;
    writeFile(
      outDir,
      handoutName,
      printDoc(`${module.code} — Unit ${unit.number} handout`, unitHandout(unit, module))
    );
    written.push(handoutName);

    if (toPdf(path.join(outDir, handoutName), path.join(outDir, `${unit.id}-handout.pdf`))) {
      written.push(`${unit.id}-handout.pdf`);
    }
  });

  // Combined deck
  const allSlides = module.units.map((unit) => unitSlides(unit, module)).join('\n');
  written.push(
    writeFile(outDir, `${folder}-slides.html`, slideDoc(`${module.code} — complete slide deck`, allSlides))
  );

  // Complete workbook
  const workbookBody = module.units
    .map((unit, i) => unitHandout(unit, module, { includeHeader: i === 0 }))
    .join('\n');
  writeFile(outDir, `${folder}-workbook.html`, printDoc(`${module.title} — workbook`, workbookBody));
  written.push(`${folder}-workbook.html`);
  if (toPdf(path.join(outDir, `${folder}-workbook.html`), path.join(outDir, `${folder}-workbook.pdf`))) {
    written.push(`${folder}-workbook.pdf`);
  }

  // Syllabus
  writeFile(outDir, `${folder}-syllabus.html`, printDoc(`${module.title} — syllabus`, syllabusHtml(module)));
  written.push(`${folder}-syllabus.html`);
  if (toPdf(path.join(outDir, `${folder}-syllabus.html`), path.join(outDir, `${folder}-syllabus.pdf`))) {
    written.push(`${folder}-syllabus.pdf`);
  }

  console.log(`  ${written.length} files written`);
  return written;
};

const main = () => {
  if (!chromePath) {
    console.warn('! Chrome not found — HTML will be written but PDFs skipped.');
    console.warn('  Set CHROME_PATH to generate PDFs.');
  }

  const { default: modulesByCourse, materialsFolderByCourse } = require(
    path.join(contentDir, 'modules.js')
  );

  let total = 0;
  Object.entries(modulesByCourse).forEach(([courseId, module]) => {
    const folder = materialsFolderByCourse[courseId] || courseId;
    total += buildModule(module, folder).length;
  });

  console.log(`\nDone. ${total} files in public/materials/.\n`);
};

main();
