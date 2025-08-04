import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../auth/store/authStore";
import styles from "./NavBar.module.css";

export const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className={styles["navbar-green"]}>
      <Container>
        <Navbar.Brand href="/">ABM Genérica</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>

          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link onClick={() => navigate("/login")}>Iniciar sesión</Nav.Link>
              </>
            ) : (
              <NavDropdown title="👤" align="end" id="user-dropdown">
                <NavDropdown.Item disabled>
                  {user?.email}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
