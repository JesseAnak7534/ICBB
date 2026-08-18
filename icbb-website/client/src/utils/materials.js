/**
 * Paths to generated course materials.
 *
 * Materials live in client/public/materials/<course>/ and are produced by
 * `npm run build:materials` from the module content, so they never drift from
 * what the site shows. PUBLIC_URL keeps the paths correct if the site is ever
 * served from a subdirectory.
 */
export const materialsPath = (course, file) =>
  `${process.env.PUBLIC_URL || ''}/materials/${course}/${file}`;

export default materialsPath;
