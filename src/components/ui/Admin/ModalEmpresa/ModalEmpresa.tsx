import React, { useEffect, useState } from 'react';
import styles from './ModalEmpresa.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [domicilio, setDomicilio] = useState<number>(0);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerDomicilios();
    if (modo === 'editar' && id) {
      cargarEmpresa(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, modo]);

  const obtenerDomicilios = async () => {
    try {
      const response = await axios.get(`${database}/api/domicilios`);
      setDomicilios(response.data);
    } catch (error) {
      console.error('Error al obtener domicilios:', error);
    }
  };

  const cargarEmpresa = async (empresaId: string) => {
    try {
      const res = await axios.get(`${database}/api/empresas/${empresaId}`);
      const e = res.data;
      setCuit(e.cuit ?? '');
      setRazonSocial(e.razonSocial ?? '');
      setDomicilio(e.domicilio?.id ?? 0);
    } catch (error) {
      console.error('Error al cargar empresa:', error);
    }
  };

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
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la empresa.',
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
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo editar la empresa.',
      });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <select
            value={domicilio}
            onChange={(e) => setDomicilio(Number(e.target.value))}
            required
          >
            <option value={0} disabled>Seleccione un domicilio</option>
            {domicilios.map((a) => (
              <option key={a.id} value={a.id}>
                {a.calle + ' ' + a.numeracion}
              </option>
            ))}
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

export default ModalEmpresa;
