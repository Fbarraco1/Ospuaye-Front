import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './GrupoFamiliar.module.css';
import { useAuthStore } from '../../../auth/store/authStore';
import ModalFamiliar from '../../ui/ModalFamiliar/ModalFamiliar';
import ModalGrupoFamiliar from '../../ui/ModalGrupoFamiliar/ModalGrupoFamiliar';

interface Familiar {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  cuil: string;
  telefono: string;
  tipoParentesco: string;
}

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
  activo: boolean;
  familiares: Familiar[];
}

export const GrupoFamiliar: React.FC = () => {
  const [grupos, setGrupos] = useState<GrupoFamiliar[]>([]);
  const [isModalGrupoOpen, setIsModalGrupoOpen] = useState(false);
  const [isModalFamiliarOpen, setIsModalFamiliarOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [grupoFamiliarId, setGrupoFamiliarId] = useState<number | null>(null);
  const [beneficiarioId, setBeneficiarioId] = useState<number | null>(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerGrupos();
  }, []);

  const obtenerGrupos = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/grupoFamiliar');
      setGrupos(response.data);
    } catch (error) {
      console.error('Error al obtener grupos familiares:', error);
    }
  };

  const eliminarGrupo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:9000/api/grupoFamiliar/${id}`, {
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

  const handleExpandRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleOpenModalGrupoFamiliar = () => {
    setIsModalGrupoOpen(true);
  };

  const handleOpenModalFamiliar = (grupoId: number, beneficiarioId: number) => {
    setGrupoFamiliarId(grupoId);
    setBeneficiarioId(beneficiarioId);
    setIsModalFamiliarOpen(true);
  };

  const handleCloseModalGrupo = () => {
    setIsModalGrupoOpen(false);
  };

  const handleCloseModalFamiliar = () => {
    setIsModalFamiliarOpen(false);
    setGrupoFamiliarId(null);
  };

  const handleFamiliarAdded = () => {
    obtenerGrupos();
    handleCloseModalFamiliar();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Grupos Familiares</h2>
        <button className={styles.addButton} onClick={handleOpenModalGrupoFamiliar}>
          <FaPlus /> Agregar Grupo Familiar
        </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Nombre Grupo</th>
            <th>Titular</th>
            <th>Fecha de Alta</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((g) => (
            <React.Fragment key={g.id}>
              <tr
                className={styles.clickableRow}
                onClick={() => handleExpandRow(g.id)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  {expandedRows.includes(g.id) ? <FaChevronUp /> : <FaChevronDown />}
                </td>
                <td>{g.id}</td>
                <td>{g.nombreGrupo}</td>
                <td>{`${g.titular.nombre} ${g.titular.apellido}`}</td>
                <td>{new Date(g.fechaAlta).toLocaleDateString()}</td>
                <td>{g.activo ? 'Sí' : 'No'}</td>
                <td className={styles.actions} onClick={e => e.stopPropagation()}>
                  <button
                    className={styles.addButton}
                    title="Agregar Familiar"
                    onClick={() => handleOpenModalFamiliar(g.id, g.titular.id)}
                  >
                    <FaPlus />
                  </button>
                  <FaEdit className={styles.editIcon} onClick={() => editarGrupo(g.id)} />
                  <FaTrash className={styles.deleteIcon} onClick={() => eliminarGrupo(g.id)} />
                </td>
              </tr>
              {expandedRows.includes(g.id) && (
                <tr>
                  <td colSpan={7}>
                    <div className={styles.familiaresList}>
                      <strong>Familiares:</strong>
                      {g.familiares && g.familiares.length > 0 ? (
                        <ul>
                          {g.familiares.map((f) => (
                            <li key={f.id}>
                              {f.nombre} {f.apellido} - DNI: {f.dni} - Parentesco: {f.tipoParentesco}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>No hay familiares registrados.</span>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <ModalFamiliar
        isOpen={isModalFamiliarOpen}
        onClose={handleCloseModalFamiliar}
        onSave={handleFamiliarAdded}
        grupoFamiliarId={grupoFamiliarId ?? undefined}
        beneficiarioId={beneficiarioId ?? 0}
      />

      <ModalGrupoFamiliar
        isOpen={isModalGrupoOpen}
        onClose={handleCloseModalGrupo}
        onGrupoFamiliarAdded={handleFamiliarAdded}
      />
    </div>
  );
};
