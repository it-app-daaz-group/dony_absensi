import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

interface User {
  id: number;
  name: string;
  nik: string;
  role: string;
  department: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        set({ 
          user: response.data.user, 
          accessToken: response.data.accessToken,
          isAuthenticated: true 
        });
      },

      logout: async () => {
        await api.post('/auth/logout');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        try {
          const response = await api.get('/auth/me');
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          // Don't clear immediately on checkAuth failure if it's just a network error, 
          // but 401/403 usually means invalid session.
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
