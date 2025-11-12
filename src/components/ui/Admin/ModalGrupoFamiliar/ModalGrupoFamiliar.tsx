import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ModalGrupoFamiliar.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
const database = import.meta.env.VITE_DATABASE;

interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
}

const ModalGrupoFamiliar: React.FC<{ modo?: 'editar' | 'crear'; onGrupoFamiliarAdded?: () => void }> = ({ modo = 'crear', onGrupoFamiliarAdded }) => {
  const { id } = useParams<{ id?: string }>();
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [titular, setTitular] = useState<number>(0);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerBeneficiarios();
    if (modo === 'editar' && id) cargarGrupo(Number(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, modo]);

  const obtenerBeneficiarios = async () => {
    try {
      const response = await axios.get(`${database}/api/beneficiarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBeneficiarios(response.data);
    } catch (error) {
      console.error('Error al obtener Beneficiarios:', error);
    }
  };

  const cargarGrupo = async (grupoId: number) => {
    try {
      const res = await axios.get(`${database}/api/grupoFamiliar/${grupoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const g = res.data;
      setNombreGrupo(g.nombreGrupo || '');
      setTitular(g.titular?.id || 0);
    } catch (error) {
      console.error('Error al cargar grupo familiar:', error);
    }
  };

  const createGrupoFamiliar = async (nombre: string, titularId: number) => {
    try {
      const response = await axios.post(
        `${database}/api/grupoFamiliar/crear`,
        { nombreGrupo: nombre, titular: { id: titularId }, fechaAlta: new Date(), activo: true, familiares: [] },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Grupo Familiar');
      Swal.fire({ icon: 'success', title: 'Grupo familiar creado', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el grupo familiar.' });
      throw error;
    }
  };

  const updateGrupoFamiliar = async (grupoId: number, nombre: string, titularId: number) => {
    try {
      const response = await axios.put(
        `${database}/api/grupoFamiliar/${grupoId}`,
        { nombreGrupo: nombre, titular: { id: titularId }, fechaAlta: new Date(), activo: true },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al editar Grupo Familiar');
      Swal.fire({ icon: 'success', title: 'Grupo familiar editado', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo editar el grupo familiar.' });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modo === 'editar' && id) {
        await updateGrupoFamiliar(Number(id), nombreGrupo, titular);
      } else {
        await createGrupoFamiliar(nombreGrupo, titular);
      }
      if (onGrupoFamiliarAdded) onGrupoFamiliarAdded();
      navigate('/grupoFamiliar');
    } catch (error) {
      console.error('Error al guardar Grupo Familiar:', error);
    }
  };

  const handleVolver = () => navigate('/grupoFamiliar');

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>Volver</button>
      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Grupo Familiar' : 'Agregar Grupo Familiar'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre del Grupo:</label>
          <input type="text" value={nombreGrupo} onChange={(e) => setNombreGrupo(e.target.value)} required />
          <label>Titular:</label>
          <select value={titular} onChange={(e) => setTitular(Number(e.target.value))} required>
            <option value={0} disabled>Seleccione un titular</option>
            {beneficiarios.map((b) => (<option key={b.id} value={b.id}>{b.nombre} {b.apellido}</option>))}
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

export default ModalGrupoFamiliar;
