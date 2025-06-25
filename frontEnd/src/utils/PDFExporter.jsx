import React from 'react';
import { Button } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'
import autoTable from 'jspdf-autotable';

const PDFExporter = ({ data }) => {



    const exportToPDF = () => {
        const doc = new jsPDF();
        // Registrar autoTable manualmente
        doc.autoTable = autoTable;
        if (!data) {
            console.error('No hay datos para exportar');
            return;
        }

        try {
            // Inicializar jsPDF con autotable
            const doc = new jsPDF();

            // Configuración del documento
            doc.setProperties({
                title: `Grado ${data.nombre} Sección ${data.seccion}`,
                subject: 'Información del grado',
                author: 'Sistema Académico',
                keywords: 'grado, estudiantes, profesor',
                creator: 'Tu Aplicación'
            });

            // Título
            doc.setFontSize(18);
            doc.text(`Grado ${data.nombre} Sección ${data.seccion}`, 14, 15);

            // Información del profesor
            doc.setFontSize(12);
            doc.text('Profesor Asignado:', 14, 25);
            if (data.profesor_nombre) {
                doc.text(`Nombre: ${data.profesor_nombre} ${data.profesor_apellido}`, 14, 30);
                doc.text(`Cédula: ${data.profesor_cedula}`, 14, 35);
                doc.text(`Teléfono: ${data.profesor_telefono}`, 14, 40);
            } else {
                doc.text('No asignado', 14, 30);
            }

            // Tabla de estudiantes
            doc.text(`Estudiantes (${data.estudiantes.length}):`, 14, 50);

            if (data.estudiantes.length > 0) {
                const headers = [['#', 'Nombres', 'Apellidos', 'Cédula Escolar', 'Fecha Nacimiento', 'Género']];
                const dataForTable = data.estudiantes.map((estudiante, index) => [
                    index + 1,
                    estudiante.nombres,
                    estudiante.apellidos,
                    estudiante.cedula_escolar,
                    new Date(estudiante.fecha_nacimiento).toLocaleDateString(),
                    estudiante.genero
                ]);

                // Usar autoTable del plugin
                doc.autoTable({
                    startY: 55,
                    head: headers,
                    body: dataForTable,
                    theme: 'grid',
                    headStyles: { fillColor: [41, 128, 185] },
                    styles: { fontSize: 9 },
                    margin: { top: 60 }
                });
            }

            doc.save(`Grado_${data.nombre}_Seccion_${data.seccion}.pdf`);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Ocurrió un error al generar el PDF');
        }
    };

    return (
        <Button variant="danger" onClick={exportToPDF} className="me-2">
            Exportar a PDF
        </Button>
    );
};

export default PDFExporter;