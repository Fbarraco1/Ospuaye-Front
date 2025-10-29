import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {FaPlus, FaFileAlt, FaHistory } from 'react-icons/fa';
import styles from './PedidoOftalmologiaUser.module.css';
import ModalDocumento from '../../../ui/Admin/ModalDocumento/ModalDocumento';
import HistorialMovimiento from '../../../ui/Admin/HistorialMovimiento/HistorialMovimiento';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../auth/store/authStore';
const database = import.meta.env.VITE_DATABASE;


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

export const PedidoOftalmologiaUser: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoOftalmologia[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [historial, setHistorial] = useState<Movimiento[]>([]);
  const [modalDocsOpen, setModalDocsOpen] = useState(false);
  const [modalHistOpen, setModalHistOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const idBenef = useAuthStore((state) => state.user?.idBeneficiario || 0);
  
  useEffect(() => {
    obtenerPedidos(idBenef);
  }, []);

  const obtenerPedidos = async (id: number) => {
    try {
      const response = await axios.get(`${database}/api/pedidos/oftalmologia/beneficiario/${id}`);
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos de oftalmología:', error);
    }
  };

//   const eliminarPedido = async (id: number) => {
//     const result = await Swal.fire({
//       title: '¿Estás seguro?',
//       text: 'Esta acción eliminará el pedido de forma permanente.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar'
//     });

//     if (result.isConfirmed) {    
//       try {
//         await axios.delete(`http://vps-5301866-x.dattaweb.com:9000/api/pedidos/oftalmologia/${id}`);
//         setPedidos((prev) => prev.filter((p) => p.id !== id));
//           Swal.fire({
//             icon: 'success',
//             title: 'Eliminado',
//             text: 'El pedido fue eliminado correctamente.',
//             timer: 1500,
//             showConfirmButton: false
//           });      
//       } catch (error) {
//         console.error('Error al eliminar pedido:', error);
//           Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'No se pudo eliminar el pedido.',
//           });      
//       }
//   }
//   };


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
    try {
      const res = await axios.get(`${database}/api/historial-movimientos/${id}`);
      setHistorial([res.data]);
      setModalHistOpen(true);
    } catch (error) {
      console.error('Error al obtener historial:', error);
    }
  };

  // Filtrar pedidos por cualquier campo visible
  const pedidosFiltrados = pedidos.filter((p) =>
    [
      p.id,  
      p.nombre,
      p.dni,
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
                <h1 className="page-title">MIS PEDIDOS OFTALMOLOGIA</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
    <div className={styles.container}>
      <h2 className={styles.title}>Pedidos de Oftalmología</h2>

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

      <button className={styles.addButton} onClick={() => navigate('/pedidos/oftalmologia/user/nuevo')}>
        <FaPlus /> Agregar Pedido
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Fecha Ingreso</th>
            <th>Estado</th>
            <th>Médico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.dni}</td>
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
        historial={historial}
        onClose={() => setModalHistOpen(false)}
      />
    </div>
    </div>
  );
};
