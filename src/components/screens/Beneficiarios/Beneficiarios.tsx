import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './Beneficiarios.module.css';
import { useAuthStore } from '../../../auth/store/authStore';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  cuil: number;
  telefono: number;
  afiliadoSindical: boolean;
  esJubilado: boolean;
  grupoFamiliarId: {
    id: number;
    nombre: string;
  };
  activo: boolean;
}

export const Beneficiarios: React.FC = () => {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // mostramos 5 por página
  const navigate = useNavigate();


  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerBeneficiarios();
  }, []);

  const obtenerBeneficiarios = async () => {
    try {
      const response = await axios.get('http://vps-5301866-x.dattaweb.com:9000/api/beneficiarios', {});
      setBeneficiarios(response.data);
    } catch (error) {
      console.error('Error al obtener beneficiarios:', error);
    }
  };

  const eliminarBeneficiario = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el beneficiario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`http://vps-5301866-x.dattaweb.com:9000/api/beneficiarios/${id}/estado`, 
          {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        obtenerBeneficiarios(); // refrescar la lista
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El beneficiario fue eliminado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error al eliminar beneficiario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el beneficiario.',
        });
      }
    }
  };

  const editarBeneficiario = (id: number) => {
    console.log('Editar beneficiario con ID:', id);
    // Podés abrir un modal en el futuro para editar
  };

  const agregarBeneficiario = () => {
    navigate('/beneficiario/nuevo');
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
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">GESTION DE BENEFICIARIOS</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
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
            <th>Afiliado Sindical</th>
            <th>¿Es Jubilado?</th>
            <th>Grupo Familiar</th>
            <th>Activo</th>
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
              <td>{b.afiliadoSindical ? 'Sí' : 'No'}</td>
              <td>{b.esJubilado ? 'Sí' : 'No'}</td>
              <td>{b.grupoFamiliarId ? b.grupoFamiliarId.id : 'N/A'}</td>
              <td>{b.activo ? 'Sí' : 'No'}</td>
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

    </div>
    </div>
  );
};
