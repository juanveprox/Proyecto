import React, { useState } from 'react';
// import axios from 'axios';
import Swal from 'sweetalert2';
import { API_ULR } from "../auth/constURL"
import { useNavigate } from 'react-router-dom';

const StudentSearch = () => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState('cedula'); // 'cedula' o 'escolar'
    const [searchValue, setSearchValue] = useState('');
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchValue.trim()) {
            Swal.fire('Error', 'Debe ingresar un valor para buscar', 'error');
            return;
        }

        setLoading(true);

        try {
            const params = {};
            if (searchType === 'cedula') {
                params.cedula = searchValue;
            } else {
                params.cedula_escolar = searchValue;
            }


            const response = await fetch(`${API_ULR}/buscar-estudiante`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params)
            });

            const respuesta = await response.json()

            if (respuesta.success) {
                setStudent(respuesta.data);
            } else {
                Swal.fire('No encontrado', response.data.message, 'info');
                setStudent(null);
            }
        } catch (error) {
            console.error('Error buscando estudiante:', error);
            Swal.fire('Error', error.response?.data?.message || 'Error al buscar estudiante', 'error');
            setStudent(null);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        ///${student.id}
        navigate(`/editar-estudiante/${student.id}`);
    };

    const handleDelete = async () => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esta acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                console.log(student.id)
                await fetch(`${API_ULR}/eliminar-estudiante/${student.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', }
                });

                Swal.fire(
                    '¡Eliminado!',
                    'El estudiante ha sido eliminado.',
                    'success'
                );

                // Limpiar resultados después de eliminar
                setStudent(null);
                setSearchValue('');
            }
        } catch (error) {
            console.error('Error eliminando estudiante:', error);
            Swal.fire(
                'Error',
                error.response?.data?.message || 'No se pudo eliminar el estudiante',
                'error'
            );
        }
    };


    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h3>Buscar Estudiante</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSearch}>
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                >
                                    <option value="cedula">Cédula</option>
                                    <option value="escolar">Cédula Escolar</option>
                                </select>
                            </div>
                            <div className="col-md-7">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={`Ingrese ${searchType === 'cedula' ? 'cédula (Ej: 12345678)' : 'cédula escolar (Ej: 11323120501)'}`}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Buscando...
                                        </>
                                    ) : 'Buscar'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {student && (
                        <div className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Resultados de la Búsqueda</h4>
                                <div>
                                    <button
                                        onClick={handleEdit}
                                        className="btn btn-warning me-2"
                                    >
                                        <i className="bi bi-pencil-square"></i> Editar
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="btn btn-danger"
                                    >
                                        <i className="bi bi-trash"></i> Eliminar
                                    </button>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header bg-info text-white">
                                    Datos del Estudiante
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Nombres:</strong> {student.nombres}</p>
                                            <p><strong>Apellidos:</strong> {student.apellidos}</p>
                                            <p><strong>Cédula:</strong> {student.cedula || 'N/A'}</p>
                                            <p><strong>Cédula Escolar:</strong> {student.cedula_escolar || 'N/A'}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Fecha Nacimiento:</strong> {new Date(student.fecha_nacimiento).toLocaleDateString()}</p>
                                            <p><strong>Género:</strong> {student.genero}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card mt-3">
                                <div className="card-header bg-secondary text-white">
                                    Datos del Representante
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Nombres:</strong> {student.rep_nombres}</p>
                                            <p><strong>Apellidos:</strong> {student.rep_apellidos}</p>
                                            <p><strong>Cédula:</strong> {student.rep_cedula || 'N/A'}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Teléfono:</strong> {student.rep_telefono}</p>
                                            <p><strong>Email:</strong> {student.email || 'N/A'}</p>
                                            <p><strong>Ocupación:</strong> {student.ocupacion || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentSearch;
