// API configuration
//
// The API is deployed alongside the site as a Vercel Function under /api, so
// the default is a same-origin relative URL — no cross-origin request, no CORS
// preflight, and nothing to update when the domain changes.
//
// Set REACT_APP_API_URL to point at a separately hosted API (for example a
// Render or Railway deployment, or a local server on another port).
const API_BASE_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

export default API_BASE_URL;
