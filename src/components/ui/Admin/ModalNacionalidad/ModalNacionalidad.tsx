import { useState, useEffect } from 'react';
import styles from './ModalNacionalidad.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
const database = import.meta.env.VITE_DATABASE;

interface ModalNacionalidadProps {
  isOpen: boolean;
  onClose: () => void;
  onNacionalidadAdded?: () => void;
  nacionalidadEdit?: {
    id: number;
    nombre: string;
    activo: boolean;
  };
}

export const ModalNacionalidad: React.FC<ModalNacionalidadProps> = ({
  isOpen,
  onClose,
  onNacionalidadAdded,
  nacionalidadEdit
}) => {
  const [nombre, setNombre] = useState('');
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (nacionalidadEdit) {
      setNombre(nacionalidadEdit.nombre);
    } else {
      setNombre('');
    }
  }, [nacionalidadEdit, isOpen]);

  const createNacionalidad = async (
    nombre: string
  ) => {
    try {
      const response = await axios.post(
        `${database}/api/nacionalidades/crear`,
        { nombre },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Nacionalidad');
      Swal.fire({
        icon: 'success',
        title: 'Nacionalidad creada',
        text: 'La nacionalidad se creó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la nacionalidad.',
      });
    }
  }

  const updateNacionalidad = async (
    id: number,
    nombre: string
  ) => {
    try {
      const response = await axios.put(
        `${database}/api/nacionalidades/${id}`,
        { nombre },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al editar Nacionalidad');
      Swal.fire({
        icon: 'success',
        title: 'Nacionalidad editada',
        text: 'La nacionalidad se editó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo editar la nacionalidad.',
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (nacionalidadEdit) {
        await updateNacionalidad(nacionalidadEdit.id, nombre);
      } else {
        await createNacionalidad(nombre);
      }
      if (onNacionalidadAdded) onNacionalidadAdded();
      onClose();
    } catch (error) {
      console.error('Error al guardar Nacionalidad:', error);
    }
    handleClose();
  };

  const handleClose = () => {
    setNombre('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{nacionalidadEdit ? 'Editar Nacionalidad' : 'Agregar Nacionalidad'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
