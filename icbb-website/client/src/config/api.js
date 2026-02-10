// API configuration
// In production, use the Render backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://icbb.onrender.com';

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_BASE_URL;
