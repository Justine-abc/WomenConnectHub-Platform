// api.js - API configuration

const API_BASE_URL = 'https://api.womenconnecthub.com'; // Example base URL

export const getApiUrl = (endpoint) => `${API_BASE_URL}/${endpoint}`;
