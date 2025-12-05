import React, { useEffect, useState } from 'react';
import styles from './ModalMedico.module.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import * as Yup from 'yup';

const database = import.meta.env.VITE_DATABASE;

interface Area {
  id: number;
  nombre: string;
}

/* ============================
   ✅ VALIDACIONES CON YUP
============================ */
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('El email es obligatorio'),

  contrasena: Yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('La contraseña es obligatoria'),

  nombre: Yup.string()
    .min(2, 'Mínimo 2 caracteres')
    .required('El nombre es obligatorio'),

  apellido: Yup.string()
    .min(2, 'Mínimo 2 caracteres')
    .required('El apellido es obligatorio'),

  dni: Yup.number()
    .transform((v, o) => o === '' ? null : v)
    .typeError('El DNI debe ser numérico')
    .positive('DNI inválido')
    .required('El DNI es obligatorio'),

  cuil: Yup.number()
    .transform((v, o) => o === '' ? null : v)
    .typeError('El CUIL debe ser numérico')
    .positive('CUIL inválido')
    .required('El CUIL es obligatorio'),

  telefono: Yup.number()
    .transform((v, o) => o === '' ? null : v)
    .typeError('El teléfono debe ser numérico')
    .positive('Teléfono inválido')
    .required('El teléfono es obligatorio'),

  sexo: Yup.string().required('Debe seleccionar el sexo'),

  estado: Yup.string().required('Debe seleccionar el estado'),

  matricula: Yup.string()
    .min(4, 'Mínimo 4 caracteres')
    .required('La matrícula es obligatoria'),

  areaId: Yup.string().required('Debe seleccionar un área'),
});


const ModalMedico: React.FC<{ modo?: 'editar' | 'crear', onMedicoAdded?: () => void }> = ({ modo = 'crear', onMedicoAdded }) => {
  const { id } = useParams();
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [cuil, setCuil] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sexo, setSexo] = useState('');
  const [estado, setEstado] = useState('');
  const [matricula, setMatricula] = useState('');
  const [areaId, setAreaId] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    fetchAreas();
    if (modo === 'editar' && id) {
      cargarMedico(id);
    }
  }, [id, modo]);

  const fetchAreas = async () => {
    try {
      const res = await axios.get(`${database}/api/areas`);
      setAreas(res.data);
    } catch {
      setAreas([]);
    }
  };

  const cargarMedico = async (medicoId: string) => {
    try {
      const res = await axios.get(`${database}/api/medicos/${medicoId}`);
      const medico = res.data;
      setEmail(medico.usuario.email || '');
      setContrasena(medico.usuario.contrasena || '');
      setNombre(medico.nombre || '');
      setApellido(medico.apellido || '');
      setDni(medico.dni?.toString() || '');
      setCuil(medico.cuil?.toString() || '');
      setTelefono(medico.telefono?.toString() || '');
      setSexo(medico.sexo || '');
      setEstado(medico.estado || '');
      setMatricula(medico.matricula || '');
      setAreaId(medico.area?.id?.toString() || '');
    } catch (error) {
      console.error('Error al cargar médico:', error);
    }
  };

  const validarCampo = async (campo: string, valor: any) => {
    try {
      const schema = Yup.reach(validationSchema, campo);
      await (schema as any).validate(valor);
      setErrors(prev => {
        const nuevo = { ...prev };
        delete nuevo[campo];
        return nuevo;
      });
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        [campo]: err.message,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setter: Function,
    campo: string
  ) => {
    const value = e.target.value;
    setter(value);
    validarCampo(campo, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(
        {
          email,
          contrasena,
          nombre,
          apellido,
          dni,
          cuil,
          telefono,
          sexo,
          estado,
          matricula,
          areaId,
        },
        { abortEarly: false }
      );

      const payload = {
        email,
        contrasena,
        nombre,
        apellido,
        dni: Number(dni),
        cuil: Number(cuil),
        telefono: Number(telefono),
        sexo,
        estado,
        matricula,
        areaId: Number(areaId),
      };

      if (modo === 'editar' && id) {
        await axios.put(
          `${database}/api/medicos/actualizar/${id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire('Actualizado', 'El médico se actualizó correctamente', 'success');
      } else {
        await axios.post(`${database}/api/auth/register/medico`, payload);
        Swal.fire('Creado', 'El médico se creó correctamente', 'success');
      }

      onMedicoAdded?.();
      navigate('/medicos');

    } catch (error: any) {
      if (error.inner) {
        const formErrors: Record<string, string> = {};
        error.inner.forEach((e: any) => {
          formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      } else {
        Swal.fire('Error', 'No se pudo guardar el médico', 'error');
      }
    }
  };

  const handleVolver = () => navigate('/medicos');

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver}>Volver</button>

      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Médico' : 'Agregar Médico'}</h2>

        {Object.keys(errors).length > 0 && (
          <div className={styles.formError}>Hay errores en el formulario</div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Email</label>
          <input value={email} onChange={e => handleChange(e, setEmail, 'email')} className={errors.email ? styles.inputError : ''} />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}

          <label>Contraseña</label>
          <input type="password" value={contrasena} onChange={e => handleChange(e, setContrasena, 'contrasena')} className={errors.contrasena ? styles.inputError : ''} />
          {errors.contrasena && <span className={styles.errorText}>{errors.contrasena}</span>}

          <label>Nombre</label>
          <input value={nombre} onChange={e => handleChange(e, setNombre, 'nombre')} className={errors.nombre ? styles.inputError : ''} />
          {errors.nombre && <span className={styles.errorText}>{errors.nombre}</span>}

          <label>Apellido</label>
          <input value={apellido} onChange={e => handleChange(e, setApellido, 'apellido')} className={errors.apellido ? styles.inputError : ''} />
          {errors.apellido && <span className={styles.errorText}>{errors.apellido}</span>}

          <label>DNI</label>
          <input type="number" value={dni} onChange={e => handleChange(e, setDni, 'dni')} className={errors.dni ? styles.inputError : ''} />
          {errors.dni && <span className={styles.errorText}>{errors.dni}</span>}

          <label>CUIL</label>
          <input type="number" value={cuil} onChange={e => handleChange(e, setCuil, 'cuil')} className={errors.cuil ? styles.inputError : ''} />
          {errors.cuil && <span className={styles.errorText}>{errors.cuil}</span>}

          <label>Teléfono</label>
          <input type="number" value={telefono} onChange={e => handleChange(e, setTelefono, 'telefono')} className={errors.telefono ? styles.inputError : ''} />
          {errors.telefono && <span className={styles.errorText}>{errors.telefono}</span>}

          <label>Sexo</label>
          <select value={sexo} onChange={e => handleChange(e, setSexo, 'sexo')} className={errors.sexo ? styles.inputError : ''}>
            <option value="">Seleccione</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="SIN_INFORMACION">Sin información</option>
            <option value="AMBOS_SEXOS">Ambos sexos</option>
          </select>
          {errors.sexo && <span className={styles.errorText}>{errors.sexo}</span>}

          <label>Estado</label>
          <select value={estado} onChange={e => handleChange(e, setEstado, 'estado')} className={errors.estado ? styles.inputError : ''}>
            <option value="">Seleccione</option>
            <option value="ACTIVO">Activo</option>
            <option value="BAJA">Baja</option>
            <option value="SUSPENDIDO">Suspendido</option>
            <option value="SIN_DEFINIR">Sin definir</option>
          </select>
          {errors.estado && <span className={styles.errorText}>{errors.estado}</span>}

          <label>Matrícula</label>
          <input value={matricula} onChange={e => handleChange(e, setMatricula, 'matricula')} className={errors.matricula ? styles.inputError : ''} />
          {errors.matricula && <span className={styles.errorText}>{errors.matricula}</span>}

          <label>Área</label>
          <select value={areaId} onChange={e => handleChange(e, setAreaId, 'areaId')} className={errors.areaId ? styles.inputError : ''}>
            <option value="">Seleccione un área</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
          {errors.areaId && <span className={styles.errorText}>{errors.areaId}</span>}

          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={handleVolver}>Cancelar</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ModalMedico;
