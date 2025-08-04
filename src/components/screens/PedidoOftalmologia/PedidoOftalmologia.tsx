import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './PedidoOftalmologia.module.css';
import ModalPedidoOftalmologia from '../../ui/ModalPedidoOftalmologia/ModalPedidoOftalmologia';

interface PedidoOftalmologia {
  id: number;
  nombre: string;
  dni: number;
  telefono: number;
  fechaIngreso: string;
  estado: string;
}

export const PedidoOftalmologia: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoOftalmologia[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/pedidos/oftalmologia');
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos de oftalmología:', error);
    }
  };

  const eliminarPedido = async (id: number) => {
    try {
      await axios.delete(`http://localhost:9000/api/pedidos/oftalmologia/${id}`);
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar pedido de oftalmología:', error);
    }
  };

  const editarPedido = (id: number) => {
    console.log('Editar pedido de oftalmología con ID:', id);
    // Lógica futura para edición
  };

  const agregarPedido = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePedidoAdded = () => {
    obtenerPedidos();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pedidos de Oftalmología</h2>
      <button className={styles.addButton} onClick={agregarPedido}>
        <FaPlus /> Agregar Pedido
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Fecha Ingreso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.dni}</td>
              <td>{p.telefono}</td>
              <td>{new Date(p.fechaIngreso).toLocaleDateString()}</td>
              <td>{p.estado}</td>
              <td className={styles.actions}>
                <FaEdit className={styles.editIcon} onClick={() => editarPedido(p.id)} />
                <FaTrash className={styles.deleteIcon} onClick={() => eliminarPedido(p.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalPedidoOftalmologia
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPedidoAdded={handlePedidoAdded}
      />
    </div>
  );
};
