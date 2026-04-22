import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:5000'),
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from Zustand store before every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
