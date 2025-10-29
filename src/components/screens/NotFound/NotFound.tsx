import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NotFound: React.FC = () => {
  const location = useLocation();
  const state: any = (location && (location.state as any)) || {};

  // Intentar obtener código desde state o query param
  const params = new URLSearchParams(location.search);
  const codeParam = params.get('code');

  const status = Number(state?.status ?? codeParam ?? 404);
  const detailMessage = state?.message ?? '';

  const mapStatusToContent = (statusCode: number) => {
    switch (statusCode) {
      case 400:
        return { title: '400 - Petición incorrecta', message: 'La solicitud tiene formato inválido o parámetros faltantes.' };
      case 401:
        return { title: '401 - No autorizado', message: 'Necesitás iniciar sesión o no tenés permisos para acceder.' };
      case 403:
        return { title: '403 - Prohibido', message: 'No tenés permiso para ver este recurso.' };
      case 404:
        return { title: '404 - Página no encontrada', message: 'La página que buscás no existe o fue movida.' };
      case 500:
        return { title: '500 - Error interno del servidor', message: 'Ocurrió un error en el servidor. Intentá más tarde.' };
      case 503:
        return { title: '503 - Servicio no disponible', message: 'El servicio está temporalmente fuera de línea.' };
      default:
        return { title: `${statusCode} - Error`, message: 'Ocurrió un error. Intentá nuevamente más tarde.' };
    }
  };

  const content = mapStatusToContent(status);

  useEffect(() => {
    document.title = `${status} - ${content.title}`;
    // Ocultar preloader después de un breve tiempo
    const fadeout = () => {
      const preloader = document.querySelector('.preloader') as HTMLElement;
      if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.display = 'none';
      }
    };
    const timeout = setTimeout(fadeout, 500);
    return () => clearTimeout(timeout);
  }, [status, content.title]);

  return (
    <>
      {/* Preloader */}
      <div className="preloader">
        <div className="preloader-inner">
          <div className="preloader-icon">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Error Area */}
      <div className="error-area overlay">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container">
              <div className="error-content text-center">
                <h1>{status}</h1>
                <h2>{content.title}</h2>
                <p>
                  {detailMessage ? detailMessage : content.message}
                </p>

                {/* Mostrar más info opcional si viene en state */}
                {detailMessage && (
                  <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', margin: '1rem auto', maxWidth: 800 }}>
                    {detailMessage}
                  </pre>
                )}

                <div className="button">
                  <Link to="/main" className="btn">
                    Volver al inicio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
