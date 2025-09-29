import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo/logo1.svg"

const HeaderMedicoOftalmologo = () => {
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
                    <a className="navbar-brand" href="/main">
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
                              aria-label="Toggle navigation">Mi cuenta</a>
                              <ul className="sub-menu collapse" id="submenu-1-1">
                                <li className="nav-item" onClick={() => navigate("/")}>Gestion de Cuenta</li>
                              </ul>                            
                        </li>

                        <li  className="nav-item">
                            <a className="page-scroll dd-menu collapsed" href="javascript:void(0)"
                              data-bs-toggle="collapse" data-bs-target="#submenu-1-4"
                              aria-controls="navbarSupportedContent" aria-expanded="false"
                              aria-label="Toggle navigation">Reintegros</a>
                              <ul className="sub-menu collapse" id="submenu-1-4">
                                <li className="nav-item" onClick={() => navigate("/pedidos/oftalmologia/medico")}>Pedidos Oftalmologia</li>
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
    </div>  
  );
};

export default HeaderMedicoOftalmologo;