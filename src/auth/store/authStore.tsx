// src/auth/store/authStore.ts
import axios from 'axios';
import Swal from 'sweetalert2';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  rol: string;
  idBeneficiario?: number;
  idMedico?: number;
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
          const response = await fetch('http://vps-5301866-x.dattaweb.com:9000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contrasena }),
          });

          if (!response.ok) throw new Error('Error al iniciar sesión');

          const data = await response.json();

          const newUser = { email: data.email, rol: data.rol, idBeneficiario: data.idBeneficiario, idMedico: data.idMedico };

          set({
            token: data.token,
            isAuthenticated: true,
            user: newUser,
          });

          return newUser;
        } catch (error) {
          console.error('Login error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error de inicio de sesión',
            text: 'Usuario o contraseña incorrectos.',
          });
          return null;
        }
      },

      startRegister: async (email, contrasena) => {
        try {
          const response = await fetch('http://vps-5301866-x.dattaweb.com:9000/api/auth/register', {
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
          Swal.fire({
            icon: 'error',
            title: 'Error de registro',
            text: 'Hubo un error al intentar .',
          });          
          return null;
        }
      },

      startRegisterBeneficiario: async (    
        nombre: string,
        apellido: string,
        email: string,
        contrasena: string,
        dni: string,
        cuil: string,
        telefono: string,
        afiliadoSindical: boolean,
        esJubilado: boolean
      ) => {
              try {
      const response = await axios.post(
        'http://vps-5301866-x.dattaweb.com:9000/api/auth/register/beneficiario',
        { nombre, apellido, email, contrasena, dni, cuil, telefono, afiliadoSindical, esJubilado },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear beneficiario');
      Swal.fire({
        icon: 'success',
        title: 'Beneficiario creado',
        text: 'El beneficiario se creó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al crear beneficiario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el beneficiario.',
      });
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
