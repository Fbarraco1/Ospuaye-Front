import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalPais.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalPaisProps {
  isOpen: boolean;
  onClose: () => void;
  onPaisesAdded?: () => void;
  paisEdit?: {
    id: number;
    nombre: string;
    activo: boolean;
  };
}

export const ModalPais: React.FC<ModalPaisProps> = ({
  isOpen,
  onClose,
  onPaisesAdded,
  paisEdit
}) => {
  const [nombre, setNombre] = useState('');
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (paisEdit) {
      setNombre(paisEdit.nombre);
    } else {
      setNombre('');
    }
  }, [paisEdit, isOpen]);

  const createPais = async (
    nombre: string
  ) => {
    try {
      const response = await axios.post(
        'http://vps-5301866-x.dattaweb.com:9000/api/paises/crear',
        { nombre },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Pais');
      Swal.fire({
        icon: 'success',
        title: 'Pais creado',
        text: 'El pais se creó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el pais.',
      });
    }
  }

  const updatePais = async (
    id: number,
    nombre: string
  ) => {
    try {
      const response = await axios.put(
        `http://vps-5301866-x.dattaweb.com:9000/api/paises/actualizar/${id}`,
        { nombre },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al editar Pais');
      Swal.fire({
        icon: 'success',
        title: 'Pais editado',
        text: 'El pais se editó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo editar el pais.',
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (paisEdit) {
        await updatePais(paisEdit.id, nombre);
      } else {
        await createPais(nombre);
      }
      if (onPaisesAdded) onPaisesAdded();
      onClose();
    } catch (error) {
      console.error('Error al guardar Pais:', error);
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
        <h2>{paisEdit ? 'Editar Pais' : 'Agregar Pais'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <div className={styles.actions}>
            <button type="submit">{paisEdit ? 'Guardar cambios' : 'Agregar'}</button>
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
