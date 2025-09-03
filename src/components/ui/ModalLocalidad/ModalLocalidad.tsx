import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalLocalidad.module.css';
import axios from 'axios';

interface ModalLocalidadProps {
  isOpen: boolean;
  onClose: () => void;
  onLocalidadAdded?: () => void;
}

interface Departamento {
    id: number;
    nombre: string;
}


export const ModalLocalidad: React.FC<ModalLocalidadProps> = ({ isOpen, onClose, onLocalidadAdded }) => {
  const [nombre, setNombre] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [departamento, setDepartamento] = useState<number>(0);
  
  const token = useAuthStore((state) => state.token);

    useEffect(() => {
    obtenerDepartamentos();
  }, []);

  const obtenerDepartamentos = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/departamentos', {
      });
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error al obtener Departamentos:', error);
    }
  };

  const createLocalidad = async (
    nombre: string, 
    codigoPostal: string,
    departamento: number

  ) => {
        try {
      const response = await axios.post(
        'http://localhost:9000/api/localidades/crear',
        { nombre, codigoPostal, departamento: { id: departamento } }, // <-- Cambia aquí
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Localidad');
      // const data = response.data;
    } catch (error) {
      console.error('error:', error);
    }
  }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await createLocalidad(nombre, codigoPostal, departamento);
      
        if (onLocalidadAdded) onLocalidadAdded();
        onClose();
      } catch (error) {
        console.error('Error al crear Localidad:', error);
      }
      handleClose();
    };
  
    const handleClose = () => {
      setNombre('');
      setCodigoPostal('');
      setDepartamento(0);
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
          <label>Codigo Postal:</label>
          <input
            type="text"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
            required
          />          
            <label>Area:</label>
          <select
            value={departamento}
            onChange={(e) => setDepartamento(Number(e.target.value))}
            required
            >
            <option value={0} disabled>Seleccione un Departamento</option>
            {departamentos.map((a) => (
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
