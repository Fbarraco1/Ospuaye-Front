import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';


const NotFound: React.FC = () => {
  useEffect(() => {
    // Cambiar el título del documento
    document.title = '404 Error';

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
  }, []);

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
                <h1>404</h1>
                <h2>Oops! Página no encontrada!</h2>
                <p>
                  La página que estás buscando no existe o ha sido movida. Por favor, verifica la URL o vuelve a la página de inicio.
                </p>
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
