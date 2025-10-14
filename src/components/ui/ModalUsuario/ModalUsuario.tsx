// components/ModalUsuario.tsx
import React, { useEffect, useState } from 'react';
import styles from './ModalUsuario.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../auth/store/authStore';


interface ModalUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded?: () => void; // para recargar la tabla después de agregar
  usuarioEdit?: {
      id: number;
      email: string;
      contrasena: string;
      rol: { id: number; nombre: string };
  };
}

interface Rol{
  id: number;
  nombre: string;
}

const ModalUsuario: React.FC<ModalUsuarioProps> = ({ isOpen, onClose, onUserAdded, usuarioEdit }) => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [roles, setRoles] = useState<Rol[]>([]);
  const [rol, setRol] = useState<number>(0);
  const token = useAuthStore((state) => state.token);
  

  useEffect(() => {
    obtenerRoles();
  }, []);

    useEffect(() => {
    if (usuarioEdit) {
      setEmail(usuarioEdit.email);
      setContrasena(usuarioEdit.contrasena);
      setRol(usuarioEdit.rol.id);
    } else {
      setEmail('');
      setContrasena('');
      setRol(0);
    }
  }, [usuarioEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (usuarioEdit) {
        await updateUsuario(usuarioEdit.id, email, contrasena, rol);
      } else { 
        await createUser(email, contrasena, rol);
      }
      if (onUserAdded) onUserAdded(); // para refrescar la tabla
      onClose(); // cerrar modal
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

    const obtenerRoles = async () => {
    try {
      const response = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/roles', {
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
          `http://vps-5301866-x.dattaweb.com:9000/api/usuarios/${id}`,
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
      } catch (error) {
        console.error('error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo editar el usuario.',
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
        'http://vps-5301866-x.dattaweb.com:9000/api/usuarios/crear',
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
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el usuario.',
      });
    }
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{usuarioEdit ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
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
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUsuario;
