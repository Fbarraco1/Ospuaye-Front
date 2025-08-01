import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuthStore } from '../../../auth/store/authStore';
import { useNavigate } from 'react-router-dom';

const dashboardItems = [
  {
    title: 'Gestión de Usuarios',
    description: 'Alta, baja y modificación de usuarios registrados.',
    route: '/usuarios',
    btn: 'Usuarios',
  },
  {
    title: 'Gestión de Beneficiarios',
    description: 'Administrar datos de los beneficiarios.',
    route: '/beneficiarios',
    btn: 'Beneficiarios',
  },
  {
    title: 'Gestión de Médicos',
    description: 'ABM de médicos asignados a las áreas.',
    route: '/medicos',
    btn: 'Médicos',
  },
  {
    title: 'Pedidos Oftalmología',
    description: 'Crear y gestionar pedidos oftalmológicos.',
    route: '/pedidos/oftalmologia',
    btn: 'Oftalmología',
  },
  {
    title: 'Pedidos Ortopedia',
    description: 'Crear y gestionar pedidos ortopédicos.',
    route: '/pedidos/ortopedia',
    btn: 'Ortopedia',
  },
  {
    title: 'Grupos Familiares',
    description: 'Administrar vínculos familiares de los beneficiarios.',
    route: '/grupoFamiliar',
    btn: 'Grupos',
  },
  {
    title: 'Áreas',
    description: 'Gestionar las áreas correspondientes.',
    route: '/areas',
    btn: 'Áreas',
  },
  {
    title: 'Roles',
    description: 'Gestionar roles de usuarios y sus áreas correspondientes.',
    route: '/roles',
    btn: 'Roles',
  },
];

export const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <Container className="mt-4">
      <h2>Bienvenido/a al Sistema de Ospuaye</h2>
      <p className="text-muted">Sesión iniciada como: <strong>{user?.email}</strong></p>

      <Row className="mt-4">
        {dashboardItems.map((item, index) => (
          <Col md={4} className="mb-4" key={index}>
            <Card className="shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                </div>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate(item.route)}
                >
                  Ir a {item.btn}
                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
