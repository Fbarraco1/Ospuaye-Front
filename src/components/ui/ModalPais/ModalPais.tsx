import { useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalPais.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalPaisProps {
  isOpen: boolean;
  onClose: () => void;
  onPaisesAdded?: () => void;
}

export const ModalPais: React.FC<ModalPaisProps> = ({ isOpen, onClose, onPaisesAdded }) => {
  const [nombre, setNombre] = useState('');
  const token = useAuthStore((state) => state.token);

  const createPais = async (
    nombre: string
  ) => {
        try {
      const response = await axios.post(
        'http://localhost:9000/api/paises/crear',
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
      // const data = response.data;
    } catch (error) {
      console.error('error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el pais.',
            });
    }
  }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await createPais(nombre);
      
        if (onPaisesAdded) onPaisesAdded();
        onClose();
      } catch (error) {
        console.error('Error al crear Pais:', error);
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
        <h2>Agregar Pais</h2>
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
