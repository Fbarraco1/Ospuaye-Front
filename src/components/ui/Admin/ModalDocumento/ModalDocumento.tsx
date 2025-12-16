import React, { useEffect, useState } from 'react';
import styles from './ModalDocumento.module.css';

const database = import.meta.env.VITE_DATABASE;

interface Documento {
  id: number;
  nombreArchivo: string;
  path: string;
  url: string;
  observacion: string;
  fechaSubida: string;
  subidoPor: string;
}

interface Props {
  isOpen: boolean;
  pedidoId: number | null; // ✅ Cambiar a recibir el ID del pedido
  onClose: () => void;
}

const ModalDocumento: React.FC<Props> = ({ isOpen, pedidoId, onClose }) => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Cargar documentos cuando se abre el modal
  useEffect(() => {
    if (isOpen && pedidoId) {
      cargarDocumentos();
    }
  }, [isOpen, pedidoId]);

  const cargarDocumentos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${database}/api/documentos/pedido/${pedidoId}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los documentos');
      }
      
      const data = await response.json();
      setDocumentos(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error cargando documentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return '-';
    try {
      const parts = fecha.split('-');
      if (parts.length === 3) {
        // backend suele enviar dd-MM-yyyy -> convertir a yyyy-MM-dd
        const normalized = parts.reverse().join('-');
        const d = new Date(normalized);
        return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('es-AR');
      }
    } catch (e) {
      // ignore and fallback
    }
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('es-AR');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Documentos del Pedido</h3>
        
        {loading && <p>Cargando documentos...</p>}
        
        {error && <p className={styles.error}>{error}</p>}
        
        {!loading && !error && documentos.length === 0 && (
          <p>No hay documentos asociados a este pedido.</p>
        )}
        
        {!loading && !error && documentos.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha Subida</th>
                <th>Observación</th>
                <th>Subido Por</th>
                <th>Archivo</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.nombreArchivo}</td>
                  <td>{formatFecha(doc.fechaSubida)}</td>
                  <td>{doc.observacion || 'Sin observación'}</td>
                  <td>{doc.subidoPor || 'Desconocido'}</td>
                  <td>
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      Ver archivo
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <button className={styles.closeButton} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalDocumento;