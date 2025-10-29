import { useEffect, useState } from 'react';
import styles from './ModalEmpresa.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
const database = import.meta.env.VITE_DATABASE;

interface ModalEmpresaProps {
  isOpen: boolean;
  onClose: () => void;
  onEmpresaAdded?: () => void;
  empresaEdit?: {
    id: number;
    cuit: string;
    razonSocial: string;
    domicilio: { id: number; calle: string; numeracion: string; localidad: {id: number, codigoPostal: string }};
  };
}
interface Domicilio {
    id: number;
    calle: string;
    numeracion: string;
}


export const ModalEmpresa: React.FC<ModalEmpresaProps> = ({
  isOpen,
  onClose,
  onEmpresaAdded,
  empresaEdit
}) => {
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [domicilio, setDomicilio] = useState<number>(0);  
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerDomicilios();
  }, []);

  useEffect(() => {
    if (empresaEdit) {
      setCuit(empresaEdit.cuit);
      setRazonSocial(empresaEdit.razonSocial);
      setDomicilio(empresaEdit.domicilio.id);
    } else {
      setCuit('');
      setRazonSocial('');
      setDomicilio(0);
    }
  }, [empresaEdit, isOpen]);

  const obtenerDomicilios = async () => {
    try {
      const response = await axios.get(`${database}/api/domicilios`, {
      });
      setDomicilios(response.data);
    } catch (error) {
      console.error('Error al obtener domicilios:', error);
    }
  };

  const createEmpresa = async (
    cuit: string,
    razonSocial: string,
    domicilio: number
  ) => {
        try {
      const response = await axios.post(
        `${database}/api/empresas/crear`,
        {  cuit, razonSocial, domicilio: { id: domicilio } }, // <-- Cambia aquí
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
      // const data = response.data;
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la empresa.',
      });
    }
  }

    const updateEmpresa = async (
    id: number,
    cuit: string,
    razonSocial: string,
    domicilio: number
  ) => {
    try {
      const response = await axios.put(
        `${database}/api/empresas/${id}`,
        { cuit, razonSocial, domicilio: { id: domicilio } },
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
    }
  }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        if (empresaEdit) {
          await updateEmpresa(empresaEdit.id, cuit, razonSocial, domicilio);
        } else {
          await createEmpresa(cuit, razonSocial, domicilio);
        }
        if (onEmpresaAdded) onEmpresaAdded();
        onClose();
      } catch (error) {
        console.error('Error al guardar Empresa:', error);
      }
      handleClose();
    };
  
    const handleClose = () => {
      setCuit('');
      setRazonSocial('');
      setDomicilio(0);
      onClose();
    };
  
    if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{empresaEdit ? 'Editar Empresa' : 'Agregar Empresa'}</h2>
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
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
