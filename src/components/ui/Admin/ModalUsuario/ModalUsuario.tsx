// components/ModalUsuario.tsx
import React, { useEffect, useState } from 'react';
import styles from './ModalUsuario.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useParams, useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;


interface ModalUsuarioProps {
  onUserAdded?: () => void; // para recargar la tabla después de agregar (opcional)
  modo?: 'editar' | 'crear';
}

interface Rol{
  id: number;
  nombre: string;
}

const ModalUsuario: React.FC<ModalUsuarioProps> = ({  onUserAdded, modo = 'crear' }) => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rol, setRol] = useState<number>(0);
  const token = useAuthStore((state) => state.token);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    obtenerRoles();
  }, []);

  // Si se renderiza como página con modo editar, cargar usuario por id
  useEffect(() => {
    if (modo === 'editar' && id) {
      const cargarUsuario = async (uid: string) => {
        try {
          const res = await axios.get(`${database}/api/usuarios/${uid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const u = res.data;
          setEmail(u.email || '');
          setContrasena(u.contrasena || '');
          setRol(u.rol?.id || 0);
        } catch (error) {
          console.error('Error al cargar usuario:', error);
        }
      };
      cargarUsuario(id);
    } else {
      // modo crear o no hay id: limpiar campos
      setEmail('');
      setContrasena('');
      setRol(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, modo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modo === 'editar' && id) {
        await updateUsuario(Number(id), email, contrasena, rol);
      } else {
        await createUser(email, contrasena, rol);
      }
      if (onUserAdded) onUserAdded(); // opcional
      // al guardar, navegar de vuelta a la lista
      navigate('/usuarios');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

    const obtenerRoles = async () => {
    try {
      const response = await axios.get(`${database}/api/roles`, {
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error al obtener Roles:', error);
    }
  };

    const updateUsuario = async (
      id: number,
      email: string,
      contrasena: string,
      rol: number
    ) => {
      try {
        const response = await axios.put(
          `${database}/api/usuarios/${id}`,
          { email, contrasena, rol: {id: rol} },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status < 200 || response.status >= 300) throw new Error('Error al editar Usuario');
        Swal.fire({
          icon: 'success',
          title: 'Usuario editado',
          text: 'El usuario se editó correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error: any) {
        console.error('error:', error);
        const backendMessage = error?.response?.data?.message || error?.response?.data || 'No se pudo editar el usuario.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: backendMessage,
        });
      }
    }

  const createUser = async (
    email: string, 
    contrasena: string,
    rol: number
  ) => {
    try {
      const response = await axios.post(
        `${database}/api/usuarios/crear`,
        { email, contrasena, rol: {id: rol} },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear usuario');
      Swal.fire({
        icon: 'success',
        title: 'Usuario creado',
        text: 'El usuario se creó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error('error:', error);
      const backendMessage = error?.response?.data?.message || error?.response?.data || 'No se pudo crear el usuario.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: backendMessage,
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <label>Seleccione el rol</label>
          <select
            value={rol}
            onChange={(e) => setRol(Number(e.target.value))}
            required
          >
            <option value={0} disabled>Seleccione un rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={() => navigate('/usuarios')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUsuario;
