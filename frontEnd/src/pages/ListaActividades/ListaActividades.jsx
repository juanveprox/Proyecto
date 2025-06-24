
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import { API_ULR } from '../../auth/constURL';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ListaActividades = () => {
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                const response = await axios.get(`${API_ULR}/actividades/`);
                setActividades(response.data.data);
            } catch (err) {
                console.error('Error al obtener actividades:', err);
                setError(err.response?.data?.message || 'Error al cargar las actividades');
            } finally {
                setLoading(false);
            }
        };

        fetchActividades();
    }, []);

    const handleEliminarActividad = async (id) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await axios.delete(`${API_ULR}/actividades/${id}`);

                // Actualizar lista de actividades
                setActividades(actividades.filter(actividad => actividad.id !== id));

                Swal.fire(
                    '¡Eliminado!',
                    'La actividad ha sido eliminada.',
                    'success'
                );
            }
        } catch (err) {
            console.error('Error al eliminar actividad:', err);
            Swal.fire(
                'Error',
                'No se pudo eliminar la actividad',
                'error'
            );
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p>Cargando actividades...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <h2 className="text-center mb-4 p-3 bg-primary text-white rounded">
                Actividades Registradas
            </h2>
            <div className="mb-2 d-flex justify-content-end">
                <Button variant="success" onClick={() => navigate("/crear-actividad")}>
                    Agregar Actividad
                </Button>
            </div>
            {actividades.length === 0 ? (
                <Alert variant="info">No hay actividades registradas aún</Alert>
            ) : (
                <Row className="g-4">
                    {actividades.map((actividad) => (
                        <Col key={actividad.id} lg={6}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{actividad.titulo}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        {new Date(actividad.fecha_creacion).toLocaleDateString()}
                                    </Card.Subtitle>
                                    <Card.Text>{actividad.descripcion}</Card.Text>

                                    {actividad.imagenes.length > 0 && (
                                        <div className="mt-3">
                                            <h6 className="mb-2">Imágenes:</h6>
                                            <Row className="g-2">
                                                {actividad.imagenes.map((img) => (
                                                    <Col xs={6} md={4} key={img.id}>
                                                        <a
                                                            href={`${API_ULR}${img.imagen_url}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Image
                                                                src={`${API_ULR}${img.imagen_url}`}
                                                                thumbnail
                                                                fluid
                                                                className="img-actividad"
                                                            />
                                                        </a>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-end mt-3">
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleEliminarActividad(actividad.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ListaActividades;