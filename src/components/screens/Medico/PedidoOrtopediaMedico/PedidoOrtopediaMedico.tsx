import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {FaFileAlt, FaHistory } from 'react-icons/fa';
import styles from './PedidoOrtopediaMedico.module.css';
import ModalDocumento from '../../../ui/Admin/ModalDocumento/ModalDocumento';
import HistorialMovimiento from '../../../ui/Admin/HistorialMovimiento/HistorialMovimiento';
import { useAuthStore } from '../../../../auth/store/authStore';
import { ModalEstadoOrtopedia } from '../../../ui/Admin/ModalEstado/ModalEstadoOrtopedia';
const database = import.meta.env.VITE_DATABASE;


interface Beneficiario {
  nombre: string;
  apellido: string;
}

interface Medico {
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

interface Documento {
  id: number;
  nombreArchivo: string;
  path: string;
  observacion: string;
  fechaSubida: string;
  subidoPor: { email: string };
}

export const PedidoOrtopediaMedico: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoOrtopedia[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [modalDocsOpen, setModalDocsOpen] = useState(false);
  const [modalHistOpen, setModalHistOpen] = useState(false);
  const [modalEstado, setModalEstado] = useState(false);
  const [idPedidoEstado, setIdPedidoEstado] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const idMedico = useAuthStore((state) => state.user?.idMedico || 0);
  const [pedidoIdSeleccionado, setPedidoIdSeleccionado] = useState<number | null>(null);

  
  useEffect(() => {
    obtenerPedidos(idMedico);
  }, []);

  const obtenerPedidos = async (id: number) => {
    try {
      const response = await axios.get(`${database}/api/pedidos/ortopedia/medico/${id}`);
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos de ortopedia:', error);
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
    setPedidoIdSeleccionado(id);
    setModalHistOpen(true);
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

  const handleChangeEstado = (id: number) => {
    setIdPedidoEstado(id);
    setModalEstado(true);
  };

  const handleEstadoActualizado = async () => {
    await obtenerPedidos(idMedico);
  };

  return (
    <div>
    <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">MIS PEDIDOS ORTOPEDIA</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
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

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Fecha Ingreso</th>
            <th>Estado</th>
            <th>Beneficiario</th>
            <th>Cambiar Estado</th>
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
              <td>{p.beneficiario ? `${p.beneficiario.nombre} ${p.beneficiario.apellido}` : ''}</td>
              <td>
                <div className={styles.actionWrapper}>
                  {<button className={styles.addButton} onClick={() => handleChangeEstado(p.id)}>Cambiar</button>}
                </div>
              </td>
              <td className={styles.actions}>
                <div className={styles.actionWrapper}>
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

      <ModalEstadoOrtopedia
        isOpen={modalEstado}
        idPedido={idPedidoEstado ?? 0}
        onClose={() => setModalEstado(false)}
        onChangeEstado={handleEstadoActualizado}
      />
    </div>
    </div>
  );
};
