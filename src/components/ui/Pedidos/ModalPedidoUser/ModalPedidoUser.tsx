import React, { useEffect, useState } from 'react';
import styles from './ModalPedidoUser.module.css';
import axios from 'axios';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

const database = import.meta.env.VITE_DATABASE;

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio').min(3, 'Mínimo 3 caracteres'),
  beneficiarioId: Yup.string().required('Debe seleccionar un beneficiario'),
  dni: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .typeError("El DNI debe ser un número")
    .required("El DNI es obligatorio")
    .positive("DNI inválido"),
  telefono: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .typeError("El teléfono debe ser un número")
    .required("El teléfono es obligatorio")
    .positive("Teléfono inválido"),
  empresa: Yup.string().required('La empresa es obligatoria'),
  delegacion: Yup.string().required('La delegación es obligatoria'),
  motivoConsulta: Yup.string().required('El motivo de consulta es obligatorio'),
  fechaRevision: Yup.date().required('La fecha de revisión es obligatoria').typeError('Fecha inválida'),
  observacionMedico: Yup.string(),
  pacienteId: Yup.string(),
});

const TIPOS_ARCHIVO_PERMITIDOS = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const EXTENSIONES_PERMITIDAS = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
const TAMAÑO_MAXIMO_MB = 5;
const TAMAÑO_MAXIMO_BYTES = TAMAÑO_MAXIMO_MB * 1024 * 1024;

const ModalPedidoUser: React.FC<{ onPedidoAdded?: () => void }> = ({ onPedidoAdded }) => {
  const token = useAuthStore((state) => state.token);
  const beneficiarioIdFromStore = useAuthStore((state) => state.user?.idBeneficiario || 0);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [beneficiarioId, setBeneficiarioId] = useState(beneficiarioIdFromStore ? String(beneficiarioIdFromStore) : '');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [delegacion, setDelegacion] = useState('');
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [recetaMedica, setRecetaMedica] = useState(false);
  const [fechaRevision, setFechaRevision] = useState('');
  const [observacionMedico, setObservacionMedico] = useState('');
  const [grupoFamiliarId, setGrupoFamiliarId] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [documentos, setDocumentos] = useState<File[]>([]);
  const [familiaresFiltrados, setFamiliaresFiltrados] = useState<any[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorDocumentos, setErrorDocumentos] = useState('');

  useEffect(() => {
    // Si tenemos beneficiario en el store, intentamos cargar datos y familiares
    if (beneficiarioIdFromStore && Number(beneficiarioIdFromStore) > 0) {
      cargarBeneficiario(Number(beneficiarioIdFromStore));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarBeneficiario = async (id: number) => {
    try {
      const resp = await axios.get(`${database}/api/beneficiarios/${id}`);
      const beneficiario = resp.data;
      if (beneficiario) {
        setBeneficiarioId(beneficiario.id?.toString() || '');
        setBusquedaYAutocompletar(beneficiario);
      }
      // cargar familiares
      try {
        const respFam = await axios.get(`${database}/api/familiares/beneficiario/${id}`);
        setFamiliaresFiltrados(respFam.data);
      } catch (err) {
        console.error('Error al cargar familiares', err);
        setFamiliaresFiltrados([]);
      }
    } catch (error) {
      console.error('Error al obtener beneficiario:', error);
    }
  };

  // función auxiliar para autocompletar datos del beneficiario (copiada comportamiento ModalPedido)
  const setBusquedaYAutocompletar = (beneficiario: any) => {
    setDni(beneficiario.dni?.toString() || '');
    setTelefono(beneficiario.telefono?.toString() || '');
    setGrupoFamiliarId(beneficiario.grupoFamiliarId?.toString() || '');
    // validar beneficiarioId en schema (en tiempo real)
    validarCampo('beneficiarioId', beneficiario.id?.toString());
    // si el beneficiario trae pacientes, ya quedaron cargados por la llamada anterior a /familiares
  };

  const validarCampo = async (nombreCampo: string, valor: any) => {
    try {
      const schema = Yup.reach(validationSchema, nombreCampo);
      await (schema as any).validate(valor);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[nombreCampo];
        return newErrors;
      });
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        [nombreCampo]: error.message
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, setter: Function, nombreCampo: string) => {
    const valor = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setter(valor);
    validarCampo(nombreCampo, valor);
  };

  const validarDocumentos = (files: File[]): boolean => {
    setErrorDocumentos('');

    if (files.length === 0) {
      return true; // Los documentos son opcionales
    }

    for (const file of files) {
      // Validar extensión
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !EXTENSIONES_PERMITIDAS.includes(extension)) {
        const mensaje = 'Solo se aceptan archivos JPG, JPEG, PNG, PDF, DOC o DOCX';
        setErrorDocumentos(mensaje);
        Swal.fire({
          icon: 'error',
          title: 'Documento no válido',
          text: mensaje,
        });
        return false;
      }

      // Validar tipo MIME
      if (!TIPOS_ARCHIVO_PERMITIDOS.includes(file.type)) {
        const mensaje = 'Solo se aceptan archivos JPG, JPEG, PNG, PDF, DOC o DOCX';
        setErrorDocumentos(mensaje);
        Swal.fire({
          icon: 'error',
          title: 'Documento no válido',
          text: mensaje,
        });
        return false;
      }

      // Validar tamaño
      if (file.size > TAMAÑO_MAXIMO_BYTES) {
        const mensaje = `El archivo "${file.name}" excede el tamaño máximo de ${TAMAÑO_MAXIMO_MB}MB`;
        setErrorDocumentos(mensaje);
        Swal.fire({
          icon: 'error',
          title: 'Documento muy grande',
          text: mensaje,
        });
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
      // Limpiar el input si es inválido
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validar todo el formulario con el mismo schema y abortEarly: false
      await validationSchema.validate({
        nombre,
        beneficiarioId,
        dni,
        telefono,
        empresa,
        delegacion,
        motivoConsulta,
        fechaRevision,
        observacionMedico,
        pacienteId,
      }, { abortEarly: false });

      // Validación de documentos ya hecha en handleDocumentosChange, pero se puede re-checkear antes de enviar:
      if (!validarDocumentos(documentos)) {
        return;
      }

      const pedido: any = {
        nombre,
        dni: dni ? Number(dni) : null,
        telefono: telefono ? Number(telefono) : null,
        empresa,
        delegacion,
        motivoConsulta,
        recetaMedica,
        fechaRevision: fechaRevision ? new Date(fechaRevision) : null,
        observacionMedico,
        beneficiario: { id: Number(beneficiarioId) },
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

      await axios.post(
        `${database}/api/pedidos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (onPedidoAdded) onPedidoAdded();
      navigate('/pedidos/general/user');
      Swal.fire({
        icon: 'success',
        title: 'Pedido creado',
        text: 'El pedido se creó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      // Si es error de validación de Yup (frontend)
      if (error && error.inner) {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err: any) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
        // mostrar alerta global opcional
        Swal.fire({
          icon: 'error',
          title: 'Errores en el formulario',
          text: 'Revisá los campos marcados.',
        });
        return;
      }

      console.error('Error al crear pedido:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el pedido.',
      });
    }
  };

  const handleVolver = () => {
    navigate('/pedidos/general/user');
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
        Volver
      </button>
      <h2 className={styles.title}>Agregar Pedido</h2>

      {/* Mensaje global si hay errores */}
      {Object.keys(errors).length > 0 && (
        <div className={styles.formError}>
          Hay errores en el formulario. Revisá los campos marcados.
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">

        <label>Nombre del pedido:</label>
        <input
          type="text"
          value={nombre}
          onChange={e => handleInputChange(e, setNombre, 'nombre')}
          className={errors.nombre ? styles.inputError : ''}
        />
        {errors.nombre && <span className={styles.errorText}>{errors.nombre}</span>}

        <label>DNI:</label>
        <input
          type="number"
          value={dni}
          onChange={e => handleInputChange(e, setDni, 'dni')}
          className={errors.dni ? styles.inputError : ''}
        />
        {errors.dni && <span className={styles.errorText}>{errors.dni}</span>}

        <label>Teléfono:</label>
        <input
          type="number"
          value={telefono}
          onChange={e => handleInputChange(e, setTelefono, 'telefono')}
          className={errors.telefono ? styles.inputError : ''}
        />
        {errors.telefono && <span className={styles.errorText}>{errors.telefono}</span>}

        <label>Empresa:</label>
        <input
          type="text"
          value={empresa}
          onChange={e => handleInputChange(e, setEmpresa, 'empresa')}
          className={errors.empresa ? styles.inputError : ''}
        />
        {errors.empresa && <span className={styles.errorText}>{errors.empresa}</span>}

        <label>Delegación:</label>
        <input
          type="text"
          value={delegacion}
          onChange={e => handleInputChange(e, setDelegacion, 'delegacion')}
          className={errors.delegacion ? styles.inputError : ''}
        />
        {errors.delegacion && <span className={styles.errorText}>{errors.delegacion}</span>}

        <label>Motivo de Consulta:</label>
        <input
          type="text"
          value={motivoConsulta}
          onChange={e => handleInputChange(e, setMotivoConsulta, 'motivoConsulta')}
          className={errors.motivoConsulta ? styles.inputError : ''}
        />
        {errors.motivoConsulta && <span className={styles.errorText}>{errors.motivoConsulta}</span>}

        <label>Receta Médica:</label>
        <input
          type="checkbox"
          checked={recetaMedica}
          onChange={e => setRecetaMedica(e.target.checked)}
        />

        <label>Fecha de Revisión:</label>
        <input
          type="date"
          value={fechaRevision}
          onChange={e => handleInputChange(e, setFechaRevision, 'fechaRevision')}
          className={errors.fechaRevision ? styles.inputError : ''}
        />
        {errors.fechaRevision && <span className={styles.errorText}>{errors.fechaRevision}</span>}

        <label>Observación Médico:</label>
        <input
          type="text"
          value={observacionMedico}
          onChange={e => handleInputChange(e, setObservacionMedico, 'observacionMedico')}
          className={errors.observacionMedico ? styles.inputError : ''}
        />
        {errors.observacionMedico && <span className={styles.errorText}>{errors.observacionMedico}</span>}

        <label>Paciente (familiar):</label>
        <select
          value={pacienteId}
          onChange={e => handleInputChange(e, setPacienteId, 'pacienteId')}
          className={errors.pacienteId ? styles.inputError : ''}
        >
          <option value="">Seleccione un paciente</option>
          {familiaresFiltrados.map(p => (
            <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
          ))}
        </select>
        {errors.pacienteId && <span className={styles.errorText}>{errors.pacienteId}</span>}

        <label>Documentos:</label>
        <input
          type="file"
          multiple
          onChange={handleDocumentosChange}
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        />
        {errorDocumentos && <span className={styles.errorDocument}>{errorDocumentos}</span>}

        <div className={styles.actions}>
          <button type="submit">Aceptar</button>
          <button type="button" onClick={handleVolver}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ModalPedidoUser;
