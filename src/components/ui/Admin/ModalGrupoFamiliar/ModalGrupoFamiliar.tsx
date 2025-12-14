import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ModalGrupoFamiliar.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import { debounce } from 'lodash';

const database = import.meta.env.VITE_DATABASE;

interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
}

const ModalGrupoFamiliar: React.FC<{ modo?: 'editar' | 'crear'; onGrupoFamiliarAdded?: () => void }> = ({
  modo = 'crear',
  onGrupoFamiliarAdded
}) => {

  const { id } = useParams<{ id?: string }>();
  const [nombreGrupo, setNombreGrupo] = useState('');

  // 🔵 AUTOCOMPLETADO DEL TITULAR
  const [titularTexto, setTitularTexto] = useState('');
  const [titularId, setTitularId] = useState<number | null>(null);
  const [sugerencias, setSugerencias] = useState<Beneficiario[]>([]);
  const [showSug, setShowSug] = useState(false);

  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (modo === 'editar' && id) cargarGrupo(Number(id));
  }, [id, modo]);

  // Debounced fetch para buscar titulares (reemplaza timerRef)
  const buscarTitularesDebounced = useCallback(
    debounce(async (texto: string) => {
      if (texto.trim().length < 2) {
        setSugerencias([]);
        return;
      }
      try {
        const res = await axios.get(
          `${database}/api/beneficiarios/buscar-simple?filtro=${texto}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSugerencias(res.data);
        setShowSug(true);
      } catch (err) {
        console.error("Error al buscar titulares:", err);
      }
    }, 350),
    [token]
  );

  // cleanup del debounce al desmontar
  useEffect(() => {
    return () => {
      buscarTitularesDebounced.cancel?.();
    };
  }, [buscarTitularesDebounced]);

  // ===============================================================
  // 🔵 AUTOCOMPLETADO: BUSCAR TITULAR (usa debounce)
  // ===============================================================
  const handleTitularChange = (texto: string) => {
    setTitularTexto(texto);
    setTitularId(null);
    buscarTitularesDebounced(texto);
  };

  const seleccionarTitular = (b: Beneficiario) => {
    setTitularTexto(`${b.nombre} ${b.apellido}`);
    setTitularId(b.id);
    setShowSug(false);
  };


  // ===============================================================
  // CARGAR GRUPO EN MODO EDITAR
  // ===============================================================
  const cargarGrupo = async (grupoId: number) => {
    try {
      const res = await axios.get(`${database}/api/grupoFamiliar/${grupoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const g = res.data;
      setNombreGrupo(g.nombreGrupo || '');

      if (g.titular) {
        setTitularId(g.titular.id);
        setTitularTexto(`${g.titular.nombre} ${g.titular.apellido}`);
      }

    } catch (error) {
      console.error("Error al cargar grupo familiar:", error);
    }
  };


  // ===============================================================
  // CREAR
  // ===============================================================
  const createGrupoFamiliar = async () => {
    if (!titularId) {
      return Swal.fire("Error", "Debe seleccionar un titular válido", "error");
    }

    try {
      await axios.post(
        `${database}/api/grupoFamiliar/crear`,
        {
          nombreGrupo,
          titular: { id: titularId },
          fechaAlta: new Date(),
          activo: true,
          familiares: []
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({ icon: 'success', title: 'Grupo familiar creado', timer: 1500, showConfirmButton: false });

    } catch (error: any) {
      console.error(error);
      const backendMessage = error?.response?.data?.message || error?.response?.data || "No se pudo crear el grupo familiar";
      Swal.fire("Error", backendMessage, "error");
    }
  };

  // ===============================================================
  // EDITAR
  // ===============================================================
  const updateGrupoFamiliar = async (grupoId: number) => {
    if (!titularId) {
      return Swal.fire("Error", "Debe seleccionar un titular válido", "error");
    }

    try {
      await axios.put(
        `${database}/api/grupoFamiliar/${grupoId}`,
        {
          nombreGrupo,
          titular: { id: titularId },
          fechaAlta: new Date(),
          activo: true
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({ icon: 'success', title: 'Grupo familiar editado', timer: 1500, showConfirmButton: false });

    } catch (error: any) {
      console.error(error);
      const backendMessage = error?.response?.data?.message || error?.response?.data || "No se pudo editar el grupo familiar";
      Swal.fire("Error", backendMessage, "error");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modo === "editar" && id) await updateGrupoFamiliar(Number(id));
    else await createGrupoFamiliar();

    if (onGrupoFamiliarAdded) onGrupoFamiliarAdded();
    navigate('/grupoFamiliar');
  };


  return (
    <div className={styles.container}>
      <button type="button" onClick={() => navigate('/grupoFamiliar')} style={{ marginBottom: 10 }}>
        Volver
      </button>

      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Grupo Familiar' : 'Agregar Grupo Familiar'}</h2>

        <form onSubmit={handleSubmit}>
          
          <label>Nombre del Grupo:</label>
          <input
            type="text"
            value={nombreGrupo}
            onChange={(e) => setNombreGrupo(e.target.value)}
            required
          />

          {/* ======================================================= */}
          {/* AUTOCOMPLETADO TITULAR */}
          {/* ======================================================= */}
          <label>Titular:</label>
          <input
            type="text"
            value={titularTexto}
            onChange={(e) => handleTitularChange(e.target.value)}
            placeholder="Buscar titular por nombre, apellido, DNI o CUIL..."
            autoComplete="off"
            required
          />

          {showSug && sugerencias.length > 0 && (
            <div className={styles.sugerenciasBox}>
              {sugerencias.map((b) => (
                <div
                  key={b.id}
                  className={styles.sugerenciaItem}
                  onClick={() => seleccionarTitular(b)}
                >
                  {b.nombre} {b.apellido}
                </div>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={() => navigate('/grupoFamiliar')}>Cancelar</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ModalGrupoFamiliar;
