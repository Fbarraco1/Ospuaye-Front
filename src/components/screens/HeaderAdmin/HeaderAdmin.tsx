import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo/logo1.svg"
import fondoAdmin from "../../../assets/images/FondoAdmin.png"


const HeaderAdmin = () => {
  const navigate = useNavigate();

  return (
    <div>
        <header className="header navbar-area style2">
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

                        <li  className="nav-item">
                            <a className="page-scroll dd-menu collapsed" href="javascript:void(0)"
                              data-bs-toggle="collapse" data-bs-target="#submenu-1-1"
                              aria-controls="navbarSupportedContent" aria-expanded="false"
                              aria-label="Toggle navigation">Usuario</a>
                              <ul className="sub-menu collapse" id="submenu-1-1">
                                <li className="nav-item" onClick={() => navigate("/usuarios")}>ABM Usuarios</li>
                                <li className="nav-item" onClick={() => navigate("/")}>Modificacion Clave</li>
                              </ul>                            
                        </li>

                        <li  className="nav-item">
                            <a className="page-scroll dd-menu collapsed" href="javascript:void(0)"
                              data-bs-toggle="collapse" data-bs-target="#submenu-1-2"
                              aria-controls="navbarSupportedContent" aria-expanded="false"
                              aria-label="Toggle navigation">Configuracion</a>
                              <ul className="sub-menu collapse" id="submenu-1-2">
                                <li className="nav-item" onClick={() => navigate("/usuarios")}>ABM Medicos</li>
                                <li className="nav-item" onClick={() => navigate("/areas")}>Modificacion Areas</li>
                                <li className="nav-item" onClick={() => navigate("/roles")}>Modificacion Roles</li>
                              </ul>                            
                        </li>

                        <li  className="nav-item">
                            <a className="page-scroll dd-menu collapsed" href="javascript:void(0)"
                              data-bs-toggle="collapse" data-bs-target="#submenu-1-3"
                              aria-controls="navbarSupportedContent" aria-expanded="false"
                              aria-label="Toggle navigation">Domicilios</a>
                              <ul className="sub-menu collapse" id="submenu-1-3">
                                <li className="nav-item" onClick={() => navigate("/pais")}>ABM Pais</li>
                                <li className="nav-item" onClick={() => navigate("/provincia")}>ABM Provincia</li>
                                <li className="nav-item" onClick={() => navigate("/departamento")}>ABM Departamento</li>
                                <li className="nav-item" onClick={() => navigate("/localidad")}>ABM Localidad</li>
                                <li className="nav-item" onClick={() => navigate("/domicilio")}>ABM Domicilio</li>
                              </ul>                            
                        </li>

                        <li  className="nav-item">
                            <a className="page-scroll dd-menu collapsed" href="javascript:void(0)"
                              data-bs-toggle="collapse" data-bs-target="#submenu-1-3"
                              aria-controls="navbarSupportedContent" aria-expanded="false"
                              aria-label="Toggle navigation">Empresas</a>
                              <ul className="sub-menu collapse" id="submenu-1-3">
                                <li className="nav-item" onClick={() => navigate("/empresa")}>ABM Empresa</li>
                              </ul>                            
                        </li>

                        <li  className="nav-item">
                            <a className="page-scroll dd-menu collapsed" href="javascript:void(0)"
                              data-bs-toggle="collapse" data-bs-target="#submenu-1-4"
                              aria-controls="navbarSupportedContent" aria-expanded="false"
                              aria-label="Toggle navigation">Beneficiarios</a>
                              <ul className="sub-menu collapse" id="submenu-1-4">
                                <li className="nav-item" onClick={() => navigate("/beneficiario")}>ABM Beneficiario</li>
                                <li className="nav-item" onClick={() => navigate("/grupoFamiliar")}>ABM Grupo Familiar</li>
                              </ul>                            
                        </li>

                        <li  className="nav-item">
                            <a className="page-scroll dd-menu collapsed" href="javascript:void(0)"
                              data-bs-toggle="collapse" data-bs-target="#submenu-1-4"
                              aria-controls="navbarSupportedContent" aria-expanded="false"
                              aria-label="Toggle navigation">Reintegros</a>
                              <ul className="sub-menu collapse" id="submenu-1-4">
                                <li className="nav-item" onClick={() => navigate("/")}>Alta Pedido Medico</li>
                                <li className="nav-item" onClick={() => navigate("/")}>Gestion Pedido Medico</li>
                              </ul>                            
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
                src={fondoAdmin}
                alt="admin"
                style={{
                    opacity: 0.5,
                    width: '750px',
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block'
                }}
            />
        </div>
    </div>  
  );
};

export default HeaderAdmin;