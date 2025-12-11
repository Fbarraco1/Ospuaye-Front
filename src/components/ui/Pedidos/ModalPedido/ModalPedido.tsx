import React, { useCallback, useEffect, useState } from 'react';
import styles from './ModalPedido.module.css';
import axios from 'axios';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { debounce } from 'lodash';


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
  fechaRevision: Yup.date().required('La fecha de revisión es obligatoria').typeError('Fecha inválida'),
  observacionMedico: Yup.string(),
  pacienteId: Yup.string(),
});

const TIPOS_ARCHIVO_PERMITIDOS = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const EXTENSIONES_PERMITIDAS = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
const TAMAÑO_MAXIMO_MB = 5;
const TAMAÑO_MAXIMO_BYTES = TAMAÑO_MAXIMO_MB * 1024 * 1024;

const ModalPedido: React.FC<{ modo?: 'editar' | 'crear', onPedidoAdded?: () => void }> = ({ modo = 'crear', onPedidoAdded }) => {
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [beneficiarioId, setBeneficiarioId] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [delegacion, setDelegacion] = useState('');
  //const [motivoConsulta, setMotivoConsulta] = useState('');
  //const [recetaMedica, setRecetaMedica] = useState(false);
  const [fechaRevision, setFechaRevision] = useState('');
  const [observacionMedico, setObservacionMedico] = useState('');
  const [grupoFamiliarId, setGrupoFamiliarId] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [documentos, setDocumentos] = useState<File[]>([]);
  const [familiaresFiltrados, setFamiliaresFiltrados] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorDocumentos, setErrorDocumentos] = useState('');
  // 🔍 AUTOCOMPLETE beneficiarios
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [mostrandoResultados, setMostrandoResultados] = useState(false);


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
    if (modo === 'editar' && id) {
      cargarPedido(id);
    }
  }, [id, modo, busqueda, buscarBeneficiarios]);

   const seleccionarBeneficiario = (b: any) => {
  handleBeneficiarioChange(b);
};

const cargarPedido = async (pedidoId: string) => {
  try {
    const resp = await axios.get(`${database}/api/pedidos/${pedidoId}`);
    const pedido = resp.data;

    setNombre(pedido.nombre || '');
    setBeneficiarioId(pedido.beneficiario?.id?.toString() || '');
    setDni(pedido.dni?.toString() || '');
    setTelefono(pedido.telefono != null ? pedido.telefono.toString() : ''); // ✅ Corrección del teléfono
    setEmpresa(pedido.empresa || '');
    setDelegacion(pedido.delegacion || '');
    //setMotivoConsulta(pedido.motivoConsulta || '');
    //setRecetaMedica(!!pedido.recetaMedica);
    
    // ✅ Convertir fecha de dd-MM-yyyy a yyyy-MM-dd para el input
    if (pedido.fechaRevision) {
      const partes = pedido.fechaRevision.split('-');
      if (partes.length === 3) {
        const [day, month, year] = partes;
        setFechaRevision(`${year}-${month}-${day}`);
      } else {
        setFechaRevision('');
      }
    } else {
      setFechaRevision('');
    }
    
    setObservacionMedico(pedido.observacionMedico || '');
    setGrupoFamiliarId(pedido.grupoFamiliar?.id?.toString() || '');
    setPacienteId(pedido.paciente?.id?.toString() || '');

    if (pedido.beneficiario) {
      const nombreCompleto = `${pedido.beneficiario.nombre} ${pedido.beneficiario.apellido}`;
      setBusqueda(nombreCompleto);
      setMostrandoResultados(false);
      handleBeneficiarioChange(pedido.beneficiario, true); // ✅ Flag de edición
    }

  } catch (error) {
    console.error('Error al cargar pedido:', error);
  }
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

  // Cargar familiares
  try {
    const resp = await axios.get(
      `${database}/api/familiares/beneficiario/${beneficiario.id}`
    );
    setFamiliaresFiltrados(resp.data);
  } catch (error) {
    console.error("Error al cargar familiares", error);
    setFamiliaresFiltrados([]);
  }
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
      // Limpiar el input
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await validationSchema.validate({
      nombre,
      beneficiarioId,
      dni,
      telefono,
      empresa,
      delegacion,
      //motivoConsulta,
      fechaRevision,
      observacionMedico,
      pacienteId,
    }, { abortEarly: false });

    // ✅ Convertir fecha a formato dd-MM-yyyy
    let fechaFormateada = null;
    if (fechaRevision) {
      const [year, month, day] = fechaRevision.split('-');
      fechaFormateada = `${day}-${month}-${year}`;
    }

    const pedido: any = {
      nombre,
      dni: dni ? Number(dni) : null,
      telefono: telefono ? Number(telefono) : null,
      empresa,
      delegacion,
      //motivoConsulta,
      //recetaMedica,
      fechaRevision: fechaFormateada, // ✅ Enviar en formato dd-MM-yyyy
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

    if (modo === 'editar' && id) {
      await axios.put(
        `${database}/api/pedidos/editar/${id}`,
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
        `${database}/api/pedidos`,
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
    navigate('/pedidos/generales');
  } catch (error: any) {
    if (error.inner) {
      const newErrors: Record<string, string> = {};
      error.inner.forEach((err: any) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
    console.error('Error al guardar pedido:', error);
  }
};

  const handleVolver = () => {
    navigate('/pedidos/generales');
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

    <label>Beneficiario:</label>
        <div className={styles.autocomplete}>
          <input
            type="text"
            placeholder="Buscar beneficiario por apellido o DNI..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setMostrandoResultados(true);
            }}
            onFocus={() => setMostrandoResultados(true)}
            className={errors.beneficiarioId ? styles.inputError : ''}
          />

          {mostrandoResultados && resultados.length > 0 && (
            <ul className={styles.resultados}>
              {resultados.map(b => (
                <li key={b.id} onClick={() => seleccionarBeneficiario(b)}>
                  {b.nombre} {b.apellido} — DNI: {b.dni}
                </li>
              ))}
            </ul>
          )}
        </div>

        {errors.beneficiarioId && <span className={styles.errorText}>{errors.beneficiarioId}</span>}

      <label>Nombre:</label>
      <input
        type="text"
        value={nombre}
        onChange={e => handleInputChange(e, setNombre, 'nombre')}
        className={errors.nombre ? styles.inputError : ''}
      />
      {errors.nombre && (
        <span className={styles.errorText}>{errors.nombre}</span>
      )}

      <label>DNI:</label>
      <input
        type="number"
        value={dni}
        onChange={e => handleInputChange(e, setDni, 'dni')}
        className={errors.dni ? styles.inputError : ''}
      />
      {errors.dni && (
        <span className={styles.errorText}>{errors.dni}</span>
      )}

      <label>Teléfono:</label>
      <input
        type="number"
        value={telefono}
        onChange={e => handleInputChange(e, setTelefono, 'telefono')}
        className={errors.telefono ? styles.inputError : ''}
      />
      {errors.telefono && (
        <span className={styles.errorText}>{errors.telefono}</span>
      )}

      <label>Empresa:</label>
      <input
        type="text"
        value={empresa}
        onChange={e => handleInputChange(e, setEmpresa, 'empresa')}
        className={errors.empresa ? styles.inputError : ''}
      />
      {errors.empresa && (
        <span className={styles.errorText}>{errors.empresa}</span>
      )}

      <label>Delegación:</label>
      <input
        type="text"
        value={delegacion}
        onChange={e => handleInputChange(e, setDelegacion, 'delegacion')}
        className={errors.delegacion ? styles.inputError : ''}
      />
      {errors.delegacion && (
        <span className={styles.errorText}>{errors.delegacion}</span>
      )}
{/* 
      <label>Motivo de Consulta:</label>
      <input
        type="text"
        value={motivoConsulta}
        onChange={e => handleInputChange(e, setMotivoConsulta, 'motivoConsulta')}
        className={errors.motivoConsulta ? styles.inputError : ''}
      />
      {errors.motivoConsulta && (
        <span className={styles.errorText}>{errors.motivoConsulta}</span>
      )} */}

      {/* <label>Receta Médica:</label>
      <input
        type="checkbox"
        checked={recetaMedica}
        onChange={e => setRecetaMedica(e.target.checked)}
      /> */}

      <label>Fecha de Revisión:</label>
      <input
        type="date"
        value={fechaRevision}
        onChange={e => handleInputChange(e, setFechaRevision, 'fechaRevision')}
        className={errors.fechaRevision ? styles.inputError : ''}
      />
      {errors.fechaRevision && (
        <span className={styles.errorText}>{errors.fechaRevision}</span>
      )}

      <label>Observación Médico:</label>
      <input
        type="text"
        value={observacionMedico}
        onChange={e => handleInputChange(e, setObservacionMedico, 'observacionMedico')}
        className={errors.observacionMedico ? styles.inputError : ''}
      />
      {errors.observacionMedico && (
        <span className={styles.errorText}>{errors.observacionMedico}</span>
      )}

      <label>Paciente (familiar):</label>
      <select
        value={pacienteId}
        onChange={e => handleInputChange(e, setPacienteId, 'pacienteId')}
        className={errors.pacienteId ? styles.inputError : ''}
      >
        <option value="">Seleccione un paciente</option>
        {familiaresFiltrados.map(p => (
          <option key={p.id} value={p.id}>
            {p.nombre} {p.apellido}
          </option>
        ))}
      </select>
      {errors.pacienteId && (
        <span className={styles.errorText}>{errors.pacienteId}</span>
      )}

      <label>Documentos:</label>
      <input
        type="file"
        multiple
        onChange={handleDocumentosChange}
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
      />
      {errorDocumentos && (
        <span className={styles.errorDocument}>{errorDocumentos}</span>
      )}

      <div className={styles.actions}>
        <button type="submit">Aceptar</button>
        <button type="button" onClick={handleVolver}>Cancelar</button>
      </div>

    </form>
  </div>
);
};
export default ModalPedido;
