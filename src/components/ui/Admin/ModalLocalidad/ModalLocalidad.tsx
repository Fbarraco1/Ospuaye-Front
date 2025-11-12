import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../auth/store/authStore';
import styles from './ModalLocalidad.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface ModalLocalidadProps {
  modo?: 'editar' | 'crear';
  onLocalidadAdded?: () => void;
}

interface Departamento {
  id: number;
  nombre: string;
}

export const ModalLocalidad: React.FC<ModalLocalidadProps> = ({ modo = 'crear', onLocalidadAdded }) => {
  const { id } = useParams<{ id: string }>();
  const [nombre, setNombre] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [departamento, setDepartamento] = useState<number>(0);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerDepartamentos();
    if (modo === 'editar' && id) {
      cargarLocalidad(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, modo]);

  const obtenerDepartamentos = async () => {
    try {
      const response = await axios.get(`${database}/api/departamentos`);
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error al obtener Departamentos:', error);
    }
  };

  const cargarLocalidad = async (localidadId: string) => {
    try {
      const res = await axios.get(`${database}/api/localidades/${localidadId}`);
      const l = res.data;
      setNombre(l.nombre || '');
      setCodigoPostal(l.codigoPostal || '');
      setDepartamento(l.departamento?.id || 0);
    } catch (error) {
      console.error('Error al cargar localidad:', error);
    }
  };

  const createLocalidad = async (nombreVal: string, codigoPostalVal: string, departamentoId: number) => {
    try {
      const response = await axios.post(
        `${database}/api/localidades`,
        { nombre: nombreVal, codigoPostal: codigoPostalVal, departamento: { id: departamentoId } },
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
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la localidad.',
      });
      throw error;
    }
  };

  const updateLocalidad = async (idNum: number, nombreVal: string, codigoPostalVal: string, departamentoId: number) => {
    try {
      const response = await axios.put(
        `${database}/api/localidades/${idNum}`,
        { nombre: nombreVal, codigoPostal: codigoPostalVal, departamento: { id: departamentoId } },
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
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modo === 'editar' && id) {
        await updateLocalidad(Number(id), nombre, codigoPostal, departamento);
      } else {
        await createLocalidad(nombre, codigoPostal, departamento);
      }
      if (onLocalidadAdded) onLocalidadAdded();
      navigate('/localidad');
    } catch (error) {
      // ya manejado en funciones
    }
  };

  const handleVolver = () => {
    navigate('/localidad');
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
        Volver
      </button>
      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Localidad' : 'Agregar Localidad'}</h2>
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
          <label>Departamento:</label>
          <select
            value={departamento}
            onChange={(e) => setDepartamento(Number(e.target.value))}
            required
          >
            <option value={0} disabled>Seleccione un Departamento</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
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

export default ModalLocalidad;
