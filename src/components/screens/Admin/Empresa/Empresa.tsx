import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Empresa.module.css';
import { useAuthStore } from '../../../../auth/store/authStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface Empresa {
    id: number;
    cuit: string;
    razonSocial: string;
    activo: boolean;
    domicilio?: {
        id?: number;
        calle?: string;
        numeracion?: string;
        localidad?: {
            id?: number;
            codigoPostal?: string;
        }
    }
}

export const Empresa = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // Estados para paginación (0-based como Beneficiarios)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    obtenerEmpresas(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce búsqueda
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerEmpresas(0);
      } else {
        buscarEmpresas(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Intentar endpoint paginado; fallback a endpoint sin paginar
  const obtenerEmpresas = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/empresas/paginar`, {
        params: { page, size },
      });
      setEmpresas(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      try {
        const res = await axios.get(`${database}/api/empresas`);
        const all: Empresa[] = res.data;
        setEmpresas(all.slice(0, itemsPerPage));
        setTotalPages(Math.ceil(all.length / itemsPerPage));
      } catch (err) {
        console.error('Error al obtener empresas (fallback):', err);
      }
    }
  };

  const buscarEmpresas = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/empresas/buscar`, {
        params: { query: filtro, page, size },
      });
      setEmpresas(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      // fallback: filtrar localmente si no existe búsqueda paginada
      try {
        const res = await axios.get(`${database}/api/empresas`);
        const all: Empresa[] = res.data;
        const filtered = all.filter(r =>
          [
            r.id,
            r.cuit,
            r.razonSocial,
            r.domicilio?.calle,
            r.domicilio?.numeracion,
            r.domicilio?.localidad?.codigoPostal,
            r.activo ? 'sí' : 'no'
          ]
            .join(' ')
            .toLowerCase()
            .includes(filtro.toLowerCase())
        );
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setEmpresas(filtered.slice(0, itemsPerPage));
      } catch (err) {
        console.error('Error fallback al buscar empresas:', err);
      }
    }
  };

  const agregarEmpresa = () => {
    navigate('/empresa/nuevo');
  }

  const editarEmpresa = (id: number) => {
    navigate(`/empresa/editar/${id}`);
  }


const descargarEmpresas = async () => {
  try {
    Swal.fire({
      title: "Preparando archivo...",
      text: "Por favor espera unos segundos",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const response = await fetch(`${database}/api/empresas/export`);

    if (!response.ok) {
      Swal.close();
      Swal.fire("Error", "No se pudo descargar el archivo.", "error");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "empresas.txt";
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    Swal.close();
    Swal.fire("Descargado", "El archivo se descargó correctamente.", "success");

  } catch (error) {
    Swal.close();
    Swal.fire("Error", "Hubo un problema al descargar el archivo.", "error");
  }
};


  const eliminarEmpresa = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la empresa.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
          await axios.patch(`${database}/api/empresas/${id}/estado`, 
            {}, {
              headers: {
              Authorization: `Bearer ${token}`,
              },
          });
          // recargar la página actual (considera búsqueda)
          if (search.trim() === '') obtenerEmpresas(currentPage);
          else buscarEmpresas(search, currentPage);
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'La empresa fue eliminada correctamente.',
            timer: 1500,
            showConfirmButton: false
          });
      } catch (error) {
          console.error('Error al eliminar Empresa:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la empresa.',
          });
      }
    }
  }

  // Controles de paginado (0-based)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerEmpresas(newPage);
      else buscarEmpresas(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerEmpresas(newPage);
      else buscarEmpresas(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">EMPRESAS</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
    <div className={styles.container}>
      <h2 className={styles.title}>Empresas</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <button className={styles.addButton} onClick={agregarEmpresa}>
        <FaPlus /> Agregar Empresa
      </button>

      <button onClick={descargarEmpresas}>
        Descargar Empresas
      </button>


      <table className={styles.table}>
        <thead>
          <tr>
            <th>Razon Social</th>
            <th>Cuit</th>
            <th>Domicilio</th>
            <th>Codigo Postal</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((b) => (
            <tr key={b.id}>
              <td>{b.razonSocial}</td>
              <td>{b.cuit}</td>
              <td>{b.domicilio ? `${b.domicilio.calle ?? ''} ${b.domicilio.numeracion ?? ''}` : 'N/A'}</td>
              <td>{b.domicilio?.localidad?.codigoPostal ?? 'N/A'}</td>
              <td>{b.activo ? 'Sí' : 'No'}</td>
              <td className={styles.actions}>
                <FaEdit
                  className={styles.editIcon}
                  onClick={() => editarEmpresa(b.id)}
                />
                <FaTrash
                  className={styles.deleteIcon}
                  onClick={() => eliminarEmpresa(b.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación (0-based) */}
      {totalPages > 1 && (
        <div className={styles.pagination} style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 0}
            className={styles.pageButton}
          >
            ◀
          </button>
          <span style={{ alignSelf: 'center' }}>
            Página {currentPage + 1} de {totalPages}
          </span>
          <button 
            onClick={handleNextPage} 
            disabled={currentPage >= totalPages - 1}
            className={styles.pageButton}
          >
            ▶
          </button>
        </div>
      )}

    </div>
    </div>
  )
}
