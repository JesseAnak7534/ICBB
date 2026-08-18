/**
 * Course materials are streamed by the API, not served as static files.
 *
 * They used to live in client/public/materials, which meant the CDN handed
 * them to anyone with the URL. They now sit outside the web root and are
 * released only to a signed-in participant who has paid for the course, so
 * these paths point at the API rather than at a file.
 */
export const materialsPath = (folder, file) => `/api/materials/${folder}/${file}`;

export const materialsIndexPath = (folder) => `/api/materials/${folder}`;

export default materialsPath;
