import React, { useEffect, useState } from 'react';
import styles from './ModalPedidoOftalmologia.module.css';
import axios from 'axios';

interface ModalPedidoOftalmologiaProps {
  isOpen: boolean;
  onClose: () => void;
  onPedidoAdded?: () => void;
}

const ModalPedidoOftalmologia: React.FC<ModalPedidoOftalmologiaProps> = ({ isOpen, onClose, onPedidoAdded }) => {
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [delegacion, setDelegacion] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('dni', dni);
    formData.append('telefono', telefono);
    formData.append('empresa', empresa);
    formData.append('delegacion', delegacion);
    formData.append('fechaIngreso', fechaIngreso);
    if (archivo) {
      formData.append('archivo', archivo);
    }

    try {
      await axios.post('http://localhost:9000/api/pedidos-oftalmologia', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (onPedidoAdded) onPedidoAdded();
      handleClose();
    } catch (error) {
      console.error('Error al crear pedido oftalmología:', error);
    }
  };

  const handleClose = () => {
    setNombre('');
    setDni('');
    setTelefono('');
    setEmpresa('');
    setDelegacion('');
    setFechaIngreso('');
    setArchivo(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar Pedido Oftalmología</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

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

          <label>Archivo:</label>
          <input type="file" onChange={(e) => setArchivo(e.target.files?.[0] || null)} />

          <div className={styles.actions}>
            <button type="submit">Agregar</button>
            <button type="button" onClick={handleClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPedidoOftalmologia;