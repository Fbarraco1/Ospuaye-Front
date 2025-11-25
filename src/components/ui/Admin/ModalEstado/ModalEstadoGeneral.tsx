import styles from './ModalEstado.module.css';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
const database = import.meta.env.VITE_DATABASE;

interface ModalEstadoProps {
    isOpen: boolean;
    idPedido: number;
    onClose: () => void;
    onChangeEstado: (nuevoEstado: string) => void;
}

const Estado = [
    "Pendiente",
    "Aceptado",
    "Rechazado",
    "Leido"
];

export const ModalEstadoGeneral: React.FC<ModalEstadoProps> = ({
    isOpen,
    idPedido,
    onClose,
    onChangeEstado
}) => {
    const [nuevoEstado, setNuevoEstado] = useState('');
    const token = useAuthStore((state) => state.token);
    

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(
                `${database}/api/pedidos/actualizar/${idPedido}`,
                { estado: nuevoEstado }, // 🔹 cuerpo
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    },
                }
                );

            Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: 'El estado del pedido fue cambiado correctamente.',
                timer: 1500,
                showConfirmButton: false
            });
            onChangeEstado(nuevoEstado);
            onClose();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cambiar el estado del pedido.'
            });
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.title}>Cambiar Estado del Pedido</h3>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>Nuevo Estado:</label>
                    <select
                        className={styles.input}
                        value={nuevoEstado}
                        onChange={e => setNuevoEstado(e.target.value)}
                        required
                    >
                        <option value="">Seleccione estado</option>
                        {Estado.map((estado) => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                    <div className={styles.actions}>
                        <button type="submit" className={styles.addButton}>Aceptar</button>
                        <button type="button" className={styles.addButton} style={{backgroundColor:'#888'}} onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
