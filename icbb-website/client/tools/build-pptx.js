/**
 * Builds real PowerPoint decks (.pptx) from the module content.
 *
 * Text is written as native PowerPoint bullet paragraphs, not drawn shapes, so
 * the decks open in PowerPoint, Google Slides, Keynote and LibreOffice and stay
 * fully editable — every bullet can be retyped, restyled or reordered.
 *
 * Called by build-materials.js; not run on its own.
 */

const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const AUTHOR = 'Jesse Anak';
const ORG = 'Institute of Computational Biology and Bioinformatics (ICBB)';

const COLOR = {
  blue: '0066CC',
  blueDark: '004D99',
  green: '00A86B',
  ink: '111827',
  body: '374151',
  muted: '6B7280',
  light: 'F9FAFB',
  white: 'FFFFFF'
};

/* --------------------------------------------------------------- helpers -- */

/**
 * A slide's worth of bullets. PowerPoint has no reflow, so anything longer than
 * this runs off the bottom of the slide instead of wrapping onto a new one.
 */
const MAX_BULLETS_PER_SLIDE = 5;
const MAX_CHARS_PER_SLIDE = 480;

const chunkBullets = (points) => {
  const chunks = [];
  let current = [];
  let chars = 0;

  points.forEach((point) => {
    const wouldOverflow =
      current.length >= MAX_BULLETS_PER_SLIDE ||
      (current.length > 0 && chars + point.length > MAX_CHARS_PER_SLIDE);

    if (wouldOverflow) {
      chunks.push(current);
      current = [];
      chars = 0;
    }

    current.push(point);
    chars += point.length;
  });

  if (current.length) chunks.push(current);
  return chunks;
};

/** Long bullets get a smaller face so they still fit the text box. */
const bulletFontSize = (points) => {
  const longest = points.reduce((max, p) => Math.max(max, p.length), 0);
  if (longest > 150) return 13;
  if (longest > 110) return 15;
  if (longest > 80) return 17;
  return 18;
};

const buildDeck = (logoBase64) => {
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
  pptx.author = AUTHOR;
  pptx.company = ORG;

  /**
   * Master slides carry the watermark and footer, so every slide gets them
   * without repeating the code — and so they sit behind the content rather
   * than over it.
   */
  const watermark = logoBase64
    ? [{
        image: {
          data: logoBase64,
          x: 7.55, y: 4.35, w: 2.1, h: 1.4,
          transparency: 82
        }
      }]
    : [];

  pptx.defineSlideMaster({
    title: 'ICBB_CONTENT',
    background: { color: COLOR.white },
    objects: [
      // Accent bar down the left edge.
      { rect: { x: 0, y: 0, w: 0.13, h: 5.63, fill: { color: COLOR.blue } } },
      ...watermark
    ],
    slideNumber: { x: 9.3, y: 5.15, color: COLOR.muted, fontSize: 10 }
  });

  pptx.defineSlideMaster({
    title: 'ICBB_TITLE',
    background: { color: COLOR.blueDark },
    objects: [
      { rect: { x: 0, y: 4.95, w: 10, h: 0.68, fill: { color: COLOR.green } } },
      ...(logoBase64
        ? [{ image: { data: logoBase64, x: 8.15, y: 0.42, w: 1.5, h: 1.0, transparency: 25 } }]
        : [])
    ]
  });

  return pptx;
};

/* ---------------------------------------------------------------- slides -- */

const addTitleSlide = (pptx, unit, module) => {
  const slide = pptx.addSlide({ masterName: 'ICBB_TITLE' });

  slide.addText(`${module.code}  ·  UNIT ${unit.number} OF ${module.units.length}`, {
    x: 0.6, y: 1.1, w: 7.3, h: 0.3,
    fontSize: 12, bold: true, color: COLOR.green, charSpacing: 2
  });

  slide.addText(unit.title, {
    x: 0.6, y: 1.5, w: 7.4, h: 1.5,
    fontSize: 34, bold: true, color: COLOR.white, valign: 'top'
  });

  slide.addText(unit.summary, {
    x: 0.6, y: 3.05, w: 7.4, h: 1.3,
    fontSize: 14, color: 'DCE7F5', valign: 'top', lineSpacingMultiple: 1.2
  });

  slide.addText(`${AUTHOR}  ·  ICBB`, {
    x: 0.6, y: 5.08, w: 6, h: 0.4,
    fontSize: 12, bold: true, color: COLOR.white
  });

  slide.addNotes(
    `Unit ${unit.number}: ${unit.title}\n\nDuration: ${unit.duration}\n\n` +
    `Objectives:\n${unit.objectives.map((o) => `- ${o}`).join('\n')}`
  );
};

const addBulletSlide = (pptx, { heading, kicker, points, notes }) => {
  const slide = pptx.addSlide({ masterName: 'ICBB_CONTENT' });

  slide.addText(kicker, {
    x: 0.55, y: 0.32, w: 8.8, h: 0.25,
    fontSize: 11, bold: true, color: COLOR.blue, charSpacing: 1.5
  });

  slide.addText(heading, {
    x: 0.55, y: 0.6, w: 8.8, h: 0.7,
    fontSize: 24, bold: true, color: COLOR.ink, valign: 'top'
  });

  // Native PowerPoint bullets: one paragraph per point, bullet: true.
  slide.addText(
    points.map((point) => ({
      text: point,
      options: {
        // { code } is the form pptxgenjs honours; passing a `type: 'bullet'`
        // key is silently ignored and produces paragraphs with no bullet at all.
        bullet: { code: '2022' },
        color: COLOR.body,
        breakLine: true
      }
    })),
    {
      x: 0.75, y: 1.45, w: 8.5, h: 3.5,
      fontSize: bulletFontSize(points),
      valign: 'top',
      lineSpacingMultiple: 1.25,
      paraSpaceAfter: 8
    }
  );

  if (notes) slide.addNotes(notes);
};

const addTableSlide = (pptx, { kicker, table }) => {
  const slide = pptx.addSlide({ masterName: 'ICBB_CONTENT' });

  slide.addText(kicker, {
    x: 0.55, y: 0.32, w: 8.8, h: 0.25,
    fontSize: 11, bold: true, color: COLOR.blue, charSpacing: 1.5
  });

  slide.addText(table.caption, {
    x: 0.55, y: 0.6, w: 8.8, h: 0.6,
    fontSize: 22, bold: true, color: COLOR.ink, valign: 'top'
  });

  const header = table.headers.map((h) => ({
    text: h,
    options: { bold: true, color: COLOR.white, fill: { color: COLOR.blueDark } }
  }));

  const body = table.rows.map((row, rowIndex) =>
    row.map((cell) => ({
      text: cell,
      options: { color: COLOR.body, fill: { color: rowIndex % 2 ? COLOR.light : COLOR.white } }
    }))
  );

  slide.addTable([header, ...body], {
    x: 0.55, y: 1.35, w: 8.9,
    fontSize: 11,
    border: { pt: 0.5, color: 'D1D5DB' },
    valign: 'top',
    autoPage: false
  });
};

const addNoteSlide = (pptx, { kicker, note }) => {
  const slide = pptx.addSlide({ masterName: 'ICBB_CONTENT' });

  slide.addText(kicker, {
    x: 0.55, y: 0.32, w: 8.8, h: 0.25,
    fontSize: 11, bold: true, color: COLOR.green, charSpacing: 1.5
  });

  slide.addText('In practice', {
    x: 0.55, y: 0.6, w: 8.8, h: 0.6,
    fontSize: 24, bold: true, color: COLOR.ink
  });

  slide.addShape('rect', {
    x: 0.55, y: 1.4, w: 0.06, h: 2.6, fill: { color: COLOR.green }
  });

  slide.addText(note, {
    x: 0.85, y: 1.4, w: 8.3, h: 2.6,
    fontSize: 16, color: COLOR.body, valign: 'top', lineSpacingMultiple: 1.3
  });
};

const addExampleSlide = (pptx, { kicker, example }) => {
  const slide = pptx.addSlide({ masterName: 'ICBB_CONTENT' });

  slide.addText(kicker, {
    x: 0.55, y: 0.32, w: 8.8, h: 0.25,
    fontSize: 11, bold: true, color: COLOR.green, charSpacing: 1.5
  });

  slide.addText(example.title, {
    x: 0.55, y: 0.6, w: 8.8, h: 0.62,
    fontSize: 23, bold: true, color: COLOR.ink, valign: 'top'
  });

  slide.addShape('rect', {
    x: 0.55, y: 1.32, w: 8.9, h: 3.5,
    fill: { color: 'F3F7FC' }, line: { color: COLOR.blue, width: 0.75 }
  });

  slide.addText(example.scenario, {
    x: 0.8, y: 1.5, w: 8.4, h: 1.1,
    fontSize: 14, italic: true, color: COLOR.body, valign: 'top', lineSpacingMultiple: 1.2
  });

  slide.addText(
    example.steps.map((step) => ({
      text: step,
      options: {
        bullet: { type: 'number' },
        color: COLOR.body,
        breakLine: true
      }
    })),
    {
      x: 0.95, y: 2.62, w: 8.15, h: 2.1,
      fontSize: 13, valign: 'top', lineSpacingMultiple: 1.15
    }
  );

  if (example.lesson) slide.addNotes(`Take-away: ${example.lesson}`);
};

const addUnitSlides = (pptx, unit, module) => {
  const kicker = `UNIT ${unit.number}`;

  addTitleSlide(pptx, unit, module);

  addBulletSlide(pptx, {
    kicker,
    heading: 'What you will be able to do',
    points: unit.objectives,
    notes: `Read these out at the start and return to them at the end of the unit.`
  });

  unit.sections.forEach((section) => {
    const chunks = chunkBullets(section.points);

    chunks.forEach((chunk, i) => {
      addBulletSlide(pptx, {
        kicker,
        heading: chunks.length > 1 ? `${section.heading} (${i + 1}/${chunks.length})` : section.heading,
        points: chunk
      });
    });

    if (section.table) addTableSlide(pptx, { kicker, table: section.table });
    if (section.note) addNoteSlide(pptx, { kicker, note: section.note });
  });

  (unit.examples || []).forEach((example) => {
    addExampleSlide(pptx, { kicker: `${kicker}  ·  WORKED EXAMPLE`, example });
  });

  const glossary = unit.keyTerms.map((t) => `${t.term} — ${t.definition}`);
  chunkBullets(glossary).forEach((chunk, i, all) => {
    addBulletSlide(pptx, {
      kicker,
      heading: all.length > 1 ? `Key terms (${i + 1}/${all.length})` : 'Key terms',
      points: chunk
    });
  });

  addBulletSlide(pptx, {
    kicker: `${kicker}  ·  OVER TO YOU`,
    heading: 'Activity',
    points: [unit.activity],
    notes: 'Allow 10-15 minutes, then take feedback from two or three pairs.'
  });
};

/* ------------------------------------------------------------------ build -- */

const loadLogo = (logoPath) => {
  if (!logoPath || !fs.existsSync(logoPath)) return null;
  const data = fs.readFileSync(logoPath).toString('base64');
  return `image/png;base64,${data}`;
};

/**
 * @returns {Promise<string[]>} filenames written
 */
const buildPptx = async (module, outDir, folder, logoPath) => {
  const logoBase64 = loadLogo(logoPath);
  const written = [];

  // One deck per unit.
  for (const unit of module.units) {
    const pptx = buildDeck(logoBase64);
    pptx.title = `${module.code} — Unit ${unit.number}: ${unit.title}`;
    pptx.subject = module.title;

    addUnitSlides(pptx, unit, module);

    const name = `${unit.id}-slides.pptx`;
    await pptx.writeFile({ fileName: path.join(outDir, name) });
    written.push(name);
  }

  // One deck for the whole module.
  const full = buildDeck(logoBase64);
  full.title = `${module.code} — ${module.title}`;
  full.subject = module.title;

  const cover = full.addSlide({ masterName: 'ICBB_TITLE' });
  cover.addText(module.code, {
    x: 0.6, y: 1.15, w: 7.3, h: 0.35,
    fontSize: 13, bold: true, color: COLOR.green, charSpacing: 2
  });
  cover.addText(module.title, {
    x: 0.6, y: 1.55, w: 7.4, h: 1.6,
    fontSize: 32, bold: true, color: COLOR.white, valign: 'top'
  });
  cover.addText(
    `${module.subtitle}\n${module.units.length} units · ${module.contactHours} contact hours`,
    { x: 0.6, y: 3.2, w: 7.4, h: 1.0, fontSize: 14, color: 'DCE7F5', lineSpacingMultiple: 1.3 }
  );
  cover.addText(`${AUTHOR}  ·  ICBB`, {
    x: 0.6, y: 5.08, w: 6, h: 0.4, fontSize: 12, bold: true, color: COLOR.white
  });

  module.units.forEach((unit) => addUnitSlides(full, unit, module));

  const fullName = `${folder}-slides.pptx`;
  await full.writeFile({ fileName: path.join(outDir, fullName) });
  written.push(fullName);

  return written;
};

module.exports = { buildPptx, AUTHOR, ORG };
