import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './Medico.module.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
const database = import.meta.env.VITE_DATABASE;


interface Medico {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  area: {
    id: number;
    nombre: string;
  };
  activo: boolean;
}

export const Medico: React.FC = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);
  const [currentPage, setCurrentPage] = useState(0); // 0-based como Beneficiarios
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5; // mostramos 5 por página
  const navigate = useNavigate();

  // Cargar lista al iniciar (página 0)
  useEffect(() => {
    obtenerMedicos(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce búsqueda (igual que Beneficiarios)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerMedicos(0);
      } else {
        buscarMedicos(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // OBTENER LISTA PAGINADA DESDE BACKEND
  const obtenerMedicos = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/medicos/paginar`, {
        params: { page, size },
      });
      setMedicos(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al obtener medicos:', error);
    }
  };

  const buscarMedicos = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/medicos/buscar`, {
        params: { query: filtro, page, size },
      });
      setMedicos(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al buscar medicos:', error);
    }
  };

  const eliminarMedico = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el medico de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        await axios.patch(`${database}/api/medicos/${id}/estado`, 
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        // recargar la página actual (considera búsqueda)
        if (search.trim() === '') obtenerMedicos(currentPage);
        else buscarMedicos(search, currentPage);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El medico fue eliminado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });        
      } catch (error) {
        console.error('Error al eliminar medico:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el medico.',
        });
      }
    }
  };

  const descargarMedicos = async () => {
  try {
    Swal.fire({
      title: "Preparando archivo...",
      text: "Por favor espera unos segundos",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const response = await fetch("http://localhost:9000/api/medicos/export");

    if (!response.ok) {
      Swal.close();
      Swal.fire("Error", "No se pudo descargar el archivo.", "error");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "medicos.txt";
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    Swal.close();
    Swal.fire("Descargado", "El archivo se descargó correctamente.", "success");

  } catch (error) {
    Swal.close();
    Swal.fire("Error", "Hubo un problema al descargar el archivo.", "error");
  }
};

  const editarMedico = (id: number) => {
    navigate(`/medicos/editar/${id}`);
  };

  const agregarMedico = () => {
    navigate('/medicos/nuevo');
  };

  // MANEJAR PAGINADO DINÁMICO (0-based)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerMedicos(newPage);
      else buscarMedicos(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerMedicos(newPage);
      else buscarMedicos(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">MEDICOS</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
    <div className={styles.container}>
      <h2 className={styles.title}>Médicos</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <button className={styles.addButton} onClick={agregarMedico}>
        <FaPlus /> Agregar Médico
      </button>

      <button onClick={descargarMedicos}>
        Descargar Médicos
      </button>


      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Matrícula</th>
            <th>Área</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.apellido}</td>
              <td>{m.matricula}</td>
              <td>{m.area?.nombre}</td> 
              <td>{m.activo ? 'Sí' : 'No'}</td>
              <td className={styles.actions}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarMedico(m.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarMedico(m.id)}
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
            disabled={currentPage === 0}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: '#88C250',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ◀
          </button>
          <span style={{ alignSelf: 'center', fontSize: '14px', color: '#555' }}>
            Página {currentPage + 1} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: '#88C250',
              cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
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
