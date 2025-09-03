
import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../state/auth.store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor: injeta Bearer token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    // headers typing in axios internal config is strict; cast to any for safe assignment
    if (!config.headers) config.headers = {} as any;
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: trata 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpa auth store e redireciona
      try {
        useAuthStore.getState().logout();
      } catch {}
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
