import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaChevronDown, FaChevronUp, FaDownload } from 'react-icons/fa';
import styles from './GrupoFamiliar.module.css';
import { useAuthStore } from '../../../../auth/store/authStore';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface Familiar {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  cuil: string;
  telefono: string;
  tipoParentesco: string;
  activo: boolean;
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
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-based como Beneficiarios
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5; // mostramos 5 por página

  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // Cargar lista (paginada) al iniciar
  useEffect(() => {
    obtenerGrupos(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce búsqueda (igual que Beneficiarios)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerGrupos(0);
      } else {
        buscarGrupos(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // OBTENER LISTA PAGINADA DESDE BACKEND
  const obtenerGrupos = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/grupoFamiliar/paginar`, {
        params: { page, size },
      });
      setGrupos(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al obtener grupos familiares paginados:', error);
      // fallback a endpoint sin paginar
      try {
        const res = await axios.get(`${database}/api/grupoFamiliar`);
        const all: GrupoFamiliar[] = res.data;
        setGrupos(all.slice(0, itemsPerPage));
        setTotalPages(Math.ceil(all.length / itemsPerPage));
      } catch (err) {
        console.error('Error fallback al obtener grupos familiares:', err);
      }
    }
  };

  const buscarGrupos = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/grupoFamiliar/buscar`, {
        params: { query: filtro, page, size },
      });
      setGrupos(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al buscar grupos familiares:', error);
      // fallback: filtrar localmente si no existe búsqueda paginada
      try {
        const res = await axios.get(`${database}/api/grupoFamiliar`);
        const all: GrupoFamiliar[] = res.data;
        const filtered = all.filter(g =>
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
            .includes(filtro.toLowerCase())
        );
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setGrupos(filtered.slice(0, itemsPerPage));
      } catch (err) {
        console.error('Error fallback al buscar grupos familiares:', err);
      }
    }
  };

  const eliminarGrupo = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el grupo familiar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`${database}/api/grupoFamiliar/${id}/estado`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // recargar la página actual (considera búsqueda)
        if (search.trim() === '') obtenerGrupos(currentPage);
        else buscarGrupos(search, currentPage);
        Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El grupo familiar fue eliminado correctamente.', timer: 1500, showConfirmButton: false });
      } catch (error) {
        console.error('Error al eliminar grupo familiar:', error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el grupo familiar.' });
      }
    }
  };

  const editarGrupo = (id: number) => {
    navigate(`/grupoFamiliar/editar/${id}`);
  };

 const descargarGrupo = async (id: number) => {
  try {
    Swal.fire({
      title: "Generando archivo...",
      html: "Por favor espera unos segundos",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const response = await axios.get(`${database}/api/grupoFamiliar/${id}/export`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `grupo_familiar_${id}.txt`);
    document.body.appendChild(link);
    link.click();

    Swal.close();

    Swal.fire({
      icon: "success",
      title: "Archivo descargado",
      text: "El archivo del grupo familiar se descargó correctamente!",
      timer: 1800,
      showConfirmButton: false
    });

  } catch (error) {
    Swal.close();
    console.error("Error al descargar grupo familiar:", error);
    Swal.fire("Error", "No se pudo generar el archivo TXT", "error");
  }
};



  const handleExpandRow = (id: number) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const handleOpenModalGrupoFamiliar = () => {
    navigate('/grupoFamiliar/nuevo');
  };

  const handleOpenModalFamiliar = (grupoId: number, beneficiarioId: number) => {
    navigate(`/grupoFamiliar/${grupoId}/familiar/nuevo/${beneficiarioId}`);
  };

  const eliminarFamiliar = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el familiar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`${database}/api/familiares/${id}/estado`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // recargar la página actual (considera búsqueda)
        if (search.trim() === '') obtenerGrupos(currentPage);
        else buscarGrupos(search, currentPage);
        Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El familiar fue eliminado correctamente.', timer: 1500, showConfirmButton: false });
      } catch (error) {
        console.error('Error al eliminar familiar:', error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el familiar.' });
      }
    }
  };

  // MANEJAR PAGINADO DINÁMICO (0-based)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerGrupos(newPage);
      else buscarGrupos(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerGrupos(newPage);
      else buscarGrupos(search, newPage);
    }
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
      <br />
      <div className={styles.container}>
        <h2 className={styles.title}>Grupos Familiares</h2>

        <input
          type="text"
          placeholder="Buscar por cualquier campo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
                  <td>{`${g.titular?.nombre ?? ''} ${g.titular?.apellido ?? ''}`}</td>
                  <td>{g.fechaAlta ? new Date(g.fechaAlta).toLocaleDateString() : 'N/A'}</td>
                  <td>{g.activo ? 'Sí' : 'No'}</td>
                  <td className={styles.actions} onClick={e => e.stopPropagation()}>
                      <div className={styles.actionWrapper}>
                    <button
                      className={styles.addButton}
                      title="Agregar Familiar"
                      onClick={() => handleOpenModalFamiliar(g.id, g.titular?.id ?? 0)}
                    >
                      <FaPlus />
                    </button>
                    <button
                      className={styles.addButton}
                      title="Descargar TXT"
                      onClick={() => descargarGrupo(g.id)}
                    >
                      <FaDownload /> 
                    </button>

                    <FaEdit className={styles.editIcon} onClick={() => editarGrupo(g.id)} />
                    <FaTrash className={styles.deleteIcon} onClick={() => eliminarGrupo(g.id)} />
                    </div>
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
                                <th>Activo</th>
                                <th>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {g.familiares.map((f) => (
                                <tr key={f.id}>
                                  <td>{f.nombre}</td>
                                  <td>{f.apellido}</td>
                                  <td>{f.tipoParentesco}</td>
                                  <td>{f.activo ? 'Sí' : 'No'}</td>
                                  <td className={styles.actions}>
                                    <div className={styles.actionWrapper}>
                                    <FaEdit
                                      className={styles.editIcon}
                                      onClick={() => {
                                        navigate(`/familiar/editar/${f.id}`);
                                      }}
                                      style={{ cursor: "pointer" }}
                                    />
                                    <FaTrash
                                      className={styles.deleteIcon}
                                      onClick={() => { eliminarFamiliar(f.id); }}
                                      style={{ cursor: "pointer" }}
                                    />
                                    </div>
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
              disabled={currentPage === 0}
              style={{
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: '#88C250',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ◀
            </button>
            <span style={{ alignSelf: 'center', fontSize: '14px', color: '#555' }}>
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              style={{
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: '#88C250',
                cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};