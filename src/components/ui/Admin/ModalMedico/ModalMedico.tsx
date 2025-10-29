import React, { useEffect, useState } from 'react';
import styles from './ModalMedico.module.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
const database = import.meta.env.VITE_DATABASE;

interface Area {
  id: number;
  nombre: string;
}

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
  const navigate = useNavigate();
  

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
    } catch (e) {
      setAreas([]);
    }
  };

  const cargarMedico = async (medicoId: string) => {
    try {
      const res = await axios.post(`${database}/api/medicos/${medicoId}`);
      const medico = res.data;
      setEmail(medico.usuario.email || '');
      setContrasena(medico.usuario.contrasena || ''); 0
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modo === 'editar' && id) {
        await axios.put(
          `${database}/api/medicos/${id}`,
          {
            email,
            nombre,
            apellido,
            dni: Number(dni),
            cuil: Number(cuil),
            telefono: Number(telefono),
            sexo,
            estado,
            matricula,
            areaId: Number(areaId),
          },
        );
        Swal.fire({
          icon: 'success',
          title: 'Médico actualizado',
          text: 'El médico se actualizó correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await axios.post(
          `${database}/api/auth/register/medico`,
          {
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
            areaId: Number(areaId)
          },
        );
        Swal.fire({
          icon: 'success',
          title: 'Médico creado',
          text: 'El médico se creó correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
      }
      if (onMedicoAdded) onMedicoAdded();
      navigate('/medicos');
    } catch (error) {
      console.error('Error al guardar médico:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar el médico.',
      });
    }
  };

    const handleVolver = () => {
    navigate('/medicos');
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleVolver} style={{ marginBottom: 10 }}>
        Volver
      </button>
      <div className={styles.modal}>
        <h2>Agregar Médico</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label>Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            required
          />
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <label>Apellido:</label>
          <input
            type="text"
            value={apellido}
            onChange={e => setApellido(e.target.value)}
            required
          />
          <label>DNI:</label>
          <input
            type="number"
            value={dni}
            onChange={e => setDni(e.target.value)}
            required
          />
          <label>CUIL:</label>
          <input
            type="number"
            value={cuil}
            onChange={e => setCuil(e.target.value)}
            required
          />
          <label>Teléfono:</label>
          <input
            type="number"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            required
          />
          <label>Sexo:</label>
          <select
            value={sexo}
            onChange={e => setSexo(e.target.value)}
            required
          >
            <option value="">Seleccione sexo</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="SIN_INFORMACION">Sin informacion</option>
            <option value="AMBOS_SEXOS">Ambos sexos</option>
          </select>
          <label>Estado:</label>
          <select
            value={estado}
            onChange={e => setEstado(e.target.value)}
            required
          >
            <option value="">Seleccione estado</option>
            <option value="ACTIVO">Activo</option>
            <option value="BAJA">Baja</option>
            <option value="SUSPENDIDO">Suspendido</option>
            <option value="SIN_DEFINIR">Sin definir</option>
          </select>
          <label>Matrícula:</label>
          <input
            type="text"
            value={matricula}
            onChange={e => setMatricula(e.target.value)}
            required
          />
          <label>Área:</label>
          <select
            value={areaId}
            onChange={e => setAreaId(e.target.value)}
            required
          >
            <option value="">Seleccione un área</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
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