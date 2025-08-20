// src/auth/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  rol: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;

  startLogin: (email: string, contrasena: string) => Promise<User | null>;
  startRegister: (email: string, contrasena: string) => Promise<User | null>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      user: null,

      startLogin: async (email, contrasena) => {
        try {
          const response = await fetch('http://localhost:9000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contrasena }),
          });

          if (!response.ok) throw new Error('Error al iniciar sesión');

          const data = await response.json();

          const newUser = { email: data.email, rol: data.rol };

          set({
            token: data.token,
            isAuthenticated: true,
            user: newUser,
          });

          return newUser;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },

      startRegister: async (email, contrasena) => {
        try {
          const response = await fetch('http://localhost:9000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contrasena }),
          });

          if (!response.ok) throw new Error('Error al registrarse');

          const data = await response.json();

          const newUser = { email: data.email, rol: data.rol };

          set({
            token: data.token,
            isAuthenticated: true,
            user: newUser,
          });

          return newUser;
        } catch (error) {
          console.error('Register error:', error);
          return null;
        }
      },

      logout: () => {
        set({ token: null, isAuthenticated: false, user: null });
        localStorage.removeItem('auth-storage'); // opcional si usás persistencia local
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
