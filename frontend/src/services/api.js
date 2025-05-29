import axios from 'axios';

// Get the API base URL from environment variables, defaulting to localhost:8000
// For Vite, environment variables must start with VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensure this is true for sending cookies with cross-origin requests
});

// Removed the request interceptor that added the Authorization header
// apiClient.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('authToken'); 
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// Optional: Response interceptor for global error handling (e.g., 401 Unauthorized)
// This can be kept if general error handling (not specific to token auth) is desired.
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors. Since we're not using token-based auth on client,
      // this might mean the cookie was invalid or not sent, or session expired.
      // Specific actions might depend on application flow (e.g., notify user, clear some state).
      console.error('Unauthorized request (401). This could be due to cookie/session issues.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
