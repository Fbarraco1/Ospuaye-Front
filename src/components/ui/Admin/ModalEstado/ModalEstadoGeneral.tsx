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
        } catch (error: any) {
            const backendMessage = error?.response?.data?.message || error?.response?.data || 'No se pudo cambiar el estado del pedido.';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: backendMessage
            });
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Cambiar Estado del Pedido</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nuevo Estado:</label>
                    <select
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
                        <button type="submit">Aceptar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
