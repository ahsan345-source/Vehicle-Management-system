import axios from 'axios';

// Base URL comes from the .env file (VITE_API_URL). Falls back to the
// standard local dev backend address if it isn't set.
const api = axios.create({
  baseURL: 'https://vehicle-management-system-w67t.onrender.com/api',
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('autocare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so components can just read `error.message`.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
