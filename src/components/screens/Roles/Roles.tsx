import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Roles.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../auth/store/authStore';
import axios from 'axios';
import { ModalRol } from '../../ui/ModalRol/ModalRol';

interface Rol {
    id: number;
    nombre: string;
    area: number
}

export const Roles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);
  
  useEffect(() => {
    obtenerRoles();
  }, []);

  const obtenerRoles = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/roles', {
      });
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
    try {
        await axios.delete(`http://localhost:9000/api/roles/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        setRoles(prev => prev.filter(b => b.id !== id));
        } catch (error) {
        console.error('Error al eliminar roles:', error);
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

  return (
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
          {rolesFiltrados.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td>{b.area.nombre}</td>
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

      <ModalRol
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRolAdded={handleAreaAdded}
      />
    </div>
  )
}
