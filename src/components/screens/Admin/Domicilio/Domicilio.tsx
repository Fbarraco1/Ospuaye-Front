import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Domicilio.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../auth/store/authStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const database = import.meta.env.VITE_DATABASE;

interface Domicilio {
    id: number;
    calle: string;
    numeracion: string;
    barrio: string;
    manzanaPiso: string;
    casaDepartamento:string;
    referencia:string;
    activo: Boolean;
    localidad: {
        id: number;
        nombre: string;
        codigoPostal: string;
        activo: boolean;
    },
    tipo: 'DOMICILIO_COMPLETO' | 'DOMICILIO_RURAL';
}

export const Domicilio = () => {
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [search, setSearch] = useState('');
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  // 🔹 Estados para paginación (backend usa 0-based)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  // Cargar lista inicial (página 0)
  useEffect(() => {
    obtenerDomicilios(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce búsqueda (400ms) — igual que Beneficiarios
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === '') {
        obtenerDomicilios(0);
      } else {
        buscarDomicilios(search, 0);
      }
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Obtener paginado desde backend (fallback a listado sin paginar si hace falta)
  const obtenerDomicilios = async (page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/domicilios/paginar`, {
        params: { page, size },
      });
      setDomicilios(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al obtener Domicilios paginados:', error);
      // fallback: obtener todo y paginar localmente
      try {
        const res = await axios.get(`${database}/api/domicilios`);
        const all: Domicilio[] = res.data;
        setDomicilios(all.slice(0, size));
        setTotalPages(Math.max(1, Math.ceil(all.length / size)));
      } catch (err) {
        console.error('Fallback error al obtener Domicilios:', err);
      }
    }
  };

  const buscarDomicilios = async (filtro: string, page = 0, size = itemsPerPage) => {
    try {
      const response = await axios.get(`${database}/api/domicilios/buscar`, {
        params: { query: filtro, page, size },
      });
      setDomicilios(response.data.content || []);
      setTotalPages(response.data.totalPages ?? 0);
    } catch (error) {
      console.error('Error al buscar Domicilios:', error);
      // fallback: filtrar localmente
      try {
        const res = await axios.get(`${database}/api/domicilios`);
        const all: Domicilio[] = res.data;
        const filtered = all.filter(l =>
          [
            l.id,
            l.calle,
            l.numeracion,
            l.barrio,
            l.manzanaPiso,
            l.casaDepartamento,
            l.referencia,
            l.localidad?.nombre,
            l.tipo
          ]
            .join(' ')
            .toLowerCase()
            .includes(filtro.toLowerCase())
        );
        setTotalPages(Math.max(1, Math.ceil(filtered.length / size)));
        setDomicilios(filtered.slice(0, size));
      } catch (err) {
        console.error('Fallback error al buscar Domicilios:', err);
      }
    }
  };

  const agregarDomicilio = () => navigate('/domicilio/nuevo');
  const editarDomicilio = (id: number) => navigate(`/domicilio/editar/${id}`);

  const eliminarDomicilio= async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el domicilio.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(`${database}/api/domicilios/${id}/estado`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // recargar la página actual (considera búsqueda)
      if (search.trim() === '') obtenerDomicilios(currentPage);
      else buscarDomicilios(search, currentPage);
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El domicilio fue eliminado correctamente.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al eliminar Domicilio:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el domicilio.',
      });
    }
  };

  // Controles de paginado (0-based)
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerDomicilios(newPage);
      else buscarDomicilios(search, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (search.trim() === '') obtenerDomicilios(newPage);
      else buscarDomicilios(search, newPage);
    }
  };

  return (
    <div>
      <div className="breadcrumbs overlay">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">DOMICILIOS</h1>
              </div>
              <ul className="breadcrumb-nav">
              </ul>
            </div>
          </div>
        </div>
      </div>
      <br />
    <div className={styles.container}>
      <h2 className={styles.title}>Domicilios</h2>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <button className={styles.addButton} onClick={agregarDomicilio}>
        <FaPlus /> Agregar Domicilio
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Calle</th>
            <th>Numeracion</th>
            <th>Barrio</th>
            <th>Manzana/Piso</th>
            <th>Casa/Dpto</th>
            <th>Referencia</th>
            <th>Localidad</th>
            <th>Tipo</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {domicilios.map((b) => (
            <tr key={b.id}>
              <td>{b.calle}</td>
              <td>{b.numeracion}</td>
              <td>{b.barrio}</td>
              <td>{b.manzanaPiso}</td>
              <td>{b.casaDepartamento}</td>
              <td>{b.referencia}</td>
              <td>{b.localidad?.nombre ?? 'Sin nombre'}</td>
              <td>{b.tipo}</td>
              <td>{b.activo ? 'Sí' : 'No'}</td>
              <td className={styles.actions}>
                <div className={styles.actionWrapper}>
                  <FaEdit
                    className={styles.editIcon}
                    onClick={() => editarDomicilio(b.id)}
                  />
                  <FaTrash
                    className={styles.deleteIcon}
                    onClick={() => eliminarDomicilio(b.id)}
                  />
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
  )
}
