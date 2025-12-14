import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import styles from './ModalProvincia.module.css';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../../auth/store/authStore';

const database = import.meta.env.VITE_DATABASE;

interface Pais {
  id: number;
  nombre: string;
}

const ModalProvincia: React.FC<{ modo?: 'editar' | 'crear'; onProvinciaAdded?: () => void }> = ({ modo = 'crear', onProvinciaAdded }) => {
  const { id } = useParams<{ id: string }>();
  const [nombre, setNombre] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState<Pais | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<Pais[]>([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // 🔎 Llamada con debounce para evitar spam al backend
  const buscarPaises = useCallback(
    debounce(async (nombre: string) => {
      if (!nombre.trim()) {
        setResultados([]);
        return;
      }
      try {
        const res = await axios.get(`${database}/api/paises/buscar-simple?nombre=${nombre}`);
        setResultados(res.data);
      } catch (error) {
        console.error('Error al buscar países:', error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    buscarPaises(busqueda);
  }, [busqueda, buscarPaises]);

  useEffect(() => {
    const cargarProvincia = async (provId: string) => {
      try {
        const res = await axios.get(`${database}/api/provincias/${provId}`);
        const p = res.data;
        setNombre(p.nombre || '');
        if (p.pais) {
          const paisData: Pais = { id: p.pais.id, nombre: p.pais.nombre };
          setPaisSeleccionado(paisData);
          setBusqueda(paisData.nombre);
        }
      } catch (error) {
        console.error('Error al cargar provincia:', error);
      }
    };

    if (modo === 'editar' && id) {
      cargarProvincia(id);
    }
  }, [id, modo]);

  const handleSeleccionarPais = (pais: Pais) => {
    setPaisSeleccionado(pais);
    setBusqueda(pais.nombre);
    setMostrandoResultados(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paisSeleccionado) {
      Swal.fire({ icon: 'warning', title: 'Selecciona un país antes de continuar' });
      return;
    }

    try {
      const data = { nombre, pais: { id: paisSeleccionado.id } };
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

      if (modo === 'editar' && id) {
        await axios.put(`${database}/api/provincias/${id}`, data, { headers });
        Swal.fire({ icon: 'success', title: 'Provincia editada', timer: 1500, showConfirmButton: false });
      } else {
        await axios.post(`${database}/api/provincias/crear`, data, { headers });
        Swal.fire({ icon: 'success', title: 'Provincia creada', timer: 1500, showConfirmButton: false });
      }

      if (onProvinciaAdded) onProvinciaAdded();
      navigate('/provincia');
    } catch (error: any) {
      console.error('error:', error);
      const backendMessage = error?.response?.data?.message || error?.response?.data || 'No se pudo guardar la provincia.';
      Swal.fire({ icon: 'error', title: 'Error', text: backendMessage });
      throw error;
    }
  };

  const handleVolver = () => navigate('/provincia');

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>Volver</button>

      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Provincia' : 'Agregar Provincia'}</h2>

        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <label>País:</label>
          <div className={styles.autocomplete}>
            <input
              type="text"
              placeholder="Escribe para buscar país..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setMostrandoResultados(true);
              }}
              onFocus={() => setMostrandoResultados(true)}
            />

            {mostrandoResultados && resultados.length > 0 && (
              <ul className={styles.resultados}>
                {resultados.map((p) => (
                  <li key={p.id} onClick={() => handleSeleccionarPais(p)}>
                    {p.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={handleVolver}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProvincia;
