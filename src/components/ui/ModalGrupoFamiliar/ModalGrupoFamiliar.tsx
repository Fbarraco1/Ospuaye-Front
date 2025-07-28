import React, { useState } from 'react';
import styles from './ModalGrupoFamiliar.module.css';

interface GrupoFamiliar {
  id?: number;
  nombre: string;
  apellido: string;
  dni: string;
  parentesco: string;
}

interface ModalGrupoFamiliarProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (grupoFamiliar: GrupoFamiliar) => void;
  initialData?: GrupoFamiliar;
}

const ModalGrupoFamiliar: React.FC<ModalGrupoFamiliarProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [grupoFamiliar, setGrupoFamiliar] = useState<GrupoFamiliar>(
    initialData || { nombre: '', apellido: '', dni: '', parentesco: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGrupoFamiliar(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(grupoFamiliar);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{grupoFamiliar.id ? 'Editar Miembro' : 'Agregar Miembro'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="nombre"
            value={grupoFamiliar.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            name="apellido"
            value={grupoFamiliar.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            required
          />
          <input
            type="text"
            name="dni"
            value={grupoFamiliar.dni}
            onChange={handleChange}
            placeholder="DNI"
            required
          />
          <select
            name="parentesco"
            value={grupoFamiliar.parentesco}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione parentesco</option>
            <option value="Hijo">Hijo</option>
            <option value="Hija">Hija</option>
            <option value="Esposo">Esposo</option>
            <option value="Esposa">Esposa</option>
            <option value="Otro">Otro</option>
          </select>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveButton}>Guardar</button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalGrupoFamiliar;
