import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './Beneficiarios.module.css';
import { useAuthStore } from '../../../auth/store/authStore';
import ModalBeneficiario from '../../ui/ModalBeneficiario/ModalBeneficiario'; // Importa el modal

interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  cuil: number;
  telefono: number;
}

export const Beneficiarios: React.FC = () => {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerBeneficiarios();
  }, []);

  const obtenerBeneficiarios = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/beneficiarios', {
      });
      setBeneficiarios(response.data);
    } catch (error) {
      console.error('Error al obtener beneficiarios:', error);
    }
  };

  const eliminarBeneficiario = async (id: number) => {
    try {
      await axios.delete(`http://localhost:9000/api/beneficiarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBeneficiarios(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error al eliminar beneficiario:', error);
    }
  };

  const editarBeneficiario = (id: number) => {
    console.log('Editar beneficiario con ID:', id);
    // Podés abrir un modal en el futuro para editar
  };

  const agregarBeneficiario = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBeneficiarioAdded = () => {
    obtenerBeneficiarios();
  };

  // Barra de búsqueda por cualquier campo
  const beneficiariosFiltrados = beneficiarios.filter((b) =>
    Object.values(b)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Beneficiarios</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <button className={styles.addButton} onClick={agregarBeneficiario}>
        <FaPlus /> Agregar Beneficiario
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>CUIL</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {beneficiariosFiltrados.map((b) => (
            <tr key={b.id}>
              <td>{b.nombre}</td>
              <td>{b.apellido}</td>
              <td>{b.dni}</td>
              <td>{b.cuil}</td>
              <td>{b.telefono}</td>
              <td className={styles.actions}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarBeneficiario(b.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarBeneficiario(b.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalBeneficiario
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBeneficiarioAdded={handleBeneficiarioAdded}
      />
    </div>
  );
};
