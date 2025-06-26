import React, { useState } from 'react';
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const AsistenciaExporter = ({ data }) => {
    const [showConfig, setShowConfig] = useState(false);
    const [numDias, setNumDias] = useState(30);
    const [inicioMes, setInicioMes] = useState(true);
    const [excluirFinSemana, setExcluirFinSemana] = useState(true);
    const [colorBorde, setColorBorde] = useState('FF0000'); // Rojo por defecto

    const exportAsistencia = () => {
        if (!data?.estudiantes?.length) {
            alert('No hay estudiantes para generar la lista');
            return;
        }

        try {
            const wb = XLSX.utils.book_new();
            const today = new Date().toISOString().split('T')[0];
            const diasSemana = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

            // Calcular días a mostrar
            let diasMostrar = [];
            for (let i = 1; i <= numDias; i++) {
                const diaSemana = diasSemana[(i - 1) % 7];
                if (!excluirFinSemana || (diaSemana !== 'S' && diaSemana !== 'D')) {
                    diasMostrar.push({ diaNum: i, diaSemana });
                }
            }

            // Crear matriz de datos
            const wsData = [];

            // Fila 1: Título
            wsData.push([`Lista de Asistencia - ${data.nombre} ${data.seccion}`]);

            // Fila 2: Encabezado de fechas
            const fechaHeader = ['N°', 'Apellidos', 'Nombres'];
            diasMostrar.forEach(dia => {
                fechaHeader.push(`${dia.diaSemana}\n${dia.diaNum}`);
            });
            fechaHeader.push('Observaciones');
            wsData.push(fechaHeader);

            // Fila 3: Espacio para escribir fechas
            const fechaRow = ['', '', 'Fechas:'];
            diasMostrar.forEach(() => fechaRow.push(''));
            fechaRow.push('');
            wsData.push(fechaRow);

            // Filas de estudiantes
            data.estudiantes.forEach((estudiante, index) => {
                const studentRow = [
                    index + 1,
                    estudiante.apellidos,
                    estudiante.nombres
                ];

                // Añadir celdas vacías para cada día
                diasMostrar.forEach(() => studentRow.push(''));

                studentRow.push(''); // Observaciones
                wsData.push(studentRow);
            });

            // Crear hoja de cálculo
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            // Configurar anchos de columnas
            const colWidths = [
                { wch: 5 },   // N°
                { wch: 20 },  // Apellidos
                { wch: 20 }   // Nombres
            ];

            // Anchura para días y observaciones
            diasMostrar.forEach(() => colWidths.push({ wch: 6 }));
            colWidths.push({ wch: 30 }); // Observaciones

            ws['!cols'] = colWidths;

            // Combinar celdas del título
            ws['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 3 + diasMostrar.length } }
            ];

            // Aplicar bordes y estilos
            const range = XLSX.utils.decode_range(ws['!ref']);

            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
                    if (!cell) continue;

                    // Aplicar bordes a todas las celdas
                    cell.s = cell.s || {};
                    cell.s.border = {
                        top: { style: 'thin', color: { rgb: colorBorde } },
                        left: { style: 'thin', color: { rgb: colorBorde } },
                        bottom: { style: 'thin', color: { rgb: colorBorde } },
                        right: { style: 'thin', color: { rgb: colorBorde } }
                    };

                    // Estilo para encabezados
                    if (R === 1) {
                        cell.s.fill = { fgColor: { rgb: "D3D3D3" } }; // Gris claro
                        cell.s.font = { bold: true };
                        cell.s.alignment = { wrapText: true, vertical: 'center', horizontal: 'center' };
                    }
                }
            }

            // Agregar hoja al libro
            XLSX.utils.book_append_sheet(wb, ws, "Asistencia");

            // Generar archivo
            XLSX.writeFile(wb, `Asistencia_${data.nombre}_${data.seccion}_${today}.xlsx`);

        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar el archivo');
        }
    };

    return (
        <>
            <Button
                variant="warning"
                onClick={() => setShowConfig(true)}
                className="me-2"
            >
                <i className="bi bi-clipboard-check me-2"></i>Exportar Asistencia
            </Button>

            <Modal show={showConfig} onHide={() => setShowConfig(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Configurar Lista de Asistencia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Tipo de lista:</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        label={inicioMes ? "Mes completo" : "Semana"}
                                        checked={inicioMes}
                                        onChange={() => setInicioMes(!inicioMes)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Excluir fines de semana:</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        checked={excluirFinSemana}
                                        onChange={() => setExcluirFinSemana(!excluirFinSemana)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {inicioMes && (
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Número de días (1-31):</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={numDias}
                                            onChange={(e) => setNumDias(Math.min(31, Math.max(1, e.target.value)))}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Color del borde:</Form.Label>
                                        <Form.Control
                                            type="color"
                                            value={`#${colorBorde}`}
                                            onChange={(e) => setColorBorde(e.target.value.substring(1))}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}
                    </Form>

                    <div className="mt-3 p-3 border rounded">
                        <h6>Vista previa de configuración:</h6>
                        <p>• {inicioMes ? `Mes completo (${numDias} días)` : 'Semana (7 días)'}</p>
                        <p>• {excluirFinSemana ? 'Excluyendo Sábados y Domingos' : 'Incluyendo fines de semana'}</p>
                        <p>• Color de borde: <span style={{
                            display: 'inline-block',
                            width: '20px',
                            height: '20px',
                            backgroundColor: `#${colorBorde}`,
                            border: '1px solid #000'
                        }}></span></p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfig(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setShowConfig(false);
                        exportAsistencia();
                    }}>
                        Generar Lista
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AsistenciaExporter;