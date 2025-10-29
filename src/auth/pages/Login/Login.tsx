// src/auth/pages/Login/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import styles from './Login.module.css';

export const Login = () => {
  const navigate = useNavigate();
  const { startLogin } = useAuthStore();

  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loggedUser = await startLogin(email, contrasena);

      if (!loggedUser) {
        console.log('Credenciales inválidas');
        return;
      }

      // Redirección según el rol
      if (loggedUser.rol === 'ADMIN') {
        navigate('/admin');
      } else if (loggedUser.rol === 'ADMINOFTALMOLOGIA') {
        navigate('/admin');
      } else if (loggedUser.rol === 'ADMINORTOPEDIA') {
        navigate('/admin');
      } else if (loggedUser.rol === 'MEDICO GENERAL') {
        navigate('/admin');  
      } else {
        navigate('/admin');
      }
    } catch (error) {
      console.log('Credenciales inválidas', error);
    }
  };

  const olvideContrasena = () => {
    navigate('/perdi-contra');
  };
  return (
    <div>
      <div className={`${styles.breadcrumbs} ${styles.overlay}`}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2 col-md-12 col-12">
              <br /><br /><br />
            </div>
          </div>
        </div>
      </div>

      <section className={styles.login + ' section'}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-12">
              <div className={styles['form-head']}>
                <h4 className={styles.title}>Iniciar Sesión</h4>
                <form onSubmit={handleSubmit}>
                  <div className={styles['form-group']}>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles['check-and-pass']}>
                    <div className="row align-items-center">
                      <div className="col-lg-6 col-md-6 col-12">
                      </div>
                      <div className="col-lg-6 col-md-6 col-12">
                        <span onClick={olvideContrasena} className={styles['lost-pass']}>
                          Olvidé mi contraseña
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.button}>
                    <button type="submit" className={styles.btn}>
                      Iniciar Sesión
                    </button>
                  </div>
                  <p className={styles['outer-link']}>
                    ¿No tenés cuenta? <a href="/register">Registrate acá</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
