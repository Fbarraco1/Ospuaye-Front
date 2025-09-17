// src/pages/Usuarios.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './Usuarios.module.css';
import ModalUsuario from '../../ui/ModalUsuario/ModalUsuario';
import { useAuthStore } from '../../../auth/store/authStore';
import Swal from 'sweetalert2';

interface Usuario {
  id: number;
  email: string;
  rol: { nombre: string };
  [key: string]: any; // Para permitir más campos dinámicamente
}

export const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const eliminarUsuario = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el usuario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:9000/api/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
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
    console.log('Editar usuario con ID:', id);
  };

  const agregarUsuario = () => {
    setIsModalOpen(true);
  };

  // Filtra por cualquier campo del usuario
  const usuariosFiltrados = usuarios.filter((usuario) =>
    Object.values(usuario)
      .map((valor) =>
        typeof valor === 'object' && valor !== null
          ? Object.values(valor).join(' ')
          : valor
      )
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Lógica de paginación
  const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const usuariosPaginados = usuariosFiltrados.slice(startIndex, startIndex + itemsPerPage);

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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosPaginados.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.email}</td>
              <td>{usuario.rol?.nombre}</td>
              <td className={styles.actions}>
                <FaEdit
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                  onClick={() => editarUsuario(usuario.id)}
                />
                <FaTrash
                  style={{ cursor: 'pointer', color: 'red' }}
                  onClick={() => eliminarUsuario(usuario.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ← Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}

      <ModalUsuario
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={() => {
          obtenerUsuarios();
          setIsModalOpen(false);
        }}
      />
    </div>
    </div>
  );
};
