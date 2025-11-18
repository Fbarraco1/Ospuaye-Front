import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Localidad.module.css';
import { useAuthStore } from '../../../../auth/store/authStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface Localidad {
    id: number;
    nombre: string;
    codigoPostal: string;
    activo: boolean;
    departamento?: {
        id: number;
        nombre: string;
        activo: boolean;
    }
}

export const Localidad = () => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // Estados para paginación (0-based como Beneficiarios)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    obtenerLocalidades(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce búsqueda (igual que Beneficiarios)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerLocalidades(0);
      } else {
        buscarLocalidades(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Intentar endpoint paginado; fallback a endpoint sin paginar
  const obtenerLocalidades = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/localidades/paginar`, {
        params: { page, size },
      });
      setLocalidades(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al obtener Localidades paginadas:', error);
      // fallback a endpoint sin paginar
      try {
        const res = await axios.get(`${database}/api/localidades`);
        const all: Localidad[] = res.data;
        setLocalidades(all.slice(0, size));
        setTotalPages(Math.max(1, Math.ceil(all.length / size)));
      } catch (err) {
        console.error('Fallback error al obtener Localidades:', err);
      }
    }
  };

  const buscarLocalidades = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/localidades/buscar`, {
        params: { query: filtro, page, size },
      });
      setLocalidades(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al buscar Localidades:', error);
      // fallback: filtrar localmente si no existe búsqueda paginada
      try {
        const res = await axios.get(`${database}/api/localidades`);
        const all: Localidad[] = res.data;
        const filtered = all.filter(l =>
          [l.id, l.nombre, l.codigoPostal, l.departamento?.nombre ?? '']
            .join(' ')
            .toLowerCase()
            .includes(filtro.toLowerCase())
        );
        setTotalPages(Math.max(1, Math.ceil(filtered.length / size)));
        setLocalidades(filtered.slice(0, size));
      } catch (err) {
        console.error('Fallback error al buscar Localidades:', err);
      }
    }
  };

  const agregarLocalidad = () => {
    navigate('/localidad/nuevo');
  }

  const editarLocalidad = (id: number) => {
    navigate(`/localidad/editar/${id}`);
  }

  const eliminarLocalidad= async (id: number) => {
    const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará la localidad.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });

    if (!result.isConfirmed) return;

    try {
        await axios.patch(`${database}/api/localidades/${id}/estado`, 
          {}, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        // recargar la página actual (considera búsqueda)
        if (search.trim() === '') obtenerLocalidades(currentPage);
        else buscarLocalidades(search, currentPage);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La localidad fue eliminada correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
    } catch (error) {
        console.error('Error al eliminar Localidad:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la localidad.',
        });
    }
  }

  // Controles de paginado (0-based)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerLocalidades(newPage);
      else buscarLocalidades(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerLocalidades(newPage);
      else buscarLocalidades(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">LOCALIDADES</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
    <div className={styles.container}>
      <h2 className={styles.title}>Localidades</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <button className={styles.addButton} onClick={agregarLocalidad}>
        <FaPlus /> Agregar Localidad
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Departamento</th>
            <th>Código Postal</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {localidades.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td>{b.departamento?.nombre ?? 'No especificado'}</td>
              <td>{b.codigoPostal}</td>
              <td>{b.activo ? 'Sí' : 'No'}</td>
              <td className={styles.actions}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarLocalidad(b.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarLocalidad(b.id)}
                />
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
