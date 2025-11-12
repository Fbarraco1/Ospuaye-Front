import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../auth/store/authStore';
import styles from './ModalArea.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;


interface ModalAreaProps {
  modo?: 'editar' | 'crear';
  onAreaAdded?: () => void;
}

const ModalArea: React.FC<ModalAreaProps> = ({ modo = 'crear', onAreaAdded }) => {
  const { id } = useParams<{ id: string }>();
  const [nombre, setNombre] = useState('');
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (modo === 'editar' && id) {
      cargarArea(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, modo]);

  const cargarArea = async (areaId: string) => {
    try {
      const res = await axios.get(`${database}/api/areas/${areaId}`);
      const a = res.data;
      setNombre(a.nombre || '');
    } catch (error) {
      console.error('Error al cargar area:', error);
    }
  };

  const createArea = async (nombreVal: string) => {
    try {
      const response = await axios.post(
        `${database}/api/areas/crear`,
        { nombre: nombreVal },
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
      throw error;
    }
  }

  const updateArea = async (idNum: number, nombreVal: string) => {
    try {
      const response = await axios.put(
        `${database}/api/areas/${idNum}`,
        { nombre: nombreVal },
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
      throw error;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modo === 'editar' && id) {
        await updateArea(Number(id), nombre);
      } else {
        await createArea(nombre);
      }
      if (onAreaAdded) onAreaAdded();
      navigate('/areas');
    } catch (error) {
      console.error('Error al guardar Area:', error);
    }
  };

  const handleVolver = () => {
    navigate('/areas');
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
        Volver
      </button>
      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Area' : 'Agregar Area'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={handleVolver}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalArea;
