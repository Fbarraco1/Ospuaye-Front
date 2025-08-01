import React, { useState } from 'react';
import styles from './ModalPedidoOrtopedia.module.css';
import axios from 'axios';

interface ModalPedidoOrtopediaProps {
  isOpen: boolean;
  onClose: () => void;
  onPedidoAdded?: () => void;
}

const ModalPedidoOrtopedia: React.FC<ModalPedidoOrtopediaProps> = ({ isOpen, onClose, onPedidoAdded }) => {
  const [nombre, setNombre] = useState('');
  const [beneficiarioId, setBeneficiarioId] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [delegacion, setDelegacion] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('beneficiario_id', beneficiarioId);
    formData.append('dni', dni);
    formData.append('telefono', telefono);
    formData.append('empresa', empresa);
    formData.append('delegacion', delegacion);
    formData.append('fechaIngreso', fechaIngreso);
    formData.append('medico_id', medicoId);
    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.post('http://localhost:9000/api/pedidos/ortopedia', formData);
      if (onPedidoAdded) onPedidoAdded();
      handleClose();
    } catch (error) {
      console.error('Error al crear pedido ortopedia:', error);
    }
  };

  const handleClose = () => {
    setNombre('');
    setBeneficiarioId('');
    setDni('');
    setTelefono('');
    setEmpresa('');
    setDelegacion('');
    setFechaIngreso('');
    setMedicoId('');
    setFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar Pedido Ortopedia</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <label>Beneficiario:</label>
          <select value={beneficiarioId} onChange={(e) => setBeneficiarioId(e.target.value)} required>
            <option value="">Seleccione un beneficiario</option>
            {/* Populate with beneficiaries */}
          </select>

          <label>DNI:</label>
          <input type="number" value={dni} onChange={(e) => setDni(e.target.value)} required />

          <label>Teléfono:</label>
          <input type="number" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />

          <label>Empresa:</label>
          <input type="text" value={empresa} onChange={(e) => setEmpresa(e.target.value)} required />

          <label>Delegación:</label>
          <input type="text" value={delegacion} onChange={(e) => setDelegacion(e.target.value)} required />

          <label>Fecha de Ingreso:</label>
          <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} required />

          <label>Médico:</label>
          <select value={medicoId} onChange={(e) => setMedicoId(e.target.value)} required>
            <option value="">Seleccione un médico</option>
            {/* Populate with doctors */}
          </select>

          <label>Archivo:</label>
          <input type="file" onChange={handleFileChange} />

          <div className={styles.actions}>
            <button type="submit">Agregar</button>
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPedidoOrtopedia;