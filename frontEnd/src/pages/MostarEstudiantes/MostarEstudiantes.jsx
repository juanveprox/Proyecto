import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_ULR } from "../../auth/constURL"
import { FaEdit } from "react-icons/fa";

import { exportToExcel, exportToPDF } from '../../utils/exportUtils';


const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'apellidos',
        sortOrder: 'asc'
    });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const { page, limit } = pagination;
                const { search, sortBy, sortOrder } = filters;

                const response = await axios.get(`${API_ULR}/estudiantes/buscar-todos/`, {
                    params: { page, limit, search, sortBy, sortOrder }
                });




                setStudents(response.data.data);
                setPagination({
                    ...pagination,
                    total: response.data.pagination.total,
                    totalPages: response.data.pagination.totalPages
                });
            } catch (error) {
                console.error('Error fetching students:', error);
                alert('Error al cargar estudiantes');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [pagination.page, pagination.limit, filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Resetear a página 1 al realizar nueva búsqueda
        setPagination({ ...pagination, page: 1 });
    };

    const handleSort = (column) => {
        setFilters({
            ...filters,
            sortBy: column,
            sortOrder: filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc'
        });
    };
    const handleExportExcel = () => {
        // Si hay filtros aplicados, exportar solo los visibles
        if (students.length > 0 && students.length < pagination.total) {
            exportToExcel(students, `estudiantes-filtrados-pagina-${pagination.page}`);
            return;
        }

        // Si no hay filtros, obtener todos los datos para exportar
        setLoading(true);
        axios.get(`${API_ULR}/estudiantes/buscar-todos/`, {
            params: { limit: 10000 } // Número grande para obtener todos
        })
            .then(response => {
                exportToExcel(response.data.data, 'todos-los-estudiantes');
            })
            .catch(error => {
                console.error('Error exportando a Excel:', error);
                alert('Error al exportar a Excel');
            })
            .finally(() => setLoading(false));
    };

    const handleExportPDF = () => {
        // Exportar la página actual a PDF
        exportToPDF(students, `estudiantes-pagina-${pagination.page}`);
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3>Listado de Estudiantes</h3><button
                        onClick={handleExportExcel}
                        className="btn btn-success me-2"
                        disabled={loading}
                        title="Exportar a Excel"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                    >
                        <i className="bi bi-file-earmark-excel"></i>Importar en Excel
                        <span className="visually-hidden">Exportar a Excel</span>
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="btn btn-danger"
                        disabled={loading}
                        title="Exportar a PDF"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                    >
                        <i className="bi bi-file-earmark-pdf"></i> Importar en  PDF
                        <span className="visually-hidden">Exportar a PDF</span>
                    </button>
                </div>


                <div className="card-body">
                    {/* Barra de búsqueda y filtros */}
                    <div className="row mb-4">
                        <div className="col-md-8">
                            <form onSubmit={handleSearch}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar estudiantes o representantes..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    />
                                    <button className="btn btn-outline-secondary" type="submit">
                                        Buscar
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-4 text-end">
                            <Link to="/crear-estudiante" className="btn btn-success">
                                <i className="bi bi-plus-circle"></i> Nuevo Estudiante
                            </Link>
                        </div>
                    </div>

                    {/* Tabla de resultados */}
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p>Cargando estudiantes...</p>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort('cedula_escolar')}>
                                                Cédula Escolar {filters.sortBy === 'cedula_escolar' && (
                                                    <i className={`bi bi-caret-${filters.sortOrder === 'asc' ? 'up' : 'down'}-fill`}></i>
                                                )}
                                            </th>
                                            <th onClick={() => handleSort('apellidos')}>
                                                Apellidos {filters.sortBy === 'apellidos' && (
                                                    <i className={`bi bi-caret-${filters.sortOrder === 'asc' ? 'up' : 'down'}-fill`}></i>
                                                )}
                                            </th>
                                            <th onClick={() => handleSort('nombres')}>
                                                Nombres {filters.sortBy === 'nombres' && (
                                                    <i className={`bi bi-caret-${filters.sortOrder === 'asc' ? 'up' : 'down'}-fill`}></i>
                                                )}
                                            </th>
                                            <th>Cédula</th>
                                            <th>Género</th>
                                            <th>Representante</th>
                                            <th>Teléfono</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.length > 0 ? (
                                            students.map((student) => (
                                                <tr key={student.id}>
                                                    <td>{student.cedula_escolar}</td>
                                                    <td>{student.apellidos}</td>
                                                    <td>{student.nombres}</td>
                                                    <td>{student.cedula}</td>
                                                    <td>{student.genero}</td>
                                                    <td>{`${student.rep_nombres} ${student.rep_apellidos}`}</td>
                                                    <td>{student.rep_telefono}</td>
                                                    <td>
                                                        <Link
                                                            to={`/editar-estudiante/${student.id}`}
                                                            className="btn btn-sm btn-warning me-2"
                                                        >
                                                            <FaEdit />

                                                        </Link>
                                                        {/* <Link
                                                            to={`/ver/${student.id}`}
                                                            className="btn btn-sm btn-info"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </Link> */}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center">No se encontraron estudiantes</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {pagination.totalPages > 1 && (
                                <nav>
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                            >
                                                Anterior
                                            </button>
                                        </li>

                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (pagination.totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (pagination.page <= 3) {
                                                pageNum = i + 1;
                                            } else if (pagination.page >= pagination.totalPages - 2) {
                                                pageNum = pagination.totalPages - 4 + i;
                                            } else {
                                                pageNum = pagination.page - 2 + i;
                                            }

                                            return (
                                                <li
                                                    key={pageNum}
                                                    className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPagination({ ...pagination, page: pageNum })}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                </li>
                                            );
                                        })}

                                        <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                            >
                                                Siguiente
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}

                            <div className="text-muted text-center">
                                Mostrando {students.length} de {pagination.total} estudiantes
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentList;



