import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Areas.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../auth/store/authStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;


interface Area {
    id: number;
    nombre: string;
    activo: boolean;
}

export const Areas = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-based como Beneficiarios
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  
  useEffect(() => {
    obtenerAreas(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce búsqueda (igual que Beneficiarios)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerAreas(0);
      } else {
        buscarAreas(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // OBTENER LISTA PAGINADA (backend)
  const obtenerAreas = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/areas/paginar`, {
        params: { page, size },
      });
      setAreas(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al obtener Areas:', error);
      // fallback a endpoint sin paginar si el backend no tiene /paginar
      try {
        const res = await axios.get(`${database}/api/areas`);
        const all: Area[] = res.data;
        setAreas(all.slice(0, itemsPerPage));
        setTotalPages(Math.ceil(all.length / itemsPerPage));
      } catch (err) {
        console.error('Error fallback al obtener Areas:', err);
      }
    }
  };

  const buscarAreas = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/areas/buscar`, {
        params: { query: filtro, page, size },
      });
      setAreas(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al buscar Areas:', error);
      // fallback: filtrar localmente si no existe endpoint de búsqueda paginada
      try {
        const res = await axios.get(`${database}/api/areas`);
        const all: Area[] = res.data;
        const filtered = all.filter(a =>
          [a.id, a.nombre].join(' ').toLowerCase().includes(filtro.toLowerCase())
        );
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setAreas(filtered.slice(0, itemsPerPage));
      } catch (err) {
        console.error('Error fallback al buscar Areas:', err);
      }
    }
  };
    
  const agregarArea = () => {
    navigate('/areas/nuevo');
  }

  const editarArea = (id: number) => {
    navigate(`/areas/editar/${id}`);
  }

  const eliminarArea = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el area de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {    
      try {
          await axios.delete(`${database}/api/areas/${id}`, {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          });
          // recargar la página actual (considera búsqueda)
          if (search.trim() === '') obtenerAreas(currentPage);
          else buscarAreas(search, currentPage);
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El area fue eliminada correctamente.',
            timer: 1500,
            showConfirmButton: false
          });
          } catch (error) {
          console.error('Error al eliminar area:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el area.',
          });       
      }
    }
  }

  // MANEJAR PAGINADO (0-based)
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerAreas(newPage);
      else buscarAreas(search, newPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerAreas(newPage);
      else buscarAreas(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">AREAS</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
    <div className={styles.container}>
      <h2 className={styles.title}>Areas</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <button className={styles.addButton} onClick={agregarArea}>
        <FaPlus /> Agregar Areas
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td>{b.activo ? 'Sí' : 'No'}</td>
              <td className={styles.actions}>
                  <div className={styles.actionWrapper}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarArea(b.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarArea(b.id)}
                />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={handlePrevPage} className={styles.pageButton} disabled={currentPage === 0}>
            ◀
          </button>
          <span>Página {currentPage + 1} de {totalPages}</span>
          <button onClick={handleNextPage} className={styles.pageButton} disabled={currentPage >= totalPages - 1}>
            ▶
          </button>
        </div>
      )}

      {/* Modal convertido en página: se eliminó <ModalArea /> */}
    </div>
    </div>
  )
}
