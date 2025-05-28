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
  // withCredentials: true, // Important for sending cookies with requests (e.g., Sanctum)
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      // The placeholder token "session_active_placeholder_token" from AuthContext
      // won't work as a Bearer token. This setup assumes a real JWT or similar.
      // For Sanctum cookie-based auth, ensure `withCredentials: true` is set and
      // that the backend handles authentication via cookies.
      // If your "authToken" in localStorage IS the actual session cookie value or a real API token, this is fine.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for global error handling (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors, e.g., clear local auth data and redirect to login
      // This should align with how AuthContext handles logout
      // localStorage.removeItem('authToken');
      // localStorage.removeItem('userData');
      // window.location.href = '/login'; // Force redirect
      console.error('Unauthorized request - 401. Redirecting to login might be needed.');
      // Potentially call a global logout function from AuthContext if accessible or use an event emitter.
    }
    return Promise.reject(error);
  }
);

export default apiClient;
