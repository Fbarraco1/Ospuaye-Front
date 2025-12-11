// src/pages/Usuarios.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './Usuarios.module.css';
import { useAuthStore } from '../../../../auth/store/authStore';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface Usuario {
  id: number;
  email: string;
  contrasena: string;
  rol: { id: number, nombre: string };
  activo: boolean;
  [key: string]: any; 
}

export const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-based como en Beneficiarios
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // Cargar lista al iniciar
  useEffect(() => {
    obtenerUsuarios(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce búsqueda (igual que Beneficiarios)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerUsuarios(0);
      } else {
        buscarUsuarios(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // OBTENER LISTA PAGINADA
  const obtenerUsuarios = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/usuarios/paginar`, {
        params: { page, size },
      });
      setUsuarios(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al obtener Usuarios:', error);
    }
  };

  const buscarUsuarios = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/usuarios/buscar`, {
        params: { query: filtro, page, size },
      });
      setUsuarios(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  const eliminarUsuario = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`${database}/api/usuarios/${id}/estado`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // recargar la página actual
        if (search.trim() === '') obtenerUsuarios(currentPage);
        else buscarUsuarios(search, currentPage);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El usuario fue eliminado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });      
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el usuario.',
        });        
      }
    }
  };

  const editarUsuario = (id: number) => {
    navigate(`/usuarios/editar/${id}`);
  };

  const agregarUsuario = () => {
    navigate('/usuarios/nuevo');
  };

  // MANEJAR PAGINADO
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerUsuarios(newPage);
      else buscarUsuarios(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerUsuarios(newPage);
      else buscarUsuarios(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">USUARIOS</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
    <div className={styles.container}>
      <h2 className={styles.title}>Usuarios</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchBar}
      />
      <button className={styles.addButton} onClick={agregarUsuario}>
        <FaPlus /> Agregar Usuario
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.email}</td>
              <td>{usuario.rol?.nombre}</td>
              <td>{usuario.activo ? 'Sí' : 'No'}</td>
              <td className={styles.actions}>
                  <div className={styles.actionWrapper}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarUsuario(usuario.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarUsuario(usuario.id)}
                />
                </div>
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
