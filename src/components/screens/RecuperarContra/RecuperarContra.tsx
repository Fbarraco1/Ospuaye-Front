import React, { useState } from "react";
import styles from "./RecuperarContra.module.css";

export default function RecuperarContra() {
  const [email, setEmail] = useState("");
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetirNueva, setRepetirNueva] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showRepetir, setShowRepetir] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (nueva !== repetirNueva) {
      setMensaje("Las contraseñas nuevas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      // 1. Buscar usuario por email
      const res = await fetch(`/api/usuarios/buscarPorEmail?email=${email}`);
      if (!res.ok) throw new Error("Usuario no encontrado");
      const usuario = await res.json();

      // 2. Validar contraseña actual
      if (usuario.contrasena !== actual) {
        setMensaje("La contraseña actual es incorrecta.");
        setLoading(false);
        return;
      }

      // 3. Actualizar contraseña
      const actualizado = {
        ...usuario,
        contrasena: nueva,
      };

      const res2 = await fetch("/api/usuarios/actualizar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actualizado),
      });

      if (!res2.ok) {
        const error = await res2.text();
        throw new Error(error);
      }

      setMensaje("Contraseña actualizada correctamente.");
    } catch (err: any) {
      setMensaje(err.message || "Error al actualizar la contraseña.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2>Cambiar contraseña</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <div className={styles.inputGroup}>
          <input
            type={showActual ? "text" : "password"}
            placeholder="Contraseña actual"
            value={actual}
            required
            onChange={e => setActual(e.target.value)}
          />
          <button
            className={styles.showBtn}
            type="button"
            onClick={() => setShowActual(v => !v)}
            tabIndex={-1}
          >
            {showActual ? "Ocultar" : "Ver"}
          </button>
        </div>
        <div className={styles.inputGroup}>
          <input
            type={showNueva ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={nueva}
            required
            minLength={6}
            onChange={e => setNueva(e.target.value)}
          />
          <button
            className={styles.showBtn}
            type="button"
            onClick={() => setShowNueva(v => !v)}
            tabIndex={-1}
          >
            {showNueva ? "Ocultar" : "Ver"}
          </button>
        </div>
        <div className={styles.inputGroup}>
          <input
            type={showRepetir ? "text" : "password"}
            placeholder="Repetir nueva contraseña"
            value={repetirNueva}
            required
            minLength={6}
            onChange={e => setRepetirNueva(e.target.value)}
          />
          <button
            className={styles.showBtn}
            type="button"
            onClick={() => setShowRepetir(v => !v)}
            tabIndex={-1}
          >
            {showRepetir ? "Ocultar" : "Ver"}
          </button>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Cambiando..." : "Cambiar contraseña"}
        </button>
        {mensaje && <p className={styles.mensaje}>{mensaje}</p>}
      </form>
    </div>
  );
}