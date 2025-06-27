import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_ULR } from "../../auth/constURL"
import Swal from 'sweetalert2';
import PDFExporter from '../../utils/PDFExporter';
import { useDebounce } from '../../utils/useDebounce';
import ExcelExporter from '../../utils/ExcelExporter';
import AsistenciaExporterExcel from '../../utils/AsistenciaExporterExcel';
import DFAsistenciaExporter from '../../utils/DFAsistenciaExporter'
import MostarInfoAdmin from '../../components/MostarInfoAdmin';

const Grados = () => {
    const [grados, setGrados] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [estudiantesDisponibles, setEstudiantesDisponibles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAsignarModal, setShowAsignarModal] = useState(false);
    const [showEstudiantesModal, setShowEstudiantesModal] = useState(false);
    const [selectedGrado, setSelectedGrado] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        seccion: '',
        id_profesor: ''
    });
    const [detallesGrado, setDetallesGrado] = useState(null);
    const [showDetallesModal, setShowDetallesModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms de delay
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [gradoToDelete, setGradoToDelete] = useState(null);


    const fetchDetallesGrado = async (idGrado) => {
        try {
            const res = await axios.get(`${API_ULR}/grados/${idGrado}/detalles`);
            setDetallesGrado(res.data);
            setShowDetallesModal(true);
        } catch (err) {
            console.error(err);
            alert('Error al cargar los detalles del grado');
        }
    };

    useEffect(() => {
        fetchGrados();
        fetchProfesores();
    }, []);

    const fetchGrados = async () => {
        try {
            const res = await axios.get(`${API_ULR}/grados`);
            setGrados(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProfesores = async () => {
        try {
            const res = await axios.get(`${API_ULR}/grados/profesores`);
            setProfesores(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchEstudiantes = async (idGrado) => {
        try {
            const res = await axios.get(`${API_ULR}/grados/${idGrado}/estudiantes`);
            setEstudiantes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchEstudiantesDisponibles = async () => {
        try {
            const res = await axios.get(`${API_ULR}/grados/estudiantes/disponibles`);
            setEstudiantesDisponibles(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_ULR}/grados`, formData);
            fetchGrados();
            setShowModal(false);
            setFormData({ nombre: '', seccion: '', id_profesor: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleAsignarProfesor = async (idGrado, idProfesor) => {
        try {
            await axios.put(`${API_ULR}/grados/${idGrado}/asignar-profesor`, { id_profesor: idProfesor });
            fetchGrados();
            setShowAsignarModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAgregarEstudiante = async (idEstudiante) => {
        try {
            await axios.post(`${API_ULR}/grados/${selectedGrado}/estudiantes`, { id_estudiante: idEstudiante });
            fetchEstudiantes(selectedGrado);
            fetchEstudiantesDisponibles();
        } catch (err) {
            console.error(err);
        }
    };

    const openEstudiantesModal = (idGrado) => {
        setSelectedGrado(idGrado);
        fetchEstudiantes(idGrado);
        fetchEstudiantesDisponibles();
        setShowEstudiantesModal(true);
    };


    const handleQuitarEstudiante = async (idEstudiante) => {
        try {
            await axios.delete(`${API_ULR}/grados/${selectedGrado}/estudiantes/${idEstudiante}`);

            // Actualizar las listas
            fetchEstudiantes(selectedGrado);
            fetchEstudiantesDisponibles();

            Swal.fire({
                icon: "success",
                title: "Se removio el estudiante con exito",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error al remover el estudiante",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const handleDeleteGrado = async () => {
        try {
            const { data } = await axios.get(`${API_ULR}/grados/${gradoToDelete.id}/estudiantes`);


            if (data.length > 0) {
                Swal.fire({
                    title: `El grado tiene ${data.length} estudiantes asignados`,
                    text: " ¿Deseas eliminarlo de todos modos?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, estoy seguro",
                    cancelButtonText: "cancelar",
                }).then((result) => {
                    if (result.isDenied) {
                        return;
                    }
                });
            }

            // Verificar si tiene profesor asignado
            if (gradoToDelete.id_profesor) {
                Swal.fire({
                    title: `El grado tiene un profesor asignado`,
                    text: " ¿Deseas eliminarlo de todos modos?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, estoy seguro",
                    cancelButtonText: "cancelar",
                }).then((result) => {
                    if (result.isDenied) {
                        return;
                    }
                });
            }

            await axios.delete(`${API_ULR}/grados/${gradoToDelete.id}`);



            // Actualizar lista de grados
            fetchGrados();

            // Cerrar modal y limpiar
            setShowDeleteModal(false);
            setGradoToDelete(null);

            // Mostrar notificación
            Swal.fire({
                icon: "success",
                title: "Grado eliminado correctamente",
                showConfirmButton: false,
                timer: 1500
            });

        } catch (error) {
            console.error('Error eliminando grado:', error);

            Swal.fire({
                icon: "error",
                title: "Error al eliminar el grado"
            });
        }
    };


    // Función para filtrar estudiantes disponibles
    const filteredEstudiantesDisponibles = estudiantesDisponibles.filter(estudiante => {
        const searchLower = debouncedSearchTerm.toLowerCase();
        return (
            estudiante.nombres.toLowerCase().includes(searchLower) ||
            estudiante.apellidos.toLowerCase().includes(searchLower) ||
            estudiante.cedula_escolar.toLowerCase().includes(searchLower)
        );
    });


    return (
        <Container>

            <Row className="my-4">
                <Col>
                    <h1>Gestión de Grados</h1>
                    <MostarInfoAdmin>
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            Crear Nuevo Grado
                        </Button>
                    </MostarInfoAdmin>
                </Col>
            </Row>


            <Row>
                <Col>
                    <Card>
                        <Card.Header>Lista de Grados</Card.Header>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Grado</th>
                                        <th>Sección</th>
                                        <th>Profesor</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grados.map((grado) => (
                                        <tr key={grado.id}>
                                            <td>{grado.nombre}</td>
                                            <td>{grado.seccion}</td>
                                            <td>
                                                {grado.profesor_nombre
                                                    ? `${grado.profesor_nombre} ${grado.profesor_apellido} (${grado.profesor_cedula})`
                                                    : 'Sin asignar'}
                                            </td>
                                            <td>
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedGrado(grado.id);
                                                        setShowAsignarModal(true);
                                                    }}
                                                >
                                                    Asignar Profesor
                                                </Button>{' '}
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => openEstudiantesModal(grado.id)}
                                                >
                                                    Estudiantes
                                                </Button>
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    onClick={() => fetchDetallesGrado(grado.id)}
                                                    className="ms-2"
                                                >
                                                    Ver Detalles
                                                </Button>
                                                <MostarInfoAdmin>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            setGradoToDelete(grado);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="m-2"
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </MostarInfoAdmin>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal para crear nuevo grado */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nuevo Grado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del Grado</Form.Label>
                            <Form.Select
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un grado</option>
                                <option value="1ro">1ro</option>
                                <option value="2do">2do</option>
                                <option value="3ro">3ro</option>
                                <option value="4to">4to</option>
                                <option value="5to">5to</option>
                                <option value="6to">6to</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sección</Form.Label>
                            <Form.Select
                                name="seccion"
                                value={formData.seccion}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione una sección</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                {/* Agrega más opciones según necesites */}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Profesor (opcional)</Form.Label>
                            <Form.Select
                                name="id_profesor"
                                value={formData.id_profesor}
                                onChange={handleInputChange}
                            >
                                <option value="">Seleccione un profesor</option>
                                {profesores.map((profesor) => (
                                    <option key={profesor.id} value={profesor.id}>
                                        {profesor.primer_apellido} {profesor.primer_nombre} ({profesor.cedula})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal para asignar profesor */}
            <Modal show={showAsignarModal} onHide={() => setShowAsignarModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Asignar Profesor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        handleAsignarProfesor(selectedGrado, formData.id_profesor);
                    }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Seleccione un profesor</Form.Label>
                            <Form.Select
                                name="id_profesor"
                                value={formData.id_profesor}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un profesor</option>
                                {profesores.map((profesor) => (
                                    <option key={profesor.id} value={profesor.id}>
                                        {profesor.primer_apellido} {profesor.primer_nombre} ({profesor.cedula})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Asignar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal para gestionar estudiantes */}
            <Modal
                show={showEstudiantesModal}
                onHide={() => setShowEstudiantesModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Estudiantes del Grado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Estudiantes actuales</h5>
                    <Table striped bordered hover size="sm" className="mb-4">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Cédula Escolar</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes.map((estudiante) => (
                                <tr key={estudiante.id}>
                                    <td>{estudiante.nombres}</td>
                                    <td>{estudiante.apellidos}</td>
                                    <td>{estudiante.cedula_escolar}</td>
                                    <td>
                                        <Button variant="danger"
                                            size="sm"
                                            onClick={() => {
                                                Swal.fire({
                                                    title: "¿Quieres sacar el estudiante ?",
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#3085d6",
                                                    cancelButtonColor: "#d33",
                                                    confirmButtonText: "Si",
                                                    cancelButtonText: "Cancelar",
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        handleQuitarEstudiante(estudiante.id);

                                                    }
                                                });
                                            }}>
                                            Quitar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <h5>Agregar estudiantes</h5>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Buscar estudiantes por nombre, apellido o cédula..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>

                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Cédula Escolar</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEstudiantesDisponibles.length > 0 ? (
                                filteredEstudiantesDisponibles.map((estudiante) => (
                                    <tr key={estudiante.id}>
                                        <td>{estudiante.nombres}</td>
                                        <td>{estudiante.apellidos}</td>
                                        <td>{estudiante.cedula_escolar}</td>
                                        <td>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleAgregarEstudiante(estudiante.id)}
                                            >
                                                Agregar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        {estudiantesDisponibles.length === 0
                                            ? 'No hay estudiantes disponibles para agregar'
                                            : 'No se encontraron resultados para tu búsqueda'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"
                        onClick={() => {
                            setShowEstudiantesModal(false)
                            setSearchTerm('');
                        }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showDetallesModal}
                onHide={() => setShowDetallesModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Detalles del Grado: {detallesGrado?.nombre} Sección {detallesGrado?.seccion}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detallesGrado && (
                        <>
                            <Card className="mb-4">
                                <Card.Header>Información del Grado</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Grado:</strong> {detallesGrado.nombre}</p>
                                            <p><strong>Sección:</strong> {detallesGrado.seccion}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong>Profesor Asignado:</strong></p>
                                            {detallesGrado.profesor_nombre ? (
                                                <>
                                                    <p>{detallesGrado.profesor_nombre} {detallesGrado.profesor_apellido}</p>
                                                    <p><strong>Cédula:</strong> {detallesGrado.profesor_cedula}</p>
                                                    <p><strong>Teléfono:</strong> {detallesGrado.profesor_telefono}</p>
                                                </>
                                            ) : (
                                                <p className="text-muted">No asignado</p>
                                            )}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Card>
                                <Card.Header>Estudiantes ({detallesGrado.estudiantes.length})</Card.Header>
                                <Card.Body>
                                    {detallesGrado.estudiantes.length > 0 ? (
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Nombres</th>
                                                    <th>Apellidos</th>
                                                    <th>Cédula Escolar</th>
                                                    <th>Fecha Nacimiento</th>
                                                    <th>Género</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {detallesGrado.estudiantes.map((estudiante, index) => (
                                                    <tr key={estudiante.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{estudiante.nombres}</td>
                                                        <td>{estudiante.apellidos}</td>
                                                        <td>{estudiante.cedula_escolar}</td>
                                                        <td>{new Date(estudiante.fecha_nacimiento).toLocaleDateString()}</td>
                                                        <td>{estudiante.genero}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p className="text-muted">No hay estudiantes asignados a este grado</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <PDFExporter data={detallesGrado} />
                    {/* <AsistenciaExporterExcel data={detallesGrado} /> */}
                    <ExcelExporter data={detallesGrado} />
                    <DFAsistenciaExporter data={detallesGrado} />
                    <Button variant="secondary" onClick={() => setShowDetallesModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de eliminar el grado {gradoToDelete?.nombre} sección {gradoToDelete?.seccion}?
                    <br />
                    <strong>Esta acción no se puede deshacer.</strong>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteGrado}>
                        Confirmar Eliminación
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Grados;