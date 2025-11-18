import  { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Roles.module.css';
import { useAuthStore } from '../../../../auth/store/authStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface Rol {
  id: number;
  nombre: string;
  area: {
    id: number;
    nombre: string;
  } | null;
  activo: boolean;
}

export const Roles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // paginado backend (0-based)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    obtenerRoles(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce búsqueda
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerRoles(0);
      } else {
        buscarRoles(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const obtenerRoles = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/roles/paginar`, {
        params: { page, size },
      });
      setRoles(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al obtener Roles paginados:', error);
      // fallback: intentar endpoint sin paginar
      try {
        const res = await axios.get(`${database}/api/roles`);
        const all: Rol[] = res.data;
        setRoles(all.slice(0, itemsPerPage));
        setTotalPages(Math.ceil(all.length / itemsPerPage));
      } catch (err) {
        console.error('Fallback error al obtener Roles:', err);
      }
    }
  };

  const buscarRoles = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/roles/buscar`, {
        params: { query: filtro, page, size },
      });
      setRoles(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al buscar Roles:', error);
      // fallback: filtrar localmente si no existe búsqueda paginada
      try {
        const res = await axios.get(`${database}/api/roles`);
        const all: Rol[] = res.data;
        const filtered = all.filter(r =>
          [r.id, r.nombre, r.area?.nombre].join(' ').toLowerCase().includes(filtro.toLowerCase())
        );
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setRoles(filtered.slice(0, itemsPerPage));
      } catch (err) {
        console.error('Fallback error al buscar Roles:', err);
      }
    }
  };

  const agregarRol = () => {
    navigate('/roles/nuevo');
  };

  const editarRol = (id: number) => {
    navigate(`/roles/editar/${id}`);
  };

  const eliminarRol = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el rol de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${database}/api/roles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // recargar la página actual (considera búsqueda)
        if (search.trim() === '') obtenerRoles(currentPage);
        else buscarRoles(search, currentPage);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El rol fue eliminado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error al eliminar rol:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el rol.',
        });
      }
    }
  };

  // paginado (0-based)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerRoles(newPage);
      else buscarRoles(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerRoles(newPage);
      else buscarRoles(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">ROLES</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className={styles.container}>
        <h2 className={styles.title}>Roles</h2>
        <input
          type="text"
          placeholder="Buscar por cualquier campo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
        />
        <button className={styles.addButton} onClick={agregarRol}>
          <FaPlus /> Agregar Roles
        </button>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Area</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((b) => (
              <tr key={b.id}>
                <td>{b.nombre}</td>
                <td>{b.area?.nombre ?? 'N/A'}</td>
                <td>{b.activo ? 'Sí' : 'No'}</td>
                <td className={styles.actions}>
                  <FaEdit className={styles.editIcon} onClick={() => editarRol(b.id)} />
                  <FaTrash className={styles.deleteIcon} onClick={() => eliminarRol(b.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Controles de paginación */}
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
