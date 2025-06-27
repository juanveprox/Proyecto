import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaBan, FaHome } from 'react-icons/fa';

const AccesoDenegado = () => {
    const navigate = useNavigate();

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                    <Card className="text-center shadow">
                        <Card.Body>
                            <div className="text-danger mb-4">
                                <FaBan size={64} />
                            </div>
                            <Card.Title as="h2" className="mb-3">Acceso Denegado</Card.Title>
                            <Card.Text className="mb-4">
                                No tienes permisos para acceder a esta página. <br />
                                Contacta al administrador si necesitas acceso.
                            </Card.Text>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/inicio')}
                                className="d-inline-flex align-items-center gap-2"
                            >
                                <FaHome /> Volver al inicio
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AccesoDenegado;