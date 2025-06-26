import React from 'react';
import { Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const ExcelExporter = ({ data }) => {
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();

        // Estilos para encabezados
        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "2A6099" } },
            alignment: { horizontal: "center" }
        };

        // Hoja de información
        const infoData = [
            ["INFORMACIÓN DEL GRADO", "", "", "", "", ""],
            ["Grado:", data.nombre, "", "", "", ""],
            ["Sección:", data.seccion, "", "", "", ""],
            [],
            ["PROFESOR ASIGNADO", "", "", "", "", ""],
            ["Nombre:", data.profesor_nombre ? `${data.profesor_nombre} ${data.profesor_apellido}` : "No asignado"],
            ["Cédula:", data.profesor_cedula || "N/A"],
            ["Teléfono:", data.profesor_telefono || "N/A"]
        ];

        const wsInfo = XLSX.utils.aoa_to_sheet(infoData);

        // Aplicar estilos a celdas (usando range)
        if (!wsInfo['!merges']) wsInfo['!merges'] = [];
        wsInfo['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });
        wsInfo['!merges'].push({ s: { r: 4, c: 0 }, e: { r: 4, c: 5 } });

        XLSX.utils.book_append_sheet(wb, wsInfo, "Información");

        // Hoja de estudiantes
        if (data.estudiantes.length > 0) {
            const estudiantesData = [
                ["LISTA DE ESTUDIANTES", "", "", "", "", ""],
                ["#", "Nombres", "Apellidos", "Cédula Escolar", "Fecha Nacimiento", "Género"],
                ...data.estudiantes.map((e, i) => [
                    i + 1,
                    e.nombres,
                    e.apellidos,
                    e.cedula_escolar,
                    new Date(e.fecha_nacimiento).toLocaleDateString(),
                    e.genero
                ])
            ];

            const wsEst = XLSX.utils.aoa_to_sheet(estudiantesData);

            // Aplicar formato
            wsEst['!cols'] = [
                { wch: 5 },  // Ancho columna #
                { wch: 20 }, // Nombres
                { wch: 20 }, // Apellidos
                { wch: 15 }, // Cédula
                { wch: 12 }, // Fecha
                { wch: 10 }  // Género
            ];

            XLSX.utils.book_append_sheet(wb, wsEst, "Estudiantes");
        }

        XLSX.writeFile(wb, `Grado_${data.nombre}_Seccion_${data.seccion}.xlsx`);
    };

    return (
        <Button
            variant="success"
            onClick={exportToExcel}
            className="me-2"
            disabled={!data}
        >
            <i className="bi bi-file-excel me-2"></i>Exportar a Excel
        </Button>
    );
};

export default ExcelExporter;