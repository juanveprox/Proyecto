import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

import { API_ULR } from "../auth/constURL"

const StudentForm = ({ isEdit = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado inicial para creación
    const initialState = {
        student: {
            nombres: '',
            apellidos: '',
            fechaNacimiento: '',
            genero: '',
            tipoCedula: '',
            cedula: '',
            cedulaEscolar: ''
        },
        guardian: {
            nombres: '',
            apellidos: '',
            relacion: '',
            email: '',
            phone: '',
            ocupacion: '',
            tipoCedula: '',
            cedula: ''
        }
    };

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(isEdit); // Solo carga en modo edición

    // Cargar datos en modo edición
    useEffect(() => {
        if (!isEdit) return;

        const fetchStudentData = async () => {
            try {
                const response = await fetch(`${API_ULR}/buscar-estudiante/${id}`, {
                    method: "get",
                    headers: { "Content-Type": "application/json", }
                });
                const respuesta = await response.json();

                if (respuesta.success) {
                    const studentData = respuesta.data;

                    setFormData({
                        student: {
                            nombres: studentData.nombres || '',
                            apellidos: studentData.apellidos || '',
                            fechaNacimiento: studentData.fecha_nacimiento?.split('T')[0] || '',
                            genero: studentData.genero || '',
                            tipoCedula: studentData.tipo_cedula || '',
                            cedula: studentData.cedula || '',
                            cedulaEscolar: studentData.cedula_escolar || ''
                        },
                        guardian: {
                            nombres: studentData.rep_nombres || '',
                            apellidos: studentData.rep_apellidos || '',
                            relacion: studentData.relacion || '',
                            email: studentData.email || '',
                            phone: studentData.rep_telefono || '',
                            ocupacion: studentData.ocupacion || '',
                            tipoCedula: studentData.rep_tipo_cedula || '',
                            cedula: studentData.rep_cedula || ''
                        }
                    });
                }

            } catch (error) {
                console.error('Error cargando datos:', error);
                Swal.fire('Error', 'No se pudieron cargar los datos del estudiante', 'error');
                navigate(isEdit ? `/editar/${id}` : '/crear-estudiante');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [id, isEdit, navigate]);

    const handleChange = (section, field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: e.target.value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEdit) {
                // Lógica para edición

                const respuesta = await fetch(`${API_ULR}/editar-estudiante/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify(formData)
                })

                if (!respuesta.ok) {
                    throw new console.error("Error al editar");

                }

                Swal.fire('¡Actualizado!', 'El estudiante ha sido actualizado correctamente', 'success');
                navigate('/estudiantes');
            } else {
                // Lógica para creación

                const respuesta = await fetch(`${API_ULR}/crear-estudiante`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData)
                });
                if (!respuesta.ok) {
                    console.log("ERROR AL REGISTRAR ESTUDIANTE")
                }

                Swal.fire('¡Registrado!', 'El estudiante ha sido registrado correctamente', 'success');
                setFormData(initialState); // Resetear formulario
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', error.response?.data?.message || 'Ocurrió un error', 'error');
        }
    };

    if (loading) {
        return <div className="container text-center mt-5">Cargando datos del estudiante...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>{isEdit ? 'Editar Estudiante' : 'Registrar Nuevo Estudiante'}</h2>

            <div className="mb-2 d-flex justify-content-end">
                <button className="btn btn-dark"
                    onClick={() => navigate("/mostrar-estudiantes")}
                >Regresar a Estudiantes</button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Sección del Estudiante */}
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h4>Datos del Estudiante</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombres</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.student.nombres}
                                    onChange={handleChange('student', 'nombres')}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Apellidos</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.student.apellidos}
                                    onChange={handleChange('student', 'apellidos')}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.student.fechaNacimiento}
                                    onChange={handleChange('student', 'fechaNacimiento')}
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Género</label>
                                <select
                                    className="form-select"
                                    value={formData.student.genero}
                                    onChange={handleChange('student', 'genero')}
                                    required
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Cedula Escolar</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.student.cedulaEscolar}
                                    onChange={handleChange('student', 'cedulaEscolar')}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Tipo de Cedula</label>
                                <select
                                    className="form-select"
                                    value={formData.student.tipoCedula}
                                    onChange={handleChange('student', 'tipoCedula')}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Venezolana">Venezolana</option>
                                    <option value="Extranjero">Extranjero</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Cedula</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.student.cedula}
                                    onChange={handleChange('student', 'cedula')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección del Representante */}
                <div className="card mb-4">
                    <div className="card-header bg-success text-white">
                        <h4>Datos del Representante</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombres</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.guardian.nombres}
                                    onChange={handleChange('guardian', 'nombres')}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Apellidos</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.guardian.apellidos}
                                    onChange={handleChange('guardian', 'apellidos')}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Tipo de Cedula</label>
                                <select
                                    className="form-select"
                                    value={formData.guardian.tipoCedula}
                                    onChange={handleChange('guardian', 'tipoCedula')}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Venezolana">Venezolana</option>
                                    <option value="Extranjero">Extranjero</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Cedula</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.guardian.cedula}
                                    onChange={handleChange('guardian', 'cedula')}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Parentesco</label>
                                <select
                                    className="form-select"
                                    value={formData.guardian.relacion}
                                    onChange={handleChange('guardian', 'relacion')}
                                    required
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Padre">Padre</option>
                                    <option value="Madre">Madre</option>
                                    <option value="Tutor">Tutor</option>
                                    <option value="tio-tia">Tio - Tia</option>
                                    <option value="abuelo-abuela">Abuela - Abuelo</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Teléfono</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={formData.guardian.phone}
                                    onChange={handleChange('guardian', 'phone')}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.guardian.email}
                                    onChange={handleChange('guardian', 'email')}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Ocupación</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.guardian.ocupacion}
                                    onChange={handleChange('guardian', 'ocupacion')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-lg w-25 mb-3 m-auto">
                        {isEdit ? 'Actualizar Estudiante' : 'Registrar Estudiante'}
                    </button>
                    {isEdit && (
                        <button
                            type="button"
                            className="btn btn-outline-secondary w-25 m-auto"
                            onClick={() => navigate('/estudiantes')}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default StudentForm;