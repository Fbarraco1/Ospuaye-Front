import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaFileAlt, FaHistory, FaCheck } from 'react-icons/fa';
import styles from './PedidoMedico.module.css';
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


interface Pedido {
  id: number;
  nombre: string;
  beneficiario: Beneficiario;
  dni: number;
  telefono: number;
  empresa: string;
  delegacion: string;
  fechaIngreso: string;
  estado: string;
  pedidoTipo: string;
  medico: { id: number };
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

interface Movimiento {
  id: number;
  fecha: string;
  tipoMovimiento: string;
  comentario: string;
  usuario: { email: string };
}

export const PedidoMedico: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [historial, setHistorial] = useState<Movimiento[]>([]);
  const [modalDocsOpen, setModalDocsOpen] = useState(false);
  const [modalHistOpen, setModalHistOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const idMedico = useAuthStore((state) => state.user?.idMedico || 0);
  

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    try {
      const response = await axios.get(`${database}/api/pedidos/todos/libres`);
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };


  const TomarPedido = async (id: number) => {
    try {
       await axios.put(
        `${database}/api/pedidos/ortopedia/${id}`,
        { medico: { id: idMedico }},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Pedido actualizado',
        text: 'El pedido se actualizó correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });

      // Refrescar la lista de pedidos
      obtenerPedidos();
    } catch (error) {
      console.error('Error al tomar pedido:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo tomar el pedido.',
      });
    }
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
      p.beneficiario?.nombre,
      p.beneficiario?.apellido,
      p.dni,
      p.telefono,
      p.empresa,
      p.delegacion,
      p.fechaIngreso,
      p.estado,
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
                <h1 className="page-title">PEDIDOS GENERALES</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
    <div className={styles.container}>
      <h2 className={styles.title}>Todos los pedidos</h2>

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

      <button className={styles.addButton} onClick={() => navigate('/pedidos/generales/nuevo')}>
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
            <th>Tipo Pedido</th>
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
              <td>{p.pedidoTipo}</td>
              <td>{p.activo ? 'Sí' : 'No'}</td>
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
                <FaCheck
                  className={styles.icon}
                  onClick={() => TomarPedido(p.id)}
                  title="Tomar pedido"
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
