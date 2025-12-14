import React, { useEffect, useState } from 'react';
import styles from './ModalRol.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../../auth/store/authStore';
const database = import.meta.env.VITE_DATABASE;

interface ModalRolProps {
  modo?: 'editar' | 'crear';
  onRolAdded?: () => void;
}

interface Area {
  id: number;
  nombre: string;
}

const ModalRol: React.FC<ModalRolProps> = ({ modo = 'crear', onRolAdded }) => {
  const { id } = useParams<{ id: string }>();
  const [nombre, setNombre] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [area, setArea] = useState<number>(0);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerAreas();
    if (modo === 'editar' && id) {
      cargarRol(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, modo]);

  const obtenerAreas = async () => {
    try {
      const response = await axios.get(`${database}/api/areas`);
      setAreas(response.data);
    } catch (error) {
      console.error('Error al obtener Areas:', error);
    }
  };

  const cargarRol = async (rolId: string) => {
    try {
      const res = await axios.get(`${database}/api/roles/${rolId}`);
      const r = res.data;
      setNombre(r.nombre || '');
      setArea(r.area?.id || 0);
    } catch (error) {
      console.error('Error al cargar rol:', error);
    }
  };

  const createRol = async (nombreVal: string, areaId: number) => {
    try {
      const response = await axios.post(
        `${database}/api/roles/crear`,
        { nombre: nombreVal, area: { id: areaId } },
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
    } catch (error: any) {
      console.error('error:', error);

      // 👉 Tomamos el mensaje real del backend
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        'No se pudo crear el rol.';

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: backendMessage,
      });

      throw error;
    }
  };

  const updateRol = async (idNum: number, nombreVal: string, areaId: number) => {
    try {
      const response = await axios.put(
        `${database}/api/roles/${idNum}`,
        { nombre: nombreVal, area: { id: areaId } },
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
    } catch (error: any) {
      console.error('error:', error);

      // 👉 Tomamos el mensaje real del backend
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        'No se pudo editar el rol.';

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
        await updateRol(Number(id), nombre, area);
      } else {
        await createRol(nombre, area);
      }
      if (onRolAdded) onRolAdded();
      navigate('/roles');
    } catch (error) {
      console.error('Error al guardar Rol:', error);
    }
  };

  const handleVolver = () => {
    navigate('/roles');
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
        Volver
      </button>
      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Rol' : 'Agregar Rol'}</h2>
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
            <button type="button" onClick={handleVolver}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRol;
