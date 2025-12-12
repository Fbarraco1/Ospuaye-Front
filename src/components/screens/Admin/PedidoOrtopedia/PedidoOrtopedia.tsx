import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaFileAlt, FaHistory } from 'react-icons/fa';
import styles from './PedidoOrtopedia.module.css';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import ModalDocumento from '../../../ui/Admin/ModalDocumento/ModalDocumento';
import HistorialMovimiento from '../../../ui/Admin/HistorialMovimiento/HistorialMovimiento';
const database = import.meta.env.VITE_DATABASE;


interface Beneficiario {
  nombre: string;
  apellido: string;
}

interface Medico {
  matricula: string;
  nombre: string;
  apellido: string;
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
  activo: boolean;
}

interface Documento {
  id: number;
  nombreArchivo: string;
  path: string;
  observacion: string;
  fechaSubida: string;
  subidoPor: { email: string };
}

export const PedidoOrtopedia: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoOrtopedia[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [modalDocsOpen, setModalDocsOpen] = useState(false);
  const [modalHistOpen, setModalHistOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [pedidoIdSeleccionado, setPedidoIdSeleccionado] = useState<number | null>(null);

  

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    try {
      const response = await axios.get(`${database}/api/pedidos/ortopedia/listar`);
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos de ortopedia:', error);
    }
  };

const eliminarPedido = async (id: number) => {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el pedido.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {    
        try {
            await axios.patch(`${database}/api/pedidos/oftalmologia/${id}/estado`, 
              {}, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            obtenerPedidos(); // refrescar la lista
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El pedido fue eliminado correctamente.',
              timer: 1500,
              showConfirmButton: false
            });          
            } catch (error) {
            console.error('Error al eliminar Pedido:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el pedido.',
            });     
          }
      }
    }

  const editarPedido = (id: number) => {
    navigate(`/pedidos/ortopedia/editar/${id}`);
  };

  const verDocumentos = async (id: number) => {
    try {
      const res = await axios.get(`${database}/api/documentos/${id}`);
      setDocumentos([res.data]);
      setModalDocsOpen(true);
    } catch (error) {
      console.error('Error al obtener documentos:', error);
    }
  };

  const verHistorial = async (id: number) => {
    setPedidoIdSeleccionado(id);
    setModalHistOpen(true);
  };

  // 🔍 Filtrar pedidos por cualquier campo
  const pedidosFiltrados = pedidos.filter((p) =>
    [
      p.id,
      p.nombre,
      p.beneficiario?.nombre,
      p.beneficiario?.apellido,
      p.dni,
      p.telefono,
      p.empresa,
      p.delegacion,
      p.fechaIngreso,
      p.estado,
      p.medico?.matricula,
    ]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // --- PAGINACIÓN ---
  const totalPages = Math.ceil(pedidosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = pedidosFiltrados.slice(startIndex, startIndex + itemsPerPage);

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
                <h1 className="page-title">PEDIDOS ORTOPEDIA</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
    <div className={styles.container}>
      <h2 className={styles.title}>Pedidos de Ortopedia</h2>

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

      <button
        className={styles.addButton}
        onClick={() => navigate('/pedidos/ortopedia/nuevo')}
      >
        <FaPlus /> Agregar Pedido
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Beneficiario</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Empresa</th>
            <th>Delegación</th>
            <th>Fecha Ingreso</th>
            <th>Estado</th>
            <th>Médico</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{`${p.beneficiario?.nombre} ${p.beneficiario?.apellido}`}</td>
              <td>{p.dni}</td>
              <td>{p.telefono}</td>
              <td>{p.empresa}</td>
              <td>{p.delegacion}</td>
              <td>{new Date(p.fechaIngreso).toLocaleDateString()}</td>
              <td>{p.estado}</td>
              <td>{p.medico ? `${p.medico.nombre} ${p.medico.apellido}` : "Pendiente"}</td>
              <td>{p.activo? 'si' : 'No'}</td>
              <td className={styles.actions}>
                  <div className={styles.actionWrapper}>
                <FaFileAlt className={styles.icon} onClick={() => verDocumentos(p.id)} title="Ver documentos" />
                <FaHistory className={styles.icon} onClick={() => verHistorial(p.id)} title="Ver historial" />
                <FaEdit className={styles.editIcon} onClick={() => editarPedido(p.id)} title="Editar" />
                <FaTrash className={styles.deleteIcon} onClick={() => eliminarPedido(p.id)} title="Eliminar" />
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

      <ModalDocumento
        isOpen={modalDocsOpen}
        documentos={documentos}
        onClose={() => setModalDocsOpen(false)}
      />

      <HistorialMovimiento
        isOpen={modalHistOpen}
        pedidoId={pedidoIdSeleccionado}
        onClose={() => setModalHistOpen(false)}
      />
    </div>
    </div>
  );
};
