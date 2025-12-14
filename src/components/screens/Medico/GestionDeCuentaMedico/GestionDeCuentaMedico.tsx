import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./GestionDeCuentaMedico.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../auth/store/authStore";
const database = import.meta.env.VITE_DATABASE;


export const GestionDeCuentaMedico = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [medico, setMedico] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    cuil: "",
    telefono: "",
    matricula: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.idMedico) {
      cargarDatosMedico(user.idMedico);
    }
  }, [user]);

  const cargarDatosMedico = async (id: number) => {
    try {
      const response = await axios.get(
        `${database}/api/medicos/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedico(response.data);
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || error?.response?.data || "No se pudieron cargar los datos del medico.";
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
    setMedico((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
       `${database}/api/medicos/actualizar/${user?.idMedico}`,
        {
          ...medico,
          dni: medico.dni ? Number(medico.dni) : null,
          cuil: medico.cuil ? Number(medico.cuil) : null,
          telefono: medico.telefono ? Number(medico.telefono) : null,
          matricula: medico.matricula ? String(medico.matricula) : null,
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
          value={medico.nombre}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>Apellido:</label>
        <input
          className={styles.input}
          type="text"
          name="apellido"
          value={medico.apellido}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>DNI:</label>
        <input
          className={styles.input}
          type="number"
          name="dni"
          value={medico.dni}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>CUIL:</label>
        <input
          className={styles.input}
          type="number"
          name="cuil"
          value={medico.cuil}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>Teléfono:</label>
        <input
          className={styles.input}
          type="number"
          name="telefono"
          value={medico.telefono}
          onChange={handleChange}
          required
        />

        <label className={styles.label}>Matrícula:</label>
        <input
          className={styles.input}
          type="text"
          name="matricula"
          value={medico.matricula}
          onChange={handleChange}
          required
        />

        <button className={styles.addButton} type="submit">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};
