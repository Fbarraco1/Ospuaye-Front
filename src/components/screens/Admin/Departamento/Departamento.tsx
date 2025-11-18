import  { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './Departamento.module.css';
import { useAuthStore } from '../../../../auth/store/authStore';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface Departamento {
  id: number;
  nombre: string;
  provincia: {
    id: number;
    nombre: string;
    activo: boolean;
  };
  activo: boolean;
}

export const Departamento = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // paginado 0-based (como Beneficiarios)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    obtenerDepartamentos(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce búsqueda (400ms) — igual que Beneficiarios
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerDepartamentos(0);
      } else {
        buscarDepartamentos(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const obtenerDepartamentos = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/departamentos/paginar`, {
        params: { page, size },
      });
      setDepartamentos(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al obtener Departamentos paginados:', error);
    }
  };

  const buscarDepartamentos = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/departamentos/buscar`, {
        params: { query: filtro, page, size },
      });
      setDepartamentos(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al buscar Departamentos:', error);
    }
  };

  const agregarDepartamento = () => {
    navigate('/departamento/nuevo');
  };

  const editarDepartamento = (id: number) => {
    navigate(`/departamento/editar/${id}`);
  };

  const eliminarDepartamento = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el departamento.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`${database}/api/departamentos/${id}/estado`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // recargar la página actual (considera búsqueda)
        if (search.trim() === '') obtenerDepartamentos(currentPage);
        else buscarDepartamentos(search, currentPage);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El departamento fue eliminado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error al eliminar Departamento:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el departamento.',
        });
      }
    }
  };

  // paginado (0-based)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerDepartamentos(newPage);
      else buscarDepartamentos(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerDepartamentos(newPage);
      else buscarDepartamentos(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">DEPARTAMENTOS</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className={styles.container}>
        <h2 className={styles.title}>Departamentos</h2>

        <input
          type="text"
          placeholder="Buscar por cualquier campo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
        />

        <button className={styles.addButton} onClick={agregarDepartamento}>
          <FaPlus /> Agregar Departamento
        </button>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Provincia</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {departamentos.map((b) => (
              <tr key={b.id}>
                <td>{b.nombre}</td>
                <td>{b.provincia?.nombre ?? 'N/A'}</td>
                <td>{b.activo ? 'Sí' : 'No'}</td>
                <td className={styles.actions}>
                  <FaEdit className={styles.editIcon} onClick={() => editarDepartamento(b.id)} />
                  <FaTrash className={styles.deleteIcon} onClick={() => eliminarDepartamento(b.id)} />
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
  );
};
