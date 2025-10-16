import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalLocalidad.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalLocalidadProps {
  isOpen: boolean;
  onClose: () => void;
  onLocalidadAdded?: () => void;
  localidadEdit?: {
    id: number;
    nombre: string;
    codigoPostal: string;
    departamento: { id: number; nombre: string };
    activo: boolean;
  };
}

interface Departamento {
    id: number;
    nombre: string;
}


export const ModalLocalidad: React.FC<ModalLocalidadProps> = ({
  isOpen,
  onClose,
  onLocalidadAdded,
  localidadEdit
}) => {
  const [nombre, setNombre] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [departamento, setDepartamento] = useState<number>(0);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerDepartamentos();
  }, []);

  useEffect(() => {
    if (localidadEdit) {
      setNombre(localidadEdit.nombre);
      setCodigoPostal(localidadEdit.codigoPostal);
      setDepartamento(localidadEdit.departamento.id);
    } else {
      setNombre('');
      setCodigoPostal('');
      setDepartamento(0);
    }
  }, [localidadEdit, isOpen]);

  const obtenerDepartamentos = async () => {
    try {
      const response = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/departamentos', {
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
        'http://vps-5301866-x.dattaweb.com:9000/api/localidades',
        { nombre, codigoPostal, departamento: { id: departamento } }, // <-- Cambia aquí
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Localidad');
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
              text: 'No se pudo crear la localidad.',
            });
    }
  }

  const updateLocalidad = async (
    id: number,
    nombre: string,
    codigoPostal: string,
    departamento: number,
    activo: boolean
  ) => {
    try {
      const response = await axios.put(
        `http://vps-5301866-x.dattaweb.com:9000/api/localidades/${id}`,
        { nombre, codigoPostal, departamento: { id: departamento }, activo },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al editar Localidad');
      Swal.fire({
        icon: 'success',
        title: 'Localidad editada',
        text: 'La localidad se editó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo editar la localidad.',
      });
    }
  }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        if (localidadEdit) {
          await updateLocalidad(localidadEdit.id, nombre, codigoPostal, departamento, localidadEdit.activo);
        } else {
          await createLocalidad(nombre, codigoPostal, departamento);
        }
        if (onLocalidadAdded) onLocalidadAdded();
        onClose();
      } catch (error) {
        console.error('Error al guardar Localidad:', error);
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
        <h2>{localidadEdit ? 'Editar Localidad' : 'Agregar Localidad'}</h2>
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
            <button type="submit">Aceptar</button>
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
