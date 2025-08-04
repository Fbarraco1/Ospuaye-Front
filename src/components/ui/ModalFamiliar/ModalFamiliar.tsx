import React, { useState } from 'react';
import styles from './ModalFamiliar.module.css';
import axios from 'axios';
import { useAuthStore } from '../../../auth/store/authStore';

type Parentesco = 'Hijo' | 'Esposa' | 'Conyugue' | 'No especificado';

interface Familiar {
  id?: number;
  grupoFamiliar: { id: number };
  beneficiario: { id: number };
  nombre: string;
  apellido: string;
  dni: string;
  cuil: string;
  telefono: string;
  tipoParentesco: Parentesco;
}

interface ModalFamiliarProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (familiar: Familiar) => void;
  grupoFamiliarId?: number; 
  beneficiarioId: number;
  initialData?: Familiar;
}

const ModalFamiliar: React.FC<ModalFamiliarProps> = ({
  isOpen,
  onClose,
  onSave,
  grupoFamiliarId,
  beneficiarioId,
  initialData,
}) => {
  const [familiar, setFamiliar] = useState<Familiar>(
    initialData || {
      grupoFamiliar: { id: grupoFamiliarId ?? 0 },
      beneficiario: { id: beneficiarioId },
      nombre: '',
      apellido: '',
      dni: '',
      cuil: '',
      telefono: '',
      tipoParentesco: 'No especificado'
    }
  );

  const token = useAuthStore((state) => state.token);

  React.useEffect(() => {
    if (isOpen && grupoFamiliarId) {
      setFamiliar(prev => ({
        ...prev,
      grupoFamiliar: { id: grupoFamiliarId },
      beneficiario: { id: beneficiarioId }
      }));
    }
  }, [grupoFamiliarId, beneficiarioId, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFamiliar(prev => ({ ...prev, [name]: value }));
  };

  const createFamiliar = async (familiar: Familiar) => {
    try {
      const response = await axios.post(
        'http://localhost:9000/api/familiares',
        familiar,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear familiar');
    } catch (error) {
      console.error('Error al crear familiar:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Familiar:', familiar);
    await createFamiliar(familiar);
    onSave(familiar);
    handleClose();
  };

  const handleClose = () => {
    setFamiliar({ grupoFamiliar: { id: grupoFamiliarId ?? 0 }, beneficiario: { id: beneficiarioId }, nombre: '', apellido: '', dni: '', cuil: '', telefono: '', tipoParentesco: 'No especificado' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{familiar.id ? 'Editar Miembro' : 'Agregar Miembro'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="nombre"
            value={familiar.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            name="apellido"
            value={familiar.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            required
          />
          <input
            type="text"
            name="dni"
            value={familiar.dni}
            onChange={handleChange}
            placeholder="DNI"
            required
          />
          <input
            type="text"
            name="cuil"
            value={familiar.cuil}
            onChange={handleChange}
            placeholder="Cuil"
            required
          />
          <input
            type="text"
            name="telefono"
            value={familiar.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            required
          />
          <select
            name="tipoParentesco"
            value={familiar.tipoParentesco}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione parentesco</option>
            <option value="Hijo">Hijo</option>
            <option value="Esposa">Esposa</option>
            <option value="Conyugue">Conyugue</option>
          </select>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveButton}>Guardar</button>
            <button type="button" onClick={handleClose} className={styles.cancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFamiliar;