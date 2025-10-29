import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Departamento.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../auth/store/authStore';
import axios from 'axios';
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
  }
  activo: boolean;
}

export const Departamento = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    obtenerDepartamentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerDepartamentos = async () => {
    try {
      const response = await axios.get(`${database}/api/departamentos`);
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error al obtener Departamentos:', error);
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
        obtenerDepartamentos(); // refrescar la lista
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

  // Barra de búsqueda por cualquier campo
  const provinciasFiltrados = departamentos.filter((r) =>
    [
      r.id,
      r.nombre,
      r.provincia.nombre
    ]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Lógica de paginación
  const totalPages = Math.ceil(provinciasFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rolesPaginados = provinciasFiltrados.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
          <FaPlus /> Agregar Departamentos
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
            {rolesPaginados.map((b) => (
              <tr key={b.id}>
                <td>{b.nombre}</td>
                <td>{/* @ts-ignore */ b.provincia.nombre}</td>
                <td>{b.activo ? 'Sí' : 'No'}</td>
                <td className={styles.actions}>
                  <FaEdit
                    className={styles.editIcon}
                    onClick={() => editarDepartamento(b.id)}
                  />
                  <FaTrash
                    className={styles.deleteIcon}
                    onClick={() => eliminarDepartamento(b.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            ◀
          </button>
          <span className={styles.pageInfo}>
            Página {currentPage} de {totalPages || 1}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={styles.pageButton}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
