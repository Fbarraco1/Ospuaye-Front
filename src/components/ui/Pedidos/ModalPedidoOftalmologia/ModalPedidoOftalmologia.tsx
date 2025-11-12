import React, { useEffect, useState } from 'react';
import styles from './ModalPedidoOftalmologia.module.css';
import axios from 'axios';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
const database = import.meta.env.VITE_DATABASE;

const ModalPedidoOftalmologia: React.FC<{ modo?: 'editar' | 'crear', onPedidoAdded?: () => void }> = ({ modo = 'crear', onPedidoAdded }) => {
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [beneficiarioId, setBeneficiarioId] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [delegacion, setDelegacion] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [beneficiarios, setBeneficiarios] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [usaLentes, setUsaLentes] = useState(false);
  const [recetaMedica, setRecetaMedica] = useState(false);
  const [fechaRevision, setFechaRevision] = useState('');
  const [observacionMedico, setObservacionMedico] = useState('');
  const [grupoFamiliarId, setGrupoFamiliarId] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [documentos, setDocumentos] = useState<File[]>([]);
  const [familiaresFiltrados, setFamiliaresFiltrados] = useState<any[]>([]);

  useEffect(() => {
    obtenerBeneficiarios();
    obtenerMedicos();
    if (modo === 'editar' && id) {
      cargarPedido(id);
    }
  }, [id, modo]);

  const obtenerBeneficiarios = async () => {
    try {
      const response = await axios.get(`${database}/api/beneficiarios`);
      setBeneficiarios(response.data);
    } catch (error) {
      console.error('Error al obtener Beneficiarios:', error);
    }
  };

  const obtenerMedicos = async () => {
    try {
      const response = await axios.get(`${database}/api/medicos`);
      setMedicos(response.data);
    } catch (error) {
      console.error('Error al obtener Médicos:', error);
    }
  };

  const cargarPedido = async (pedidoId: string) => {
    try {
      const resp = await axios.get(`${database}/api/pedidos/oftalmologia/${pedidoId}`);
      const pedido = resp.data;
      setNombre(pedido.nombre || '');
      setBeneficiarioId(pedido.beneficiario?.id?.toString() || '');
      setDni(pedido.dni?.toString() || '');
      setTelefono(pedido.telefono?.toString() || '');
      setEmpresa(pedido.empresa || '');
      setDelegacion(pedido.delegacion || '');
      setMotivoConsulta(pedido.motivoConsulta || '');
      setUsaLentes(!!pedido.usaLentes);
      setRecetaMedica(!!pedido.recetaMedica);
      setFechaRevision(pedido.fechaRevision ? pedido.fechaRevision.slice(0,10) : '');
      setObservacionMedico(pedido.observacionMedico || '');
      setGrupoFamiliarId(pedido.grupoFamiliar?.id?.toString() || '');
      setPacienteId(pedido.paciente?.id?.toString() || '');
      setMedicoId(pedido.medico?.id?.toString() || '');
      // Si quieres cargar documentos, deberías hacer otra petición aquí
    } catch (error) {
      console.error('Error al cargar pedido:', error);
    }
  };

  const handleBeneficiarioChange = async (id: string) => {
    setBeneficiarioId(id);

    const beneficiario = beneficiarios.find(b => b.id === parseInt(id));
    if (beneficiario) {
      setDni(beneficiario.dni);
      setTelefono(beneficiario.telefono);
      setGrupoFamiliarId(beneficiario.grupoFamiliarId?.toString() || '');

      try {
        // Llamar al backend para traer solo los familiares de ese beneficiario
        const resp = await axios.get(`${database}/api/familiares/beneficiario/${id}`);
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
      usaLentes,
      recetaMedica,
      fechaRevision,
      observacionMedico,
      beneficiario: { id: Number(beneficiarioId) },
      medico: { id: Number(medicoId) }
    };
    if (grupoFamiliarId && grupoFamiliarId.trim() !== '') {
      pedido.grupoFamiliar = { id: Number(grupoFamiliarId) };
    }
    if (pacienteId && pacienteId.trim() !== '') {
      pedido.paciente = { id: Number(pacienteId) };
    }

    const formData = new FormData();
    formData.append('pedido', JSON.stringify(pedido));
    documentos.forEach(file => formData.append("documentos", file));

    try {
      if (modo === 'editar' && id) {
        await axios.put(
          `${database}/api/pedidos/oftalmologia/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            }
          }
        );
        Swal.fire({
          icon: 'success',
          title: 'Pedido actualizado',
          text: 'El pedido se actualizó correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await axios.post(
          `${database}/api/pedidos/oftalmologia`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            }
          }
        );
        Swal.fire({
          icon: 'success',
          title: 'Pedido creado',
          text: 'El pedido se creó correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
      }
      if (onPedidoAdded) onPedidoAdded();
      navigate('/pedidos/oftalmologia');
    } catch (error) {
      console.error('Error al guardar pedido oftalmologia:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar el pedido.',
      });
    }
  };

  const handleVolver = () => {
    navigate('/pedidos/oftalmologia');
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
        Volver
      </button>
      <h2 className={styles.title}>Agregar Pedido Oftalmologia</h2>
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

        <label>Usa Lentes:</label>
        <input type="checkbox" checked={usaLentes} onChange={e => setUsaLentes(e.target.checked)} />

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
        <select value={medicoId} onChange={e => setMedicoId(e.target.value)} >
          <option value="">Seleccione un médico</option>
          {medicos.map(m => (
            <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>
          ))}
        </select>

        <label>Documentos:</label>
        <input type="file" multiple onChange={e => setDocumentos(Array.from(e.target.files || []))} />

        <div className={styles.actions}>
          <button type="submit">Aceptar</button>
          <button type="button" onClick={handleVolver}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ModalPedidoOftalmologia;
