import  { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Nacionalidad.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface Nacionalidad {
  id: number;
  nombre: string;
  activo: boolean;
}

export const Nacionalidad = () => {
  const [nacionalidades, setNacionalidades] = useState<Nacionalidad[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-based como Beneficiarios
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerNacionalidades(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce búsqueda (igual que Beneficiarios)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerNacionalidades(0);
      } else {
        buscarNacionalidades(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const obtenerNacionalidades = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/nacionalidades/paginar`, {
        params: { page, size },
      });
      setNacionalidades(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al obtener Nacionalidades paginadas:', error);
      // fallback a endpoint sin paginar
      try {
        const res = await axios.get(`${database}/api/nacionalidades`);
        const all: Nacionalidad[] = res.data;
        setNacionalidades(all.slice(0, itemsPerPage));
        setTotalPages(Math.max(1, Math.ceil(all.length / itemsPerPage)));
      } catch (err) {
        console.error('Fallback error al obtener Nacionalidades:', err);
      }
    }
  };

  const buscarNacionalidades = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/nacionalidades/buscar`, {
        params: { query: filtro, page, size },
      });
      setNacionalidades(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al buscar Nacionalidades:', error);
      // fallback: filtrar localmente si no existe búsqueda paginada
      try {
        const res = await axios.get(`${database}/api/nacionalidades`);
        const all: Nacionalidad[] = res.data;
        const filtered = all.filter(p =>
          [p.id, p.nombre].join(' ').toLowerCase().includes(filtro.toLowerCase())
        );
        setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
        setNacionalidades(filtered.slice(0, itemsPerPage));
      } catch (err) {
        console.error('Fallback error al buscar Nacionalidades:', err);
      }
    }
  };

  const agregarNacionalidad = () => {
    navigate('/nacionalidades/nuevo');
  };

  const editarNacionalidad = (id: number) => {
    navigate(`/nacionalidades/editar/${id}`);
  };

  const eliminarNacionalidad = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la nacionalidad.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(`${database}/api/nacionalidades/${id}/estado`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // recargar la página actual (considera búsqueda)
      if (search.trim() === '') obtenerNacionalidades(currentPage);
      else buscarNacionalidades(search, currentPage);
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('Error al eliminar nacionalidad:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar la nacionalidad.' });
    }
  };

  // Controles de paginado (0-based)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerNacionalidades(newPage);
      else buscarNacionalidades(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerNacionalidades(newPage);
      else buscarNacionalidades(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">NACIONALIDADES</h1>
              </div>
              <ul className="breadcrumb-nav"></ul>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className={styles.container}>
        <h2 className={styles.title}>Nacionalidades</h2>
        <input
          type="text"
          placeholder="Buscar por cualquier campo..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(0); }}
          style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
        />
        <button className={styles.addButton} onClick={agregarNacionalidad}>
          <FaPlus /> Agregar Nacionalidad
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
            {nacionalidades.map((b) => (
              <tr key={b.id}>
                <td>{b.nombre}</td>
                <td>{b.activo ? 'Si' : 'No'}</td>
                <td className={styles.actions}>
                    <div className={styles.actionWrapper}>
                  <FaEdit className={styles.editIcon} onClick={() => editarNacionalidad(b.id)} />
                  <FaTrash className={styles.deleteIcon} onClick={() => eliminarNacionalidad(b.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button onClick={handlePrevPage} className={styles.pageButton} disabled={currentPage === 0}>◀</button>
            <span>Página {currentPage + 1} de {totalPages}</span>
            <button onClick={handleNextPage} className={styles.pageButton} disabled={currentPage >= totalPages - 1}>▶</button>
          </div>
        )}
      </div>
    </div>
  );
};
