import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './PedidoOrtopedia.module.css';
import { useAuthStore } from '../../../auth/store/authStore';
import ModalPedidoOrtopedia from '../../ui/ModalPedidoOrtopedia/ModalPedidoOrtopedia';
import HistorialMovimiento from '../../ui/HistorialMovimiento/HistorialMovimiento';

interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
}

interface Medico {
  id: number;
  matricula: string;
}

interface PedidoOrtopedia {
  id: number;
  nombre: string;
  beneficiario: Beneficiario;
  dni: number;
  telefono: number;
  empresa: string;
  delegacion: string;
  fechaIngreso: string;
  estado: string;
  medico: Medico;
}

export const PedidoOrtopedia: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoOrtopedia[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/pedidos/ortopedia');
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos de ortopedia:', error);
    }
  };

  const eliminarPedido = async (id: number) => {
    try {
      await axios.delete(`http://localhost:9000/api/pedidos/ortopedia/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPedidos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar pedido de ortopedia:', error);
    }
  };

  const editarPedido = (id: number) => {
    console.log('Editar pedido de ortopedia con ID:', id);
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
      <h2 className={styles.title}>Pedidos de Ortopedia</h2>
      <button className={styles.addButton} onClick={agregarPedido}>
        <FaPlus /> Agregar Pedido
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Beneficiario</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Empresa</th>
            <th>Delegación</th>
            <th>Fecha Ingreso</th>
            <th>Estado</th>
            <th>Médico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{`${p.beneficiario?.nombre} ${p.beneficiario?.apellido}`}</td>
              <td>{p.dni}</td>
              <td>{p.telefono}</td>
              <td>{p.empresa}</td>
              <td>{p.delegacion}</td>
              <td>{new Date(p.fechaIngreso).toLocaleDateString()}</td>
              <td>{p.estado}</td>
              <td>{p.medico?.matricula}</td>
              <td className={styles.actions}>
                <FaEdit className={styles.editIcon} onClick={() => editarPedido(p.id)} />
                <FaTrash className={styles.deleteIcon} onClick={() => eliminarPedido(p.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalPedidoOrtopedia
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPedidoAdded={handlePedidoAdded}
      />

      {pedidos.length > 0 && <HistorialMovimiento pedidoId={pedidos[0].id} />}
    </div>
  );
};