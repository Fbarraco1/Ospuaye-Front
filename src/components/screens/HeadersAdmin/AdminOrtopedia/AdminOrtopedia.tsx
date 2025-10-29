import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo/logo1.svg"
import fondoAdmin from "../../../assets/images/FondoAdmin.png"


const AdminOrtopedia = () => {
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
                <a className="navbar-brand" href="/admin">
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

                    <li className="nav-item">
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/medicos")}>Gestión de Médicos</span>
                    </li>

                    <li className="nav-item">
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/pedidos/ortopedia")}>Pedidos Ortopedia</span>
                    </li>  

                    <li className="nav-item">
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/beneficiarios")}>Gestión de beneficiarios</span>
                    </li>

                    <li className="nav-item">
                        <span aria-label="Toggle navigation" style={{ cursor: "pointer" }} onClick={() => navigate("/grupoFamiliar")}>Grupos Familiares</span>
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

export default AdminOrtopedia;