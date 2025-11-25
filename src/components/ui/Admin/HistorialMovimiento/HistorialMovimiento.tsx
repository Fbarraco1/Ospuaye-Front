import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './HistorialMovimiento.module.css';
const database = import.meta.env.VITE_DATABASE;

interface Movimiento {
  id: number;
  fecha: string;
  comentario: string;
  usuario: {
    email: string;
  };
}

interface Props {
  isOpen: boolean;
  pedidoId: number | null;
  onClose: () => void;
}


const HistorialMovimiento: React.FC<Props> = ({ isOpen, pedidoId, onClose }) => {
  const [historial, setHistorial] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !pedidoId) return;

    const fetchHistorial = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${database}/api/historial-movimientos/pedido/${pedidoId}`
        );
        setHistorial(response.data);
      } catch (err) {
        setError('No se pudo cargar el historial.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [isOpen, pedidoId]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Historial de Movimientos</h3>

        {/* Loader */}
        {loading && <p>Cargando movimientos...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.scrollContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Comentario</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {historial.length > 0 ? (
                  historial.map((m) => (
                    <tr key={m.id}>
                      <td>{new Date(m.fecha).toLocaleString()}</td>
                      <td>{m.comentario || 'Sin comentario'}</td>
                      <td>{m.usuario?.email || 'Desconocido'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center' }}>
                      No hay movimientos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <button className={styles.closeButton} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default HistorialMovimiento;
