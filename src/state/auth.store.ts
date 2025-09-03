// Zustand (token, user)

import { create } from 'zustand';
import api from '../services/api';

interface User {
  _id: string;
  email: string;
  name?: string;
  // outros campos conforme backend
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  hydrate: () => Promise<void>;
}

const TOKEN_KEY = 'auth_token';

function getTokenFromStorage() {
  return localStorage.getItem(TOKEN_KEY);
}

function saveTokenToStorage(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: getTokenFromStorage(),
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post<{ token: string }>('/auth/login', { email, password });
      const token = res.data.token;
      saveTokenToStorage(token);
      set({ token });
      await get().hydrate();
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Erro ao logar', loading: false });
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    saveTokenToStorage(null);
    set({ token: null, user: null });
  },
  hydrate: async () => {
    const token = getTokenFromStorage();
    if (!token) {
      set({ user: null, token: null });
      return;
    }
    set({ loading: true });
    try {
      const res = await api.get<User>('/auth/me');
      set({ user: res.data, token });
    } catch {
      saveTokenToStorage(null);
      set({ user: null, token: null });
    } finally {
      set({ loading: false });
    }
  },
}));
