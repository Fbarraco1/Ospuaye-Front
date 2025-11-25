import React, { useEffect, useState } from 'react';
import styles from './ModalDepartamento.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../auth/store/authStore';
import { useNavigate, useParams } from 'react-router-dom';

const database = import.meta.env.VITE_DATABASE;

interface ModalDepartamentoProps {
  modo?: 'editar' | 'crear';
  onDepartamentoAdded?: () => void;
}

interface Provincia {
  id: number;
  nombre: string;
}

export const ModalDepartamento: React.FC<ModalDepartamentoProps> = ({
  modo = 'crear',
  onDepartamentoAdded,
}) => {
  const [nombre, setNombre] = useState('');
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [provincia, setProvincia] = useState<number>(0);
  const [activo, setActivo] = useState<boolean>(true);
  const [provinciaSearch, setProvinciaSearch] = useState('');

  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Cargar datos cuando es edición
  useEffect(() => {
    if (modo === 'editar' && id) {
      cargarDepartamento(id);
    }
  }, [id, modo]);

  // Búsqueda con debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (provinciaSearch.trim().length === 0) {
        setProvincias([]);
        return;
      }
      buscarProvincias(provinciaSearch);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [provinciaSearch]);

  const buscarProvincias = async (valor: string) => {
    try {
      const response = await axios.get(
        `${database}/api/provincias/buscar-simple?nombre=${valor}`
      );
      setProvincias(response.data);
    } catch (error) {
      console.error('Error buscando provincias:', error);
    }
  };

  const cargarDepartamento = async (departamentoId: string) => {
    try {
      const res = await axios.get(`${database}/api/departamentos/${departamentoId}`);
      const d = res.data;

      setNombre(d.nombre || '');
      setProvincia(d.provincia?.id || 0);
      setProvinciaSearch(d.provincia?.nombre || '');
      setActivo(typeof d.activo === 'boolean' ? d.activo : true);
    } catch (error) {
      console.error('Error al cargar departamento:', error);
    }
  };

  const createDepartamento = async (nombre: string, provincia: number) => {
    try {
      const response = await axios.post(
        `${database}/api/departamentos/crear`,
        { nombre, provincia: { id: provincia } },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300)
        throw new Error('Error al crear Departamento');

      Swal.fire({
        icon: 'success',
        title: 'Departamento creado',
        text: 'El departamento se creó correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el departamento.',
      });
      throw error;
    }
  };

  const updateDepartamento = async (
    idNum: number,
    nombre: string,
    provincia: number,
    activoFlag: boolean
  ) => {
    try {
      const response = await axios.put(
        `${database}/api/departamentos/${idNum}`,
        { nombre, provincia: { id: provincia }, activo: activoFlag },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status < 200 || response.status >= 300)
        throw new Error('Error al editar Departamento');

      Swal.fire({
        icon: 'success',
        title: 'Departamento editado',
        text: 'El departamento se editó correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo editar el departamento.',
      });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (provincia === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Seleccione una provincia válida',
      });
      return;
    }

    try {
      if (modo === 'editar' && id) {
        await updateDepartamento(Number(id), nombre, provincia, activo);
      } else {
        await createDepartamento(nombre, provincia);
      }
      if (onDepartamentoAdded) onDepartamentoAdded();
      navigate('/departamento');
    } catch {
      /* manejado arriba */
    }
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={() => navigate('/departamento')} style={{ marginBottom: 10 }}>
        Volver
      </button>

      <div className={styles.modal}>
        <h2>{modo === 'editar' ? 'Editar Departamento' : 'Agregar Departamento'}</h2>

        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label>Provincia:</label>
          <input
            type="text"
            placeholder="Buscar provincia..."
            value={provinciaSearch}
            onChange={(e) => {
              setProvinciaSearch(e.target.value);
              setProvincia(0);
            }}
          />

          {/* Lista de autocompletado */}
          {provincias.length > 0 && provinciaSearch.length > 0 && (
            <ul className={styles.autocompleteList}>
              {provincias.map((p) => (
                <li
                  key={p.id}
                  onClick={() => {
                    setProvincia(p.id);
                    setProvinciaSearch(p.nombre);
                    setProvincias([]);
                  }}
                  className={styles.autocompleteItem}
                >
                  {p.nombre}
                </li>
              ))}
            </ul>
          )}

          {modo === 'editar' && (
            <>
              <label>Activo:</label>
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
            </>
          )}

          <div className={styles.actions}>
            <button type="submit">Aceptar</button>
            <button type="button" onClick={() => navigate('/departamento')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
