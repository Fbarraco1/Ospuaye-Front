import React, { useEffect, useState } from 'react';
import styles from './EditarFamiliar.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../../auth/store/authStore';
const database = import.meta.env.VITE_DATABASE;

type Parentesco = any;
type Sexo = any;

interface Familiar {
  id: number;
  grupoFamiliar: { id: number };
  beneficiario: { id: number };
  nombre: string;
  apellido: string;
  dni: string;
  cuil: string;
  telefono: string;
  tipoParentesco: Parentesco;
  correoElectronico?: string;
  sexo?: Sexo;
  nacionalidad?: { id: number; nombre: string };
}

const EditarFamiliar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [familiar, setFamiliar] = useState<Familiar | null>(null);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [nacionalidades, setNacionalidades] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    if (id) cargarFamiliar(Number(id));
    obtenerNacionalidades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const obtenerNacionalidades = async () => {
    try {
      const res = await axios.get(`${database}/api/nacionalidades`);
      setNacionalidades(res.data);
    } catch (error) {
      console.error('Error al obtener nacionalidades:', error);
    }
  };

  const cargarFamiliar = async (fid: number) => {
    try {
      const res = await axios.get(`${database}/api/familiares/${fid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFamiliar(res.data);
    } catch (error) {
      console.error('Error al cargar familiar:', error);
    }
  };

  const updateFamiliar = async (data: Familiar) => {
    try {
      const response = await axios.put(`${database}/api/familiares/actualizar`, data, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (response.status < 200 || response.status >= 300) throw new Error('Error al actualizar familiar');
      Swal.fire({ icon: 'success', title: 'Familiar actualizado', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('Error al actualizar familiar:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el familiar.' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFamiliar(prev => prev ? ({ ...prev, [name]: value }) : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familiar) return;
    await updateFamiliar(familiar);
    navigate('/grupoFamiliar');
  };

  if (!familiar) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Editar Familiar</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="text" name="nombre" value={familiar.nombre} onChange={handleChange} required />
          <input type="text" name="apellido" value={familiar.apellido} onChange={handleChange} required />
          <input type="text" name="dni" value={familiar.dni} onChange={handleChange} required />
          <input type="text" name="cuil" value={familiar.cuil} onChange={handleChange} required />
          <input type="text" name="telefono" value={familiar.telefono} onChange={handleChange} required />
          <select name="sexo" value={familiar.sexo ?? 'SIN_INFORMACION'} onChange={handleChange}>
            <option value="SIN_INFORMACION">Sin información</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
          </select>
          <select name="nacionalidad" value={familiar.nacionalidad?.id ?? 0} onChange={handleChange}>
            <option value={0} disabled>Seleccione nacionalidad</option>
            {nacionalidades.map(n => (<option key={n.id} value={n.id}>{n.nombre}</option>))}
          </select>
          <select name="tipoParentesco" value={familiar.tipoParentesco} onChange={handleChange} required>
            <option value="Sin_Informacion">Sin información</option>
            <option value="Conyuge">Cónyuge</option>
            <option value="Hijo_Soltero_Menor_De_21">Hijo soltero menor de 21</option>
          </select>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveButton}>Aceptar</button>
            <button type="button" onClick={() => navigate('/grupoFamiliar')} className={styles.cancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarFamiliar;
