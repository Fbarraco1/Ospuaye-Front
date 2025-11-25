import React, { useEffect, useState } from 'react';
import styles from './modalBeneficiario.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;


const ModalBeneficiario: React.FC<{ modo?: 'editar' | 'crear', onBeneficiarioAdded?: () => void }> = ({ modo = 'crear', onBeneficiarioAdded }) => {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [cuil, setCuil] = useState('');
  const [telefono, setTelefono] = useState('');
  const [afiliadoSindical, setafiliadoSindical] = useState(false);
  const [esJubilado, setEsJubilado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (modo === 'editar' && id) {
      cargarBeneficiario(id);
    }
  }, [id, modo]);

  const cargarBeneficiario = async (beneficiarioId: string) => {
    try {
      const res = await axios.get(`${database}/api/beneficiarios/${beneficiarioId}`);
      const beneficiario = res.data;
      setNombre(beneficiario.nombre || '');
      setApellido(beneficiario.apellido || '');
      setEmail(beneficiario.usuario.email || '');
      setDni(beneficiario.dni?.toString() || '');
      setCuil(beneficiario.cuil?.toString() || '');
      setTelefono(beneficiario.telefono?.toString() || '');
      setafiliadoSindical(beneficiario.afiliadoSindical || false);
      setEsJubilado(beneficiario.esJubilado || false);
    } catch (error) {
      console.error('Error al cargar beneficiario:', error);
    }
  };

  const updateBene = async (
    nombre: string,
    apellido: string,
    email: string,
    dni: string,
    cuil: string,
    telefono: string,
    afiliadoSindical: boolean,
    esJubilado: boolean
  ) => {
    try {
      const response = await axios.put(
       `${database}/api/beneficiarios/${id}`,
        { nombre, apellido, email, dni, cuil, telefono, afiliadoSindical, esJubilado },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear beneficiario');
      Swal.fire({
        icon: 'success',
        title: 'Beneficiario actualizado',
        text: 'El beneficiario se actualizo correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al actualizar beneficiario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el beneficiario.',
      });
    }
  }

  const createBene = async (
    nombre: string,
    apellido: string,
    email: string,
    contrasena: string,
    dni: string,
    cuil: string,
    telefono: string,
    afiliadoSindical: boolean,
    esJubilado: boolean
  ) => {
    try {
      const response = await axios.post(
        `${database}/api/auth/register/beneficiario`,
        { nombre, apellido, email, contrasena, dni, cuil, telefono, afiliadoSindical, esJubilado },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.status < 200 || response.status >= 300) throw new Error('Error al crear beneficiario');
      Swal.fire({
        icon: 'success',
        title: 'Beneficiario creado',
        text: 'El beneficiario se creó correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al crear beneficiario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el beneficiario.',
      });
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modo === 'editar' && id) {
        await updateBene(nombre, apellido, email, dni, cuil, telefono, afiliadoSindical, esJubilado);
        handleVolver();
      } else {
      await createBene(nombre, apellido, email, contrasena, dni, cuil, telefono, afiliadoSindical, esJubilado);
      if (onBeneficiarioAdded) onBeneficiarioAdded();
      handleVolver();}
    } catch (error) {
      console.error('Error al crear beneficiario:', error);
    }
    handleVolver();
  };

    const handleVolver = () => {
    navigate('/beneficiarios');
  };
  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
        Volver
      </button>
      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Beneficiario' : 'Agregar Beneficiario'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Apellido:</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {modo !== 'editar' && (
            <>
              <label>Contraseña:</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </>
          )}

          <label>DNI:</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
          />

          <label>CUIL:</label>
          <input
            type="text"
            value={cuil}
            onChange={(e) => setCuil(e.target.value)}
            required
          />

          <label>Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />

          <label>¿Es Afiliado Sindical?:</label>
          <input
            type="checkbox"
            checked={afiliadoSindical}
            onChange={(e) => setafiliadoSindical(e.target.checked)}
          />

          <label>¿Es Jubilado?:</label>
          <input
            type="checkbox"
            checked={esJubilado}
            onChange={(e) => setEsJubilado(e.target.checked)}
          />                    

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
