import { useEffect, useState } from 'react';
import styles from './ModalDomicilio.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface ModalDomicilioProps {
  modo?: 'editar' | 'crear';
  onDomicilioAdded?: () => void;
}
interface Localidad {
    id: number;
    nombre: string;
    codigoPostal: string;
}

export const ModalDomicilio: React.FC<ModalDomicilioProps> = ({ modo = 'crear', onDomicilioAdded }) => {
  const { id } = useParams<{ id: string }>();
  const [calle, setCalle] = useState('');
  const [numeracion, setNumeracion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [manzanaPiso, setManzanaPiso] = useState('');
  const [casaDepartamento, setCasaDepartamento] = useState('');
  const [referencia, setReferencia] = useState('');
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [localidad, setLocalidad] = useState<number>(0);
  const [tipo, setTipo] = useState<'DOMICILIO_COMPLETO' | 'DOMICILIO_RURAL' | 'Sin definir' >('Sin definir');
  
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerLocalidades();
    if (modo === 'editar' && id) {
      cargarDomicilio(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, modo]);

  const obtenerLocalidades = async () => {
    try {
      const response = await axios.get(`${database}/api/localidades`);
      setLocalidades(response.data);
    } catch (error) {
      console.error('Error al obtener Localidades:', error);
    }
  };

  const cargarDomicilio = async (domicilioId: string) => {
    try {
      const res = await axios.get(`${database}/api/domicilios/${domicilioId}`);
      const d = res.data;
      setCalle(d.calle || '');
      setNumeracion(d.numeracion || '');
      setBarrio(d.barrio || '');
      setManzanaPiso(d.manzanaPiso || '');
      setCasaDepartamento(d.casaDepartamento || '');
      setReferencia(d.referencia || '');
      setLocalidad(d.localidad?.id || 0);
      setTipo(d.tipo || 'Sin definir');
    } catch (error) {
      console.error('Error al cargar domicilio:', error);
    }
  };

  const updateDomicilio = async (
    idNum: number,
    calle: string,
    numeracion: string,
    barrio: string,
    manzanaPiso: string,
    casaDepartamento:string,
    referencia:string,
    activo: Boolean,
    localidadId:number,
    tipoVal: 'DOMICILIO_COMPLETO' | 'DOMICILIO_RURAL',
  ) => {
    try {
      const response = await axios.put(
        `${database}/api/domicilios/${idNum}`,
        { calle, numeracion, barrio, manzanaPiso, casaDepartamento, referencia, activo, localidad: { id: localidadId }, tipo: tipoVal },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al editar domicilio');
      Swal.fire({
        icon: 'success',
        title: 'Domicilio editado',
        text: 'El domicilio se editó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo editar el domicilio.',
      });
      throw error;
    }
  }
  const createDomicilio = async (
    calle: string,
    numeracion: string,
    barrio: string,
    manzanaPiso: string,
    casaDepartamento:string,
    referencia:string,
    localidadId: number,
    tipoVal: 'DOMICILIO_COMPLETO' | 'DOMICILIO_RURAL' | 'Sin definir'
  ) => {
    try {
      const response = await axios.post(
        `${database}/api/domicilios/crear`,
        { calle, numeracion, barrio, manzanaPiso, casaDepartamento, referencia, localidad: { id: localidadId }, tipo: tipoVal },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Domicilio');
      Swal.fire({
        icon: 'success',
        title: 'Domicilio creado',
        text: 'El domicilio se creó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el domicilio.',
      });
      throw error;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modo === 'editar' && id) {
        await updateDomicilio(Number(id), calle, numeracion, barrio, manzanaPiso, casaDepartamento, referencia, true, localidad, tipo as 'DOMICILIO_COMPLETO' | 'DOMICILIO_RURAL');
      } else {
        await createDomicilio(calle, numeracion, barrio, manzanaPiso, casaDepartamento, referencia, localidad, tipo);
      }
      if (onDomicilioAdded) onDomicilioAdded();
      navigate('/domicilio');
    } catch (error) {
      console.error('Error al guardar domicilio:', error);
    }
  };

  const handleVolver = () => {
    navigate('/domicilio');
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
        Volver
      </button>
      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Domicilio' : 'Agregar Domicilio'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Calle:</label>
          <input
            type="text"
            value={calle}
            onChange={(e) => setCalle(e.target.value)}
            required
          />
          <label>Numeracion:</label>
          <input
            type="text"
            value={numeracion}
            onChange={(e) => setNumeracion(e.target.value)}
            required
          />  
          <label>Barrio:</label>
          <input
            type="text"
            value={barrio}
            onChange={(e) => setBarrio(e.target.value)}
            required
          /> 
          <label>Manzana/Piso:</label>
          <input
            type="text"
            value={manzanaPiso}
            onChange={(e) => setManzanaPiso(e.target.value)}
            required
          /> 

          <label>Casa/Departamento:</label>
          <input
            type="text"
            value={casaDepartamento}
            onChange={(e) => setCasaDepartamento(e.target.value)}
            required
          /> 
          <label>Referencia:</label>
          <input
            type="text"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            required
          />                             
          <label>Localidad:</label>
          <select
            value={localidad}
            onChange={(e) => setLocalidad(Number(e.target.value))}
            required
            >
            <option value={0} disabled>Seleccione una Localidad</option>
            {localidades.map((a) => (
                <option key={a.id} value={a.id}>
                {a.nombre}
                </option>
            ))}
           </select>

            <label>Tipo:</label>
            <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'DOMICILIO_COMPLETO' | 'DOMICILIO_RURAL' | 'Sin definir')}
            required
            >
            <option value="Sin definir" disabled>Seleccione un Tipo</option>
            <option value="DOMICILIO_COMPLETO">URBANO</option>
            <option value="DOMICILIO_RURAL">RURAL</option>
           </select>

          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={handleVolver}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ModalDomicilio;
