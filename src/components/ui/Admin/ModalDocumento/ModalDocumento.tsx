import React from 'react';
import styles from './ModalDocumento.module.css';
interface Documento {
  id: number;
  nombreArchivo: string;
  path: string;
  observacion: string;
  fechaSubida: string;
  subidoPor: {
    email: string;
  };
}

interface Props {
  isOpen: boolean;
  documentos: Documento[];
  onClose: () => void;
}

const ModalDocumento: React.FC<Props> = ({ isOpen, documentos, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Documentos del Pedido</h3>
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
                <td>{new Date(doc.fechaSubida).toLocaleString()}</td>
                <td>{doc.observacion || 'Sin observación'}</td>
                <td>{doc.subidoPor?.email || 'Desconocido'}</td>
                <td>
                  <a href={doc.path} target="_blank" rel="noopener noreferrer">
                    Ver archivo
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={styles.closeButton} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalDocumento;
