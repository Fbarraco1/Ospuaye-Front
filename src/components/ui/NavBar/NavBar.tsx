import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../auth/store/authStore";

export const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="header navbar-area style2">
        <div className="top-bar">
        <div className="container">
            <div className="inner-topbar">
            <div className="row">
                <div className="col-lg-6 col-md-6 col-12">
                <div className="top-contact">
                    <ul>
                    <li>
                        <i className="lni lni-envelope"></i>
                        <a href="mailto:ospuaye@ospuaye.org.ar">ospuaye@ospuaye.org.ar</a>
                    </li>
                    <li>
                        <i className="lni lni-phone"></i>
                        <a href="tel:08007770238">0800-777-0238 (Línea Gratuita)</a>
                    </li>
                    <li>
                        <i className="lni lni-whatsapp"></i>
                        <a href="https://wa.me/5491141875753">+54 9 1141875753</a>
                    </li>
                    </ul>
                </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                <div className="right-content">
                    <div className="login-button">
                    {!isAuthenticated ? (
                      <ul>
                        <li>
                          <span style={{ cursor: "pointer", color: "white" }} onClick={() => navigate("/login")}>
                            <i className="lni lni-enter" style={{ color: "white" }}></i> Ingresar
                          </span>
                        </li>
                        <li>
                          <span style={{ cursor: "pointer", color: "white" }} onClick={() => navigate("/register")}>
                            <i className="lni lni-user" style={{ color: "white" }}></i> Registrarse
                          </span>
                        </li>
                      </ul>
                    ) : (
                      <ul>
                        <li>
                          <span style={{ cursor: "pointer", display: "flex", alignItems: "center", color: "white" }}>
                            <i className="lni lni-user"></i>
                            <span style={{ marginLeft: 8 }}>{user?.email}</span>
                            <span
                              style={{ marginLeft: 16, color: "#dc3545" }}
                              title="Cerrar sesión"
                              onClick={handleLogout}
                            >
                              <i className="lni lni-exit"></i>
                            </span>
                          </span>
                        </li>
                      </ul>
                    )}
                    </div>
                    <div className="top-social">
                    <ul>
                        <li>
                        <a href="paginaConstruccion.html">
                            <i className="lni lni-facebook-filled"></i>
                        </a>
                        </li>
                        <li>
                        <a href="paginaConstruccion.html">
                            <i className="lni lni-instagram"></i>
                        </a>
                        </li>
                        <li>
                        <a href="paginaConstruccion.html">
                            <i className="lni lni-linkedin-original"></i>
                        </a>
                        </li>
                    </ul>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};
