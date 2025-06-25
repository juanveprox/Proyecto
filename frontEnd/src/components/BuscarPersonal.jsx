import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Table, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { API_ULR } from '../auth/constURL';
import BaseRegistroPersonal from './RegistroPersonal';
import DetallePersonal from './DetallePersonal';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const BuscarPersonal = ({ tipo }) => {
    const navigate = useNavigate();
    const [key, setKey] = useState('buscar');
    const [personal, setPersonal] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [busqueda, setBusqueda] = useState('');

    const [showDetalle, setShowDetalle] = useState(false);
    const [personalDetalle, setPersonalDetalle] = useState(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);


    // Títulos según el tipo de personal
    const titulos = {
        docentes: 'Docentes',
        administrativos: 'Personal Administrativo',
        obreros: 'Personal Obrero'
    };

    // Buscar personal al montar componente o cambiar búsqueda
    useEffect(() => {
        buscarPersonal();
    }, [tipo]);

    const buscarPersonal = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_ULR}/personal/${tipo}`);
            setPersonal(response.data.data || []);
        } catch (err) {
            console.error('Error al buscar personal:', err);
            setError(err.response?.data?.message || 'Error al cargar el personal');
        } finally {
            setLoading(false);
        }
    };


    const cargarDetallePersonal = async (id) => {
        setLoadingDetalle(true);
        try {
            const response = await axios.get(`${API_ULR}/personal/${id}`);
            setPersonalDetalle(response.data.data);
            setShowDetalle(true);
        } catch (err) {
            console.error('Error al cargar detalles:', err);
            setError('Error al cargar los detalles del personal');
        } finally {
            setLoadingDetalle(false);
        }
    };

    const confirmarEliminacion = (persona) => {
        Swal.fire({
            title: `¿Eliminar a ${persona.primer_nombre} ${persona.primer_apellido}?`,
            text: `Cédula: ${persona.cedula}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            backdrop: `
                rgba(0,0,0,0.7)
                url("/images/trash-icon.png")
                center left
                no-repeat
            `,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return eliminarPersonal(persona.id)
                    .then(response => {
                        return response;
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            `Error al eliminar: ${error.response?.data?.message || error.message}`
                        );
                    });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    '¡Eliminado!',
                    `El personal ha sido eliminado correctamente.`,
                    'success'
                );
                buscarPersonal();
            }
        });
    };

    const eliminarPersonal = async (id) => {
        try {
            const response = await axios.delete(`${API_ULR}/personal/${id}`);
            return response.data;
        } catch (err) {
            console.error('Error al eliminar personal:', err);
            throw err;
        }
    };




    // Filtrar personal según búsqueda
    const personalFiltrado = personal.filter(p => {
        const term = busqueda.toLowerCase();
        return (
            p.primer_nombre.toLowerCase().includes(term) ||
            p.primer_apellido.toLowerCase().includes(term) ||
            p.cedula.includes(term) ||
            (p.cargo_voucher && p.cargo_voucher.toLowerCase().includes(term))
        );
    });

    return (
        <Container className="mt-4 mb-5">
            <h2 className="text-center mb-4 bg-primary text-white py-3 rounded">Búsqueda de {titulos[tipo] || 'Personal'}</h2>

            <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-4">
                <Tab eventKey="buscar" title={`Buscar ${titulos[tipo]}`}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col md={10}>
                                        <Form.Group controlId="formBusqueda">
                                            <Form.Label>Buscar {titulos[tipo] || 'personal'}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder={`Buscar por nombre, cédula o cargo...`}
                                                value={busqueda}
                                                onChange={(e) => setBusqueda(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2} className="d-flex align-items-end">
                                        <Button
                                            variant="primary"
                                            onClick={buscarPersonal}
                                            disabled={loading}
                                        >
                                            {loading ? 'Buscando...' : 'Refrescar'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>

                    {loading && (
                        <div className="text-center my-4">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                            <p>Cargando {titulos[tipo]?.toLowerCase() || 'personal'}...</p>
                        </div>
                    )}

                    {error && (
                        <Alert variant="danger" onClose={() => setError('')} dismissible>
                            {error}
                        </Alert>
                    )}

                    {!loading && !error && (
                        <Card className="shadow-sm">
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Cédula</th>
                                                <th>Nombre Completo</th>
                                                <th>Cargo Voucher</th>
                                                <th>Teléfono</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {personalFiltrado.length > 0 ? (
                                                personalFiltrado.map((persona) => (
                                                    <tr key={persona.id}>
                                                        <td>{persona.cedula}</td>
                                                        <td>{`${persona.primer_nombre} ${persona.segundo_nombre || ''} ${persona.primer_apellido} ${persona.segundo_apellido || ''}`}</td>
                                                        <td>{persona.cargo_voucher}</td>
                                                        <td>{persona.telefono}</td>
                                                        <td>
                                                            <Button
                                                                variant="info"
                                                                size="sm"
                                                                onClick={() => cargarDetallePersonal(persona.id)}
                                                                disabled={loadingDetalle}
                                                            >
                                                                {loadingDetalle && personalDetalle?.id === persona.id ? (
                                                                    <Spinner size="sm" animation="border" />
                                                                ) : (
                                                                    'Detalle'
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="warning"
                                                                size="sm"
                                                                onClick={() => navigate(`/editar-personal/${persona.id}`)}
                                                                className="mx-2"
                                                            >
                                                                Editar
                                                            </Button>

                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => confirmarEliminacion(persona)}
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        {busqueda ? 'No se encontraron resultados' : `No hay ${titulos[tipo]?.toLowerCase() || 'personal'} registrado`}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Tab>

                <Tab eventKey="registrar" title={`Registrar ${titulos[tipo]}`}>
                    <BaseRegistroPersonal
                        tipoPersonal={tipo}
                        onSuccess={() => {
                            setKey('buscar');
                            buscarPersonal();
                        }}
                    />
                </Tab>
            </Tabs>

            {/* Componente de Detalle */}
            <DetallePersonal
                personal={personalDetalle}
                show={showDetalle}
                onHide={() => setShowDetalle(false)}
            />
        </Container>
    );
};

export default BuscarPersonal;