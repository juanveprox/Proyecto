import { useState, useRef } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { API_ULR } from "../auth/constURL"
const BaseRegistroPersonal = ({ tipoPersonal = "docentes" }) => {
    const [formData, setFormData] = useState({
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        cedula: '',
        telefono: '',
        correo: '',
        fechaNacimiento: '',
        sexo: '',
        cargoVoucher: '',
        codigoCargo: '',
        dependencia: '',
        codigoDependencia: '',
        cargaHoraria: '',
        fechaIngresoMPPE: '',
        titulosProfesionales: '',
        tipoTitulo: '',
        tallaFranela: '',
        tallaPantalon: '',
        tallaZapato: '',
        archivo: null
    });
    // eslint-disable-next-line no-unused-vars
    const [filePreview, setFilePreview] = useState(null);
    const fileInputRef = useRef(null);
    // eslint-disable-next-line no-unused-vars
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [archivos, setArchivos] = useState([null, null, null]);
    const [filePreviews, setFilePreviews] = useState([null, null, null]);
    const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validaciones
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            Swal.fire('Error', 'Formato no válido. Solo imágenes (JPEG, PNG, GIF) o PDFs', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Error', 'El tamaño máximo por archivo es 5MB', 'error');
            return;
        }

        // Actualizar estado
        const newArchivos = [...archivos];
        newArchivos[index] = file;
        setArchivos(newArchivos);

        // Vista previa para imágenes
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newPreviews = [...filePreviews];
                newPreviews[index] = e.target.result;
                setFilePreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        } else {
            const newPreviews = [...filePreviews];
            newPreviews[index] = { name: file.name, type: 'pdf' };
            setFilePreviews(newPreviews);
        }
    };

    // Eliminar archivo específico
    const removeFile = (index) => {
        const newArchivos = [...archivos];
        newArchivos[index] = null;
        setArchivos(newArchivos);

        const newPreviews = [...filePreviews];
        newPreviews[index] = null;
        setFilePreviews(newPreviews);

        if (fileInputRefs[index].current) {
            fileInputRefs[index].current.value = '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = [
            'primerNombre', 'primerApellido', 'cedula',
            'telefono', 'correo', 'fechaNacimiento',
            'sexo', 'cargoVoucher', 'dependencia',
            'codigoCargo',
            'fechaIngresoMPPE', 'codigoDependencia'
        ];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'Este campo es requerido';
            }
        });

        if (formData.cedula && !/^\d+$/.test(formData.cedula)) {
            newErrors.cedula = 'La cédula debe contener solo números';
        }

        if (formData.correo && !/^\S+@\S+\.\S+$/.test(formData.correo)) {
            newErrors.correo = 'Correo electrónico inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setUploadProgress(0);

        try {
            const formDataToSend = new FormData();

            // Agregar todos los campos del formulario
            Object.keys(formData).forEach(key => {

                if (key !== 'archivo' && formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Agregar archivos (solo los que tienen valor)
            archivos.forEach((archivo, index) => {
                if (archivo) {
                    formDataToSend.append(`archivos[${index}]`, archivo);
                }
            });

            const datos = {};
            for (const [key, value] of formDataToSend) {
                datos[key] = value;
            }
            console.log(datos);


            const response = await axios.post(`${API_ULR}/personal/${tipoPersonal}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: `${tipoPersonal.charAt(0).toUpperCase() + tipoPersonal.slice(1)} registrado correctamente`
            });

            // Resetear formulario
            setFormData({
                primerNombre: '',
                segundoNombre: '',
                primerApellido: '',
                segundoApellido: '',
                cedula: '',
                telefono: '',
                correo: '',
                fechaNacimiento: '',
                sexo: '',
                cargoVoucher: '',
                codigoCargo: '',
                dependencia: '',
                codigoDependencia: '',
                cargaHoraria: '',
                fechaIngresoMPPE: '',
                titulosProfesionales: '',
                tipoTitulo: '',
                tallaFranela: '',
                tallaPantalon: '',
                tallaZapato: '',
                archivo: null
            });
            setArchivos([null, null, null])
            setFilePreviews([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (error) {
            console.error('Error al registrar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al registrar'
            });
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };


    return (
        <div className='w-100 min-vh-100 p-1'>


            <Container className="mt-0 bg-white p-0 rounded">
                <h2 className="mt-3 mb-0 text-center py-3 bg-primary text-white rounded-top">Registro de {tipoPersonal.charAt(0).toUpperCase() + tipoPersonal.slice(1)}</h2>
                <Form onSubmit={handleSubmit} className='px-3 py-2'>
                    <h4 className="mt-4 mb-3 py-2 px-3 bg-dark-subtle text-black rounded">Datos Personales</h4>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded">
                                <Form.Label className='fw-medium'>Primer Nombre *</Form.Label>
                                <Form.Control
                                    name="primerNombre"
                                    value={formData.primerNombre}
                                    onChange={handleChange}
                                    isInvalid={!!errors.primerNombre}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.primerNombre}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Segundo Nombre</Form.Label>
                                <Form.Control
                                    name="segundoNombre"
                                    value={formData.segundoNombre}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Primer Apellido *</Form.Label>
                                <Form.Control
                                    name="primerApellido"
                                    value={formData.primerApellido}
                                    onChange={handleChange}
                                    isInvalid={!!errors.primerApellido}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.primerApellido}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Segundo Apellido</Form.Label>
                                <Form.Control
                                    name="segundoApellido"
                                    value={formData.segundoApellido}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Cédula *</Form.Label>
                                <Form.Control
                                    name="cedula"
                                    value={formData.cedula}
                                    onChange={handleChange}
                                    isInvalid={!!errors.cedula}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.cedula}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Fecha de Nacimiento *</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fechaNacimiento"
                                    value={formData.fechaNacimiento}
                                    onChange={handleChange}
                                    isInvalid={!!errors.fechaNacimiento}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.fechaNacimiento}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Correo Electrónico *</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    isInvalid={!!errors.correo}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.correo}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Teléfono *</Form.Label>
                                <Form.Control
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    isInvalid={!!errors.telefono}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.telefono}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Sexo *</Form.Label>
                                <Form.Select
                                    name="sexo"
                                    value={formData.sexo}
                                    onChange={handleChange}
                                    isInvalid={!!errors.sexo}
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.sexo}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Sección de datos laborales */}
                    <h4 className="mt-4 mb-3 py-2 px-3 bg-dark-subtle text-black rounded">Datos Laborales</h4>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Cargo (Voucher) *</Form.Label>
                                <Form.Control
                                    name="cargoVoucher"
                                    value={formData.cargoVoucher}
                                    onChange={handleChange}
                                    isInvalid={!!errors.cargoVoucher}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.cargoVoucher}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Código del Cargo</Form.Label>
                                <Form.Control
                                    name="codigoCargo"
                                    value={formData.codigoCargo}
                                    onChange={handleChange}
                                    isInvalid={!!errors.codigoCargo}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Dependencia *</Form.Label>
                                <Form.Control
                                    name="dependencia"
                                    value={formData.dependencia}
                                    onChange={handleChange}
                                    isInvalid={!!errors.dependencia}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.dependencia}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Código de Dependencia</Form.Label>
                                <Form.Control
                                    name="codigoDependencia"
                                    value={formData.codigoDependencia}
                                    onChange={handleChange}
                                    isInvalid={!!errors.codigoDependencia}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Carga Horaria</Form.Label>
                                <Form.Control
                                    name="cargaHoraria"
                                    value={formData.cargaHoraria}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Fecha de Ingreso al MPPE *</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fechaIngresoMPPE"
                                    value={formData.fechaIngresoMPPE}
                                    onChange={handleChange}
                                    isInvalid={!!errors.fechaIngresoMPPE}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.fechaIngresoMPPE}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Datos Académicos */}
                    <h4 className="mt-4 mb-3 py-2 px-3 bg-dark-subtle text-black rounded">Datos Académicos</h4>
                    <Row>
                        <Col md={8}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Títulos Profesionales</Form.Label>
                                <Form.Control
                                    rows={3}
                                    name="titulosProfesionales"
                                    value={formData.titulosProfesionales}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Tipo de Título</Form.Label>
                                <Form.Select
                                    name="tipoTitulo"
                                    value={formData.tipoTitulo}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="pregrado">Pregrado</option>
                                    <option value="posgrado">Posgrado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Datos de Vestimenta */}
                    <h4 className="mt-4 mb-3 py-2 px-3 bg-dark-subtle text-black rounded">Datos de Vestimenta</h4>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Talla de Franela</Form.Label>
                                <Form.Control
                                    name="tallaFranela"
                                    value={formData.tallaFranela}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Talla de Pantalón</Form.Label>
                                <Form.Control
                                    name="tallaPantalon"
                                    value={formData.tallaPantalon}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3 ps-xl-3 border-start border-info-subtle border-3 rounded-3">
                                <Form.Label className='fw-medium'>Talla de Zapato</Form.Label>
                                <Form.Control
                                    name="tallaZapato"
                                    value={formData.tallaZapato}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Sección de archivos adjuntos */}
                    <h4 className="mt-4 mb-3">Documentos Adjuntos (Máximo 3)</h4>

                    {[0, 1, 2].map((index) => (
                        <Form.Group key={index} className="mb-3">
                            <Form.Label>Documento {index + 1}</Form.Label>

                            {filePreviews[index] && (
                                <div className="mb-3 position-relative">
                                    {typeof filePreviews[index] === 'string' ? (
                                        <img
                                            src={filePreviews[index]}
                                            alt={`Vista previa ${index + 1}`}
                                            className="img-thumbnail d-block mb-2"
                                            style={{ maxHeight: '200px' }}
                                        />
                                    ) : (
                                        <div className="border p-3 text-center">
                                            <i className="bi bi-file-earmark-pdf fs-1"></i>
                                            <p className="mt-2">{filePreviews[index].name}</p>
                                        </div>
                                    )}
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeFile(index)}
                                        className="position-absolute top-0 end-0 m-2"
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            )}

                            <div className="d-flex align-items-center gap-3">
                                <Button
                                    variant="outline-primary"
                                    onClick={() => fileInputRefs[index].current.click()}
                                    className="d-flex align-items-center gap-2"
                                >
                                    <FaUpload /> Seleccionar Archivo
                                </Button>
                                <span className="text-muted">
                                    {archivos[index] ? archivos[index].name : 'Ningún archivo seleccionado'}
                                </span>
                            </div>

                            <Form.Control
                                type="file"
                                ref={fileInputRefs[index]}
                                onChange={(e) => handleFileChange(index, e)}
                                accept=".jpg,.jpeg,.png,.gif,.pdf"
                                className="d-none"
                            />
                        </Form.Group>
                    ))}

                    {/* Botón de envío */}
                    <div className="text-center mt-4">
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Registrando...' : 'Registrar'}
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>

    );
};

export default BaseRegistroPersonal;