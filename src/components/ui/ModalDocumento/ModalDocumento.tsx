import React, { useState, useEffect } from 'react';
import styles from './ModalDocumento.module.css';
import axios from 'axios';

interface Documento {
  id: number;
  nombre: string;
  fecha: string;
  path: string;
}

interface ModalDocumentoProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentoAdded?: () => void;
  pedido?: { id: number }; // Se puede pasar el pedido para asociar documentos
}

const ModalDocumento: React.FC<ModalDocumentoProps> = ({
  isOpen,
  onClose,
  onDocumentoAdded,
  pedido,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [documentHistory, setDocumentHistory] = useState<Documento[]>([]);

  useEffect(() => {
    if (isOpen && pedido?.id) {
      fetchDocumentHistory();
    }
  }, [isOpen, pedido]);

  const fetchDocumentHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/documentos?pedidoId=${pedido?.id || ''}`
      );
      setDocumentHistory(response.data);
    } catch (error) {
      console.error('Error fetching document history:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length > 0 && pedido?.id) {
      const formData = new FormData();
      files.forEach((file) => formData.append('documents', file));
      formData.append('pedidoId', String(pedido.id));
      try {
        await axios.post('http://localhost:9000/api/documentos', formData);
        if (onDocumentoAdded) onDocumentoAdded();
        handleClose();
      } catch (error) {
        console.error('Error uploading document:', error);
      }
    }
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Gestionar Documentos</h2>
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={handleUpload}>Subir Documentos</button>
        <button onClick={handleClose}>Cancelar</button>
        <h3>Historial de Documentos</h3>
        <ul>
          {documentHistory.map((doc) => (
            <li key={doc.id}>
              <a href={doc.path} target="_blank" rel="noopener noreferrer">{doc.nombre}</a> - {new Date(doc.fecha).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModalDocumento;