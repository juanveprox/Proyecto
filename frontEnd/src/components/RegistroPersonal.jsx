// src/components/personal/BaseRegistroPersonal.jsx
import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

const BaseRegistroPersonal = ({ tipoPersonal = "docente" }) => {
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
        tipoTitulo: 'pregrado',
        tallaFranela: '',
        tallaPantalon: '',
        tallaZapato: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            'fechaIngresoMPPE'
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
        try {
            // Aquí cambiarías la URL según el tipo de personal
            // const response = await axios.post(`/api/${tipoPersonal}`, formData);

            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: `${tipoPersonal.charAt(0).toUpperCase() + tipoPersonal.slice(1)} registrado correctamente`
            });

            // Resetear formulario
            setFormData({
                primerNombre: '',
                // ... resto de campos
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al registrar'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Registro de {tipoPersonal.charAt(0).toUpperCase() + tipoPersonal.slice(1)}</h2>

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Primer Nombre *</Form.Label>
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
                        <Form.Group className="mb-3">
                            <Form.Label>Segundo Nombre</Form.Label>
                            <Form.Control
                                name="segundoNombre"
                                value={formData.segundoNombre}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Repetir el mismo patrón para todos los campos */}

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Cédula *</Form.Label>
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
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono *</Form.Label>
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

                {/* Sección de datos laborales */}
                <h4 className="mt-4 mb-3">Datos Laborales</h4>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Cargo (Voucher) *</Form.Label>
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
                        <Form.Group className="mb-3">
                            <Form.Label>Código del Cargo</Form.Label>
                            <Form.Control
                                name="codigoCargo"
                                value={formData.codigoCargo}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Botón de envío */}
                <div className="text-center mt-4">
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Registrando...' : 'Registrar'}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default BaseRegistroPersonal;