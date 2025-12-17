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

  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [calle, setCalle] = useState('');
  const [numeracion, setNumeracion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [manzanaPiso, setManzanaPiso] = useState('');
  const [casaDepartamento, setCasaDepartamento] = useState('');
  const [referencia, setReferencia] = useState('');

  // 🔎 búsqueda localidades
  const [searchLocalidad, setSearchLocalidad] = useState('');
  const [localidadesFiltradas, setLocalidadesFiltradas] = useState<Localidad[]>([]);
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState<number>(0);

  const [tipoDomicilio, setTipoDomicilio] = useState<
    'DOMICILIO_COMPLETO' | 'DOMICILIO_RURAL' | 'Sin definir'
  >('Sin definir');

  useEffect(() => {
    if (modo === 'editar' && id) cargarDomicilio(id);
  }, [id, modo]);

  /** 🔎 Buscar localidades mientras escribe */
  useEffect(() => {
    if (searchLocalidad.trim().length < 2) {
      setLocalidadesFiltradas([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      buscarLocalidades(searchLocalidad);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchLocalidad]);

  const buscarLocalidades = async (filtro: string) => {
    try {
      const res = await axios.get(
        `${database}/api/localidades/buscar-simple?nombre=${filtro}`
      );
      setLocalidadesFiltradas(res.data);
    } catch (e) {
      console.error('Error buscando localidades', e);
    }
  };

  const cargarDomicilio = async (domId: string) => {
    try {
      const res = await axios.get(`${database}/api/domicilios/${domId}`);
      const d = res.data;

      setCalle(d.calle || '');
      setNumeracion(d.numeracion || '');
      setBarrio(d.barrio || '');
      setManzanaPiso(d.manzanaPiso || '');
      setCasaDepartamento(d.casaDepartamento || '');
      setReferencia(d.referencia || '');

      // asignar localidad existente
      if (d.localidad) {
        setLocalidadSeleccionada(d.localidad.id);
        setSearchLocalidad(d.localidad.nombre);
      }

      setTipoDomicilio(d.tipoDomicilio || 'Sin definir');

    } catch (e) {
      console.error('Error cargando domicilio', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!localidadSeleccionada) {
      Swal.fire({
        icon: 'warning',
        title: 'Seleccione una localidad válida',
      });
      return;
    }

    try {
      if (modo === 'editar' && id) {
        await axios.put(
          `${database}/api/domicilios/${id}`,
          {
            calle,
            numeracion,
            barrio,
            manzanaPiso,
            casaDepartamento,
            referencia,
            activo: true,
            localidad: { id: localidadSeleccionada },
            tipoDomicilio,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        Swal.fire('Éxito', 'Domicilio actualizado correctamente', 'success');
      } else {
        await axios.post(
          `${database}/api/domicilios/crear`,
          {
            calle,
            numeracion,
            barrio,
            manzanaPiso,
            casaDepartamento,
            referencia,
            localidad: { id: localidadSeleccionada },
            tipoDomicilio,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire('Éxito', 'Domicilio creado correctamente', 'success');
      }

      onDomicilioAdded?.();
      navigate('/domicilio');

    } catch (e: any) {
      console.error('Error guardando domicilio', e);
      const backendMessage = e?.response?.data?.message || e?.response?.data || 'No se pudo guardar el domicilio';
      Swal.fire('Error', backendMessage, 'error');
    }
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={() => navigate('/domicilio')} style={{ marginBottom: 10 }}>
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
          <input
            type="text"
            value={searchLocalidad}
            onChange={(e) => setSearchLocalidad(e.target.value)}
            placeholder="Buscar localidad..."
          />

          {localidadesFiltradas.length > 0 && (
            <ul className={styles.dropdown}>
              {localidadesFiltradas.map((loc) => (
                <li
                  key={loc.id}
                  onClick={() => {
                    setLocalidadSeleccionada(loc.id);
                    setSearchLocalidad(loc.nombre);
                    setLocalidadesFiltradas([]);
                  }}
                >
                  {loc.nombre} ({loc.codigoPostal})
                </li>
              ))}
            </ul>
          )}

          <label>Tipo:</label>
          <select
            value={tipoDomicilio}
            onChange={(e) => setTipoDomicilio(e.target.value as any)}
            required
          >
            <option value="Sin definir" disabled>Seleccione un Tipo</option>
            <option value="DOMICILIO_COMPLETO">URBANO</option>
            <option value="DOMICILIO_RURAL">RURAL</option>
          </select>

          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={() => navigate('/domicilio')}>
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ModalDomicilio;
