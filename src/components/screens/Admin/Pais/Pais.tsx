import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Pais.module.css';
import { useAuthStore } from '../../../../auth/store/authStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface Pais {
  id: number;
  nombre: string;
  activo: boolean;
}

export const Pais = () => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-based (backend)
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerPaises(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce búsqueda (igual que Beneficiarios)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerPaises(0);
      } else {
        buscarPaises(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const obtenerPaises = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/paises/paginar`, {
        params: { page, size },
      });
      setPaises(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al obtener Paises paginados:', error);
      // fallback a endpoint sin paginar
      try {
        const res = await axios.get(`${database}/api/paises`);
        const all: Pais[] = res.data;
        setPaises(all.slice(0, itemsPerPage));
        setTotalPages(Math.max(1, Math.ceil(all.length / itemsPerPage)));
      } catch (err) {
        console.error('Fallback error al obtener Paises:', err);
      }
    }
  };

  const buscarPaises = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/paises/buscar`, {
        params: { query: filtro, page, size },
      });
      setPaises(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al buscar Paises:', error);
      // fallback: filtrar localmente si no existe búsqueda paginada
      try {
        const res = await axios.get(`${database}/api/paises`);
        const all: Pais[] = res.data;
        const filtered = all.filter(p =>
          [p.id, p.nombre].join(' ').toLowerCase().includes(filtro.toLowerCase())
        );
        setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
        setPaises(filtered.slice(0, itemsPerPage));
      } catch (err) {
        console.error('Fallback error al buscar Paises:', err);
      }
    }
  };

  const agregarPais = () => navigate('/pais/nuevo');
  const editarPais = (id: number) => navigate(`/pais/editar/${id}`);

  const eliminarPais = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el pais.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(`${database}/api/paises/${id}/estado`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // recargar la página actual (considera búsqueda)
      if (search.trim() === '') obtenerPaises(currentPage);
      else buscarPaises(search, currentPage);
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El pais fue eliminado correctamente.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al eliminar pais:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el pais.',
      });
    }
  };

  // Controles de paginado (0-based)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerPaises(newPage);
      else buscarPaises(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerPaises(newPage);
      else buscarPaises(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">PAISES</h1>
              </div>
              <ul className="breadcrumb-nav"></ul>
            </div>
          </div>
        </div>
      </div>

      <br />
      <div className={styles.container}>
        <h2 className={styles.title}>Paises</h2>

        <input
          type="text"
          placeholder="Buscar por cualquier campo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
        />
        <button className={styles.addButton} onClick={agregarPais}>
          <FaPlus /> Agregar Paises
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
            {paises.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.activo ? 'Sí' : 'No'}</td>
                <td className={styles.actions}>
                  <FaEdit className={styles.editIcon} onClick={() => editarPais(p.id)} />
                  <FaTrash className={styles.deleteIcon} onClick={() => eliminarPais(p.id)} />
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
      </div>
    </div>
  );
};
