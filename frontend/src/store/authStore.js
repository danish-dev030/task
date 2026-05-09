import axios from 'axios';
import { create } from 'zustand';

const AUTH_KEY = 'pixora_auth';

const readPersisted = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
  } catch (_err) {
    return null;
  }
};

const persisted = typeof window !== 'undefined' ? readPersisted() : null;
if (persisted?.token) {
  axios.defaults.headers.common.Authorization = `Bearer ${persisted.token}`;
}

export const useAuthStore = create((set) => ({
  user: persisted?.user || null,
  token: persisted?.token || null,
  setAuth: (user, token) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    delete axios.defaults.headers.common.Authorization;
    set({ user: null, token: null });
  }
}));
