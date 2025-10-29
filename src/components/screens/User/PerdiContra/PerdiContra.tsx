import styles from "./PerdiContra.module.css";

const whatsappNumber = "5491141875753"; // Reemplaza con el número real
const mensaje = encodeURIComponent("Hola, perdí mi contraseña y necesito ayuda.");

const handleWhatsapp = () => {
  window.open(`https://wa.me/${whatsappNumber}?text=${mensaje}`, "_blank");
};

export default function PerdiContra() {
  return (
    <div className={styles.container}>
      <h2>¿Perdiste tu contraseña?</h2>
      <p>
        Contactate con nosotros por WhatsApp para que te ayudemos a recuperarla.
      </p>
      <button className={styles.button} onClick={handleWhatsapp}>
        Ir a WhatsApp
      </button>
    </div>
  );
}