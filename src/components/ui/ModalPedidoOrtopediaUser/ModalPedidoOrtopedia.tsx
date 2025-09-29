import React, { useEffect, useState } from 'react';
import styles from './ModalPedidoOrtopedia.module.css';
import axios from 'axios';
import { useAuthStore } from '../../../auth/store/authStore';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ModalPedidoOrtopediaUser: React.FC<{ onPedidoAdded?: () => void }> = ({ onPedidoAdded }) => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const beneficiarioId = useAuthStore((state) => state.user?.idBeneficiario || 0);
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [delegacion, setDelegacion] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [beneficiarios] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [recetaMedica, setRecetaMedica] = useState(false);
  const [fechaRevision, setFechaRevision] = useState('');
  const [observacionMedico, setObservacionMedico] = useState('');
  const [grupoFamiliarId, setGrupoFamiliarId] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [documentos, setDocumentos] = useState<File[]>([]);
  const [familiaresFiltrados, setFamiliaresFiltrados] = useState<any[]>([]);

  useEffect(() => {
    obtenerMedicos();
    handleBeneficiario(beneficiarioId);
  }, []);


  const obtenerMedicos = async () => {
    try {
      const response = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/medicos');
      setMedicos(response.data);
    } catch (error) {
      console.error('Error al obtener Médicos:', error);
    }
  };

  const handleBeneficiario = async (id: number) => {

    const beneficiario = beneficiarios.find(b => b.id === id);
    if (beneficiario) {
      setGrupoFamiliarId(beneficiario.grupoFamiliarId?.toString() || '');

      try {
        // Llamar al backend para traer solo los familiares de ese beneficiario
        const resp = await axios.get(`http://vps-5301866-x.dattaweb.com:9000/api/familiares/beneficiario/${id}`);
        setFamiliaresFiltrados(resp.data);
      } catch (error) {
        console.error("Error al obtener familiares del beneficiario:", error);
        setFamiliaresFiltrados([]);
      }
    } else {
      setGrupoFamiliarId('');
      setFamiliaresFiltrados([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pedido: any = {
      nombre,
      dni: dni ? Number(dni) : null,
      telefono: telefono ? Number(telefono) : null,
      empresa,
      delegacion,
      motivoConsulta,
      recetaMedica,
      fechaRevision,
      observacionMedico,
      beneficiario: { id: Number(beneficiarioId) },
      medico: { id: Number(medicoId) }
    };
      // 👇 Solo agregamos grupoFamiliar si hay valor
      if (grupoFamiliarId && grupoFamiliarId.trim() !== '') {
        pedido.grupoFamiliar = { id: Number(grupoFamiliarId) };
      }

      // 👇 Solo agregamos paciente si hay valor
      if (pacienteId && pacienteId.trim() !== '') {
        pedido.paciente = { id: Number(pacienteId) };
      }

    const formData = new FormData();
    formData.append('pedido', JSON.stringify(pedido));

    documentos.forEach(file => formData.append("documentos", file));

    try {
      await axios.post(
        'http://vps-5301866-x.dattaweb.com:9000/api/pedidos/ortopedia',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if (onPedidoAdded) onPedidoAdded();
      navigate('/pedidos/ortopedia/user');
            Swal.fire({
              icon: 'success',
              title: 'Pedido creado',
              text: 'El pedido se creó correctamente.',
              timer: 2000,
              showConfirmButton: false
            });
    } catch (error) {
      console.error('Error al crear pedido Ortopedia:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el pedido.',
            });
    }
  };

  const handleVolver = () => {
    navigate('/pedidos/ortopedia/user');
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
        Volver
      </button>
      <h2 className={styles.title}>Agregar Pedido Ortopedia</h2>
      <form onSubmit={handleSubmit}>

        <label>Nombre del pedido:</label>
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
        <select value={pacienteId} onChange={e => setPacienteId(e.target.value)}>
          <option value="">Seleccione un paciente</option>
          {familiaresFiltrados.map(p => (
            <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
          ))}
        </select>

        <label>Médico:</label>
        <select value={medicoId} onChange={e => setMedicoId(e.target.value)} required>
          <option value="">Seleccione un médico</option>
          {medicos.map(m => (
            <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>
          ))}
        </select>

        <label>Documentos:</label>
        <input type="file" multiple onChange={e => setDocumentos(Array.from(e.target.files || []))} />

        <div className={styles.actions}>
          <button type="submit">Agregar</button>
          <button type="button" onClick={handleVolver}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ModalPedidoOrtopediaUser;
