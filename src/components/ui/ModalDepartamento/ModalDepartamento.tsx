import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalDepartamento.module.css';
import axios from 'axios';

interface ModalDepartamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onDepartamentoAdded?: () => void;
}

interface Provincia {
    id: number;
    nombre: string;
}


export const ModalDepartamento: React.FC<ModalDepartamentoProps> = ({ isOpen, onClose, onDepartamentoAdded }) => {
  const [nombre, setNombre] = useState('');
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [provincia, setProvincia] = useState<number>(0);
  
  const token = useAuthStore((state) => state.token);

    useEffect(() => {
    obtenerProvincias();
  }, []);

  const obtenerProvincias = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/provincias', {
      });
      setProvincias(response.data);
    } catch (error) {
      console.error('Error al obtener Provincias:', error);
    }
  };

  const createDepartamento = async (
    nombre: string, 
    provincia: number
  ) => {
        try {
      const response = await axios.post(
        'http://localhost:9000/api/departamentos/crear',
        { nombre, provincia: { id: provincia } }, // <-- Cambia aquí
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Departamento');
      // const data = response.data;
    } catch (error) {
      console.error('error:', error);
    }
  }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await createDepartamento(nombre, provincia);
      
        if (onDepartamentoAdded) onDepartamentoAdded();
        onClose();
      } catch (error) {
        console.error('Error al crear Provincia:', error);
      }
      handleClose();
    };
  
    const handleClose = () => {
      setNombre('');
      setProvincia(0);
      onClose();
    };
  
    if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar Departamento</h2>
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
            value={provincia}
            onChange={(e) => setProvincia(Number(e.target.value))}
            required
            >
            <option value={0} disabled>Seleccione un pais</option>
            {provincias.map((a) => (
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
