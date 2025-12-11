import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Provincia.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface Provincia {
    id: number;
    nombre: string;
    pais: {
        id: number;
        nombre: string;
        activo: boolean;
    }
    activo: boolean;
}

export const Provincia = () => {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // Estados para paginación (0-based como Beneficiarios)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    obtenerProvincias(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce búsqueda (igual que Beneficiarios)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerProvincias(0);
      } else {
        buscarProvincias(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Intentar endpoint paginado; fallback a endpoint sin paginar
  const obtenerProvincias = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/provincias/paginar`, {
        params: { page, size },
      });
      setProvincias(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al obtener Provincias paginadas:', error);
      // fallback a endpoint sin paginar
      try {
        const res = await axios.get(`${database}/api/provincias`);
        const all: Provincia[] = res.data;
        setProvincias(all.slice(0, itemsPerPage));
        setTotalPages(Math.max(1, Math.ceil(all.length / itemsPerPage)));
      } catch (err) {
        console.error('Fallback error al obtener Provincias:', err);
      }
    }
  };

  const buscarProvincias = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/provincias/buscar`, {
        params: { query: filtro, page, size },
      });
      setProvincias(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al buscar Provincias:', error);
      // fallback: filtrar localmente si no existe búsqueda paginada
      try {
        const res = await axios.get(`${database}/api/provincias`);
        const all: Provincia[] = res.data;
        const filtered = all.filter(r =>
          [r.id, r.nombre, r.pais?.nombre ?? '']
            .join(' ')
            .toLowerCase()
            .includes(filtro.toLowerCase())
        );
        setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
        setProvincias(filtered.slice(0, itemsPerPage));
      } catch (err) {
        console.error('Fallback error al buscar Provincias:', err);
      }
    }
  };

  const agregarProvincia = () => {
    navigate('/provincia/nuevo');
  }

  const editarProvincia = (id: number) => {
    navigate(`/provincia/editar/${id}`);
  }

  const eliminarProvincia= async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la provincia.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(`${database}/api/provincias/${id}/estado`, 
        {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      // recargar la página actual (considera búsqueda)
      if (search.trim() === '') obtenerProvincias(currentPage);
      else buscarProvincias(search, currentPage);
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'La provincia fue eliminada correctamente.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al eliminar Provincias:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la provincia.',
      });
    }
  }

  // Controles de paginado (0-based)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerProvincias(newPage);
      else buscarProvincias(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerProvincias(newPage);
      else buscarProvincias(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">PROVINCIAS</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
    <div className={styles.container}>
      <h2 className={styles.title}>Provincias</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <button className={styles.addButton} onClick={agregarProvincia}>
        <FaPlus /> Agregar Provincias
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Pais</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {provincias.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td>{b.pais?.nombre ?? 'Sin nombre'}</td>
              <td>{b.activo ? 'Sí' : 'No'}</td>
              <td className={styles.actions}>
                  <div className={styles.actionWrapper}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarProvincia(b.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarProvincia(b.id)}
                />
                </div>
              </td>
            </tr>
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
  )
}
