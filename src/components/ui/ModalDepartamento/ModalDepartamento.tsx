import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalDepartamento.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalDepartamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onDepartamentoAdded?: () => void;
  departamentoEdit?: {
    id: number;
    nombre: string;
    provincia: { id: number; nombre: string };
    activo: boolean;
  };
}

interface Provincia {
    id: number;
    nombre: string;
}


export const ModalDepartamento: React.FC<ModalDepartamentoProps> = ({
  isOpen,
  onClose,
  onDepartamentoAdded,
  departamentoEdit
}) => {
  const [nombre, setNombre] = useState('');
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [provincia, setProvincia] = useState<number>(0);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerProvincias();
  }, []);

  useEffect(() => {
    if (departamentoEdit) {
      setNombre(departamentoEdit.nombre);
      setProvincia(departamentoEdit.provincia.id);
    } else {
      setNombre('');
      setProvincia(0);
    }
  }, [departamentoEdit, isOpen]);

  const obtenerProvincias = async () => {
    try {
      const response = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/provincias', {
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
        'http://vps-5301866-x.dattaweb.com:9000/api/departamentos/crear',
        { nombre, provincia: { id: provincia } }, // <-- Cambia aquí
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Departamento');
       Swal.fire({
              icon: 'success',
              title: 'Departamento creado',
              text: 'El departamento se creó correctamente.',
              timer: 2000,
              showConfirmButton: false
            });
      // const data = response.data;
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el departamento.',
            });
    }
  }

  const updateDepartamento = async (
    id: number,
    nombre: string,
    provincia: number,
    activo: boolean // <-- nuevo parámetro
  ) => {
    try {
      const response = await axios.put(
        `http://vps-5301866-x.dattaweb.com:9000/api/departamentos/${id}`,
        { nombre, provincia: { id: provincia }, activo }, // <-- incluir activo
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al editar Departamento');
      Swal.fire({
        icon: 'success',
        title: 'Departamento editado',
        text: 'El departamento se editó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo editar el departamento.',
      });
    } 
  }

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (departamentoEdit) {
      await updateDepartamento(departamentoEdit.id, nombre, provincia, departamentoEdit.activo); // <-- pasar activo
    } else {
      await createDepartamento(nombre, provincia);
    }
    if (onDepartamentoAdded) onDepartamentoAdded();
    onClose();
  } catch (error) {
    console.error('Error al guardar Departamento:', error);
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
        <h2>{departamentoEdit ? 'Editar Departamento' : 'Agregar Departamento'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
            <label>Provincia:</label>
          <select
            value={provincia}
            onChange={(e) => setProvincia(Number(e.target.value))}
            required
            >
            <option value={0} disabled>Seleccione una provincia</option>
            {provincias.map((a) => (
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
