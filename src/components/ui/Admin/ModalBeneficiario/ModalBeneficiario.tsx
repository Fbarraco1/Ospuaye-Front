import React, { useEffect, useState } from 'react';
import styles from './modalBeneficiario.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../../auth/store/authStore';
import * as Yup from 'yup';

const database = import.meta.env.VITE_DATABASE;

const ModalBeneficiario: React.FC<{ modo?: 'editar' | 'crear', onBeneficiarioAdded?: () => void }> = ({ modo = 'crear', onBeneficiarioAdded }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [dni, setDni] = useState('');
  const [cuil, setCuil] = useState('');
  const [telefono, setTelefono] = useState('');
  const [afiliadoSindical, setafiliadoSindical] = useState(false);
  const [esJubilado, setEsJubilado] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  // ---------------------- SCHEMA YUP ----------------------
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
    apellido: Yup.string().required('El apellido es obligatorio'),
    email: Yup.string().email('Email inválido').required('El email es obligatorio'),
    contrasena: modo !== 'editar'
      ? Yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es obligatoria')
      : Yup.string(),
    dni: Yup.string().matches(/^\d+$/, 'Solo números').min(7, 'Mínimo 7 dígitos').required('DNI obligatorio'),
    cuil: Yup.string().matches(/^\d{11}$/, 'Debe tener 11 dígitos').required('CUIL obligatorio'),
    telefono: Yup.string().nullable()
      .matches(/^\d*$/, 'Solo números'),
  });

  // ---------------------- CARGAR BENEFICIARIO ----------------------
  useEffect(() => {
    if (modo === 'editar' && id) {
      cargarBeneficiario(id);
    }
  }, [id, modo]);

  const cargarBeneficiario = async (beneficiarioId: string) => {
    try {
      const res = await axios.get(`${database}/api/beneficiarios/${beneficiarioId}`);
      const b = res.data;
      setNombre(b.nombre || '');
      setApellido(b.apellido || '');
      setEmail(b.usuario.email || '');
      setDni(b.dni?.toString() || '');
      setCuil(b.cuil?.toString() || '');
      setTelefono(b.telefono?.toString() || '');
      setafiliadoSindical(b.afiliadoSindical || false);
      setEsJubilado(b.esJubilado || false);
    } catch (error) {
      console.error('Error al cargar beneficiario:', error);
    }
  };

  // ---------------------- VALIDAR CAMPO ----------------------
  const validarCampo = async (campo: string, valor: any) => {
    try {
      const fieldSchema = Yup.reach(validationSchema, campo);
      await (fieldSchema as any).validate(valor);

      setErrors(prev => {
        const nuevos = { ...prev };
        delete nuevos[campo];
        return nuevos;
      });
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        [campo]: err.message
      }));
    }
  };

  // ---------------------- VALIDAR FORM ----------------------
  const validarFormulario = async () => {
    try {
      await validationSchema.validate({
        nombre,
        apellido,
        email,
        contrasena,
        dni,
        cuil,
        telefono
      }, { abortEarly: false });

      setErrors({});
      setFormError('');
      return true;
    } catch (err: any) {
      const errores: Record<string, string> = {};
      err.inner.forEach((e: any) => {
        if (e.path) errores[e.path] = e.message;
      });
      setErrors(errores);
      setFormError('Por favor corregí los errores del formulario');
      return false;
    }
  };

  // ---------------------- API ----------------------
  const updateBene = async () => {
    await axios.put(`${database}/api/beneficiarios/${id}`, {
      nombre, apellido, usuario: { email }, dni, cuil, telefono, afiliadoSindical, esJubilado
    }, { headers: { Authorization: `Bearer ${token}` } });
  };

  const createBene = async () => {
    await axios.post(`${database}/api/auth/register/beneficiario`, {
      nombre, apellido, email, contrasena, dni, cuil, telefono, afiliadoSindical, esJubilado
    });
  };

  // ---------------------- SUBMIT ----------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const esValido = await validarFormulario();
    if (!esValido) return;

    try {
      if (modo === 'editar') {
        await updateBene();
        Swal.fire('Éxito', 'Beneficiario actualizado', 'success');
      } else {
        await createBene();
        Swal.fire('Éxito', 'Beneficiario creado', 'success');
      }

      if (onBeneficiarioAdded) onBeneficiarioAdded();
      navigate('/beneficiarios');

    } catch {
      Swal.fire('Error', 'No se pudo guardar el beneficiario', 'error');
    }
  };

  // ---------------------- VOLVER ----------------------
  const handleVolver = () => navigate('/beneficiarios');

  // ---------------------- RENDER ----------------------
  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>Volver</button>

      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Beneficiario' : 'Agregar Beneficiario'}</h2>

        {formError && <div className={styles.formError}>{formError}</div>}

        <form onSubmit={handleSubmit}>

          <label>Nombre:</label>
          <input className={errors.nombre ? styles.inputError : ''} value={nombre}
            onChange={e => { setNombre(e.target.value); validarCampo('nombre', e.target.value); }} />
          {errors.nombre && <span className={styles.errorText}>{errors.nombre}</span>}

          <label>Apellido:</label>
          <input className={errors.apellido ? styles.inputError : ''} value={apellido}
            onChange={e => { setApellido(e.target.value); validarCampo('apellido', e.target.value); }} />
          {errors.apellido && <span className={styles.errorText}>{errors.apellido}</span>}

          <label>Email:</label>
          <input className={errors.email ? styles.inputError : ''} value={email}
            onChange={e => { setEmail(e.target.value); validarCampo('email', e.target.value); }} />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}

          {modo !== 'editar' && (
            <>
              <label>Contraseña:</label>
              <input type="password" className={errors.contrasena ? styles.inputError : ''}
                value={contrasena}
                onChange={e => { setContrasena(e.target.value); validarCampo('contrasena', e.target.value); }} />
              {errors.contrasena && <span className={styles.errorText}>{errors.contrasena}</span>}
            </>
          )}

          <label>DNI:</label>
          <input className={errors.dni ? styles.inputError : ''} value={dni}
            onChange={e => { setDni(e.target.value); validarCampo('dni', e.target.value); }} />
          {errors.dni && <span className={styles.errorText}>{errors.dni}</span>}

          <label>CUIL:</label>
          <input className={errors.cuil ? styles.inputError : ''} value={cuil}
            onChange={e => { setCuil(e.target.value); validarCampo('cuil', e.target.value); }} />
          {errors.cuil && <span className={styles.errorText}>{errors.cuil}</span>}

          <label>Teléfono:</label>
          <input className={errors.telefono ? styles.inputError : ''} value={telefono}
            onChange={e => { setTelefono(e.target.value); validarCampo('telefono', e.target.value); }} />
          {errors.telefono && <span className={styles.errorText}>{errors.telefono}</span>}

          <label>¿Es Afiliado Sindical?:</label>
          <input type="checkbox" checked={afiliadoSindical}
            onChange={e => setafiliadoSindical(e.target.checked)} />

          <label>¿Es Jubilado?:</label>
          <input type="checkbox" checked={esJubilado}
            onChange={e => setEsJubilado(e.target.checked)} />

          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={handleVolver}>Cancelar</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ModalBeneficiario;
