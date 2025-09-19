import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './GrupoFamiliar.module.css';
import { useAuthStore } from '../../../auth/store/authStore';
import ModalFamiliar from '../../ui/ModalFamiliar/ModalFamiliar';
import ModalGrupoFamiliar from '../../ui/ModalGrupoFamiliar/ModalGrupoFamiliar';
import EditarFamiliar from '../../ui/EditarFamiliar/EditarFamiliar';
import Swal from 'sweetalert2';

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
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // mostramos 5 por página
  const [isModalEditarFamiliarOpen, setIsModalEditarFamiliarOpen] = useState(false);
  const [selectedFamiliar, setSelectedFamiliar] = useState<any>(undefined);


  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerGrupos();
  }, []);

  const obtenerGrupos = async () => {
    try {
      const response = await axios.get('http://vps-5301866-x.dattaweb.com:9000/grupoFamiliar');
      setGrupos(response.data);
    } catch (error) {
      console.error('Error al obtener grupos familiares:', error);
    }
  };

  const eliminarGrupo = async (id: number) => {
    const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará el grupo familiar de forma permanente.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });
    
        if (result.isConfirmed) {
      try {
        await axios.delete(`http://vps-5301866-x.dattaweb.com:9000/api/grupoFamiliar/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGrupos((prev) => prev.filter((g) => g.id !== id));
                Swal.fire({
                  icon: 'success',
                  title: 'Eliminado',
                  text: 'El grupo familiar fue eliminado correctamente.',
                  timer: 1500,
                  showConfirmButton: false
                });
      } catch (error) {
        console.error('Error al eliminar grupo familiar:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo eliminar el grupo familiar.',
                });
      }
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

    const eliminarFamiliar= async (id: number) => {
    try {
      await axios.delete(`http://vps-5301866-x.dattaweb.com:9000/api/familiares/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error al eliminar familiar:', error);
    }
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

  // --- FILTRADO ---
  const gruposFiltrados = grupos.filter((g) =>
    [
      g.id,
      g.nombreGrupo,
      g.titular?.nombre,
      g.titular?.apellido,
      g.titular?.dni,
      g.fechaAlta,
      g.activo ? 'Sí' : 'No'
    ]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // --- PAGINADO ---
  const totalPages = Math.ceil(gruposFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = gruposFiltrados.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">GRUPOS FAMILIARES</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
    <div className={styles.container}>
      <h2 className={styles.title}>Grupos Familiares</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // resetear al buscar
        }}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
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
          {currentItems.map((g) => (
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
                        <table className={styles.table} style={{ marginTop: 10 }}>
                          <thead>
                            <tr>
                              <th>Nombre</th>
                              <th>Apellido</th>
                              <th>Parentesco</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {g.familiares.map((f) => (
                              <tr key={f.id}>
                                <td>{f.nombre}</td>
                                <td>{f.apellido}</td>
                                <td>{f.tipoParentesco}</td>
                                <td className={styles.actions}>
                                  <FaEdit
                                    className={styles.editIcon}
                                    onClick={() => {
                                      setSelectedFamiliar({
                                        ...f,
                                        grupoFamiliar: { id: g.id },
                                        beneficiario: { id: g.titular.id }
                                      });
                                      setIsModalEditarFamiliarOpen(true);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  />
                                  <FaTrash
                                    className={styles.deleteIcon}
                                    onClick={() => {eliminarFamiliar(f.id)}}
                                    style={{ cursor: "pointer" }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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

      {/* PAGINADO */}
      {totalPages > 1 && (
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: currentPage === 1 ? '#88C250' : '#88C250',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ◀
          </button>
          <span style={{ alignSelf: 'center', fontSize: '14px', color: '#555' }}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: currentPage === totalPages ? '#88C250' : '#88C250',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            ▶
          </button>
        </div>
      )}

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

      <EditarFamiliar
        isOpen={isModalEditarFamiliarOpen && !!selectedFamiliar}
        onClose={() => {
          setIsModalEditarFamiliarOpen(false);
          setSelectedFamiliar(undefined);
        }}
        onSave={obtenerGrupos}
        initialData={selectedFamiliar}
      />
    </div>
    </div>
  );
};
