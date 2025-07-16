// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Create axios instance with base configuration
const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default apiConfig; 