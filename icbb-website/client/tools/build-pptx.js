/**
 * Builds PowerPoint decks (.pptx) from the module content.
 *
 * Text is written as native PowerPoint bullet paragraphs, not drawn shapes, so
 * every deck opens and edits normally in PowerPoint, Google Slides, Keynote and
 * LibreOffice.
 *
 * Typography: Constantia for display and Corbel for text. Both ship with
 * Microsoft Office on Windows and macOS, so the deck looks the same on the
 * lecturer's machine as it does here — a web font would silently fall back to
 * Calibri and undo the design. They are a deliberate pair from the same
 * ClearType family rather than the Office defaults.
 *
 * Called by build-materials.js; not run on its own.
 */

const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const AUTHOR = 'Jesse Anak';
const ORG = 'Institute of Computational Biology and Bioinformatics';

const FONT_DISPLAY = 'Constantia';
const FONT_TEXT = 'Corbel';

/**
 * Ink and bronze on paper. Deliberately not a blue-to-green gradient: a solid
 * ground and one warm accent reads as a considered lecture deck rather than a
 * template.
 */
const COLOR = {
  ink: '1C3140',        // deep slate-navy, the structural colour
  inkDeep: '132330',    // title grounds
  text: '23282E',       // body text on white
  soft: '5F6B76',       // secondary text
  bronze: '9A6A3C',     // accent: rules, numerals, emphasis
  bronzeLight: 'C8A67B',
  paper: 'FFFFFF',
  panel: 'F6F4F0',      // warm off-white for panels
  line: 'D8D3CB',
  white: 'FFFFFF'
};

/* --------------------------------------------------------------- helpers -- */

// PowerPoint does not reflow, so a slide holds a fixed amount before text runs
// off the bottom. These caps are what keep the decks presentable unattended.
const MAX_BULLETS_PER_SLIDE = 5;
const MAX_CHARS_PER_SLIDE = 460;

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

const bulletFontSize = (points) => {
  const longest = points.reduce((max, p) => Math.max(max, p.length), 0);
  if (longest > 150) return 13.5;
  if (longest > 110) return 15;
  if (longest > 80) return 16.5;
  return 18;
};

const loadLogo = (logoPath) => {
  if (!logoPath || !fs.existsSync(logoPath)) return null;
  return `image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
};

/* ---------------------------------------------------------------- masters -- */

const buildDeck = (logoBase64) => {
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 in
  pptx.author = AUTHOR;
  pptx.company = ORG;
  pptx.theme = { headFontFace: FONT_DISPLAY, bodyFontFace: FONT_TEXT };

  // Content pages: white, a hairline foot rule, the mark set quietly bottom-right.
  pptx.defineSlideMaster({
    title: 'ICBB_CONTENT',
    background: { color: COLOR.paper },
    objects: [
      { rect: { x: 0.62, y: 5.02, w: 8.76, h: 0.012, fill: { color: COLOR.line } } },
      ...(logoBase64
        ? [{ image: { data: logoBase64, x: 8.72, y: 5.15, w: 0.62, h: 0.41, transparency: 62 } }]
        : [])
    ],
    slideNumber: {
      x: 0.62, y: 5.14, w: 1, h: 0.3,
      color: COLOR.soft, fontSize: 9, fontFace: FONT_TEXT
    }
  });

  // Section/title pages: one solid ink ground, a bronze rule, nothing else.
  pptx.defineSlideMaster({
    title: 'ICBB_TITLE',
    background: { color: COLOR.inkDeep },
    objects: [
      { rect: { x: 0.75, y: 1.62, w: 1.15, h: 0.028, fill: { color: COLOR.bronze } } },
      ...(logoBase64
        ? [{ image: { data: logoBase64, x: 8.6, y: 4.72, w: 0.74, h: 0.49, transparency: 55 } }]
        : [])
    ]
  });

  return pptx;
};

/* ----------------------------------------------------------------- slides -- */

const addTitleSlide = (pptx, unit, module) => {
  const slide = pptx.addSlide({ masterName: 'ICBB_TITLE' });

  slide.addText(`${module.code}   ·   Unit ${unit.number} of ${module.units.length}`, {
    x: 0.75, y: 1.12, w: 7.4, h: 0.32,
    fontFace: FONT_TEXT, fontSize: 11.5, color: COLOR.bronzeLight, charSpacing: 2.4
  });

  slide.addText(unit.title, {
    x: 0.75, y: 1.86, w: 7.5, h: 1.55,
    fontFace: FONT_DISPLAY, fontSize: 33, color: COLOR.white,
    valign: 'top', lineSpacingMultiple: 1.02
  });

  slide.addText(unit.summary, {
    x: 0.75, y: 3.42, w: 6.9, h: 1.15,
    fontFace: FONT_TEXT, fontSize: 13.5, color: 'B9C2CB',
    valign: 'top', lineSpacingMultiple: 1.28
  });

  slide.addText(`${AUTHOR}   ·   ICBB`, {
    x: 0.75, y: 4.82, w: 5, h: 0.3,
    fontFace: FONT_TEXT, fontSize: 10.5, color: '8894A0', charSpacing: 1.2
  });

  slide.addNotes(
    `Unit ${unit.number}: ${unit.title}\n\nDuration: ${unit.duration}\n\n` +
    `Objectives:\n${unit.objectives.map((o) => `- ${o}`).join('\n')}`
  );
};

/** Heading block shared by every content slide: kicker, title, short rule. */
const addHeading = (slide, kicker, heading) => {
  slide.addText(kicker, {
    x: 0.62, y: 0.42, w: 8.5, h: 0.26,
    fontFace: FONT_TEXT, fontSize: 10, color: COLOR.bronze, charSpacing: 2
  });

  slide.addText(heading, {
    x: 0.62, y: 0.72, w: 8.5, h: 0.72,
    fontFace: FONT_DISPLAY, fontSize: 25, color: COLOR.ink,
    valign: 'top', lineSpacingMultiple: 1.0
  });

  slide.addShape('rect', {
    x: 0.62, y: 1.46, w: 0.62, h: 0.022, fill: { color: COLOR.bronze }
  });
};

const addBulletSlide = (pptx, { heading, kicker, points, notes }) => {
  const slide = pptx.addSlide({ masterName: 'ICBB_CONTENT' });
  addHeading(slide, kicker, heading);

  slide.addText(
    points.map((point) => ({
      text: point,
      options: {
        // { code } is the form pptxgenjs honours. A `type: 'bullet'` key is
        // silently ignored and yields paragraphs with no bullet at all.
        bullet: { code: '2013' }, // en dash: quieter than a filled disc
        color: COLOR.text,
        fontFace: FONT_TEXT,
        breakLine: true
      }
    })),
    {
      x: 0.78, y: 1.82, w: 8.2, h: 3.05,
      fontSize: bulletFontSize(points),
      valign: 'top',
      lineSpacingMultiple: 1.3,
      paraSpaceAfter: 11
    }
  );

  if (notes) slide.addNotes(notes);
};

const addTableSlide = (pptx, { kicker, table }) => {
  const slide = pptx.addSlide({ masterName: 'ICBB_CONTENT' });
  addHeading(slide, kicker, table.caption);

  const header = table.headers.map((h) => ({
    text: h,
    options: { bold: true, color: COLOR.ink, fontFace: FONT_TEXT, fill: { color: COLOR.panel } }
  }));

  const body = table.rows.map((row) =>
    row.map((cell) => ({
      text: cell,
      options: { color: COLOR.text, fontFace: FONT_TEXT, fill: { color: COLOR.paper } }
    }))
  );

  // Hairline rules rather than banded fills — closer to a printed table.
  slide.addTable([header, ...body], {
    x: 0.62, y: 1.78, w: 8.76,
    fontSize: 11,
    border: { pt: 0.4, color: COLOR.line },
    valign: 'top',
    margin: 6,
    autoPage: false
  });
};

const addNoteSlide = (pptx, { kicker, note }) => {
  const slide = pptx.addSlide({ masterName: 'ICBB_CONTENT' });
  addHeading(slide, kicker, 'In practice');

  slide.addShape('rect', {
    x: 0.62, y: 1.82, w: 8.76, h: 2.62, fill: { color: COLOR.panel }
  });

  slide.addText(note, {
    x: 1.02, y: 2.02, w: 7.96, h: 2.22,
    fontFace: FONT_DISPLAY, fontSize: 16, italic: true, color: COLOR.ink,
    valign: 'top', lineSpacingMultiple: 1.32
  });
};

const addExampleSlide = (pptx, { kicker, example }) => {
  const slide = pptx.addSlide({ masterName: 'ICBB_CONTENT' });
  addHeading(slide, kicker, example.title);

  slide.addText(example.scenario, {
    x: 0.62, y: 1.8, w: 8.76, h: 0.9,
    fontFace: FONT_DISPLAY, fontSize: 13, italic: true, color: COLOR.soft,
    valign: 'top', lineSpacingMultiple: 1.24
  });

  slide.addText(
    example.steps.slice(0, 6).map((step) => ({
      text: step,
      options: {
        bullet: { type: 'number' },
        color: COLOR.text,
        fontFace: FONT_TEXT,
        breakLine: true
      }
    })),
    {
      x: 0.86, y: 2.76, w: 8.1, h: 2.1,
      fontSize: 12.5, valign: 'top', lineSpacingMultiple: 1.2, paraSpaceAfter: 5
    }
  );

  if (example.lesson) slide.addNotes(`The point: ${example.lesson}`);
};

/** Closing slide for a unit: the activity, set large and quiet. */
const addActivitySlide = (pptx, unit) => {
  const slide = pptx.addSlide({ masterName: 'ICBB_TITLE' });

  slide.addText('Over to you', {
    x: 0.75, y: 1.12, w: 7.4, h: 0.32,
    fontFace: FONT_TEXT, fontSize: 11.5, color: COLOR.bronzeLight, charSpacing: 2.4
  });

  slide.addText('Activity', {
    x: 0.75, y: 1.86, w: 7.5, h: 0.7,
    fontFace: FONT_DISPLAY, fontSize: 30, color: COLOR.white, valign: 'top'
  });

  slide.addText(unit.activity, {
    x: 0.75, y: 2.72, w: 7.6, h: 1.9,
    fontFace: FONT_TEXT, fontSize: 14.5, color: 'C4CCD4',
    valign: 'top', lineSpacingMultiple: 1.34
  });

  slide.addNotes('Allow 10-15 minutes, then take feedback from two or three pairs.');
};

const addUnitSlides = (pptx, unit, module) => {
  const kicker = `UNIT ${unit.number}`;

  addTitleSlide(pptx, unit, module);

  addBulletSlide(pptx, {
    kicker,
    heading: 'What you will be able to do',
    points: unit.objectives,
    notes: 'Read these at the start, and return to them at the end of the unit.'
  });

  unit.sections.forEach((section) => {
    const chunks = chunkBullets(section.points);

    chunks.forEach((chunk, i) => {
      addBulletSlide(pptx, {
        kicker,
        heading: chunks.length > 1
          ? `${section.heading} (${i + 1}/${chunks.length})`
          : section.heading,
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

  addActivitySlide(pptx, unit);
};

/* ------------------------------------------------------------------ build -- */

const buildPptx = async (module, outDir, folder, logoPath) => {
  const logoBase64 = loadLogo(logoPath);
  const written = [];

  for (const unit of module.units) {
    const pptx = buildDeck(logoBase64);
    pptx.title = `${module.code} — Unit ${unit.number}: ${unit.title}`;
    pptx.subject = module.title;

    addUnitSlides(pptx, unit, module);

    const name = `${unit.id}-slides.pptx`;
    await pptx.writeFile({ fileName: path.join(outDir, name) });
    written.push(name);
  }

  // The whole module in one deck.
  const full = buildDeck(logoBase64);
  full.title = `${module.code} — ${module.title}`;
  full.subject = module.title;

  const cover = full.addSlide({ masterName: 'ICBB_TITLE' });
  cover.addText(module.code, {
    x: 0.75, y: 1.12, w: 7.4, h: 0.32,
    fontFace: FONT_TEXT, fontSize: 11.5, color: COLOR.bronzeLight, charSpacing: 2.4
  });
  cover.addText(module.title, {
    x: 0.75, y: 1.86, w: 7.6, h: 1.6,
    fontFace: FONT_DISPLAY, fontSize: 31, color: COLOR.white,
    valign: 'top', lineSpacingMultiple: 1.02
  });
  cover.addText(
    `${module.units.length} units · ${module.contactHours} contact hours · ${module.level}`,
    {
      x: 0.75, y: 3.5, w: 7.4, h: 0.4,
      fontFace: FONT_TEXT, fontSize: 13, color: 'B9C2CB'
    }
  );
  cover.addText(`${AUTHOR}   ·   ICBB`, {
    x: 0.75, y: 4.82, w: 5, h: 0.3,
    fontFace: FONT_TEXT, fontSize: 10.5, color: '8894A0', charSpacing: 1.2
  });

  module.units.forEach((unit) => addUnitSlides(full, unit, module));

  const fullName = `${folder}-slides.pptx`;
  await full.writeFile({ fileName: path.join(outDir, fullName) });
  written.push(fullName);

  return written;
};

module.exports = { buildPptx, AUTHOR, ORG, FONT_DISPLAY, FONT_TEXT, COLOR };
