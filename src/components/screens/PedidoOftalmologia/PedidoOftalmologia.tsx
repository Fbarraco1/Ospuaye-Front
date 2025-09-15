import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaFileAlt, FaHistory } from 'react-icons/fa';
import styles from './PedidoOftalmologia.module.css';
import ModalDocumento from '../../ui/ModalDocumento/ModalDocumento';
import HistorialMovimiento from '../../ui/HistorialMovimiento/HistorialMovimiento';
import { useNavigate } from 'react-router-dom';

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
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [historial, setHistorial] = useState<Movimiento[]>([]);
  const [modalDocsOpen, setModalDocsOpen] = useState(false);
  const [modalHistOpen, setModalHistOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

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
                <h1 className="page-title">PEDIDOS OFTALMOLOGIA</h1>
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

      <button className={styles.addButton} onClick={() => navigate('/pedidos/oftalmologia/nuevo')}>
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
          {currentItems.map((p) => (
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
