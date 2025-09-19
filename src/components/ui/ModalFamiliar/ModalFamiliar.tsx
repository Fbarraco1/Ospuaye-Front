import React, { useState } from 'react';
import styles from './ModalFamiliar.module.css';
import axios from 'axios';
import { useAuthStore } from '../../../auth/store/authStore';
import Swal from 'sweetalert2';

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

  type Sexo =
  | 'MASCULINO'
  | 'FEMENINO'
  |'SIN_INFORMACION'
  |'AMBOS_SEXOS'

interface Familiar {
  id?: number;  
  grupoFamiliar: { id: number };
  beneficiario: { id: number };
  nombre: string;
  apellido: string;
  dni: string;
  cuil: string;
  telefono: string;
  correoElectronico?: string;
  sexo: Sexo;
  nacionalidad: {id: number, nombre: string};
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
      correoElectronico: '',
      sexo: 'SIN_INFORMACION',
      nacionalidad: {id: 0, nombre: ''},
      tipoParentesco: 'Sin_Informacion'
    }
  );
  const [nacionalidades, setNacionalidades] = useState<{ id: number; nombre: string }[]>([]);


  const token = useAuthStore((state) => state.token);

  React.useEffect(() => {
    if (isOpen && grupoFamiliarId) {
      setFamiliar(prev => ({
        ...prev,
      grupoFamiliar: { id: grupoFamiliarId },
      beneficiario: { id: beneficiarioId }
      }));
    }
    obtenerNacionalidades();
  }, [grupoFamiliarId, beneficiarioId, isOpen]);

const obtenerNacionalidades = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/nacionalidades', {
      });
      setNacionalidades(response.data);
    } catch (error) {
      console.error('Error al obtener Nacionalidades:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "nacionalidad") {
      // Buscar el objeto nacionalidad seleccionado
      const selected = nacionalidades.find(n => n.id === Number(value));
      setFamiliar(prev => ({
        ...prev,
        nacionalidad: selected ? { id: selected.id, nombre: selected.nombre } : { id: 0, nombre: "" }
      }));
    } else if (name === "correoElectronico" || name === "email") {
      setFamiliar(prev => ({ ...prev, correoElectronico: value }));
    } else {
      setFamiliar(prev => ({ ...prev, [name]: value }));
    }
  };

  const createFamiliar = async (familiar: Familiar) => {
    try {
      const response = await axios.post(
        'http://localhost:9000/api/familiares/crear',
        familiar,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear familiar');
          Swal.fire({
            icon: 'success',
            title: 'Familiar creado',
            text: 'El familiar se creó correctamente.',
            timer: 2000,
            showConfirmButton: false
          });
    } catch (error) {
      console.error('Error al crear familiar:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el familiar.',
            });
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
    setFamiliar({ grupoFamiliar: { id: grupoFamiliarId ?? 0 }, beneficiario: { id: beneficiarioId }, nombre: '', apellido: '', dni: '', cuil: '', telefono: '', correoElectronico: '', sexo: 'SIN_INFORMACION', nacionalidad: {id: 0, nombre:''}, tipoParentesco: 'Sin_Informacion' });
    onClose();
  };

  const parentescoOptions: { value: Parentesco; label: string }[] = [
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

    const sexoOptions: { value: Sexo; label: string }[] = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' },
    { value: 'SIN_INFORMACION', label: 'Sin información' },
    { value: 'AMBOS_SEXOS', label: 'Amos sexos' }
  ];

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
          <input
            type="email"
            name="correoElectronico"
            value={familiar.correoElectronico}
            onChange={handleChange}
            placeholder="Correo Electrónico"
            required
          />
          
          <label>Sexo:</label>
          <select
            name="sexo"
            value={familiar.sexo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione sexo</option>
            {sexoOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>  

          <label>Nacionalidad:</label>
          <select
            name="nacionalidad"
            value={familiar.nacionalidad.id}
            onChange={handleChange}
            required
          >
            <option value={0} disabled>Seleccione un país</option>
            {nacionalidades.map((a) => (
                <option key={a.id} value={a.id}>
                {a.nombre}
                </option>
            ))}
          </select>

          <label>Parentesco:</label>
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
            <button type="submit" className={styles.saveButton}>Guardar</button>
            <button type="button" onClick={handleClose} className={styles.cancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFamiliar;