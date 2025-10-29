import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../auth/store/authStore';
import styles from './ModalGrupoFamiliar.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
const database = import.meta.env.VITE_DATABASE;

interface ModalGrupoFamiliarProps {
  isOpen: boolean;
  onClose: () => void;
  onGrupoFamiliarAdded?: () => void;
  grupoEdit?: {
    id: number;
    nombreGrupo: string;
    titular: { id: number; nombre: string; apellido: string };
    fechaAlta: string;
    activo: boolean;
    familiares: any[];
  };
}

interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
}

const ModalGrupoFamiliar: React.FC<ModalGrupoFamiliarProps> = ({
  isOpen,
  onClose,
  onGrupoFamiliarAdded,
  grupoEdit
}) => {
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [titular, setTitular] = useState<number>(0);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (isOpen) obtenerBeneficiarios();
  }, [isOpen]);

  useEffect(() => {
    if (grupoEdit) {
      setNombreGrupo(grupoEdit.nombreGrupo);
      setTitular(grupoEdit.titular.id);
    } else {
      setNombreGrupo('');
      setTitular(0);
    }
  }, [grupoEdit, isOpen]);

  const obtenerBeneficiarios = async () => {
    try {
      const response = await axios.get(`${database}/api/beneficiarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBeneficiarios(response.data);
    } catch (error) {
      console.error('Error al obtener Beneficiarios:', error);
    }
  };

  const createGrupoFamiliar = async (
    nombreGrupo: string,
    titularId: number
  ) => {
    try {
      const response = await axios.post(
        `${database}/api/grupoFamiliar/crear`,
        {
          nombreGrupo,
          titular: { id: titularId },
          fechaAlta: new Date(),
          activo: true,
          familiares: [],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300)
        throw new Error('Error al crear Grupo Familiar');

            Swal.fire({
              icon: 'success',
              title: 'Grupo familiar creado',
              text: 'El grupo familiar se creó correctamente.',
              timer: 2000,
              showConfirmButton: false
            });
    } catch (error) {
      console.error('error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el grupo familiar.',
            });
    }
  };

  const updateGrupoFamiliar = async (
    id: number,
    nombreGrupo: string,
    titularId: number
  ) => {
    try {
      const response = await axios.put(
        `${database}/api/grupoFamiliar/${id}`,
        {
          nombreGrupo,
          titular: { id: titularId },
          fechaAlta: new Date(),
          activo: true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300)
        throw new Error('Error al editar Grupo Familiar');
      Swal.fire({
        icon: 'success',
        title: 'Grupo familiar editado',
        text: 'El grupo familiar se editó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo editar el grupo familiar.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (grupoEdit) {
        await updateGrupoFamiliar(grupoEdit.id, nombreGrupo, titular);
      } else {
        await createGrupoFamiliar(nombreGrupo, titular);
      }
      if (onGrupoFamiliarAdded) onGrupoFamiliarAdded();
      handleClose();
    } catch (error) {
      console.error('Error al guardar Grupo Familiar:', error);
    }
  };

  const handleClose = () => {
    setNombreGrupo('');
    setTitular(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{grupoEdit ? 'Editar Grupo Familiar' : 'Agregar Grupo Familiar'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre del Grupo:</label>
          <input
            type="text"
            value={nombreGrupo}
            onChange={(e) => setNombreGrupo(e.target.value)}
            required
          />
          <label>Titular:</label>
          <select
            value={titular}
            onChange={(e) => setTitular(Number(e.target.value))}
            required
          >
            <option value={0} disabled>
              Seleccione un titular
            </option>
            {beneficiarios.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre} {b.apellido}
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
  );
};

export default ModalGrupoFamiliar;
