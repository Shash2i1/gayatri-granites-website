import { create } from 'zustand';
import { apiClient, API_BASE_URL } from '../api/client';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  isAdmin: false,
  isLoggedIn: false,

  fetchCurrentUser: async () => {
    set({ loading: true });
    try {
      const { data } = await apiClient.get('/api/me');
      set({ user: data, isAdmin: data.role === 'ADMIN', isLoggedIn: true, loading: false });
    } catch {
      set({ user: null, isAdmin: false, isLoggedIn: false, loading: false });
    }
  },

  login: () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  },

  logout: async () => {
    await apiClient.post('/api/logout');
    set({ user: null, isAdmin: false, isLoggedIn: false });
  },
}));