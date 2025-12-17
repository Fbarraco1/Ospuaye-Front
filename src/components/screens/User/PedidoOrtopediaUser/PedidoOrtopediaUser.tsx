import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {FaPlus, FaFileAlt, FaHistory } from 'react-icons/fa';
import styles from './PedidoOrtopedia.module.css';
const database = import.meta.env.VITE_DATABASE;
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../auth/store/authStore';
import ModalDocumento from '../../../ui/Admin/ModalDocumento/ModalDocumento';
import HistorialMovimiento from '../../../ui/Admin/HistorialMovimiento/HistorialMovimiento';

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


export const PedidoOrtopediaUser: React.FC = () => {
  const [pedidos, setPedidos] = useState<PedidoOrtopedia[]>([]);
  const [modalDocsOpen, setModalDocsOpen] = useState(false);
  const [modalHistOpen, setModalHistOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const idBenef = useAuthStore((state) => state.user?.idBeneficiario || 0);
  const [pedidoIdSeleccionado, setPedidoIdSeleccionado] = useState<number | null>(null);
  const [pedidoIdDocumentos, setPedidoIdDocumentos] = useState<number | null>(null);

  
  useEffect(() => {
    obtenerPedidos(idBenef);
  }, []);

  const obtenerPedidos = async (id: number) => {
    try {
      const response = await axios.get(`${database}/api/pedidos/ortopedia/beneficiario/${id}`);
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos de Ortopedia:', error);
    }
  };


  const verDocumentos = (id: number) => {
    setPedidoIdDocumentos(id);
    setModalDocsOpen(true);
  };

  const verHistorial = (id: number) => {
    setPedidoIdSeleccionado(id);
    setModalHistOpen(true);
  };

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

  const totalPages = Math.ceil(pedidosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = pedidosFiltrados.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return '-';
    try {
      let f = fecha;
      if (f.includes('T')) f = f.split('T')[0];
      const parts = f.split('-').map(p => p.trim());
      if (parts.length === 3) {
        // yyyy-MM-dd
        if (parts[0].length === 4) {
          const [y, m, d] = parts;
          const dObj = new Date(`${y}-${m}-${d}`);
          return isNaN(dObj.getTime()) ? '-' : dObj.toLocaleDateString('es-AR');
        }
        // dd-MM-yyyy
        if (parts[2].length === 4) {
          const [day, month, year] = parts;
          const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          const dObj = new Date(iso);
          return isNaN(dObj.getTime()) ? '-' : dObj.toLocaleDateString('es-AR');
        }
      }
    } catch (e) {
      // fallback
    }
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('es-AR');
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
          setCurrentPage(1);
        }}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />

      <button className={styles.addButton} onClick={() => navigate('/pedidos/ortopedia/user/nuevo')}>
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
              <td>{formatFecha(p.fechaIngreso)}</td>
              <td>{p.estado}</td>
              <td>{p.medico?.matricula}</td>
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
        pedidoId={pedidoIdDocumentos}
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