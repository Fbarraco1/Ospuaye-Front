import React, { useState, useEffect } from 'react';
import styles from './EditarFamiliar.module.css';
import axios from 'axios';
import { useAuthStore } from '../../../auth/store/authStore';

type Parentesco =
  | 'Titular'
  | 'Conyuge'
  | 'Concubino_Concubina'
  | 'Hijo_Soltero_Menor_De_21'
  | 'Hijo_Soltero_Entre_21_25_Estudiando'
  | 'Hijo_Conyuge_Menor_De_21'
  | 'Hijo_Conyuge_Entre_21_25_Estudiando'
  | 'Menor_Bajo_Guarda_Tutela'
  | 'Familiar_A_Cargo'
  | 'Mayor_de_25_Discapacitado'
  | 'Solo_Parentescos'
  | 'Grupo_Familiar_Completos'
  | 'Sin_Informacion';

interface Familiar {
  id: number;
  grupoFamiliar: { id: number };
  beneficiario: { id: number };
  nombre: string;
  apellido: string;
  dni: string;
  cuil: string;
  telefono: string;
  tipoParentesco: Parentesco;
}

interface EditarFamiliarProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;   // ya no pasamos el objeto completo, sino que solo notificamos
  initialData?: Familiar; // obligatorio para edición
}

const EditarFamiliar: React.FC<EditarFamiliarProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [familiar, setFamiliar] = useState<Familiar | null>(initialData ?? null);
  const token = useAuthStore((state) => state.token);

  // cada vez que cambia el familiar seleccionado, se actualiza el state
  useEffect(() => {
    if (isOpen && initialData) {
      setFamiliar(initialData);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFamiliar(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const updateFamiliar = async (familiar: Familiar) => {
    try {
      const response = await axios.put(
        `http://localhost:9000/api/familiares/actualizar`,
        familiar,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al actualizar familiar');
    } catch (error) {
      console.error('Error al actualizar familiar:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familiar) return;
    await updateFamiliar(familiar);
    onSave();     // avisamos al padre que refresque lista
    handleClose();
  };

  const handleClose = () => {
    setFamiliar(initialData ?? null);
    onClose();
  };

  const parentescoOptions: { value: Parentesco; label: string }[] = [
    { value: 'Titular', label: 'Titular' },
    { value: 'Conyuge', label: 'Cónyuge' },
    { value: 'Concubino_Concubina', label: 'Concubino/a' },
    { value: 'Hijo_Soltero_Menor_De_21', label: 'Hijo soltero menor de 21' },
    { value: 'Hijo_Soltero_Entre_21_25_Estudiando', label: 'Hijo soltero 21-25 estudiando' },
    { value: 'Hijo_Conyuge_Menor_De_21', label: 'Hijo de cónyuge menor de 21' },
    { value: 'Hijo_Conyuge_Entre_21_25_Estudiando', label: 'Hijo de cónyuge 21-25 estudiando' },
    { value: 'Menor_Bajo_Guarda_Tutela', label: 'Menor bajo guarda/tutela' },
    { value: 'Familiar_A_Cargo', label: 'Familiar a cargo' },
    { value: 'Mayor_de_25_Discapacitado', label: 'Mayor de 25 discapacitado' },
    { value: 'Solo_Parentescos', label: 'Solo parentescos' },
    { value: 'Grupo_Familiar_Completos', label: 'Grupo familiar completos' },
    { value: 'Sin_Informacion', label: 'Sin información' },
  ];

  if (!isOpen || !familiar) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Editar Familiar</h2>
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
            {parentescoOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveButton}>Guardar Cambios</button>
            <button type="button" onClick={handleClose} className={styles.cancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarFamiliar;
