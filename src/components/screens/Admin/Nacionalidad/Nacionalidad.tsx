import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Nacionalidad.module.css';
import { useEffect, useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerNacionalidades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerNacionalidades = async () => {
    try {
      const response = await axios.get(`${database}/api/nacionalidades`);
      setNacionalidades(response.data);
    } catch (error) {
      console.error('Error al obtener Nacionalidades:', error);
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

    if (result.isConfirmed) {
      try {
        await axios.patch(`${database}/api/nacionalidades/${id}/estado`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        obtenerNacionalidades();
        Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
      } catch (error) {
        console.error('Error al eliminar nacionalidad:', error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar la nacionalidad.' });
      }
    }
  };

  // filtrado y paginación (igual que antes)
  const paisesFiltrados = nacionalidades.filter((a) =>
    [a.id, a.nombre].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = paisesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(paisesFiltrados.length / itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage((p) => p - 1); };

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
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
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
            {currentItems.map((b) => (
              <tr key={b.id}>
                <td>{b.nombre}</td>
                <td>{b.activo ? 'Si' : 'No'}</td>
                <td className={styles.actions}>
                  <FaEdit className={styles.editIcon} onClick={() => editarNacionalidad(b.id)} />
                  <FaTrash className={styles.deleteIcon} onClick={() => eliminarNacionalidad(b.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button onClick={handlePrevPage} className={styles.pageButton} disabled={currentPage === 1}>◀</button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={handleNextPage} className={styles.pageButton} disabled={currentPage === totalPages}>▶</button>
          </div>
        )}
      </div>
    </div>
  );
};
