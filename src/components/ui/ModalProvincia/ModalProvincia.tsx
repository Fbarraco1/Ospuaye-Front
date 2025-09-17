import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalProvincia.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalProvinciaProps {
  isOpen: boolean;
  onClose: () => void;
  onProvinciaAdded?: () => void;
}

interface Pais {
    id: number;
    nombre: string;
}


export const ModalProvincia: React.FC<ModalProvinciaProps> = ({ isOpen, onClose, onProvinciaAdded }) => {
  const [nombre, setNombre] = useState('');
  const [paises, setPaises] = useState<Pais[]>([]);
  const [pais, setPais] = useState<number>(0);
  
  const token = useAuthStore((state) => state.token);

    useEffect(() => {
    obtenerPaises();
  }, []);

  const obtenerPaises = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/paises', {
      });
      setPaises(response.data);
    } catch (error) {
      console.error('Error al obtener Pais:', error);
    }
  };

  const createProvincia = async (
    nombre: string, 
    pais: number
  ) => {
        try {
      const response = await axios.post(
        'http://localhost:9000/api/provincias/crear',
        { nombre, pais: { id: pais } }, // <-- Cambia aquí
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Provincia');
            Swal.fire({
              icon: 'success',
              title: 'Provincia creada',
              text: 'La provincia se creó correctamente.',
              timer: 2000,
              showConfirmButton: false
            });
      // const data = response.data;
    } catch (error) {
      console.error('error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear la provincia.',
            });
    }
  }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await createProvincia(nombre, pais);
      
        if (onProvinciaAdded) onProvinciaAdded();
        onClose();
      } catch (error) {
        console.error('Error al crear Provincia:', error);
      }
      handleClose();
    };
  
    const handleClose = () => {
      setNombre('');
      setPais(0);
      onClose();
    };
  
    if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar Provincia</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
            <label>Area:</label>
          <select
            value={pais}
            onChange={(e) => setPais(Number(e.target.value))}
            required
            >
            <option value={0} disabled>Seleccione un pais</option>
            {paises.map((a) => (
                <option key={a.id} value={a.id}>
                {a.nombre}
                </option>
            ))}
           </select>

          <div className={styles.actions}>
            <button type="submit">Agregar</button>
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
