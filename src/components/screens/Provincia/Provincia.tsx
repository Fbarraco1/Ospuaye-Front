import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Provincia.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import axios from 'axios';
import { ModalProvincia } from '../../ui/ModalProvincia/ModalProvincia';
import Swal from 'sweetalert2';

interface Provincia {
    id: number;
    nombre: string;
    pais: {
        id: number;
        nombre: string;
        activo: boolean;
    }
}

export const Provincia = () => {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);

  // 🔹 Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    obtenerProvincias();
  }, []);

  const obtenerProvincias = async () => {
    try {
      const response = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/provincias', {});
      setProvincias(response.data);
    } catch (error) {
      console.error('Error al obtener Provincias:', error);
    }
  };
    
  const agregarProvincia = () => {
    setIsModalOpen(true);
  }

  const editarProvincia = (id: number) => {
    console.log('Editar Provinvcia con ID:', id);
  }

  const eliminarProvincia= async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la provincia de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {    
      try {
          await axios.delete(`http://vps-5301866-x.dattaweb.com:9000/api/provincias/${id}`, {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          });
          setProvincias(prev => prev.filter(b => b.id !== id));
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
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProvinciaAdded = () => {
    obtenerProvincias();
  };

  // Barra de búsqueda por cualquier campo
  const provinciasFiltrados = provincias.filter((r) =>
    [
      r.id,
      r.nombre,
      r.pais
    ]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 🔹 Lógica de paginación
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
                <h1 className="page-title">PROVINCIAS</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
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
        <FaPlus /> Agregar Roles
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Pais</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rolesPaginados.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td>{/* @ts-ignore */ b.pais.nombre}</td>
              <td className={styles.actions}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarProvincia(b.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarProvincia(b.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Controles de paginación */}
      <div className={styles.pagination}>
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Anterior
        </button>
        <span className={styles.pageInfo}>
          Página {currentPage} de {totalPages || 1}
        </span>
        <button 
          onClick={nextPage} 
          disabled={currentPage === totalPages || totalPages === 0}
          className={styles.pageButton}
        >
          Siguiente
        </button>
      </div>

      <ModalProvincia
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onProvinciaAdded={handleProvinciaAdded}
      />
    </div>
    </div>
  )
}
