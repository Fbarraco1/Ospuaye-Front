import React, { useEffect, useState } from 'react';
import styles from './ModalMedico.module.css';
import axios from 'axios';

interface ModalMedicoProps {
  isOpen: boolean;
  onClose: () => void;
  onMedicoAdded?: () => void;
}

interface Area {
  id: number;
  nombre: string;
}

const ModalMedico: React.FC<ModalMedicoProps> = ({ isOpen, onClose, onMedicoAdded }) => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [matricula, setMatricula] = useState('');
  const [areaId, setAreaId] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchAreas();
    }
  }, [isOpen]);

  const fetchAreas = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/areas',);
      setAreas(res.data);
    } catch (e) {
      setAreas([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:9000/api/auth/register/medico',
        {
          email,
          contrasena,
          matricula,
          areaId: areaId
        },
      );
      if (onMedicoAdded) onMedicoAdded();
      handleClose();
    } catch (error) {
      console.error('Error al crear médico:', error);
    }
  };

  const handleClose = () => {
    setEmail('');
    setContrasena('');
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
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

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