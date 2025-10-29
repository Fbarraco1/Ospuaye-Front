import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Domicilio.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../auth/store/authStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ModalDomicilio } from '../../../ui/Admin/ModalDomicilio/ModalDomicilio';
const database = import.meta.env.VITE_DATABASE;


interface Domicilio {
    id: number;
    calle: string;
    numeracion: string;
    barrio: string;
    manzanaPiso: string;
    casaDepartamento:string;
    referencia:string;
    activo: Boolean;
    localidad: {
        id: number;
        nombre: string;
        codigoPostal: string;
        activo: boolean;
    },
    tipo: 'URBANO' | 'RURAL';
}

export const Domicilio = () => {
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [edit, setEdit] = useState<Domicilio | undefined>(undefined);
  const token = useAuthStore((state) => state.token);

  // 🔹 Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    obtenerDomicilios();
  }, []);

  const obtenerDomicilios = async () => {
    try {
      const response = await axios.get(`${database}/api/domicilios`, {});
      setDomicilios(response.data);
    } catch (error) {
      console.error('Error al obtener Domicilios:', error);
    }
  };
    
  const agregarDomicilio = () => {
    setIsModalOpen(true);
  }

  const editarDomicilio = (id: number) => {
    const dom = domicilios.find(d => d.id === id);
    setEdit(dom);
    setIsModalOpen(true);  }

  const eliminarDomicilio= async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el domicilio.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {    
      try {
          await axios.patch(`${database}/api/domicilios/${id}/estado`, 
            {}, {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          });
          obtenerDomicilios(); // refrescar la lista
                  Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El domicilio fue eliminado correctamente.',
                    timer: 1500,
                    showConfirmButton: false
                  });
          } catch (error) {
          console.error('Error al eliminar Domicilios:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el domicilio.',
          });
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEdit(undefined);
  };

  const handleDomicilioAdded = () => {
    obtenerDomicilios();
  };

  // Barra de búsqueda por cualquier campo
  const provinciasFiltrados = domicilios.filter((r) =>
    [
      r.id,
      r.calle,
      r.numeracion,
      r.barrio,
      r.manzanaPiso,
      r.casaDepartamento,
      r.referencia,
      r.localidad?.nombre,
      r.tipo
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
                <h1 className="page-title">DOMICILIOS</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
    <div className={styles.container}>
      <h2 className={styles.title}>Domicilios</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <button className={styles.addButton} onClick={agregarDomicilio}>
        <FaPlus /> Agregar Domicilio
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Calle</th>
            <th>Numeracion</th>
            <th>Barrio</th>
            <th>Manzana/Piso</th>
            <th>Casa/Dpto</th>
            <th>Referencia</th>
            <th>Localidad</th>
            <th>Tipo</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rolesPaginados.map((b) => (
            <tr key={b.id}>
              <td>{b.calle}</td>
              <td>{b.numeracion}</td>
              <td>{b.barrio}</td>
              <td>{b.manzanaPiso}</td>
              <td>{b.casaDepartamento}</td>
              <td>{b.referencia}</td>
              <td>{b.tipo}</td>
              <td>{/* @ts-ignore */ b.localidad.nombre}</td>
              <td>{b.activo ? 'Sí' : 'No'}</td>
              <td className={styles.actions}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarDomicilio(b.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarDomicilio(b.id)}
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

      <ModalDomicilio
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDomicilioAdded={handleDomicilioAdded}
        domicilioEdit={edit}
      />
    </div>
    </div>
  )
}
