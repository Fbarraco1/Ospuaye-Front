import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import styles from './ModalMedico.module.css';
import axios from 'axios';

interface ModalMedicoProps {
  isOpen: boolean;
  onClose: () => void;
  onMedicoAdded?: () => void;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
}

interface Area {
  id: number;
  nombre: string;
}

const ModalMedico: React.FC<ModalMedicoProps> = ({ isOpen, onClose, onMedicoAdded }) => {
  const [usuarioId, setUsuarioId] = useState('');
  const [matricula, setMatricula] = useState('');
  const [areaId, setAreaId] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (isOpen) {
      fetchUsuarios();
      fetchAreas();
    }
  }, [isOpen]);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
    } catch (e) {
      setUsuarios([]);
    }
  };

  const fetchAreas = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/areas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAreas(res.data);
    } catch (e) {
      setAreas([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:9000/api/medicos',
        {
          usuario_id: usuarioId,
          matricula,
          area_id: areaId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (onMedicoAdded) onMedicoAdded();
      handleClose();
    } catch (error) {
      console.error('Error al crear médico:', error);
    }
  };

  const handleClose = () => {
    setUsuarioId('');
    setMatricula('');
    setAreaId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar Médico</h2>
        <form onSubmit={handleSubmit}>
          <label>Usuario:</label>
          <select
            value={usuarioId}
            onChange={e => setUsuarioId(e.target.value)}
            required
          >
            <option value="">Seleccione un usuario</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>
                {u.nombre} {u.apellido}
              </option>
            ))}
          </select>

          <label>Matrícula:</label>
          <input
            type="text"
            value={matricula}
            onChange={e => setMatricula(e.target.value)}
            required
          />

          <label>Área:</label>
          <select
            value={areaId}
            onChange={e => setAreaId(e.target.value)}
            required
          >
            <option value="">Seleccione un área</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>
                {a.nombre}
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
  );
};

export default ModalMedico;