import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Empresa.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import axios from 'axios';
import { ModalEmpresa } from '../../ui/ModalEmpresa/ModalEmpresa';
import Swal from 'sweetalert2';

interface Empresa {
    id: number;
    nombre: string;
    cuit: string;
    razonSocial: string;
    activo: boolean;
    domicilio: {
        id: number;
        calle: string;
        numeracion: string;
        codigoPostal: string;
    }
}

export const Empresa = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);

  // 🔹 Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    obtenerEmpresas();
  }, []);

  const obtenerEmpresas = async () => {
    try {
      const response = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/empresas', {});
      setEmpresas(response.data);
    } catch (error) {
      console.error('Error al obtener empresas:', error);
    }
  };
    
  const agregarEmpresa = () => {
    setIsModalOpen(true);
  }

  const editarEmpresa = (id: number) => {
    console.log('Editar Empresa con ID:', id);
  }

  const eliminarEmpresa= async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la empresa de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
          await axios.delete(`http://vps-5301866-x.dattaweb.com:9000/api/empresas/${id}`, {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          });
          setEmpresas(prev => prev.filter(b => b.id !== id));
                  Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'La empresa fue eliminada correctamente.',
                    timer: 1500,
                    showConfirmButton: false
                  });
          } catch (error) {
          console.error('Error al eliminar Empresa:', error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar la empresa.',
                  });
      }
  }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEmpresaAdded = () => {
    obtenerEmpresas();
  };

  // Barra de búsqueda por cualquier campo
  const provinciasFiltrados = empresas.filter((r) =>
    [
      r.id,
      r.nombre,
      r.cuit,
      r.razonSocial,
      r.domicilio?.calle,
      r.domicilio?.numeracion,
      r.domicilio?.codigoPostal
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
                <h1 className="page-title">EMPRESAS</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
    <div className={styles.container}>
      <h2 className={styles.title}>Empresas</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <button className={styles.addButton} onClick={agregarEmpresa}>
        <FaPlus /> Agregar Empresa
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cuit</th>
            <th>Razon Social</th>
            <th>Domicilio</th>
            <th>Codigo Postal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rolesPaginados.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td>{b.cuit}</td>
              <td>{b.razonSocial}</td>
              <td>{`${b.domicilio.calle} ${b.domicilio.numeracion}`}</td>
              <td>{b.domicilio.codigoPostal}</td>
              <td className={styles.actions}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarEmpresa(b.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarEmpresa(b.id)}
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

      <ModalEmpresa
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEmpresaAdded={handleEmpresaAdded}
      />
    </div>
    </div>
  )
}
