import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ModalFamiliar.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
const database = import.meta.env.VITE_DATABASE;

type Parentesco =
  | 'Titular'
  | 'Conyuge'
  | 'Concubino_Concubina'
  | 'Hijo_Soltero_Menor_De_21'
  | 'Hijo_Soltero_Entre_21_25_Estudiando'
  | 'Hijo_Conyuge_Menor_De_21'
  | 'Hijo_Conyuge_Entre_21_25_Estudiando'
  | 'Menor_Bajo_Guarda_Tutela'
  | 'Familiar_A_Cargo'
  | 'Mayor_de_25_Discapacitado'
  | 'Solo_Parentescos'
  | 'Grupo_Familiar_Completos'
  | 'Sin_Informacion';

  type Sexo =
  | 'MASCULINO'
  | 'FEMENINO'
  |'SIN_INFORMACION'
  |'AMBOS_SEXOS'

interface Familiar {
  id?: number;
  grupoFamiliar?: { id: number };
  beneficiario: { id: number };
  nombre: string;
  apellido: string;
  dni: string;
  cuil: string;
  telefono: string;
  correoElectronico?: string;
  sexo: Sexo;
  nacionalidad: { id: number; nombre: string };
  tipoParentesco: Parentesco;
}

const ModalFamiliar: React.FC<{ modo?: 'editar' | 'crear' }> = ({ modo = 'crear' }) => {
  const { grupoId, beneficiarioId, id } = useParams<{ grupoId?: string; beneficiarioId?: string; id?: string }>();
  const [familiar, setFamiliar] = useState<Familiar>({
    grupoFamiliar: { id: Number(grupoId ?? 0) },
    beneficiario: { id: Number(beneficiarioId ?? 0) },
    nombre: '',
    apellido: '',
    dni: '',
    cuil: '',
    telefono: '',
    correoElectronico: '',
    sexo: 'SIN_INFORMACION',
    nacionalidad: { id: 0, nombre: '' },
    tipoParentesco: 'Sin_Informacion',
  });
  const [nacionalidades, setNacionalidades] = useState<{ id: number; nombre: string }[]>([]);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerNacionalidades();
    if (modo === 'editar' && id) cargarFamiliar(Number(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, modo, grupoId, beneficiarioId]);

  // Asegurar que el grupoFamiliar se setee cuando llega el param grupoId (especialmente al crear)
  useEffect(() => {
    if (grupoId) {
      setFamiliar(prev => ({
        ...prev,
        grupoFamiliar: { id: Number(grupoId) }
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupoId]);

  const obtenerNacionalidades = async () => {
    try {
      const response = await axios.get(`${database}/api/nacionalidades`);
      setNacionalidades(response.data);
    } catch (error) {
      console.error('Error al obtener Nacionalidades:', error);
    }
  };

  const cargarFamiliar = async (fid: number) => {
    try {
      const res = await axios.get(`${database}/api/familiares/${fid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const f = res.data;
      setFamiliar({
        id: f.id,
        grupoFamiliar: { id: f.grupoFamiliar?.id ?? Number(grupoId ?? 0) },
        beneficiario: { id: f.beneficiario?.id ?? Number(beneficiarioId ?? 0) },
        nombre: f.nombre ?? '',
        apellido: f.apellido ?? '',
        dni: f.dni ?? '',
        cuil: f.cuil ?? '',
        telefono: f.telefono ?? '',
        correoElectronico: f.correoElectronico ?? '',
        sexo: f.sexo ?? 'SIN_INFORMACION',
        nacionalidad: f.nacionalidad ?? { id: 0, nombre: '' },
        tipoParentesco: f.tipoParentesco ?? 'Sin_Informacion',
      });
    } catch (error) {
      console.error('Error al cargar familiar:', error);
    }
  };

  const createFamiliar = async (data: Familiar) => {
    try {
      const response = await axios.post(`${database}/api/familiares/crear`, data, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear familiar');
      Swal.fire({ icon: 'success', title: 'Familiar creado', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('Error al crear familiar:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el familiar.' });
      throw error;
    }
  };

  const updateFamiliar = async (data: Familiar) => {
    try {
      const response = await axios.put(`${database}/api/familiares/${id}`, data, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (response.status < 200 || response.status >= 300) throw new Error('Error al actualizar familiar');
      Swal.fire({ icon: 'success', title: 'Familiar actualizado', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('Error al actualizar familiar:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el familiar.' });
      throw error;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'nacionalidad') {
      const selected = nacionalidades.find(n => n.id === Number(value));
      setFamiliar(prev => ({ ...prev, nacionalidad: selected ? { id: selected.id, nombre: selected.nombre } : { id: 0, nombre: '' } }));
    } else {
      setFamiliar(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Familiar = {
        ...familiar,
        id: Number(id),
        grupoFamiliar:
          grupoId
            ? { id: Number(grupoId) }
            : familiar.grupoFamiliar?.id
            ? { id: familiar.grupoFamiliar.id }
            : undefined
      };
      if (modo === 'editar' && id) {
        await updateFamiliar(payload);
      } else {
        await createFamiliar(payload);
      }
      navigate('/grupoFamiliar');
    } catch (error) {
      console.error('Error al guardar familiar:', error);
    }
  };

  const handleVolver = () => navigate('/grupoFamiliar');

  return (
    <div className={styles.container}>
      <div className={styles.modalContent}>
        <h2>{modo === 'editar' ? 'Editar Miembro' : 'Agregar Miembro'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="text" name="nombre" value={familiar.nombre} onChange={handleChange} placeholder="Nombre" required />
          <input type="text" name="apellido" value={familiar.apellido} onChange={handleChange} placeholder="Apellido" required />
          <input type="text" name="dni" value={familiar.dni} onChange={handleChange} placeholder="DNI" required />
          <input type="text" name="cuil" value={familiar.cuil} onChange={handleChange} placeholder="Cuil" required />
          <input type="text" name="telefono" value={familiar.telefono} onChange={handleChange} placeholder="Teléfono" />
          <input type="text" name="correoElectronico" value={familiar.correoElectronico} onChange={handleChange} placeholder="Correo Electrónico" />
          <label>Sexo:</label>
          <select name="sexo" value={familiar.sexo} onChange={handleChange} required>
            <option value="SIN_INFORMACION">Sin información</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="AMBOS_SEXOS">Ambos sexos</option>
          </select>
          <label>Nacionalidad:</label>
          <select name="nacionalidad" value={familiar.nacionalidad.id} onChange={handleChange} required>
            <option value={0} disabled>Seleccione un país</option>
            {nacionalidades.map(n => (<option key={n.id} value={n.id}>{n.nombre}</option>))}
          </select>
          <label>Parentesco:</label>
          <select name="tipoParentesco" value={familiar.tipoParentesco} onChange={handleChange} required>
            <option value="Sin_Informacion">Sin información</option>
            <option value="Conyuge">Cónyuge</option>
            <option value="Hijo_Soltero_Menor_De_21">Hijo soltero menor de 21</option>
            <option value="Sin_Informacion">Sin información</option>
            <option value="Titular">Titular</option>
            <option value="Conyuge">Cónyuge</option>
            <option value="Concubino_Concubina">Concubino / Concubina</option>
            <option value="Hijo_Soltero_Menor_De_21">Hijo soltero menor de 21</option>
            <option value="Hijo_Soltero_Entre_21_25_Estudiando">Hijo soltero entre 21 y 25 (estudiando)</option>
            <option value="Hijo_Conyuge_Menor_De_21">Hijo del cónyuge menor de 21</option>
            <option value="Hijo_Conyuge_Entre_21_25_Estudiando">Hijo del cónyuge entre 21 y 25 (estudiando)</option>
            <option value="Menor_Bajo_Guarda_Tutela">Menor bajo guarda/tutela</option>
            <option value="Familiar_A_Cargo">Familiar a cargo</option>
            <option value="Mayor_de_25_Discapacitado">Mayor de 25 discapacitado</option>
            <option value="Solo_Parentescos">Solo parentescos</option>
            <option value="Grupo_Familiar_Completos">Grupo familiar completos</option>
           </select>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveButton}>Aceptar</button>
            <button type="button" onClick={handleVolver} className={styles.cancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFamiliar;