import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './Medico.module.css';
import { useAuthStore } from '../../../auth/store/authStore';
import ModalMedico from '../../ui/ModalMedico/ModalMedico'; // Import the modal for adding/editing Medico

interface Medico {
  id: number;
  usuario_id: number;
  matricula: string;
  area_id: number;
}

export const Medico: React.FC = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerMedicos();
  }, []);

  const obtenerMedicos = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/medicos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedicos(response.data);
    } catch (error) {
      console.error('Error al obtener medicos:', error);
    }
  };

  const eliminarMedico = async (id: number) => {
    try {
      await axios.delete(`http://localhost:9000/api/medicos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedicos(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error al eliminar medico:', error);
    }
  };

  const editarMedico = (id: number) => {
    console.log('Editar medico con ID:', id);
    // Open modal for editing in the future
  };

  const agregarMedico = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMedicoAdded = () => {
    obtenerMedicos();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Médicos</h2>
      <button className={styles.addButton} onClick={agregarMedico}>
        <FaPlus /> Agregar Médico
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario ID</th>
            <th>Matrícula</th>
            <th>Área ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.usuario_id}</td>
              <td>{m.matricula}</td>
              <td>{m.area_id}</td>
              <td className={styles.actions}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarMedico(m.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarMedico(m.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalMedico
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onMedicoAdded={handleMedicoAdded}
      />
    </div>
  );
};