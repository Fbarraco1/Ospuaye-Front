import React from 'react';
import styles from './HistorialMovimiento.module.css';

interface Movimiento {
  id: number;
  fecha: string;
  tipoMovimiento: string;
  comentario: string;
  usuario: {
    email: string;
  };
}

interface Props {
  isOpen: boolean;
  historial: Movimiento[];
  onClose: () => void;
}

const HistorialMovimiento: React.FC<Props> = ({ isOpen, historial, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Historial de Movimientos</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Movimiento</th>
              <th>Comentario</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((m) => (
              <tr key={m.id}>
                <td>{new Date(m.fecha).toLocaleString()}</td>
                <td>{m.tipoMovimiento}</td>
                <td>{m.comentario || 'Sin comentario'}</td>
                <td>{m.usuario?.email || 'Desconocido'}</td>
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

export default HistorialMovimiento;
