import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Roles.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import axios from 'axios';
import { ModalRol } from '../../ui/ModalRol/ModalRol';
import Swal from 'sweetalert2';

interface Rol {
    id: number;
    nombre: string;
    area: {
        nombre: string;
    }
}

export const Roles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);

  // 🔹 Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    obtenerRoles();
  }, []);

  const obtenerRoles = async () => {
    try {
      const response = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/roles', {});
      setRoles(response.data);
    } catch (error) {
      console.error('Error al obtener Roles:', error);
    }
  };
    
  const agregarRol = () => {
    setIsModalOpen(true);
  }

  const editarRol = (id: number) => {
    console.log('Editar Area con ID:', id);
  }

  const eliminarRol= async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el rol de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {    
      try {
          await axios.delete(`http://vps-5301866-x.dattaweb.com:9000/api/roles/${id}`, {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          });
          setRoles(prev => prev.filter(b => b.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El rol fue eliminado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });          
          } catch (error) {
          console.error('Error al eliminar roles:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el rol.',
          });          
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAreaAdded = () => {
    obtenerRoles();
  };

  // Barra de búsqueda por cualquier campo
  const rolesFiltrados = roles.filter((r) =>
    [
      r.id,
      r.nombre,
      r.area
    ]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 🔹 Lógica de paginación
  const totalPages = Math.ceil(rolesFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const rolesPaginados = rolesFiltrados.slice(startIndex, endIndex);

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
                <h1 className="page-title">ROLES</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
    <div className={styles.container}>
      <h2 className={styles.title}>Roles</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <button className={styles.addButton} onClick={agregarRol}>
        <FaPlus /> Agregar Roles
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Area</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rolesPaginados.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td>{/* @ts-ignore */ b.area.nombre}</td>
              <td className={styles.actions}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarRol(b.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarRol(b.id)}
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

      <ModalRol
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRolAdded={handleAreaAdded}
      />
    </div>
    </div>
  )
}
