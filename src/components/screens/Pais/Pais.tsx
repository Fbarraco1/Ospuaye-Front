import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Pais.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import axios from 'axios';
import { ModalPais } from '../../ui/ModalPais/ModalPais';
import Swal from 'sweetalert2';

interface Pais {
    id: number;
    nombre: string;
    activo: boolean;
}

export const Pais = () => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // estado para paginación
  const itemsPerPage = 5;
  const token = useAuthStore((state) => state.token);
  
  useEffect(() => {
    obtenerPaises();
  }, []);

  const obtenerPaises = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/paises', {
      });
      setPaises(response.data);
    } catch (error) {
      console.error('Error al obtener Areas:', error);
    }
  };
    
  const agregarPais = () => {
    setIsModalOpen(true);
  }

  const editarPais = (id: number) => {
    console.log('Editar Area con ID:', id);
  }

  const eliminarPais = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el pais de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {    
      try {
          await axios.delete(`http://localhost:9000/api/paises/${id}`, {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          });
          setPaises(prev => prev.filter(b => b.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El pais fue eliminado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });          
          } catch (error) {
          console.error('Error al eliminar beneficiario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el pais.',
          });     
        }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePaisesAdded = () => {
    obtenerPaises();
  };

  // Barra de búsqueda por cualquier campo
  const paisesFiltrados = paises.filter((a) =>
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
  const currentItems = paisesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(paisesFiltrados.length / itemsPerPage);

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
                <h1 className="page-title">PAISES</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
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
          {currentItems.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td>{b.activo}</td>
              <td className={styles.actions}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarPais(b.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarPais(b.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Siguiente
          </button>
        </div>
      )}

      <ModalPais
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPaisesAdded={handlePaisesAdded}
      />
    </div>
    </div>
  )
}
