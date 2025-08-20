import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo/logo1.svg"

const HeaderAdmin = () => {
  const navigate = useNavigate();

  return (
    <header className="header navbar-area style2">
        {/* Start Topbar */}
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
                    <ul>
                        <li>
                            <span style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
                                <i className="lni lni-enter"></i> Ingresar
                            </span>
                        </li>
                        <li>
                            <span style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
                                <i className="lni lni-user"></i> Registrarse
                            </span>
                        </li>
                    </ul>
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
        {/* End Topbar */}
        <div className="container">
        <div className="row align-items-center">
            <div className="col-lg-12">
            <div className="nav-inner">
                {/* Start Navbar */}
                <nav className="navbar navbar-expand-lg">
                <a className="navbar-brand" href="">
                    <img src={logo} alt="Logo" />
                </a>
                <button
                    className="navbar-toggler mobile-menu-btn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="toggler-icon"></span>
                    <span className="toggler-icon"></span>
                    <span className="toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                    <ul id="nav" className="navbar-nav ms-auto">
                    <li className="nav-item" >
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/usuarios")}>Gestión de Usuarios</span>
                    </li>

                    <li className="nav-item">
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/beneficiarios")}>Gestión de Beneficiarios</span>
                    </li>  

                    <li className="nav-item">
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/medicos")}>Gestión de Médicos</span>
                    </li>

                    <li className="nav-item">
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/pedidos/oftalmologia")}>Pedidos Oftalmología</span>
                    </li>

                    <li className="nav-item">
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/pedidos/ortopedia")}>Pedidos Ortopedia</span>
                    </li>

                    <li className="nav-item">
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/grupoFamiliar")}>Grupos Familiares</span>
                    </li>

                    <li className="nav-item">
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/areas")}>Áreas</span>
                    </li>

                    <li className="nav-item">
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/roles")}>Roles</span>
                    </li>                                                                        
                    </ul>
                </div>
                </nav>
                {/* End Navbar */}
            </div>
            </div>
        </div>
        </div>
    </header>
  );
};

export default HeaderAdmin;