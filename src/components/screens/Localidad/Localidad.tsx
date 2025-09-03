import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Localidad.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import axios from 'axios';
import { ModalLocalidad } from '../../ui/ModalLocalidad/ModalLocalidad';

interface Localidad {
    id: number;
    nombre: string;
    codigoPostal: string;
    activo: boolean;
    departamento: {
        id: number;
        nombre: string;
        activo: boolean;
    }
}

export const Localidad = () => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);

  // 🔹 Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    obtenerLocalidades();
  }, []);

  const obtenerLocalidades = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/localidades', {});
      setLocalidades(response.data);
    } catch (error) {
      console.error('Error al obtener Localidades:', error);
    }
  };
    
  const agregarLocalidad = () => {
    setIsModalOpen(true);
  }

  const editarLocalidad = (id: number) => {
    console.log('Editar Localidad con ID:', id);
  }

  const eliminarLocalidad= async (id: number) => {
    try {
        await axios.delete(`http://localhost:9000/api/localidades/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        setLocalidades(prev => prev.filter(b => b.id !== id));
        } catch (error) {
        console.error('Error al eliminar Localidad:', error);
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLocalidadAdded = () => {
    obtenerLocalidades();
  };

  // Barra de búsqueda por cualquier campo
  const provinciasFiltrados = localidades.filter((r) =>
    [
      r.id,
      r.nombre,
      r.departamento,
      r.codigoPostal
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rolesPaginados.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td>{/* @ts-ignore */ b.departamento.nombre}</td>
              <td>{b.codigoPostal}</td>
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

      <ModalLocalidad
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLocalidadAdded={handleLocalidadAdded}
      />
    </div>
  )
}
