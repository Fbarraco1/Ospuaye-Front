import React, { useEffect, useState } from 'react';
import styles from './ModalPedido.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

interface ModalPedidoProps {
  isOpen: boolean;
  onClose: () => void;
  onPedidoAdded?: () => void;
}

interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
}

interface Medico {
  id: number;
  matricula: string;
}

const ModalPedido: React.FC<ModalPedidoProps> = ({ isOpen, onClose, onPedidoAdded }) => {
  const [nombre, setNombre] = useState('');
  const [beneficiarioId, setBeneficiarioId] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [delegacion, setDelegacion] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [medicoId, setMedicoId] = useState('');

  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchBeneficiarios();
      fetchMedicos();
    }
  }, [isOpen]);

  const fetchBeneficiarios = async () => {
    try {
      const res = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/beneficiarios');
      setBeneficiarios(res.data);
    } catch (e) {
      setBeneficiarios([]);
    }
  };

  const fetchMedicos = async () => {
    try {
      const res = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/medicos');
      setMedicos(res.data);
    } catch (e) {
      setMedicos([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://vps-5301866-x.dattaweb.com:9000/api/pedidos', {
        nombre,
        beneficiario_id: beneficiarioId,
        dni: parseInt(dni),
        telefono: parseInt(telefono),
        empresa,
        delegacion,
        fechaIngreso,
        medico_id: medicoId,
      });
      if (onPedidoAdded) onPedidoAdded();
      handleClose();

            Swal.fire({
              icon: 'success',
              title: 'Pedido creado',
              text: 'El pedido se creó correctamente.',
              timer: 2000,
              showConfirmButton: false
            });

    } catch (error) {
      console.error('Error al crear pedido:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el pedido.',
            });
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar Pedido</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <label>Beneficiario:</label>
          <select value={beneficiarioId} onChange={(e) => setBeneficiarioId(e.target.value)} required>
            <option value="">Seleccione un beneficiario</option>
            {beneficiarios.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre} {b.apellido}
              </option>
            ))}
          </select>

          <label>DNI:</label>
          <input type="number" value={dni} onChange={(e) => setDni(e.target.value)} required />

          <label>Teléfono:</label>
          <input type="number" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />

          <label>Emergencia:</label>
          <input type="text" value={empresa} onChange={(e) => setEmpresa(e.target.value)} required />

          <label>Delegación:</label>
          <input type="text" value={delegacion} onChange={(e) => setDelegacion(e.target.value)} required />

          <label>Fecha de Ingreso:</label>
          <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} required />

          <label>Médico:</label>
          <select value={medicoId} onChange={(e) => setMedicoId(e.target.value)} required>
            <option value="">Seleccione un médico</option>
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.matricula}
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

export default ModalPedido;
