import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalArea.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalAreaProps {
  isOpen: boolean;
  onClose: () => void;
  onAreaAdded?: () => void;
  areaEdit?: {
    id: number;
    nombre: string;
  };
}

export const ModalArea: React.FC<ModalAreaProps> = ({ isOpen, onClose, onAreaAdded, areaEdit }) => {
  const [nombre, setNombre] = useState('');
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (areaEdit) {
      setNombre(areaEdit.nombre);
    } else {
      setNombre('');
    }
  }, [areaEdit, isOpen]);

  const createArea = async (
    nombre: string
  ) => {
    try {
      const response = await axios.post(
        'http://vps-5301866-x.dattaweb.com:9000/api/areas/crear',
        { nombre },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Area');
      Swal.fire({
        icon: 'success',
        title: 'Area creada',
        text: 'El area se creó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el area.',
      });
    }
  }

  const updateArea = async (
    id: number,
    nombre: string
  ) => {
    try {
      const response = await axios.put(
        `http://vps-5301866-x.dattaweb.com:9000/api/areas/${id}`,
        { nombre },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al editar Area');
      Swal.fire({
        icon: 'success',
        title: 'Area editada',
        text: 'El area se editó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo editar el area.',
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (areaEdit) {
        await updateArea(areaEdit.id, nombre);
      } else {
        await createArea(nombre);
      }
      if (onAreaAdded) onAreaAdded();
      onClose();
    } catch (error) {
      console.error('Error al guardar Area:', error);
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
        <h2>{areaEdit ? 'Editar Area' : 'Agregar Area'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <div className={styles.actions}>
            <button type="submit">{areaEdit ? 'Guardar cambios' : 'Agregar'}</button>
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
