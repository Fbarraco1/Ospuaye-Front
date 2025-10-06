import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Areas.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import axios from 'axios';
import { ModalArea } from '../../ui/ModalArea/ModalArea';
import Swal from 'sweetalert2';

interface Area {
    id: number;
    nombre: string;
}

export const Areas = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // estado para paginación
  const [areaEdit, setAreaEdit] = useState<Area | undefined>(undefined);
  const itemsPerPage = 5;
  const token = useAuthStore((state) => state.token);
  
  useEffect(() => {
    obtenerAreas();
  }, []);

  const obtenerAreas = async () => {
    try {
      const response = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/areas', {
      });
      setAreas(response.data);
    } catch (error) {
      console.error('Error al obtener Areas:', error);
    }
  };
    
  const agregarArea = () => {
    setAreaEdit(undefined);
    setIsModalOpen(true);
  }

  const editarArea = (id: number) => {
    const area = areas.find(a => a.id === id);
    setAreaEdit(area);
    setIsModalOpen(true);
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
          await axios.delete(`http://vps-5301866-x.dattaweb.com:9000/api/areas/${id}`, {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          });
          setAreas(prev => prev.filter(b => b.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El area fue eliminada correctamente.',
            timer: 1500,
            showConfirmButton: false
          });
          } catch (error) {
          console.error('Error al eliminar beneficiario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el area.',
          });       
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAreaEdit(undefined);
  };

  const handleAreaAdded = () => {
    obtenerAreas();
  };

  // Barra de búsqueda por cualquier campo
  const areasFiltradas = areas.filter((a) =>
    [
      a.id,
      a.nombre
    ]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // --- Paginación ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = areasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(areasFiltradas.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td className={styles.actions}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarArea(b.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarArea(b.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={handlePrevPage} className={styles.pageButton} disabled={currentPage === 1}>
            ◀
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={handleNextPage} className={styles.pageButton} disabled={currentPage === totalPages}>
            ▶
          </button>
        </div>
      )}

      <ModalArea
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAreaAdded={handleAreaAdded}
        areaEdit={areaEdit}
      />
    </div>
    </div>
  )
}
