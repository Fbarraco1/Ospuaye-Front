import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../../../auth/store/authStore';
import styles from './ModalLocalidad.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';

const database = import.meta.env.VITE_DATABASE;

interface Departamento {
  id: number;
  nombre: string;
}

export const ModalLocalidad: React.FC<{ modo?: 'editar' | 'crear'; onLocalidadAdded?: () => void }> = ({
  modo = 'crear',
  onLocalidadAdded
}) => {
  const { id } = useParams<{ id: string }>();
  const [nombre, setNombre] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');

  // AUTOCOMPLETE
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<Departamento[]>([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);

  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<Departamento | null>(null);

  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // 🔎 Llamada con debounce
  const buscarDepartamentos = useCallback(
    debounce(async (texto: string) => {
      if (!texto.trim()) {
        setResultados([]);
        return;
      }

      try {
        const res = await axios.get(`${database}/api/departamentos/buscar-simple?nombre=${texto}`);
        setResultados(res.data);
      } catch (error) {
        console.error('Error al buscar departamentos:', error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    buscarDepartamentos(busqueda);
  }, [busqueda, buscarDepartamentos]);

  // Si está en editar cargamos la localidad
  useEffect(() => {
    if (modo === 'editar' && id) {
      cargarLocalidad(id);
    }
  }, [id, modo]);

  const cargarLocalidad = async (localidadId: string) => {
    try {
      const res = await axios.get(`${database}/api/localidades/${localidadId}`);
      const l = res.data;

      setNombre(l.nombre || '');
      setCodigoPostal(l.codigoPostal || '');

      if (l.departamento) {
        const dep: Departamento = {
          id: l.departamento.id,
          nombre: l.departamento.nombre
        };
        setDepartamentoSeleccionado(dep);
        setBusqueda(dep.nombre);
      }
    } catch (error) {
      console.error('Error al cargar localidad:', error);
    }
  };

  const handleSeleccionarDepartamento = (dep: Departamento) => {
    setDepartamentoSeleccionado(dep);
    setBusqueda(dep.nombre);
    setMostrandoResultados(false);
    setResultados([]);
  };

  // Guardar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departamentoSeleccionado) {
      Swal.fire({ icon: 'warning', title: 'Selecciona un departamento antes de continuar' });
      return;
    }

    const data = {
      nombre,
      codigoPostal,
      departamento: { id: departamentoSeleccionado.id }
    };

    try {
      if (modo === 'editar' && id) {
        await axios.put(`${database}/api/localidades/actualizar/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({ icon: 'success', title: 'Localidad editada', timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${database}/api/localidades`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({ icon: 'success', title: 'Localidad creada', timer: 1500, showConfirmButton: false });
      }

      if (onLocalidadAdded) onLocalidadAdded();
      navigate('/localidad');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar la localidad.' });
    }
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={() => navigate('/localidad')} style={{ marginBottom: 10 }}>
        Volver
      </button>

      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Localidad' : 'Agregar Localidad'}</h2>

        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <label>Código Postal:</label>
          <input value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} required />

          {/* AUTOCOMPLETE DEPARTAMENTOS */}
          <label>Departamento:</label>
          <div className={styles.autocomplete}>
            <input
              type="text"
              placeholder="Escribe para buscar departamento..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrandoResultados(true);
              }}
              onFocus={() => setMostrandoResultados(true)}
            />

            {mostrandoResultados && resultados.length > 0 && (
              <ul className={styles.resultados}>
                {resultados.map((d) => (
                  <li key={d.id} onClick={() => handleSeleccionarDepartamento(d)}>
                    {d.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={() => navigate('/localidad')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalLocalidad;
