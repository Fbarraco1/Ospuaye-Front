// src/pages/Usuarios.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './Usuarios.module.css';
import ModalUsuario from '../../ui/ModalUsuario/ModalUsuario';
import { useAuthStore } from '../../../auth/store/authStore';

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
    try {
      await axios.delete(`http://localhost:9000/api/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
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

  return (
    <div>
      <h2>Usuarios</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <button onClick={agregarUsuario} style={{ marginLeft: '10px', marginBottom: '10px' }}>
        <FaPlus /> Agregar Usuario
      </button>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.email}</td>
              <td>{usuario.rol?.nombre}</td>
              <td>
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

      <ModalUsuario
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={() => {
          obtenerUsuarios();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
