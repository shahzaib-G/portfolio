// Single source of truth for API URL.
// Set REACT_APP_API_URL in Netlify env vars → your Render backend URL.
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export default API;
