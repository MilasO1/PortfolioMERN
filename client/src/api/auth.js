import axios from 'axios';

// Set base URL for all axios requests
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configure request interceptor to handle authentication
axios.interceptors.request.use(
  config => {
    // You can add logic here to attach auth tokens from localStorage if needed
    return config;
  },
  error => Promise.reject(error)
);

// Configure response interceptor to handle common errors
axios.interceptors.response.use(
  response => response,
  error => {
    // Handle authentication errors (401)
    if (error.response && error.response.status === 401) {
      // Redirect to login or dispatch an event
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API methods
export const login = (email, password) => 
  axios.post('/api/users/login', { email, password }, { withCredentials: true });

export const register = (name, email, password) => 
  axios.post('/api/users/register', { name, email, password }, { withCredentials: true });

export const logout = () => 
  axios.post('/api/users/logout', {}, { withCredentials: true });

export const getCurrentUser = () => 
  axios.get('/api/users/me', { withCredentials: true });