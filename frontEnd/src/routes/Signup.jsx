import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { API_ULR } from "../auth/ConstURL.JS";


const Signup = () => {
    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        usuario: '',
        correo: '',
        clave: '',
        confirmarClave: '',
        rol: 'usuario' // Valor por defecto
    });

    // Estado para errores de validación
    const [errors, setErrors] = useState({});

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Validar el formulario
    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        if (!formData.usuario.trim()) newErrors.usuario = 'El usuario es requerido';
        if (!formData.correo.trim()) newErrors.correo = 'El correo es requerido';
        else if (!/^\S+@\S+\.\S+$/.test(formData.correo)) newErrors.correo = 'Correo inválido';
        if (!formData.clave) newErrors.clave = 'La contraseña es requerida';
        else if (formData.clave.length < 6) newErrors.clave = 'La contraseña debe tener al menos 6 caracteres';
        if (formData.clave !== formData.confirmarClave) newErrors.confirmarClave = 'Las contraseñas no coinciden';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {

            try {
                const respuesta = await fetch(`${API_ULR}/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });
                const response = await respuesta.json();

                if (respuesta.ok) {
                    Swal.fire({
                        title: "Exito",
                        text: "El usuario se creo correctamente",
                        icon: "success"
                    });

                    setFormData({
                        nombre: '',
                        usuario: '',
                        correo: '',
                        clave: '',
                        confirmarClave: '',
                        rol: 'usuario' // Valor por defecto
                    })


                } else {
                    console.log(respuesta.status)
                    Swal.fire({
                        title: "Error",
                        text: `${response.error}` || "Error al crear el usuario",
                        icon: `${respuesta.status == 409 ? "warning" : "error"}`
                    });

                }

            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Error del servidor",
                    icon: "warning"
                });


                console.log(error)
            }
        }

    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4 bg-primary text-white p-2 rounded">Registrar Usuario</h2>
                            <form onSubmit={handleSubmit}>
                                {/* Nombre */}
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                </div>

                                {/* Usuario */}
                                <div className="mb-3">
                                    <label htmlFor="usuario" className="form-label">Usuario</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.usuario ? 'is-invalid' : ''}`}
                                        id="usuario"
                                        name="usuario"
                                        value={formData.usuario}
                                        onChange={handleChange}
                                    />
                                    {errors.usuario && <div className="invalid-feedback">{errors.usuario}</div>}
                                </div>

                                {/* Correo electrónico */}
                                <div className="mb-3">
                                    <label htmlFor="correo" className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                                        id="correo"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                    />
                                    {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                                </div>

                                {/* Contraseña */}
                                <div className="mb-3">
                                    <label htmlFor="clave" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.clave ? 'is-invalid' : ''}`}
                                        id="clave"
                                        name="clave"
                                        value={formData.clave}
                                        onChange={handleChange}
                                    />
                                    {errors.clave && <div className="invalid-feedback">{errors.clave}</div>}
                                </div>

                                {/* Confirmar contraseña */}
                                <div className="mb-3">
                                    <label htmlFor="confirmarClave" className="form-label">Confirmar contraseña</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.confirmarClave ? 'is-invalid' : ''}`}
                                        id="confirmarClave"
                                        name="confirmarClave"
                                        value={formData.confirmarClave}
                                        onChange={handleChange}
                                    />
                                    {errors.confirmarClave && <div className="invalid-feedback">{errors.confirmarClave}</div>}
                                </div>

                                {/* Rol (Administrador / Usuario) */}
                                <div className="mb-3">
                                    <label htmlFor="rol" className="form-label">Rol</label>
                                    <select
                                        className="form-select"
                                        id="rol"
                                        name="rol"
                                        value={formData.rol}
                                        onChange={handleChange}
                                    >
                                        <option value="usuario">Usuario</option>
                                        <option value="administrador">Administrador</option>
                                    </select>
                                </div>

                                {/* Botón de envío */}
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Registrarse</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;