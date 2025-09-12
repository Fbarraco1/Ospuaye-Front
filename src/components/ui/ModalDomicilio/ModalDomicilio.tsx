import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalDomicilio.module.css';
import axios from 'axios';

interface ModalDomicilioProps {
  isOpen: boolean;
  onClose: () => void;
  onDomicilioAdded?: () => void;
}
interface Localidad {
    id: number;
    nombre: string;
    codigoPostal: string;
}


export const ModalDomicilio: React.FC<ModalDomicilioProps> = ({ isOpen, onClose, onDomicilioAdded }) => {
  const [calle, setCalle] = useState('');
  const [numeracion, setNumeracion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [manzanaPiso, setManzanaPiso] = useState('');
  const [casaDepartamento, setCasaDepartamento] = useState('');
  const [referencia, setReferencia] = useState('');
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [localidad, setLocalidad] = useState<number>(0);
  const [tipo, setTipo] = useState<'URBANO' | 'RURAL' | 'Sin definir' >('Sin definir');
  
  const token = useAuthStore((state) => state.token);

    useEffect(() => {
    obtenerLocalidades();
  }, []);

  const obtenerLocalidades = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/localidades', {
      });
      setLocalidades(response.data);
    } catch (error) {
      console.error('Error al obtener Localidades:', error);
    }
  };

  const createDomicilio = async (
    calle: string,
    numeracion: string,
    barrio: string,
    manzanaPiso: string,
    casaDepartamento:string,
    referencia:string,
    localidad: number,
    tipo: 'URBANO' | 'RURAL' | 'Sin definir'

  ) => {
        try {
      const response = await axios.post(
        'http://localhost:9000/api/domicilios/crear',
        { calle, numeracion, barrio, manzanaPiso, casaDepartamento, referencia, localidad: { id: localidad }, tipo }, // <-- Cambia aquí
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Domicilio');
      // const data = response.data;
    } catch (error) {
      console.error('error:', error);
    }
  }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await createDomicilio(calle, numeracion, barrio, manzanaPiso, casaDepartamento, referencia, localidad, tipo);
      
        if (onDomicilioAdded) onDomicilioAdded();
        onClose();
      } catch (error) {
        console.error('Error al crear domicilio:', error);
      }
      handleClose();
    };
  
    const handleClose = () => {
      setCalle('');
      setNumeracion('');
      setBarrio('');
      setManzanaPiso('');
      setCasaDepartamento('');
      setReferencia('');
      setLocalidad(0);
      setTipo('Sin definir');
      onClose();
    };
  
    if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar Localidad</h2>
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
            onChange={(e) => setTipo(e.target.value as 'URBANO' | 'RURAL' | 'Sin definir')}
            required
            >
            <option value="Sin definir" disabled>Seleccione un Tipo</option>
            <option value="URBANO">URBANO</option>
            <option value="RURAL">RURAL</option>
           </select>

          <div className={styles.actions}>
            <button type="submit">Agregar</button>
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
