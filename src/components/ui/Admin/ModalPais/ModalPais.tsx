import React, { useEffect, useState } from 'react';
import styles from './ModalPais.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface ModalPaisProps {
  modo?: 'editar' | 'crear';
  onPaisesAdded?: () => void;
}

const ModalPais: React.FC<ModalPaisProps> = ({ modo = 'crear', onPaisesAdded }) => {
  const { id } = useParams<{ id: string }>();
  const [nombre, setNombre] = useState('');
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (modo === 'editar' && id) {
      cargarPais(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, modo]);

  const cargarPais = async (paisId: string) => {
    try {
      const res = await axios.get(`${database}/api/paises/${paisId}`);
      const p = res.data;
      setNombre(p.nombre || '');
    } catch (error) {
      console.error('Error al cargar pais:', error);
    }
  };

  const createPais = async (nombreVal: string) => {
  try {
    const response = await axios.post(
      `${database}/api/paises/crear`,
      { nombre: nombreVal },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status < 200 || response.status >= 300)
      throw new Error('Error al crear Pais');

    Swal.fire({
      icon: 'success',
      title: 'País creado',
      text: 'El país se creó correctamente.',
      timer: 2000,
      showConfirmButton: false,
    });

  } catch (error: any) {
    console.error('error:', error);

    // 👉 Tomamos el mensaje real del backend
    const backendMessage =
      error?.response?.data?.message ||
      error?.response?.data ||
      'No se pudo crear el país.';

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: backendMessage,
    });

    throw error;
  }
};


  const updatePais = async (idNum: number, nombreVal: string) => {
    try {
      const response = await axios.put(
        `${database}/api/paises/actualizar/${idNum}`,
        { nombre: nombreVal },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al editar Pais');
      Swal.fire({
        icon: 'success',
        title: 'Pais editado',
        text: 'El pais se editó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error('error:', error);

      // 👉 Tomamos el mensaje real del backend
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        'No se pudo editar el pais.';

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: backendMessage,
      });

      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modo === 'editar' && id) {
        await updatePais(Number(id), nombre);
      } else {
        await createPais(nombre);
      }
      if (onPaisesAdded) onPaisesAdded();
      navigate('/pais');
    } catch (error) {
      console.error('Error al guardar Pais:', error);
    }
  };

  const handleVolver = () => {
    navigate('/pais');
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
        Volver
      </button>
      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Pais' : 'Agregar Pais'}</h2>
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

export default ModalPais;
