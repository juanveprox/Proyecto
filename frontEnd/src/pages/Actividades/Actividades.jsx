import { useState, useRef } from 'react';
import { Form, Button, Alert, Container, Card, Row, Col, Image, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import { FaTrash, FaUpload } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_ULR } from '../../auth/constURL';
import { useNavigate } from 'react-router-dom';

const Actividades = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        imagenes: []
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Validar número de imágenes
        if (formData.imagenes.length + files.length > 5) {
            Swal.fire({
                icon: "warning",
                title: "Límite excedido",
                text: 'Máximo 5 imágenes permitidas',
            });
            return;
        }

        // Validar tamaño y tipo de cada imagen
        const validImages = files.filter(file => {
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire({
                    icon: "warning",
                    title: "Demasiado grande",
                    text: `La imagen ${file.name} es demasiado grande (máx. 2MB)`,
                });
                return false;
            }
            if (!file.type.match('image.*')) {
                Swal.fire({
                    icon: "warning",
                    title: "No es válida",
                    text: `El archivo ${file.name} no es una imagen válida`,
                });
                return false;
            }
            return true;
        });

        setFormData(prev => ({
            ...prev,
            imagenes: [...prev.imagenes, ...validImages]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        setUploadProgress(0);

        // Validaciones
        if (!formData.titulo.trim() || !formData.descripcion.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Campos requeridos",
                text: "Título y descripción son obligatorios",
            });
            setIsSubmitting(false);
            return;
        }

        if (formData.imagenes.length === 0) {
            Swal.fire({
                title: "Imágenes requeridas",
                text: "Debes subir al menos una imagen",
                icon: "info"
            });
            setIsSubmitting(false);
            return;
        }

        // Preparar FormData según lo que espera la API
        const formDataToSend = new FormData();
        formDataToSend.append('titulo', formData.titulo);
        formDataToSend.append('descripcion', formData.descripcion);

        // Appendear cada imagen individualmente
        formData.imagenes.forEach((img, index) => {
            formDataToSend.append(`imagenes[${index}]`, img);
        });

        try {
            const response = await axios.post(`${API_ULR}/actividades/`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            });

            // Verificar si la respuesta es exitosa (2xx)
            if (response.status >= 200 && response.status < 300) {
                Swal.fire({
                    icon: "success",
                    title: "¡Actividad creada!",
                    text: "La actividad se ha registrado correctamente",
                    showConfirmButton: false,
                    timer: 1500
                });

                // Resetear formulario
                setFormData({
                    titulo: '',
                    descripcion: '',
                    imagenes: []
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                throw new Error(response.data?.message || 'Error desconocido');
            }
        } catch (err) {
            console.error('Error al crear actividad:', err);

            let errorMessage = 'Error al crear la actividad';
            if (err.response) {
                // Error de la API
                errorMessage = err.response.data?.message || err.response.statusText;
            } else if (err.request) {
                // Error de conexión
                errorMessage = 'No se pudo conectar al servidor';
            }

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="mt-4 mb-5">
            <h2 className="text-center mb-4 p-3 bg-primary text-white rounded">
                Crear Reporte de Actividad
            </h2>
            <div className="mb-2 d-flex justify-content-end">
                <button className="btn btn-dark"
                    onClick={() => navigate("/actividades")}
                >Regresar a las Actividad</button>
            </div>
            <Card className="shadow">
                <Card.Body>
                    {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Título de la Actividad</Form.Label>
                            <Form.Control
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                placeholder="Ej: Día del Árbol 2023"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Descripción Detallada</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="descripcion"
                                rows={5}
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Describa la actividad realizada, participantes, objetivos, etc."
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold d-block">
                                Imágenes de la Actividad (Máx. 5)
                            </Form.Label>

                            {/* Vista previa de imágenes */}
                            {formData.imagenes.length > 0 && (
                                <Row className="mb-3 g-2">
                                    {formData.imagenes.map((img, index) => (
                                        <Col key={index} xs={6} md={4} lg={3}>
                                            <div className="position-relative">
                                                <Image
                                                    src={URL.createObjectURL(img)}
                                                    thumbnail
                                                    className="img-preview"
                                                    style={{ height: '120px', objectFit: 'cover' }}
                                                />
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="position-absolute top-0 end-0 m-1"
                                                    onClick={() => removeImage(index)}
                                                    title="Eliminar imagen"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            )}

                            <div className="d-flex align-items-center gap-3">
                                <Button
                                    variant="outline-primary"
                                    onClick={() => fileInputRef.current.click()}
                                    className="d-flex align-items-center gap-2"
                                    disabled={formData.imagenes.length >= 5}
                                >
                                    <FaUpload /> Seleccionar Imágenes
                                </Button>
                                <span className="text-muted">
                                    {formData.imagenes.length} / 5 imágenes seleccionadas
                                </span>
                            </div>

                            <Form.Control
                                type="file"
                                ref={fileInputRef}
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="d-none"
                                disabled={formData.imagenes.length >= 5}
                            />
                            <Form.Text muted>
                                Formatos aceptados: JPG, PNG, WEBP. Máximo 2MB por imagen.
                            </Form.Text>
                        </Form.Group>

                        {isSubmitting && (
                            <div className="mb-3">
                                <ProgressBar
                                    now={uploadProgress}
                                    label={`${uploadProgress}%`}
                                    animated
                                    striped
                                    variant={uploadProgress === 100 ? 'success' : 'primary'}
                                />
                                <div className="text-center mt-2">
                                    {uploadProgress === 100 ?
                                        'Procesando actividad...' :
                                        'Subiendo imágenes, por favor espere...'}
                                </div>
                            </div>
                        )}

                        <div className="d-flex justify-content-end mt-4">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting || formData.imagenes.length === 0}
                                size="lg"
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar Actividad'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Actividades;