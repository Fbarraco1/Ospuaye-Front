import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./GestionDeCuenta.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../auth/store/authStore";
const database = import.meta.env.VITE_DATABASE;


export const GestionDeCuenta = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [beneficiario, setBeneficiario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    cuil: "",
    telefono: "",
    afiliadoSindical: false,
    esJubilado: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.idBeneficiario) {
      cargarDatosBeneficiario(user.idBeneficiario);
    }
  }, [user]);

  const cargarDatosBeneficiario = async (id: number) => {
    try {
      const response = await axios.get(
        `${database}/api/beneficiarios/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBeneficiario(response.data);
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || error?.response?.data || "No se pudieron cargar los datos del beneficiario.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: backendMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBeneficiario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `${database}/api/beneficiarios/${user?.idBeneficiario}`,
        {
          ...beneficiario,
          dni: beneficiario.dni ? Number(beneficiario.dni) : null,
          cuil: beneficiario.cuil ? Number(beneficiario.cuil) : null,
          telefono: beneficiario.telefono ? Number(beneficiario.telefono) : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Datos actualizados",
        text: "Tus datos se actualizaron correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || error?.response?.data || "No se pudieron actualizar los datos.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: backendMessage,
      });
    }
  };

  if (loading) {
    return <div className={styles.container}>Cargando datos...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Editar mis datos</h2>
      <p
        onClick={() => navigate('/recuperar-contra')}
        style={{ cursor: "pointer" }}
      >
        <u>Cambiar contraseña</u>
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Nombre:</label>
        <input
          className={styles.input}
          type="text"
          name="nombre"
          value={beneficiario.nombre}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>Apellido:</label>
        <input
          className={styles.input}
          type="text"
          name="apellido"
          value={beneficiario.apellido}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>DNI:</label>
        <input
          className={styles.input}
          type="number"
          name="dni"
          value={beneficiario.dni}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>CUIL:</label>
        <input
          className={styles.input}
          type="number"
          name="cuil"
          value={beneficiario.cuil}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>Teléfono:</label>
        <input
          className={styles.input}
          type="number"
          name="telefono"
          value={beneficiario.telefono}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>Afiliado Sindical:</label>
        <input
          className={styles.checkbox}
          type="checkbox"
          name="afiliadoSindical"
          checked={beneficiario.afiliadoSindical}
          onChange={handleChange}
        />

        <label className={styles.label}>¿Es Jubilado?</label>
        <input
          className={styles.checkbox}
          type="checkbox"
          name="esJubilado"
          checked={beneficiario.esJubilado}
          onChange={handleChange}
        />

        <button className={styles.addButton} type="submit">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};
