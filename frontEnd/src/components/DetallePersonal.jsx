// import { Modal, Button, Row, Col, Tab, Tabs, Badge } from 'react-bootstrap';
// import PropTypes from 'prop-types';
// import { formatoFecha } from '../utils/formatoFecha';
// import { API_ULR } from '../auth/constURL';
// const DetallePersonal = ({ personal, show, onHide }) => {
//     if (!personal) return null;
//     console.log(personal.tipo)
//     return (
//         <Modal show={show} onHide={onHide} size="xl" centered>
//             <Modal.Header closeButton>
//                 <Modal.Title>
//                     Detalles de {personal.primer_nombre} {personal.primer_apellido}
//                     <Badge bg="info" className="ms-2">
//                         {personal.tipo}
//                     </Badge>
//                 </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Tabs defaultActiveKey="infoPersonal" className="mb-3">
//                     {/* Pestaña Información Personal */}
//                     <Tab eventKey="infoPersonal" title="Información Personal">
//                         <Row className="mb-3">
//                             <Col md={6}>
//                                 <h5>Datos Básicos</h5>
//                                 <p><strong>Cédula:</strong> {personal.cedula}</p>
//                                 <p><strong>Nombre Completo:</strong> {`${personal.primer_nombre} ${personal.segundo_nombre || ''} ${personal.primer_apellido} ${personal.segundo_apellido || ''}`}</p>
//                                 <p><strong>Fecha de Nacimiento:</strong> {formatoFecha(personal.fecha_nacimiento)}</p>
//                                 <p><strong>Sexo:</strong> {personal.sexo || 'No especificado'}</p>
//                             </Col>
//                             <Col md={6}>
//                                 <h5>Contacto</h5>
//                                 <p><strong>Teléfono:</strong> {personal.telefono || 'No especificado'}</p>
//                                 <p><strong>Correo Electrónico:</strong> {personal.correo || 'No especificado'}</p>
//                             </Col>
//                         </Row>
//                     </Tab>

//                     {/* Pestaña Información Laboral */}
//                     <Tab eventKey="infoLaboral" title="Información Laboral">
//                         <Row className="mb-3">
//                             <Col md={6}>
//                                 <h5>Datos Laborales</h5>
//                                 <p><strong>Cargo Voucher:</strong> {personal.cargo_voucher}</p>
//                                 <p><strong>Código de Cargo:</strong> {personal.codigo_cargo || 'No especificado'}</p>
//                                 <p><strong>Dependencia:</strong> {personal.dependencia}</p>
//                             </Col>
//                             <Col md={6}>
//                                 <p><strong>Código Dependencia:</strong> {personal.codigo_dependencia || 'No especificado'}</p>
//                                 <p><strong>Carga Horaria:</strong> {personal.carga_horaria || 'No especificado'}</p>
//                                 <p><strong>Fecha de Ingreso:</strong> {formatoFecha(personal.fecha_ingreso_mppe)}</p>
//                             </Col>
//                         </Row>
//                     </Tab>

//                     {/* Pestaña Titulaciones */}
//                     <Tab eventKey="titulaciones" title="Titulaciones">
//                         <Row>
//                             <Col>
//                                 <h5>Títulos Profesionales</h5>
//                                 <p>{personal.titulos_profesionales || 'No especificado'}</p>
//                                 <p><strong>Tipo de Título:</strong> {personal.tipo_titulo || 'No especificado'}</p>
//                             </Col>
//                         </Row>
//                     </Tab>

//                     {/* Pestaña Uniformes */}
//                     <Tab eventKey="uniformes" title="Uniformes">
//                         <Row>
//                             <Col>
//                                 <h5>Tallas</h5>
//                                 <p><strong>Franela:</strong> {personal.talla_franela || 'No especificado'}</p>
//                                 <p><strong>Pantalón:</strong> {personal.talla_pantalon || 'No especificado'}</p>
//                                 <p><strong>Zapato:</strong> {personal.talla_zapato || 'No especificado'}</p>
//                             </Col>
//                         </Row>
//                     </Tab>

//                     {/* Pestaña Archivos */}
//                     {personal.archivos && personal.archivos.length > 0 && (
//                         <Tab eventKey="archivos" title="Archivos">
//                             <Row>
//                                 <Col>
//                                     <h5>Documentos Adjuntos</h5>
//                                     <div className="row">
//                                         {personal.archivos.map((archivo) => (
//                                             <div key={archivo.id} className="col-md-4 mb-3">
//                                                 {archivo.tipo_archivo.startsWith('image/') ? (
//                                                     <div className="card">
//                                                         <img
//                                                             src={`${API_ULR}${archivo.url}`}
//                                                             alt={archivo.nombre_archivo}
//                                                             className="card-img-top img-thumbnail"
//                                                             style={{ maxHeight: '200px', objectFit: 'contain' }}
//                                                         />
//                                                         <div className="card-body">
//                                                             <p className="card-text small">
//                                                                 {archivo.nombre_archivo}
//                                                             </p>
//                                                             <a
//                                                                 href={archivo.url}
//                                                                 target="_blank"
//                                                                 rel="noopener noreferrer"
//                                                                 className="btn btn-sm btn-primary"
//                                                             >
//                                                                 Ver completo
//                                                             </a>
//                                                         </div>
//                                                     </div>
//                                                 ) : (
//                                                     <div className="card">
//                                                         <div className="card-body">
//                                                             <h5 className="card-title">{archivo.nombre_archivo}</h5>
//                                                             <p className="card-text">{archivo.tipo_archivo}</p>
//                                                             <a
//                                                                 href={archivo.url}
//                                                                 target="_blank"
//                                                                 rel="noopener noreferrer"
//                                                                 className="btn btn-primary"
//                                                             >
//                                                                 Descargar
//                                                             </a>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </Col>
//                             </Row>
//                         </Tab>
//                     )}
//                 </Tabs>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={onHide}>
//                     Cerrar
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// DetallePersonal.propTypes = {
//     personal: PropTypes.object,
//     show: PropTypes.bool.isRequired,
//     onHide: PropTypes.func.isRequired
// };

// export default DetallePersonal;


import { Modal, Button, Row, Col, Tab, Tabs, Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { formatoFecha } from '../utils/formatoFecha';
import { API_ULR } from '../auth/constURL';

const DetallePersonal = ({ personal, show, onHide }) => {
    if (!personal) return null;

    // Función para determinar si un archivo es una imagen
    const esImagen = (tipoArchivo) => {
        return tipoArchivo.startsWith('image/') || tipoArchivo === 'imagen';
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>
                    Detalles de {personal.primer_nombre} {personal.primer_apellido}
                    <Badge bg="info" className="ms-2">
                        {personal.tipo}
                    </Badge>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="infoPersonal" className="mb-3">
                    {/* Pestaña Información Personal */}
                    <Tab eventKey="infoPersonal" title="Información Personal">
                        <Row className="mb-3">
                            <Col md={6}>
                                <h5 className="text-primary">Datos Básicos</h5>
                                <p><strong>Cédula:</strong> {personal.cedula}</p>
                                <p><strong>Nombre Completo:</strong> {`${personal.primer_nombre} ${personal.segundo_nombre || ''} ${personal.primer_apellido} ${personal.segundo_apellido || ''}`}</p>
                                <p><strong>Fecha de Nacimiento:</strong> {formatoFecha(personal.fecha_nacimiento)}</p>
                                <p><strong>Sexo:</strong> {personal.sexo || 'No especificado'}</p>
                            </Col>
                            <Col md={6}>
                                <h5 className="text-primary">Contacto</h5>
                                <p><strong>Teléfono:</strong> {personal.telefono || 'No especificado'}</p>
                                <p><strong>Correo Electrónico:</strong> {personal.correo || 'No especificado'}</p>
                            </Col>
                        </Row>
                    </Tab>

                    {/* Pestaña Información Laboral */}
                    <Tab eventKey="infoLaboral" title="Información Laboral">
                        <Row className="mb-3">
                            <Col md={6}>
                                <h5 className="text-primary">Datos Laborales</h5>
                                <p><strong>Cargo Voucher:</strong> {personal.cargo_voucher}</p>
                                <p><strong>Código de Cargo:</strong> {personal.codigo_cargo || 'No especificado'}</p>
                                <p><strong>Dependencia:</strong> {personal.dependencia}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Código Dependencia:</strong> {personal.codigo_dependencia || 'No especificado'}</p>
                                <p><strong>Carga Horaria:</strong> {personal.carga_horaria || 'No especificado'}</p>
                                <p><strong>Fecha de Ingreso:</strong> {formatoFecha(personal.fecha_ingreso_mppe)}</p>
                            </Col>
                        </Row>
                    </Tab>

                    {/* Pestaña Titulaciones */}
                    <Tab eventKey="titulaciones" title="Titulaciones">
                        <Row>
                            <Col>
                                <h5 className="text-primary">Títulos Profesionales</h5>
                                <p>{personal.titulos_profesionales || 'No especificado'}</p>
                                <p><strong>Tipo de Título:</strong> {personal.tipo_titulo || 'No especificado'}</p>
                            </Col>
                        </Row>
                    </Tab>

                    {/* Pestaña Uniformes */}
                    <Tab eventKey="uniformes" title="Uniformes">
                        <Row>
                            <Col>
                                <h5 className="text-primary">Tallas</h5>
                                <p><strong>Franela:</strong> {personal.talla_franela || 'No especificado'}</p>
                                <p><strong>Pantalón:</strong> {personal.talla_pantalon || 'No especificado'}</p>
                                <p><strong>Zapato:</strong> {personal.talla_zapato || 'No especificado'}</p>
                            </Col>
                        </Row>
                    </Tab>

                    {/* Pestaña Archivos */}
                    {personal.archivos && personal.archivos.length > 0 && (
                        <Tab eventKey="archivos" title="Archivos">
                            <Row>
                                <Col>
                                    <h5 className="text-primary mb-4">Documentos Adjuntos</h5>
                                    <div className="row">
                                        {personal.archivos.map((archivo) => (
                                            <div key={archivo.id} className="col-md-4 mb-4">
                                                <div className="card h-100 shadow-sm">
                                                    {esImagen(archivo.tipo_archivo) ? (
                                                        <>
                                                            <div className="card-img-top d-flex align-items-center justify-content-center" style={{ height: '200px', overflow: 'hidden' }}>
                                                                <img
                                                                    src={`http://localhost:3000/api/uploads-personal/${archivo.nombre_archivo}`}
                                                                    alt={archivo.nombre_archivo}
                                                                    className="img-fluid"
                                                                    style={{
                                                                        maxHeight: '100%',
                                                                        width: 'auto',
                                                                        objectFit: 'contain'
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="card-body">
                                                                <h6 className="card-title text-truncate">{archivo.nombre_archivo}</h6>
                                                                <div className="d-grid gap-2">
                                                                    <a
                                                                        href={`http://localhost:3000/api/uploads-personal/${archivo.nombre_archivo}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="btn btn-sm btn-outline-primary"
                                                                    >
                                                                        Ver completo
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="card-body d-flex flex-column">
                                                            <div className="text-center py-3">
                                                                <i className="bi bi-file-earmark-text fs-1 text-secondary"></i>
                                                            </div>
                                                            <h6 className="card-title text-truncate">{archivo.nombre_archivo}</h6>
                                                            <p className="card-text small text-muted">{archivo.tipo_archivo}</p>
                                                            <div className="mt-auto d-grid gap-2">
                                                                <a
                                                                    href={`http://localhost:3000/api/uploads-personal/${archivo.nombre_archivo}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    download
                                                                >
                                                                    Descargar
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </Tab>
                    )}
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

DetallePersonal.propTypes = {
    personal: PropTypes.shape({
        id: PropTypes.number,
        primer_nombre: PropTypes.string,
        segundo_nombre: PropTypes.string,
        primer_apellido: PropTypes.string,
        segundo_apellido: PropTypes.string,
        cedula: PropTypes.string,
        telefono: PropTypes.string,
        correo: PropTypes.string,
        fecha_nacimiento: PropTypes.string,
        sexo: PropTypes.string,
        cargo_voucher: PropTypes.string,
        codigo_cargo: PropTypes.string,
        dependencia: PropTypes.string,
        codigo_dependencia: PropTypes.string,
        carga_horaria: PropTypes.string,
        fecha_ingreso_mppe: PropTypes.string,
        titulos_profesionales: PropTypes.string,
        tipo_titulo: PropTypes.string,
        talla_franela: PropTypes.string,
        talla_pantalon: PropTypes.string,
        talla_zapato: PropTypes.string,
        tipo: PropTypes.string,
        archivos: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                nombre_archivo: PropTypes.string,
                ruta_archivo: PropTypes.string,
                tipo_archivo: PropTypes.string,
                url: PropTypes.string
            })
        )
    }),
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired
};

export default DetallePersonal;