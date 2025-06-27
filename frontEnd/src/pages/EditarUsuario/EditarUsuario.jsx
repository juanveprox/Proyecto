import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaUserPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_ULR } from "../../auth/constURL"
import { useNavigate } from 'react-router-dom';


const EditarUsuario = () => {
    // Estados
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()

    // Obtener usuarios
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${API_ULR}/users`);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            showErrorAlert('Error al cargar usuarios');
            setLoading(false);
        }
    };

    // Filtrado de usuarios
    const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejo de formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    // Crear/Editar usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentUser.id) {
                await axios.put(`${API_ULR}/users/${currentUser.id}`, currentUser);
                showSuccessAlert('Usuario actualizado correctamente');
            } else {
                await axios.post(`${API_ULR}/users`, currentUser);
                showSuccessAlert('Usuario creado correctamente');
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            showErrorAlert(error.response?.data?.message || 'Error al guardar');
        }
    };

    // Eliminar usuario
    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_ULR}/users/${id}`);
                    showSuccessAlert('Usuario eliminado');
                    fetchUsers();
                } catch (error) {
                    showErrorAlert('Error al eliminar usuario');
                }
            }
        });
    };

    // Alertas
    const showSuccessAlert = (message) => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500
        });
    };

    const showErrorAlert = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
        });
    };


    return (
        <div className="p-4">
            <div className="d-flex justify-content-between mb-4">
                <h2>
                    <FaUserPlus className="me-2" />
                    Gestión de Usuarios
                </h2>
                <Button
                    variant="primary"
                    onClick={() => {
                        navigate("/registrar")
                    }}
                >
                    <FaUserPlus className="me-2" />
                    Nuevo Usuario
                </Button>
            </div>

            {/* Buscador */}
            <div className="mb-3">
                <div className="input-group">
                    <span className="input-group-text">
                        <FaSearch />
                    </span>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla de usuarios */}
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.nombre}</td>
                                    <td>{user.usuario}</td>
                                    <td>{user.correo}</td>
                                    <td>{user.rol}</td>
                                    <td>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => {
                                                setCurrentUser(user);
                                                setShowModal(true);
                                            }}
                                            className="me-2"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            <FaTrashAlt />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No se encontraron usuarios
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {/* Modal para crear/editar */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {currentUser?.id ? 'Editar Usuario' : 'Crear Usuario'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={currentUser?.nombre || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                name="usuario"
                                value={currentUser?.usuario || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="correo"
                                value={currentUser?.correo || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select
                                name="rol"
                                value={currentUser?.rol || 'usuario'}
                                onChange={handleInputChange}
                            >
                                <option value="admin">Administrador</option>
                                <option value="usuario">Usuario</option>
                            </Form.Select>
                        </Form.Group>

                        {!currentUser?.id && (
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={currentUser?.password || ''}
                                    onChange={handleInputChange}
                                    required={!currentUser?.id}
                                />
                            </Form.Group>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            {currentUser?.id ? 'Actualizar' : 'Crear'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default EditarUsuario;