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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // mostramos 5 por página

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerBeneficiarios();
  }, []);

  const obtenerBeneficiarios = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/beneficiarios', {});
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
      setBeneficiarios((prev) => prev.filter((b) => b.id !== id));
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

  // --- FILTRADO ---
  const beneficiariosFiltrados = beneficiarios.filter((b) =>
    Object.values(b)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // --- PAGINADO ---
  const totalPages = Math.ceil(beneficiariosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = beneficiariosFiltrados.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Beneficiarios</h2>

      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // resetear página al filtrar
        }}
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
          {currentItems.map((b) => (
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

      {/* PAGINADO */}
      {totalPages > 1 && (
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: currentPage === 1 ? '#88C250' : '#88C250',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ◀
          </button>
          <span style={{ alignSelf: 'center', fontSize: '14px', color: '#555' }}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: currentPage === totalPages ? '#88C250' : '#88C250',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            ▶
          </button>
        </div>
      )}

      <ModalBeneficiario
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBeneficiarioAdded={handleBeneficiarioAdded}
      />
    </div>
  );
};
