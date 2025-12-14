import React, { useEffect, useState, useCallback } from 'react';
import styles from './ModalEmpresa.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import { debounce } from 'lodash';
const database = import.meta.env.VITE_DATABASE;

interface Domicilio {
  id: number;
  calle: string;
  numeracion: string;
}

const ModalEmpresa: React.FC<{ modo?: 'editar' | 'crear'; onEmpresaAdded?: () => void }> = ({ modo = 'crear', onEmpresaAdded }) => {
  const { id } = useParams<{ id: string }>();
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [domicilio, setDomicilio] = useState<number>(0);

  // Autocomplete dinamico para domicilio (basado en ModalProvincia)
  const [busquedaDomicilio, setBusquedaDomicilio] = useState('');
  const [resultadosDomicilios, setResultadosDomicilios] = useState<Domicilio[]>([]);
  const [mostrandoResultadosDomicilios, setMostrandoResultadosDomicilios] = useState(false);

  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (modo === 'editar' && id) {
      cargarEmpresa(id);
    }
  }, [id, modo]);

  const cargarEmpresa = async (empresaId: string) => {
    try {
      const res = await axios.get(`${database}/api/empresas/${empresaId}`);
      const e = res.data;
      setCuit(e.cuit ?? '');
      setRazonSocial(e.razonSocial ?? '');
      setDomicilio(e.domicilio?.id ?? 0);
      // mostrar texto del domicilio en el campo de búsqueda
      setBusquedaDomicilio(e.domicilio ? `${e.domicilio.calle} ${e.domicilio.numeracion}` : '');
    } catch (error) {
      console.error('Error al cargar empresa:', error);
    }
  };

  // Debounce para buscar domicilios (cambia endpoint si lo deseas)
  const buscarDomicilios = useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setResultadosDomicilios([]);
        return;
      }
      try {
        // endpoint ejemplo: /api/domicilios/buscar?query=...
        const res = await axios.get(`${database}/api/domicilios/buscar-simple?filtro=${encodeURIComponent(q)}`);
        setResultadosDomicilios(res.data);
      } catch (error) {
        console.error('Error al buscar domicilios:', error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    buscarDomicilios(busquedaDomicilio);
  }, [busquedaDomicilio, buscarDomicilios]);

  const createEmpresa = async (cuit: string, razonSocial: string, domicilioId: number) => {
    try {
      const response = await axios.post(
        `${database}/api/empresas/crear`,
        { cuit, razonSocial, domicilio: { id: domicilioId } },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear Empresa');
      Swal.fire({
        icon: 'success',
        title: 'Empresa creada',
        text: 'La empresa se creó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error('error:', error);

      // 👉 Tomamos el mensaje real del backend
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        'No se pudo crear la empresa.';

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: backendMessage,
      });

      throw error;
    }
  };

  const updateEmpresa = async (idNum: number, cuit: string, razonSocial: string, domicilioId: number) => {
    try {
      const response = await axios.put(
        `${database}/api/empresas/${idNum}`,
        { cuit, razonSocial, domicilio: { id: domicilioId } },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al editar Empresa');
      Swal.fire({
        icon: 'success',
        title: 'Empresa editada',
        text: 'La empresa se editó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error('error:', error);

      // 👉 Tomamos el mensaje real del backend
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        'No se pudo editar la empresa.';

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: backendMessage,
      });

      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domicilio || domicilio === 0) {
      Swal.fire({ icon: 'warning', title: 'Selecciona un domicilio antes de continuar' });
      return;
    }
    try {
      if (modo === 'editar' && id) {
        await updateEmpresa(Number(id), cuit, razonSocial, domicilio);
      } else {
        await createEmpresa(cuit, razonSocial, domicilio);
      }
      if (onEmpresaAdded) onEmpresaAdded();
      navigate('/empresa');
    } catch (error) {
      // ya manejado en funciones
    }
  };

  const handleVolver = () => {
    navigate('/empresa');
  };

  const handleSeleccionarDomicilio = (d: Domicilio) => {
    setDomicilio(d.id);
    setBusquedaDomicilio(`${d.calle} ${d.numeracion}`);
    setMostrandoResultadosDomicilios(false);
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
        Volver
      </button>
      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Empresa' : 'Agregar Empresa'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Cuit:</label>
          <input
            type="number"
            value={cuit}
            onChange={(e) => setCuit(e.target.value)}
            required
          />
          <label>Razon Social:</label>
          <input
            type="text"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            required
          />
          <label>Domicilio:</label>
          <div className={styles.autocomplete}>
            <input
              type="text"
              placeholder="Escribe para buscar domicilio..."
              value={busquedaDomicilio}
              onChange={(e) => {
                setBusquedaDomicilio(e.target.value);
                setMostrandoResultadosDomicilios(true);
                // limpiar id de domicilio si se edita el texto
                setDomicilio(0);
              }}
              onFocus={() => setMostrandoResultadosDomicilios(true)}
              required
            />

            {mostrandoResultadosDomicilios && resultadosDomicilios.length > 0 && (
              <ul className={styles.resultados}>
                {resultadosDomicilios.map((d) => (
                  <li key={d.id} onClick={() => handleSeleccionarDomicilio(d)}>
                    {d.calle} {d.numeracion}
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

export default ModalEmpresa;
