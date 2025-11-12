import React, { useEffect, useState } from 'react';
import styles from './ModalNacionalidad.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

const ModalNacionalidad: React.FC<{ modo?: 'editar' | 'crear'; onNacionalidadAdded?: () => void }> = ({ modo = 'crear', onNacionalidadAdded }) => {
  const { id } = useParams<{ id: string }>();
  const [nombre, setNombre] = useState('');
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (modo === 'editar' && id) {
      cargarNacionalidad(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, modo]);

  const cargarNacionalidad = async (nid: string) => {
    try {
      const res = await axios.get(`${database}/api/nacionalidades/${nid}`);
      const n = res.data;
      setNombre(n.nombre || '');
    } catch (error) {
      console.error('Error al cargar nacionalidad:', error);
    }
  };

  const createNacionalidad = async (nombreVal: string) => {
    try {
      const response = await axios.post(
        `${database}/api/nacionalidades/crear`,
        { nombre: nombreVal },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Nacionalidad');
      Swal.fire({ icon: 'success', title: 'Nacionalidad creada', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear la nacionalidad.' });
      throw error;
    }
  };

  const updateNacionalidad = async (idNum: number, nombreVal: string) => {
    try {
      const response = await axios.put(
        `${database}/api/nacionalidades/${idNum}`,
        { nombre: nombreVal },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al editar Nacionalidad');
      Swal.fire({ icon: 'success', title: 'Nacionalidad editada', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo editar la nacionalidad.' });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modo === 'editar' && id) {
        await updateNacionalidad(Number(id), nombre);
      } else {
        await createNacionalidad(nombre);
      }
      if (onNacionalidadAdded) onNacionalidadAdded();
      navigate('/nacionalidades');
    } catch (error) {
      console.error('Error al guardar Nacionalidad:', error);
    }
  };

  const handleVolver = () => navigate('/nacionalidades');

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>Volver</button>
      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Nacionalidad' : 'Agregar Nacionalidad'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={handleVolver}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNacionalidad;
