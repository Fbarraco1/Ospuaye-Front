import { useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalArea.module.css';
import axios from 'axios';

interface ModalAreaProps {
  isOpen: boolean;
  onClose: () => void;
  onAreaAdded?: () => void;
}

export const ModalArea: React.FC<ModalAreaProps> = ({ isOpen, onClose, onAreaAdded }) => {
  const [nombre, setNombre] = useState('');
  const token = useAuthStore((state) => state.token);

  const createArea = async (
    nombre: string
  ) => {
        try {
      const response = await axios.post(
        'http://localhost:9000/api/areas/crear',
        { nombre },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Area');
      // const data = response.data;
    } catch (error) {
      console.error('error:', error);
    }
  }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await createArea(nombre);
      
        if (onAreaAdded) onAreaAdded();
        onClose();
      } catch (error) {
        console.error('Error al crear beneficiario:', error);
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
        <h2>Agregar Area</h2>
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
