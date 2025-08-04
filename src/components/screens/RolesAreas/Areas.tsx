import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Areas.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import axios from 'axios';
import { ModalArea } from '../../ui/ModalArea/ModalArea';

interface Area {
    id: number;
    nombre: string;
}

export const Areas = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);
  
  useEffect(() => {
    obtenerAreas();
  }, []);

  const obtenerAreas = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/areas', {
      });
      setAreas(response.data);
    } catch (error) {
      console.error('Error al obtener Areas:', error);
    }
  };
    
  const agregarArea = () => {
    setIsModalOpen(true);
  }

  const editarArea = (id: number) => {
    console.log('Editar Area con ID:', id);

  }

  const eliminarArea = async (id: number) => {
    try {
        await axios.delete(`http://localhost:9000/api/areas/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        setAreas(prev => prev.filter(b => b.id !== id));
        } catch (error) {
        console.error('Error al eliminar beneficiario:', error);
    }
  }

    const handleCloseModal = () => {
    setIsModalOpen(false);
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

  return (
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
          {areasFiltradas.map((b) => (
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

      <ModalArea
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAreaAdded={handleAreaAdded}
      />
    </div>
  )
}
