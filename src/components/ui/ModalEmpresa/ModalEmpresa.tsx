import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalEmpresa.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalEmpresaProps {
  isOpen: boolean;
  onClose: () => void;
  onEmpresaAdded?: () => void;
}
interface Domicilio {
    id: number;
    calle: string;
    numeracion: string;
}


export const ModalEmpresa: React.FC<ModalEmpresaProps> = ({ isOpen, onClose, onEmpresaAdded }) => {
  const [nombre, setNombre] = useState('');
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [domicilio, setDomicilio] = useState<number>(0);  
  const token = useAuthStore((state) => state.token);

    useEffect(() => {
    obtenerDomicilios();
  }, []);

  const obtenerDomicilios = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/domicilios', {
      });
      setDomicilios(response.data);
    } catch (error) {
      console.error('Error al obtener domicilios:', error);
    }
  };

  const createEmpresa = async (
    nombre: string,
    cuit: string,
    razonSocial: string,
    domicilio: number
  ) => {
        try {
      const response = await axios.post(
        'http://localhost:9000/api/empresas/crear',
        { nombre, cuit, razonSocial, domicilio: { id: domicilio } }, // <-- Cambia aquí
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

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await createEmpresa(nombre, cuit, razonSocial, domicilio);
      
        if (onEmpresaAdded) onEmpresaAdded();
        onClose();
      } catch (error) {
        console.error('Error al crear Empresa:', error);
      }
      handleClose();
    };
  
    const handleClose = () => {
      setNombre('');
      setCuit('');
      setRazonSocial('');
      setDomicilio(0);
      onClose();
    };
  
    if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar Empresa</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
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
            <button type="submit">Agregar</button>
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
