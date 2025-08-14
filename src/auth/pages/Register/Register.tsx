import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import styles from './Register.module.css';

export const Register = () => {
  const navigate = useNavigate();
  const { startRegister } = useAuthStore();

  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await startRegister(email, contrasena);
      navigate('/');
    } catch (error) {
      console.log('Credenciales inválidas', error);
    }
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
                <h4 className={styles.title}>Registrarse</h4>
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
                  <div className={styles.button}>
                    <button type="submit" className={styles.btn}>
                      Iniciar Sesión
                    </button>
                  </div>
                  <p className={styles['outer-link']}>
                    ¿Ya tenés cuenta? <a href="/login">Inicia Sesión</a>
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
