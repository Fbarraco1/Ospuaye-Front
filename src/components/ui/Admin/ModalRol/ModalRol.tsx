import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../auth/store/authStore';
import styles from './ModalRol.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
const database = import.meta.env.VITE_DATABASE;

interface ModalRolProps {
  isOpen: boolean;
  onClose: () => void;
  onRolAdded?: () => void;
  rolEdit?: {
    id: number;
    nombre: string;
    area: { id: number; nombre: string };
  };
}

interface Area {
    id: number;
    nombre: string;
}


export const ModalRol: React.FC<ModalRolProps> = ({
  isOpen,
  onClose,
  onRolAdded,
  rolEdit
}) => {
  const [nombre, setNombre] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [area, setArea] = useState<number>(0);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerAreas();
  }, []);

  useEffect(() => {
    if (rolEdit) {
      setNombre(rolEdit.nombre);
      setArea(rolEdit.area.id);
    } else {
      setNombre('');
      setArea(0);
    }
  }, [rolEdit, isOpen]);

  const obtenerAreas = async () => {
    try {
      const response = await axios.get(`${database}/api/areas`, {
      });
      setAreas(response.data);
    } catch (error) {
      console.error('Error al obtener Areas:', error);
    }
  };

  const updateRol = async (
    id: number,
    nombre: string,
    area: number
  ) => {
    try {
      const response = await axios.put(
        `${database}/api/roles/${id}`,
        { nombre, area: { id: area } },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al editar Rol');
      Swal.fire({
        icon: 'success',
        title: 'Rol editado',
        text: 'El rol se editó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo editar el rol.',
      });
    }
  }

  const createRol = async (
    nombre: string, 
    area: number
  ) => {
    try {
      const response = await axios.post(
        `${database}/api/roles/crear`,
        { nombre, area: { id: area } },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Rol');
      Swal.fire({
        icon: 'success',
        title: 'Rol creado',
        text: 'El rol se creó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el rol.',
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (rolEdit) {
        await updateRol(rolEdit.id, nombre, area);
      } else {
        await createRol(nombre, area);
      }
      if (onRolAdded) onRolAdded();
      onClose();
    } catch (error) {
      console.error('Error al guardar Rol:', error);
    }
    handleClose();
  };

  const handleClose = () => {
    setNombre('');
    setArea(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{rolEdit ? 'Editar Rol' : 'Agregar Rol'}</h2>
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
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            required
          >
            <option value={0} disabled>Seleccione un área</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
