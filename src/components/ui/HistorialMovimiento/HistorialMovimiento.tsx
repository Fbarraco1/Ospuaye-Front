import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './HistorialMovimiento.module.css';

interface Movimiento {
  id: number;
  pedidoId: number;
  descripcion: string;
  fecha: string;
}

const HistorialMovimiento: React.FC<{ pedidoId: number }> = ({ pedidoId }) => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/movimientos/${pedidoId}`);
        setMovimientos(response.data);
      } catch (error) {
        console.error('Error fetching movimiento history:', error);
      }
    };

    fetchMovimientos();
  }, [pedidoId]);

  return (
    <div className={styles.container}>
      <h3>Historial de Movimientos</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento) => (
            <tr key={movimiento.id}>
              <td>{movimiento.id}</td>
              <td>{movimiento.descripcion}</td>
              <td>{new Date(movimiento.fecha).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialMovimiento;