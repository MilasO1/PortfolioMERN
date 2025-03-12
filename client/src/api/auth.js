import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

axios.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (email, password) => 
  axios.post('/api/users/login', { email, password }, { withCredentials: true });

export const register = (name, email, password) => 
  axios.post('/api/users/register', { name, email, password }, { withCredentials: true });
