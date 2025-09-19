import { useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalNacionalidad.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalNacionalidadProps {
  isOpen: boolean;
  onClose: () => void;
  onNacionalidadAdded?: () => void;
}

export const ModalNacionalidad: React.FC<ModalNacionalidadProps> = ({ isOpen, onClose, onNacionalidadAdded }) => {
  const [nombre, setNombre] = useState('');
  const token = useAuthStore((state) => state.token);

  const createNacionalidad = async (
    nombre: string
  ) => {
        try {
      const response = await axios.post(
        'http://vps-5301866-x.dattaweb.com:9000/api/nacionalidades/crear',
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
              title: 'Localidad creada',
              text: 'La localidad se creó correctamente.',
              timer: 2000,
              showConfirmButton: false
            });
      // const data = response.data;
    } catch (error) {
      console.error('error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear la nacionalidad.',
            });
    }
  }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await createNacionalidad(nombre);
      
        if (onNacionalidadAdded) onNacionalidadAdded();
        onClose();
      } catch (error) {
        console.error('Error al crear Nacionalidad:', error);
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
        <h2>Agregar Nacionalidad</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <div className={styles.actions}>
            <button type="submit">Agregar</button>
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
