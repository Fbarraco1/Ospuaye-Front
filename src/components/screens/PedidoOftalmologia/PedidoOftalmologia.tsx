import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaFileAlt, FaHistory } from 'react-icons/fa';
import styles from './PedidoOftalmologia.module.css';
import ModalPedidoOftalmologia from '../../ui/ModalPedidoOftalmologia/ModalPedidoOftalmologia';
import ModalDocumento from '../../ui/ModalDocumento/ModalDocumento';
import HistorialMovimiento from '../../ui/HistorialMovimiento/HistorialMovimiento';


interface Beneficiario {
  nombre: string;
  apellido: string;
}

interface Medico {
  matricula: string;
}

interface PedidoOftalmologia {
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

interface Documento {
  id: number;
  nombreArchivo: string;
  path: string;
  observacion: string;
  fechaSubida: string;
  subidoPor: { email: string };
}

interface Movimiento {
  id: number;
  fecha: string;
  tipoMovimiento: string;
  comentario: string;
  usuario: { email: string };
}

export const PedidoOftalmologia: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoOftalmologia[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [historial, setHistorial] = useState<Movimiento[]>([]);
  const [modalDocsOpen, setModalDocsOpen] = useState(false);
  const [modalHistOpen, setModalHistOpen] = useState(false);

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
      console.error('Error al eliminar pedido:', error);
    }
  };

  const editarPedido = (id: number) => {
    console.log('Editar pedido:', id);
  };

  const verDocumentos = async (id: number) => {
    try {
      const res = await axios.get(`http://localhost:9000/api/documentos/${id}`);
      setDocumentos([res.data]);
      setModalDocsOpen(true);
    } catch (error) {
      console.error('Error al obtener documentos:', error);
    }
  };

  const verHistorial = async (id: number) => {
    try {
      const res = await axios.get(`http://localhost:9000/api/historiales/${id}`);
      setHistorial([res.data]);
      setModalHistOpen(true);
    } catch (error) {
      console.error('Error al obtener historial:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pedidos de Oftalmología</h2>
      <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
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
                <FaFileAlt
                  className={styles.icon}
                  onClick={() => verDocumentos(p.id)}
                  title="Ver documentos"
                />
                <FaHistory
                  className={styles.icon}
                  onClick={() => verHistorial(p.id)}
                  title="Ver historial"
                />
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarPedido(p.id)}
                  title="Editar"
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarPedido(p.id)}
                  title="Eliminar"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalPedidoOftalmologia
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPedidoAdded={obtenerPedidos}
      />

      <ModalDocumento
        isOpen={modalDocsOpen}
        documentos={documentos}
        onClose={() => setModalDocsOpen(false)}
      />

      <HistorialMovimiento
        isOpen={modalHistOpen}
        historial={historial}
        onClose={() => setModalHistOpen(false)}
      />
    </div>
  );
};
