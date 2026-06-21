import axios from 'axios';

// A worker's session is completely separate from a customer/admin
// session (different login endpoint, different collection, different
// JWT `role` claim — see backend/middleware/workerAuth.js). Using a
// different localStorage key means a technician and a logged-in
// customer/admin can't accidentally clobber each other's session in
// the same browser.
const WORKER_TOKEN_KEY = 'autocare_worker_token';

const workerApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

workerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(WORKER_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

workerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export { WORKER_TOKEN_KEY };
export default workerApi;
