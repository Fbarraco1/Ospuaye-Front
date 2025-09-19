import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalGrupoFamiliar.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalGrupoFamiliarProps {
  isOpen: boolean;
  onClose: () => void;
  onGrupoFamiliarAdded?: () => void;
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
}) => {
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [titular, setTitular] = useState<number>(0);

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (isOpen) obtenerBeneficiarios();
  }, [isOpen]);

  const obtenerBeneficiarios = async () => {
    try {
      const response = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/beneficiarios', {
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
        'http://vps-5301866-x.dattaweb.com:9000/api/grupoFamiliar/crear',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createGrupoFamiliar(nombreGrupo, titular);

      if (onGrupoFamiliarAdded) onGrupoFamiliarAdded();
      handleClose();
    } catch (error) {
      console.error('Error al crear Grupo Familiar:', error);
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
        <h2>Agregar Grupo Familiar</h2>
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
            <button type="submit">Agregar</button>
            <button type="button" onClick={handleClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalGrupoFamiliar;
