import React, { useEffect, useState } from 'react';
import styles from './ModalMedico.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Area {
  id: number;
  nombre: string;
}

const ModalMedico: React.FC<{ onMedicoAdded?: () => void }> = ({ onMedicoAdded }) => {
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
  }, []);

  const fetchAreas = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/areas');
      setAreas(res.data);
    } catch (e) {
      setAreas([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:9000/api/auth/register/medico',
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
      if (onMedicoAdded) onMedicoAdded();
      navigate('/medicos');

    } catch (error) {
      console.error('Error al crear médico:', error);
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
            <button type="submit">Agregar</button>
            <button type="button" onClick={handleVolver}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalMedico;