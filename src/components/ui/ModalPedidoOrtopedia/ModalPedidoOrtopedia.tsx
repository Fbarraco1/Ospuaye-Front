import React, { useEffect, useState } from 'react';
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
  const [beneficiarios, setBeneficiarios] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [recetaMedica, setRecetaMedica] = useState(false);
  const [fechaRevision, setFechaRevision] = useState('');
  const [observacionMedico, setObservacionMedico] = useState('');
  const [grupoFamiliarId, setGrupoFamiliarId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [documentos, setDocumentos] = useState<File[]>([]);

  const [familiares, setFamiliares] = useState<any[]>([]);
  const [familiaresFiltrados, setFamiliaresFiltrados] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      obtenerBeneficiarios();
      obtenerMedicos();
      obtenerFamiliares();
    }
  }, [isOpen]);

  const obtenerBeneficiarios = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/beneficiarios/dto');
      setBeneficiarios(response.data);
    } catch (error) {
      console.error('Error al obtener Beneficiarios:', error);
    }
  };

  const obtenerFamiliares = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/familiares');
      setFamiliares(response.data);
    } catch (error) {
      console.error('Error al obtener familiares:', error);
    }
  };

  const obtenerMedicos = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/medicos');
      setMedicos(response.data);
    } catch (error) {
      console.error('Error al obtener Médicos:', error);
    }
  };

  const handleBeneficiarioChange = (id: string) => {
    setBeneficiarioId(id);

    const beneficiario = beneficiarios.find(b => b.id === parseInt(id));
    if (beneficiario) {
      setDni(beneficiario.dni);
      setTelefono(beneficiario.telefono);
      setUsuarioId(beneficiario.usuarioId?.toString() || '');
      setGrupoFamiliarId(beneficiario.grupoFamiliarId?.toString() || '');

      const familiaresGrupo = familiares.filter(f => f.grupoFamiliar?.id === beneficiario.grupoFamiliarId);
      setFamiliaresFiltrados(familiaresGrupo);
    } else {
      setUsuarioId('');
      setGrupoFamiliarId('');
      setFamiliaresFiltrados([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pedido = {
      nombre,
      dni,
      telefono,
      empresa,
      delegacion,
      motivoConsulta,
      recetaMedica,
      fechaRevision,
      observacionMedico,
      grupoFamiliar: { id: grupoFamiliarId },
      beneficiario: { id: beneficiarioId },
      usuario: { id: usuarioId },
      paciente: { id: pacienteId },
      medico: { id: medicoId }
    };

    const formData = new FormData();
    formData.append('pedido', JSON.stringify(pedido));
    formData.append('usuario', JSON.stringify({ id: usuarioId }));

    documentos.forEach((file, idx) => {
      formData.append(`documentos[${idx}][nombreArchivo]`, file.name);
      formData.append(`documentos[${idx}][path]`, `/archivos/estudios/${file.name}`);
      formData.append(`documentos[${idx}][observacion]`, 'Estudio previo adjunto');
      formData.append(`documentos[${idx}][file]`, file);
    });

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
    setUsuarioId('');
    setGrupoFamiliarId('');
    setPacienteId('');
    setFamiliaresFiltrados([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar Pedido Ortopedia</h2>
        <form onSubmit={handleSubmit}>
          <label>Beneficiario:</label>
          <select value={beneficiarioId} onChange={e => handleBeneficiarioChange(e.target.value)} required>
            <option value="">Seleccione un beneficiario</option>
            {beneficiarios.map(b => (
              <option key={b.id} value={b.id}>{b.nombre} {b.apellido}</option>
            ))}
          </select>

          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />

          <label>DNI:</label>
          <input type="number" value={dni} onChange={e => setDni(e.target.value)} required />

          <label>Teléfono:</label>
          <input type="number" value={telefono} onChange={e => setTelefono(e.target.value)} required />

          <label>Empresa:</label>
          <input type="text" value={empresa} onChange={e => setEmpresa(e.target.value)} required />

          <label>Delegación:</label>
          <input type="text" value={delegacion} onChange={e => setDelegacion(e.target.value)} required />

          <label>Motivo de Consulta:</label>
          <input type="text" value={motivoConsulta} onChange={e => setMotivoConsulta(e.target.value)} required />

          <label>Receta Médica:</label>
          <input type="checkbox" checked={recetaMedica} onChange={e => setRecetaMedica(e.target.checked)} />

          <label>Fecha de Revisión:</label>
          <input type="date" value={fechaRevision} onChange={e => setFechaRevision(e.target.value)} required />

          <label>Observación Médico:</label>
          <input type="text" value={observacionMedico} onChange={e => setObservacionMedico(e.target.value)} />

          <label>Paciente (familiar):</label>
          <select value={pacienteId} onChange={e => setPacienteId(e.target.value)} >
            <option value="">Seleccione un paciente</option>
            {familiaresFiltrados.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
            ))}
          </select>

          <label>Médico:</label>
          <select value={medicoId} onChange={e => setMedicoId(e.target.value)} required>
            <option value="">Seleccione un médico</option>
            {medicos.map(m => (
              <option key={m.id} value={m.id}>{m.matricula}</option>
            ))}
          </select>

          <label>Documentos:</label>
          <input type="file" multiple onChange={handleFileChange} />

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

