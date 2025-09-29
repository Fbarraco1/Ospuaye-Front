import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import styles from './Register.module.css';

export const Register = () => {
  const navigate = useNavigate();
  const { startRegisterBeneficiario } = useAuthStore();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [dni, setDni] = useState('');
  const [cuil, setCuil] = useState('');
  const [telefono, setTelefono] = useState('');
  const [afiliadoSindical, setAfiliadoSindical] = useState(false);
  const [esJubilado, setEsJubilado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await startRegisterBeneficiario(
      nombre,
      apellido,
      email,
      contrasena,
      dni,
      cuil,
      telefono,
      afiliadoSindical,
      esJubilado
    );
    navigate('/login');
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
                <h4 className={styles.title}>Registrarse como Beneficiario</h4>
                <form onSubmit={handleSubmit}>
                  <div className={styles['form-group']}>
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <input
                      type="text"
                      placeholder="Apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      required
                    />
                  </div>
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
                  <div className={styles['form-group']}>
                    <input
                      type="text"
                      placeholder="DNI"
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <input
                      type="text"
                      placeholder="CUIL"
                      value={cuil}
                      onChange={(e) => setCuil(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <input
                      type="text"
                      placeholder="Teléfono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label>
                      <input
                        type="checkbox"
                        checked={afiliadoSindical}
                        onChange={(e) => setAfiliadoSindical(e.target.checked)}
                      /> Afiliado Sindical
                    </label>
                  </div>
                  <div className={styles['form-group']}>
                    <label>
                      <input
                        type="checkbox"
                        checked={esJubilado}
                        onChange={(e) => setEsJubilado(e.target.checked)}
                      /> Jubilado
                    </label>
                  </div>
                  <div className={styles.button}>
                    <button type="submit" className={styles.btn}>
                      Registrarse
                    </button>
                  </div>
                  <p className={styles['outer-link']}>
                    ¿Ya tenés cuenta? <a href="/">Inicia Sesión</a>
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
