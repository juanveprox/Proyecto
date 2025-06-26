import React from 'react';
import { Button } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PDFAsistenciaMensual = ({ data, config = {} }) => {
    const {
        borderColor = '#000000',
        headerBgColor = '#d3d3d3',
        fechaInicio = new Date()
    } = config;

    const generarPDF = () => {
        if (!data || !data.estudiantes || data.estudiantes.length === 0) {
            alert('No hay datos de estudiantes para generar la lista');
            return;
        }

        try {
            // Configuración inicial del documento
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // Convertir colores HEX a RGB
            const hexToRgb = (hex) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return [r, g, b];
            };

            const borderRgb = hexToRgb(borderColor);
            const headerRgb = hexToRgb(headerBgColor);

            // Configurar 4 semanas (20 días laborables)
            const semanas = [];
            let fechaActual = new Date(fechaInicio);
            const diasSemana = ['L', 'M', 'M', 'J', 'V'];

            // Generar 4 semanas de 5 días cada una
            for (let semana = 0; semana < 4; semana++) {
                const dias = [];

                for (let dia = 0; dia < 5; dia++) {
                    dias.push({
                        diaNum: fechaActual.getDate(),
                        diaSemana: diasSemana[dia],
                        fecha: new Date(fechaActual)
                    });
                    fechaActual.setDate(fechaActual.getDate() + 1);
                }

                semanas.push({
                    numero: semana + 1,
                    dias: dias
                });
            }

            // Preparar estructura de la tabla
            const headers = [
                { title: 'N°', dataKey: 'index' },
                { title: 'Apellidos', dataKey: 'apellidos' },
                { title: 'Nombres', dataKey: 'nombres' }
            ];

            // Agregar encabezados para semanas y días
            semanas.forEach((semana, i) => {
                headers.push({
                    title: `Semana`,
                    colSpan: 5,
                    dataKey: `semana_${semana.numero}`
                });

                semana.dias.forEach(dia => {
                    headers.push({
                        title: dia.diaSemana,
                    });
                });
            });


            // Crear filas de estudiantes
            const bodyData = data.estudiantes.map((estudiante, index) => {
                const row = {
                    index: index + 1,
                    apellidos: estudiante.apellidos,
                    nombres: estudiante.nombres,
                    observaciones: ''
                };

                semanas.forEach(semana => {
                    semana.dias.forEach(dia => {
                        row[`dia_${dia.diaNum}`] = '';
                    });
                });

                return row;
            });

            // Agregar fila de fechas
            const fechaRow = {
                index: '',
                apellidos: '',
                nombres: 'Fechas:',
                observaciones: ''
            };

            semanas.forEach(semana => {
                semana.dias.forEach(dia => {
                    fechaRow[`dia_${dia.diaNum}`] = dia.fecha.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit'
                    });
                });
            });

            bodyData.unshift(fechaRow);

            // Agregar título
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(`Lista de Asistencia Mensual - ${data.nombre} ${data.seccion}`, 14, 15);

            // Generar tabla
            autoTable(doc, {
                startY: 25,
                head: [headers.map(h => h.title)],
                body: bodyData.map(row => headers.map(header => row[header.dataKey])),
                headStyles: {
                    fillColor: headerRgb,
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    halign: 'center',
                    valign: 'middle'
                },
                bodyStyles: {
                    halign: 'center',
                    valign: 'middle'
                },
                styles: {
                    cellPadding: 2,
                    fontSize: 8, // Tamaño más pequeño para caber todo
                    lineColor: borderRgb,
                    lineWidth: 0.2
                },
                columnStyles: {
                    0: { cellWidth: 8 },  // Columna N°
                    1: { cellWidth: 25 }, // Apellidos
                    2: { cellWidth: 25 }, // Nombres
                },
                didParseCell: (data) => {
                    // Estilo para fila de fechas
                    if (data.row.index === 0) {
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.fillColor = [220, 220, 220]; // Gris claro
                    }

                    // Estilo para encabezados de semana
                    if (data.column.index >= 3 && data.column.index % 6 === 3) {
                        data.cell.styles.fillColor = [200, 200, 255]; // Azul claro
                    }

                    // Centrar contenido
                    data.cell.styles.halign = 'center';
                    data.cell.styles.valign = 'middle';
                },
                didDrawCell: (data) => {
                    // Combinar celdas de encabezado de semana
                    if (data.section === 'head' && data.column.index >= 3 && data.column.index % 6 === 3) {
                        doc.rect(
                            data.cell.x,
                            data.cell.y,
                            data.cell.width * 5,
                            data.cell.height,
                            'S'
                        );
                    }
                }
            });

            // Guardar el PDF
            doc.save(`Asistencia_Mensual_${data.nombre}_${data.seccion}.pdf`);

        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Ocurrió un error al generar el PDF. Verifica la consola para más detalles.');
        }
    };

    return (
        <Button
            variant="primary"
            onClick={generarPDF}
            className="me-2"
            disabled={!data?.estudiantes?.length}
        >
            <i className="bi bi-calendar-month me-2"></i>Exportar Asistencia
        </Button>
    );
};

export default PDFAsistenciaMensual;