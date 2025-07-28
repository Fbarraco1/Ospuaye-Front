import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './GrupoFamiliar.module.css';
import { useAuthStore } from '../../../auth/store/authStore';
import ModalGrupoFamiliar from '../../ui/ModalGrupoFamiliar/ModalGrupoFamiliar';
interface GrupoFamiliar {
  id: number;
  nombreGrupo: string;
  titular: {
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
  };
  fechaAlta: string;
  dni: number;
  cuil: number;
  tipoParentesco: string;
  activo: boolean;
}

export const GrupoFamiliar: React.FC = () => {
  const [grupos, setGrupos] = useState<GrupoFamiliar[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerGrupos();
  }, []);

  const obtenerGrupos = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/grupos-familiares');
      setGrupos(response.data);
    } catch (error) {
      console.error('Error al obtener grupos familiares:', error);
    }
  };

  const eliminarGrupo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:9000/api/grupos-familiares/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGrupos((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error('Error al eliminar grupo familiar:', error);
    }
  };

  const editarGrupo = (id: number) => {
    console.log('Editar grupo con ID:', id);
    // Lógica para abrir modal de edición futura
  };

  const agregarGrupo = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGrupoAdded = () => {
    obtenerGrupos();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Grupos Familiares</h2>
      <button className={styles.addButton} onClick={agregarGrupo}>
        <FaPlus /> Agregar Grupo Familiar
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Grupo</th>
            <th>Titular</th>
            <th>DNI</th>
            <th>CUIL</th>
            <th>Parentesco</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.nombreGrupo}</td>
              <td>{`${g.titular.nombre} ${g.titular.apellido}`}</td>
              <td>{g.dni}</td>
              <td>{g.cuil}</td>
              <td>{g.tipoParentesco}</td>
              <td>{g.activo ? 'Sí' : 'No'}</td>
              <td className={styles.actions}>
                <FaEdit className={styles.editIcon} onClick={() => editarGrupo(g.id)} />
                <FaTrash className={styles.deleteIcon} onClick={() => eliminarGrupo(g.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalGrupoFamiliar
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleGrupoAdded}
      />
    </div>
  );
};
