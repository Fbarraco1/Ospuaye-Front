import React, { useCallback, useEffect, useState } from 'react';
import styles from './ModalPedidoOftalmologia.module.css';
import axios from 'axios';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { debounce } from 'lodash';

const database = import.meta.env.VITE_DATABASE;

/* =======================
   VALIDACIÓN YUP
======================= */

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio').min(3, 'Mínimo 3 caracteres'),
  beneficiarioId: Yup.string().required('Debe seleccionar un beneficiario'),
  dni: Yup.number()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .typeError("El DNI debe ser un número")
    .required("El DNI es obligatorio")
    .positive("DNI inválido"),
  telefono: Yup.number()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .typeError("El teléfono debe ser un número")
    .required("El teléfono es obligatorio")
    .positive("Teléfono inválido"),
  empresa: Yup.string().required('La empresa es obligatoria'),
  delegacion: Yup.string().required('La delegación es obligatoria'),
  motivoConsulta: Yup.string().required('El motivo de consulta es obligatorio'),
  fechaRevision: Yup.date().required('La fecha es obligatoria').typeError('Fecha inválida'),
  observacionMedico: Yup.string(),
  pacienteId: Yup.string(),
});

/* =======================
   VALIDACIÓN DOCUMENTOS
======================= */

const TIPOS_ARCHIVO_PERMITIDOS = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const EXTENSIONES_PERMITIDAS = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
const TAMAÑO_MAXIMO_MB = 5;
const TAMAÑO_MAXIMO_BYTES = TAMAÑO_MAXIMO_MB * 1024 * 1024;

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

  // AUTOCOMPLETE
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorDocumentos, setErrorDocumentos] = useState('');

  /* =======================
     AUTOCOMPLETE BENEFICIARIOS
  ======================= */

  const buscarBeneficiarios = useCallback(
    debounce(async (texto: string) => {
      if (!texto.trim()) {
        setResultados([]);
        return;
      }
      const res = await axios.get(`${database}/api/beneficiarios/buscar-simple?filtro=${texto}`);
      setResultados(res.data);
    }, 300),
    []
  );

  useEffect(() => {
    buscarBeneficiarios(busqueda);
    obtenerMedicos();

    if (modo === 'editar' && id) {
      cargarPedido(id);
    }
  }, [busqueda, id, modo]);

  const seleccionarBeneficiario = (b: any) => {
    handleBeneficiarioChange(b);
  };

  const handleBeneficiarioChange = async (beneficiario: any, esEdicion = false) => {

    setBeneficiarioId(beneficiario.id.toString());
    setBusqueda(`${beneficiario.nombre} ${beneficiario.apellido}`);
    setMostrandoResultados(false);

    // ✅ Solo autocompletar si NO estamos en modo edición o si el campo está vacío
    if (!esEdicion) {
      setDni(beneficiario.dni || '');
      setTelefono(beneficiario.telefono || '');
    }
    setGrupoFamiliarId(beneficiario.grupoFamiliarId?.toString() || '');

    validarCampo('beneficiarioId', beneficiario.id);

    // FAMILIARES
    try {
      const resp = await axios.get(`${database}/api/familiares/beneficiario/${beneficiario.id}`);
      setFamiliaresFiltrados(resp.data);
    } catch {
      setFamiliaresFiltrados([]);
    }
  };

  const normalizeDateForInput = (fecha?: string) => {
    if (!fecha) return '';
    // Si viene con time ISO '2025-12-15T00:00:00' -> tomar la parte antes de T
    let f = fecha;
    if (f.includes('T')) f = f.split('T')[0];
    const parts = f.split('-').map(p => p.trim());
    if (parts.length !== 3) return '';
    // yyyy-MM-dd
    if (parts[0].length === 4) {
      const [y, m, d] = parts;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    // dd-MM-yyyy
    if (parts[2].length === 4) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    // fallback: intentar parsear
    const date = new Date(fecha);
    if (!isNaN(date.getTime())) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return '';
  };

  /* =======================
     VALIDACIONES
  ======================= */

  const validarCampo = async (campo: string, valor: any) => {
    try {
      const schema = Yup.reach(validationSchema, campo);
      await (schema as any).validate(valor);
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[campo];
        return copy;
      });
    } catch (error: any) {
      setErrors(prev => ({ ...prev, [campo]: error.message }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    setter: Function,
    campo: string
  ) => {
    const valor = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setter(valor);
    validarCampo(campo, valor);
  };

  const validarDocumentos = (files: File[]): boolean => {

    setErrorDocumentos('');

    for (const file of files) {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (!extension || !EXTENSIONES_PERMITIDAS.includes(extension)) {
        setErrorDocumentos('Solo archivos JPG, PNG, PDF, DOC o DOCX');
        return false;
      }

      if (!TIPOS_ARCHIVO_PERMITIDOS.includes(file.type)) {
        setErrorDocumentos('Tipo de archivo no permitido');
        return false;
      }

      if (file.size > TAMAÑO_MAXIMO_BYTES) {
        setErrorDocumentos(`Máximo ${TAMAÑO_MAXIMO_MB}MB`);
        return false;
      }
    }
    return true;
  };

  const handleDocumentosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files || []);
    if (validarDocumentos(archivos)) {
      setDocumentos(archivos);
    } else {
      setDocumentos([]);
      e.target.value = '';
    }
  };

  /* =======================
     DATOS EDICIÓN
  ======================= */

  const cargarPedido = async (pedidoId: string) => {
    const resp = await axios.get(`${database}/api/pedidos/oftalmologia/${pedidoId}`);
    const pedido = resp.data;

    setNombre(pedido.nombre || '');
    setBeneficiarioId(pedido.beneficiario?.id?.toString() || '');
    setDni(pedido.dni?.toString() || '');
    setTelefono(pedido.telefono != null ? pedido.telefono.toString() : ''); // ✅ Corrección del teléfono
    setEmpresa(pedido.empresa || '');
    setDelegacion(pedido.delegacion || '');
    setMotivoConsulta(pedido.motivoConsulta || '');
    setUsaLentes(!!pedido.usaLentes);
    setRecetaMedica(!!pedido.recetaMedica);
    
    // Normalizar la fecha para el input[type=date]
    setFechaRevision(normalizeDateForInput(pedido.fechaRevision));
    
    setObservacionMedico(pedido.observacionMedico || '');
    setGrupoFamiliarId(pedido.grupoFamiliar?.id?.toString() || '');
    setPacienteId(pedido.paciente?.id?.toString() || '');
    setMedicoId(pedido.medico?.id?.toString() || '');

    if (pedido.beneficiario) {
      setBusqueda(`${pedido.beneficiario.nombre} ${pedido.beneficiario.apellido}`);
      handleBeneficiarioChange(pedido.beneficiario, true); // ✅ Flag de edición
    }
  };

  const obtenerMedicos = async () => {
    const response = await axios.get(`${database}/api/medicos`);
    setMedicos(response.data);
  };

  /* =======================
     SUBMIT
  ======================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate({
        nombre, beneficiarioId, dni, telefono, empresa,
        delegacion, motivoConsulta, fechaRevision, observacionMedico, pacienteId
      }, { abortEarly: false });

      // ✅ Convertir fecha a formato dd-MM-yyyy
      let fechaFormateada = null;
      if (fechaRevision) {
        const [year, month, day] = fechaRevision.split('-');
        fechaFormateada = `${day}-${month}-${year}`;
      }

      const pedido: any = {
        nombre,
        dni: Number(dni),
        telefono: Number(telefono),
        empresa,
        delegacion,
        motivoConsulta,
        usaLentes,
        recetaMedica,
        fechaRevision: fechaFormateada, // ✅ Enviar en formato dd-MM-yyyy
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
      formData.append("pedido", JSON.stringify(pedido));
      documentos.forEach(f => formData.append("documentos", f));

      if (modo === 'editar' && id) {
        await axios.put(`${database}/api/pedidos/oftalmologia/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        });
        Swal.fire({
          icon: 'success',
          title: 'Pedido actualizado',
          text: 'El pedido se actualizó correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await axios.post(`${database}/api/pedidos/oftalmologia`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        });
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

    } catch (error: any) {
      if (error.inner) {
        const map: any = {};
        error.inner.forEach((err: any) => map[err.path] = err.message);
        setErrors(map);
      }
      Swal.fire('Error', 'Revisá los campos del formulario', 'error');
    }
  };

  const handleVolver = () => navigate('/pedidos/oftalmologia');

return (
  <div className={styles.container}>
    <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
      Volver
    </button>
    <h2 className={styles.title}>Agregar Pedido Oftalmologia</h2>
    {Object.keys(errors).length > 0 &&
      <div className={styles.formError}>Hay errores en el formulario</div>
    }

    <form onSubmit={handleSubmit}>

      <label>Beneficiario</label>
      <div className={styles.autocomplete}>
        <input
          type="text"
          value={busqueda}
          onChange={e => { setBusqueda(e.target.value); setMostrandoResultados(true); }}
          onFocus={() => setMostrandoResultados(true)}
          placeholder="Buscar beneficiario"
          className={errors.beneficiarioId ? styles.inputError : ''}
        />

        {mostrandoResultados && resultados.length > 0 && (
          <ul className={styles.resultados}>
            {resultados.map(b => (
              <li key={b.id} onClick={() => seleccionarBeneficiario(b)}>
                {b.nombre} {b.apellido} — DNI {b.dni}
              </li>
            ))}
          </ul>
        )}
      </div>
      {errors.beneficiarioId && <span className={styles.errorText}>{errors.beneficiarioId}</span>}


      <label>Nombre:</label>
      <input type="text" value={nombre} onChange={e => handleInputChange(e, setNombre, 'nombre')} required />
      {errors.nombre && (
        <span className={styles.errorText}>{errors.nombre}</span>
      )}

      <label>DNI:</label>
      <input type="number" value={dni} onChange={e => handleInputChange(e, setDni, 'dni')} required />
      {errors.dni && (
        <span className={styles.errorText}>{errors.dni}</span>
      )}

      <label>Teléfono:</label>
      <input type="number" value={telefono} onChange={e => handleInputChange(e, setTelefono, 'telefono')} required />
      {errors.telefono && (
        <span className={styles.errorText}>{errors.telefono}</span>
      )}

      <label>Empresa:</label>
      <input type="text" value={empresa} onChange={e => handleInputChange(e, setEmpresa, 'empresa')} required />
      {errors.empresa && (
        <span className={styles.errorText}>{errors.empresa}</span>
      )}

      <label>Delegación:</label>
      <input type="text" value={delegacion} onChange={e => handleInputChange(e, setDelegacion, 'delegacion')} required />
      {errors.delegacion && (
        <span className={styles.errorText}>{errors.delegacion}</span>
      )}

      <label>Motivo de Consulta:</label>
      <input type="text" value={motivoConsulta} onChange={e => handleInputChange(e, setMotivoConsulta, 'motivoConsulta')} required />
      {errors.motivoConsulta && (
        <span className={styles.errorText}>{errors.motivoConsulta}</span>
      )}

      <label>Usa Lentes:</label>
      <input type="checkbox" checked={usaLentes} onChange={e => handleInputChange(e, setUsaLentes, 'usaLentes')} />

      <label>Receta Médica:</label>
      <input type="checkbox" checked={recetaMedica} onChange={e => handleInputChange(e, setRecetaMedica, 'recetaMedica')} />

      <label>Fecha de Revisión:</label>
      <input type="date" value={fechaRevision} onChange={e => handleInputChange(e, setFechaRevision, 'fechaRevision')} required />
      {errors.fechaRevision && (
        <span className={styles.errorText}>{errors.fechaRevision}</span>
      )}

      <label>Observación Médico:</label>
      <input type="text" value={observacionMedico} onChange={e => handleInputChange(e, setObservacionMedico, 'observacionMedico')} />
      {errors.observacionMedico && (
        <span className={styles.errorText}>{errors.observacionMedico}</span>
      )}

      <label>Paciente (familiar):</label>
      <select value={pacienteId} onChange={e => handleInputChange(e, setPacienteId, 'pacienteId')}>
        <option value="">Seleccione un paciente</option>
        {familiaresFiltrados.map(p => (
          <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
        ))}
      </select>
            {errors.pacienteId && (
        <span className={styles.errorText}>{errors.pacienteId}</span>
      )}

      <label>Médico:</label>
      <select value={medicoId} onChange={e => handleInputChange(e, setMedicoId, 'medicoId')} >
        <option value="">Seleccione un médico</option>
        {medicos.map(m => (
          <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>
        ))}
      </select>

      <label>Documento:</label>
      <input type="file" multiple onChange={handleDocumentosChange} />
      {errorDocumentos && <span className={styles.errorDocument}>{errorDocumentos}</span>}

      <div className={styles.actions}>
        <button type="submit">Aceptar</button>
        <button type="button" onClick={handleVolver}>Cancelar</button>
      </div>
    </form>
  </div>
);

};

export default ModalPedidoOftalmologia;
