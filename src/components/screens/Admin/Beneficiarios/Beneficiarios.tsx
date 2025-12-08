import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import styles from './Beneficiarios.module.css';
import { useAuthStore } from '../../../../auth/store/authStore';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  cuil: number;
  telefono: number;
  afiliadoSindical: boolean;
  esJubilado: boolean;
  grupoFamiliar: {
    id: number;
    nombre: string;
  };
  activo: boolean;
}

export const Beneficiarios: React.FC = () => {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // ← backend usa 0-based
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  // 🔹 Cargar lista completa al iniciar
  useEffect(() => {
    obtenerBeneficiarios();
  }, []);

  // 🔹 Buscar en el backend cuando cambia el texto
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerBeneficiarios(0);
      } else {
        buscarBeneficiarios(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);


  // 🔽 DESCARGAR TXT DE BENEFICIARIOS
const descargarBeneficiariosTXT = async () => {
  try {
    // 🔹 Bloquear pantalla mientras se genera
    Swal.fire({
      title: "Generando archivo...",
      text: "Por favor espere unos segundos",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await axios.get(`${database}/api/beneficiarios/export`, {
      responseType: "blob",
    });

    // Crear blob para generar archivo
    const blob = new Blob([response.data], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    // Detectar nombre del archivo
    let fileName = "beneficiarios.txt";
    const disposition = response.headers["content-disposition"];
    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);
      if (match && match.length === 2) fileName = match[1];
    }

    // Descargar archivo
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);

    // 🔹 Cerrar alerta
    Swal.close();

    // 🔹 Avisar éxito
    Swal.fire({
      icon: "success",
      title: "Archivo descargado",
      text: "El archivo se generó correctamente.",
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error) {
    Swal.close();
    console.error("Error al descargar beneficiarios:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al generar el archivo.",
    });
  }
};



  // 🧩 OBTENER LISTA PAGINADA
  const obtenerBeneficiarios = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/beneficiarios/paginar`, {
        params: { page, size },
      });
      setBeneficiarios(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al obtener beneficiarios:', error);
    }
  };

 const buscarBeneficiarios = async (filtro: string, page = 0, size = itemsPerPage) => {
  try {
    const response = await axios.get(`${database}/api/beneficiarios/buscar`, {
      params: { query: filtro, page, size },
    });

    setBeneficiarios(response.data.content);
    setTotalPages(response.data.totalPages);
  } catch (error) {
    console.error('Error al buscar beneficiarios:', error);
  }
};


  // 🗑️ ELIMINAR
  const eliminarBeneficiario = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el beneficiario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`${database}/api/beneficiarios/${id}/estado`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        obtenerBeneficiarios(currentPage);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El beneficiario fue eliminado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error al eliminar beneficiario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el beneficiario.',
        });
      }
    }
  };

  const agregarBeneficiario = () => navigate('/beneficiario/nuevo');
  const editarBeneficiario = (id: number) => navigate(`/beneficiario/editar/${id}`);

  // 🔄 MANEJAR PAGINADO DINÁMICO
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerBeneficiarios(newPage);
      else buscarBeneficiarios(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerBeneficiarios(newPage);
      else buscarBeneficiarios(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">GESTIÓN DE BENEFICIARIOS</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <div className={styles.container}>
        <h2 className={styles.title}>Beneficiarios</h2>

        <input
          type="text"
          placeholder="Buscar por cualquier campo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
        />

        <button className={styles.addButton} onClick={agregarBeneficiario}>
          <FaPlus /> Agregar Beneficiario
        </button>

        <button
          className={styles.addButton}
          style={{ backgroundColor: "#3b7ddd" }}
          onClick={descargarBeneficiariosTXT}
          >
          Descargar TXT
        </button>


        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>CUIL</th>
              <th>Teléfono</th>
              <th>Afiliado Sindical</th>
              <th>¿Es Jubilado?</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {beneficiarios.map((b) => (
              <tr key={b.id}>
                <td>{b.nombre}</td>
                <td>{b.apellido}</td>
                <td>{b.dni}</td>
                <td>{b.cuil}</td>
                <td>{b.telefono}</td>
                <td>{b.afiliadoSindical ? 'Sí' : 'No'}</td>
                <td>{b.esJubilado ? 'Sí' : 'No'}</td>
                <td>{b.activo ? 'Sí' : 'No'}</td>
                <td className={styles.actions}>
                  <div className={styles.actionWrapper}>
                    <FaEdit className={styles.editIcon} onClick={() => editarBeneficiario(b.id)} />
                    <FaTrash className={styles.deleteIcon} onClick={() => eliminarBeneficiario(b.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINADO */}
        {totalPages > 1 && (
          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              style={{
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: '#88C250',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ◀
            </button>
            <span style={{ alignSelf: 'center', fontSize: '14px', color: '#555' }}>
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              style={{
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: '#88C250',
                cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
