import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Documento.module.css';
import ModalDocumento from '../../ui/ModalDocumento/ModalDocumento';
import HistorialMovimiento from '../../ui/HistorialMovimiento/HistorialMovimiento';

interface DocumentoType {
  id: number;
  nombre: string;
  fecha: string;
  path: string;
}

const Documento: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentos, setDocumentos] = useState<DocumentoType[]>([]);

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/documentos');
      setDocumentos(response.data);
    } catch (error) {
      console.error('Error fetching documentos:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDocumentoAdded = () => {
    fetchDocumentos();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Documentos</h2>
      <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
        Agregar Documento
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Archivo</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.nombre}</td>
              <td>{new Date(doc.fecha).toLocaleDateString()}</td>
              <td>
                <a href={doc.path} target="_blank" rel="noopener noreferrer">Ver archivo</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalDocumento
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDocumentoAdded={handleDocumentoAdded}
      />

      <HistorialMovimiento pedidoId={documentos[0]?.id || 0} />
    </div>
  );
};

export default Documento;