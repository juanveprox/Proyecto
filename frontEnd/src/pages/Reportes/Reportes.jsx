import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUpload, FaFilePdf, FaFileWord, FaFileExcel, FaTimes, FaInfoCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { URL_CORTA, API_ULR } from '../../auth/constURL';
import { useNavigate } from 'react-router-dom';




const Reportes = () => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const navigate = useNavigate()
    // Cargar archivos al montar el componente
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${API_ULR}/files`);
                setUploadedFiles(response.data.data || []);
            } catch (error) {
                console.error('Error cargando archivos:', error);
            }
        };

        fetchFiles();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validaciones
        const allowedExtensions = /(\.pdf|\.docx?|\.xlsx?|\.csv)$/i;
        if (!allowedExtensions.exec(selectedFile.name)) {
            Swal.fire('Error', 'Formato de archivo no permitido', 'error');
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            Swal.fire('Error', 'El archivo no puede ser mayor a 5MB', 'error');
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            Swal.fire('Error', 'Por favor selecciona un archivo', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);

        try {
            setIsUploading(true);
            setUploadProgress(0);

            const response = await axios.post(`${API_ULR}/upload`, formData, {
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

            Swal.fire('Éxito', 'Archivo subido correctamente', 'success');

            // Actualizar lista de archivos

            setUploadedFiles(prev => [
                {
                    ...response.data.file,
                    nombre_original: file.name, // Usa el nombre original del archivo subido
                    size: file.size, // Añade el tamaño si es necesario
                    created_at: new Date().toISOString() // Añade la fecha actual
                },
                ...prev
            ]);

            // Resetear formulario
            setFile(null);
            setDescription('');
            document.getElementById('fileInput').value = '';
        } catch (error) {
            console.error('Error subiendo archivo:', error);
            Swal.fire('Error', error.response?.data?.message || 'Error al subir el archivo', 'error');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const removeFile = () => {
        setFile(null);
        document.getElementById('fileInput').value = '';
    };


    const downloadFile = (storedName, originalName) => {
        window.open(`${URL_CORTA}/uploads/${storedName}`, '_blank');
    };


    const deleteFile = async (fileId, storedName) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esta acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await axios.delete(`${API_ULR}/files/${fileId}`);

                // Actualizar la lista de archivos
                setUploadedFiles(prev => prev.filter(file => file.id !== fileId));

                Swal.fire(
                    '¡Eliminado!',
                    'El archivo ha sido eliminado.',
                    'success'
                );
            }
        } catch (error) {
            console.error('Error eliminando archivo:', error);
            Swal.fire(
                'Error',
                error.response?.data?.message || 'No se pudo eliminar el archivo',
                'error'
            );
        }
    };
    const getFileIcon = (fileName) => {

        if (!fileName || typeof fileName !== 'string') {

            return <FaUpload />; // O cualquier icono por defecto

        }

        const ext = fileName.split('.').pop().toLowerCase();
        switch (ext) {
            case 'pdf': return <FaFilePdf className="text-danger" />;
            case 'docx': case 'doc': return <FaFileWord className="text-primary" />;
            case 'xlsx': case 'xls': case 'csv': return <FaFileExcel className="text-success" />;
            default: return <FaUpload />;
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h4>Subir Archivos con Descripción</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="fileInput" className="form-label">
                                Selecciona un archivo (PDF, Word, Excel)
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                                required
                            />
                            <div className="form-text">
                                Formatos aceptados: PDF, Word (.doc, .docx), Excel (.xls, .xlsx, .csv) - Máx. 5MB
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                <FaInfoCircle className="me-2" />
                                Descripción del archivo (opcional)
                            </label>
                            <textarea
                                id="description"
                                className="form-control"
                                rows="2"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ej: Documento de contratos del primer trimestre 2023"
                            />
                        </div>

                        {file && (
                            <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    {getFileIcon(file.name)}
                                    <span className="ms-2">{file.name}</span>
                                    <span className="ms-2 text-muted">({(file.size / 1024).toFixed(2)} KB)</span>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={removeFile}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}

                        {isUploading && (
                            <div className="mb-3">
                                <div className="progress">
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style={{ width: `${uploadProgress}%` }}
                                    >
                                        {uploadProgress}%
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!file || isUploading}
                        >
                            {isUploading ? 'Subiendo...' : 'Subir Archivo'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Lista de archivos subidos */}
            <div className="card mt-4">
                <div className="card-header bg-secondary text-white">
                    <h5>Archivos Subidos</h5>
                </div>
                <div className="card-body">
                    {uploadedFiles.length === 0 ? (
                        <p className="text-muted">No hay archivos subidos aún</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Nombre</th>
                                        <th>Tamaño</th>
                                        <th>Descripción</th>
                                        <th>Fecha</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploadedFiles.map((file) => (
                                        <tr key={file.id}>
                                            <td>{getFileIcon(file.nombre_original)}</td>
                                            <td>{file.nombre_original}</td>
                                            <td>{(file.size / 1024).toFixed(2)} KB</td>
                                            <td>
                                                {file.description || (
                                                    <span className="text-muted">Sin descripción</span>
                                                )}
                                            </td>
                                            <td>
                                                {new Date(file.created_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary m-2"
                                                    onClick={() => { downloadFile(file.nombre_guardado, file.nombre_original) }
                                                    }
                                                >
                                                    Descargar
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteFile(file.id, file.nombre_guardado)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reportes;