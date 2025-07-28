import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuthStore } from '../../../auth/store/authStore';

const dashboardItems = [
  {
    title: 'Gestión de Usuarios',
    description: 'Alta, baja y modificación de usuarios registrados.',
    route: '/usuarios',
  },
  {
    title: 'Gestión de Beneficiarios',
    description: 'Administrar datos de los beneficiarios.',
    route: '/beneficiarios',
  },
  {
    title: 'Gestión de Médicos',
    description: 'ABM de médicos asignados a las áreas.',
    route: '/medicos',
  },
  {
    title: 'Gestión de Pedidos',
    description: 'Crear y gestionar pedidos ortopédicos u oftalmológicos.',
    route: '/pedidos',
  },
  {
    title: 'Gestión de Documentos',
    description: 'Adjuntar y revisar documentos de pedidos.',
    route: '/documentos',
  },
  {
    title: 'Grupos Familiares',
    description: 'Administrar vínculos familiares de los beneficiarios.',
    route: '/grupoFamiliar',
  },
  {
    title: 'Áreas',
    description: 'Gestionar las áreas correspondientes.',
    route: '/areas',
  },
    
  {
    title: 'Roles',
    description: 'Gestionar roles de usuarios y sus áreas correspondientes.',
    route: '/roles',
  },
];

export const Dashboard = () => {
  const { user } = useAuthStore();

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
                <a href={item.route} className="btn btn-primary mt-3">Ir a {item.title.split(" ")[2]}</a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
