import apiClient from './api';

// Function to get CSRF cookie - typically needed for Laravel Sanctum
const getCsrfCookie = async () => {
    try {
        // For Vite, environment variables must start with VITE_
        const csrfUrl = import.meta.env.VITE_SANCTUM_CSRF_URL || 'http://localhost:8000/sanctum/csrf-cookie';
        await apiClient.get(csrfUrl);
    } catch (error) {
        console.error('Error fetching CSRF cookie:', error);
        // Handle error appropriately, maybe by not proceeding with the request
        // or by notifying the user.
    }
};

export const login = async (credentials) => {
    await getCsrfCookie(); // Ensure CSRF cookie is set before login
    try {
        const response = await apiClient.post('/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Login failed');
    }
};

export const register = async (userData) => {
    await getCsrfCookie(); // Ensure CSRF cookie is set before registration
    try {
        const response = await apiClient.post('/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Registration failed');
    }
};

export const logout = async () => {
    try {
        const response = await apiClient.post('/logout');
        return response.data;
    } catch (error) {
        console.error('Logout error:', error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : new Error('Logout failed');
    }
};

// export const getUser = async () => {
//   try {
//     const response = await apiClient.get('/user'); 
//     return response.data;
//   } catch (error) {
//     console.error('Get user error:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };
