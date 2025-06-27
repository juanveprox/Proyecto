import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { FaUserEdit, FaSave, FaLock, FaEnvelope, FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuthContext } from '../../auth/AutorizarContexto';
import { API_ULR } from '../../auth/constURL';

const UserConfig = () => {
    const { user, updateUser } = useAuthContext();
    const [formData, setFormData] = useState({
        nombre: '',
        usuario: '',
        correo: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    // Cargar datos del usuario al iniciar
    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                usuario: user.usuario || '',
                correo: user.correo || '',
            });
        }
    }, [user]);

    // Manejar cambios en el formulario principal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejar cambios en el formulario de contraseña
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    // Actualizar datos del usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const datos = await axios.put(`${API_ULR}/users/${user.id}/user`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });

            updateUser(datos.data.updatedUser); // Actualizar contexto de autenticación

            Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: "Datos actualizados correctamente",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `${err.response?.data?.message}` || 'Error al actualizar datos',
                showConfirmButton: false,
                timer: 2000
            });

        } finally {
            setLoading(false);
        }
    };

    // Cambiar contraseña
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Swal.fire({
                icon: "warning",
                title: "Error",
                text: 'Error las contraseñas no coinciden',
                showConfirmButton: false,
                timer: 2000
            });
        }

        setLoading(true);
        try {
            await axios.put(
                `${API_ULR}/users/${user.id}/password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );

            Swal.fire('¡Éxito!', 'Contraseña actualizada correctamente', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {

            Swal.fire({
                icon: "error",
                title: "Error",
                text: `${err.response?.data?.message}` || 'Error al cambiar contraseña',
                showConfirmButton: false,
                timer: 2000
            });
            // setError(err.response?.data?.message || 'Error al cambiar contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">
                <FaUserEdit className="me-2" />
                Configuración de Usuario
            </h2>

            {/* {error && <Alert variant="danger">{error}</Alert>} */}

            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>
                        <FaUser className="me-2" />
                        Datos Personales
                    </Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                name="usuario"
                                value={formData.usuario}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : (
                                <>
                                    <FaSave className="me-2" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Card.Title>
                        <FaLock className="me-2" />
                        Cambiar Contraseña
                    </Card.Title>
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña Actual</Form.Label>
                            <Form.Control
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                minLength="6"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                minLength="6"
                                required
                            />
                        </Form.Group>

                        <Button variant="warning" type="submit" disabled={loading}>
                            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default UserConfig;