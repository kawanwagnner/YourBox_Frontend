
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
    // debug in dev only
    try {
      if (import.meta.env.MODE === 'development') console.debug('[api] attaching token to request');
    } catch {}
    // headers typing in axios internal config is strict; cast to any for safe assignment
    if (!config.headers) config.headers = {} as any;
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  } else {
    try { if (import.meta.env.MODE === 'development') console.debug('[api] no token found for request'); } catch {}
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
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
