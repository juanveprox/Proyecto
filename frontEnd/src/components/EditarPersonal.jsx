import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_ULR } from '../auth/constURL';

const EditarPersonal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [personal, setPersonal] = useState({
        id: '',
        tipo: '',
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        cedula: '',
        telefono: '',
        correo: '',
        fecha_nacimiento: '',
        sexo: '',
        cargo_voucher: '',
        codigo_cargo: '',
        dependencia: '',
        codigo_dependencia: '',
        carga_horaria: '',
        fecha_ingreso_mppe: '',
        titulos_profesionales: '',
        tipo_titulo: '',
        talla_franela: '',
        talla_pantalon: '',
        talla_zapato: '',
        archivos: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nuevoArchivo, setNuevoArchivo] = useState(null);

    useEffect(() => {
        const fetchPersonal = async () => {
            try {
                const response = await axios.get(`${API_ULR}/personal/${id}`);
                setPersonal(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar la información del personal',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchPersonal();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonal(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setNuevoArchivo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Agregar campos del formulario
            Object.keys(personal).forEach(key => {
                if (key !== 'archivos') {
                    formData.append(key, personal[key]);
                }
            });

            // Agregar archivo si existe
            if (nuevoArchivo) {
                formData.append('archivos', nuevoArchivo);
            }


            await axios.put(`${API_ULR}/personal/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            await Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Los cambios se guardaron correctamente',
                confirmButtonText: 'OK'
            });

            navigate(`/${personal.tipo}s`);
        } catch (err) {
            setError(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron guardar los cambios',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDeleteFile = async (fileId) => {
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
            try {
                await axios.delete(`${API_ULR}/personal/${id}/archivos/${fileId}`);
                setPersonal(prev => ({
                    ...prev,
                    archivos: prev.archivos.filter(file => file.id !== fileId)
                }));

                await Swal.fire(
                    '¡Eliminado!',
                    'El archivo ha sido eliminado.',
                    'success'
                );
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el archivo',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger m-3" role="alert">
            Error: {error}
        </div>
    );

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Editar Personal</h1>

            <form onSubmit={handleSubmit}>
                {/* Información Básica */}
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h2 className="h5 mb-0">Información Básica</h2>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Primer Nombre</label>
                                <input
                                    type="text"
                                    name="primer_nombre"
                                    value={personal.primer_nombre}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Segundo Nombre</label>
                                <input
                                    type="text"
                                    name="segundo_nombre"
                                    value={personal.segundo_nombre}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Primer Apellido</label>
                                <input
                                    type="text"
                                    name="primer_apellido"
                                    value={personal.primer_apellido}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Segundo Apellido</label>
                                <input
                                    type="text"
                                    name="segundo_apellido"
                                    value={personal.segundo_apellido}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Cédula</label>
                                <input
                                    type="text"
                                    name="cedula"
                                    value={personal.cedula}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={personal.telefono}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Correo</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={personal.correo}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={personal.fecha_nacimiento.split('T')[0]}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Sexo</label>
                                <select
                                    name="sexo"
                                    value={personal.sexo}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información Laboral */}
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h2 className="h5 mb-0">Información Laboral</h2>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Cargo</label>
                                <input
                                    type="text"
                                    name="cargo_voucher"
                                    value={personal.cargo_voucher}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Código de Cargo</label>
                                <input
                                    type="text"
                                    name="codigo_cargo"
                                    value={personal.codigo_cargo}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Dependencia</label>
                                <input
                                    type="text"
                                    name="dependencia"
                                    value={personal.dependencia}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Código de Dependencia</label>
                                <input
                                    type="text"
                                    name="codigo_dependencia"
                                    value={personal.codigo_dependencia}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Carga Horaria</label>
                                <input
                                    type="text"
                                    name="carga_horaria"
                                    value={personal.carga_horaria}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Fecha de Ingreso</label>
                                <input
                                    type="date"
                                    name="fecha_ingreso_mppe"
                                    value={personal.fecha_ingreso_mppe.split('T')[0]}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información Adicional */}
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h2 className="h5 mb-0">Información Adicional</h2>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Títulos Profesionales</label>
                                <input
                                    type="text"
                                    name="titulos_profesionales"
                                    value={personal.titulos_profesionales}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Tipo de Título</label>
                                <select
                                    name="tipo_titulo"
                                    value={personal.tipo_titulo}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="pregrado">Pregrado</option>
                                    <option value="posgrado">Posgrado</option>
                                </select>

                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Talla Franela</label>
                                <input
                                    type="text"
                                    name="talla_franela"
                                    value={personal.talla_franela}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Talla Pantalón</label>
                                <input
                                    type="text"
                                    name="talla_pantalon"
                                    value={personal.talla_pantalon}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Talla Zapato</label>
                                <input
                                    type="text"
                                    name="talla_zapato"
                                    value={personal.talla_zapato}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Archivos Adjuntos */}
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h2 className="h5 mb-0">Archivos Adjuntos</h2>
                    </div>
                    <div className="card-body">
                        {(!personal.archivos || personal.archivos.length < 3) && (
                            <div className="mb-3">
                                <label className="form-label">Agregar Nuevo Archivo</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="form-control"
                                    // Opcional: deshabilitar si ya hay 3 archivos
                                    disabled={personal.archivos?.length >= 3}
                                />
                                {personal.archivos?.length >= 3 && (
                                    <small className="text-muted">Máximo 3 archivos permitidos</small>
                                )}
                            </div>
                        )}

                        {personal.archivos && personal.archivos.length > 0 ? (
                            <div className="list-group">
                                {personal.archivos.map(file => (
                                    <div key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-decoration-none"
                                            >
                                                {file.nombre_archivo}
                                            </a>
                                            <span className="ms-2 text-muted small">({file.tipo_archivo})</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteFile(file.id)}
                                            className="btn btn-sm btn-outline-danger"
                                        >
                                            <i className="bi bi-trash"></i> Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">No hay archivos adjuntos</p>
                        )}
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mb-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/${personal.tipo}s`)}
                        className="btn btn-secondary"
                    >
                        <i className="bi bi-x-circle me-1"></i> Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        <i className="bi bi-save me-1"></i> Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarPersonal;