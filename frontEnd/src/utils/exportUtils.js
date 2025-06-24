import { utils, writeFile } from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


//!Para Exportar a PDF O EXCEL
// export const exportToPDF = (data, fileName = 'estudiantes') => {
//     const doc = new jsPDF();

//     // Configuración del título
//     doc.setFontSize(16);
//     doc.text('Listado de Estudiantes', 14, 15);

//     // Configuración de la tabla
//     autoTable(doc, {
//         head: [['Cédula Escolar', 'Apellidos', 'Nombres', 'Cédula', 'Género', "Fecha Nacimiento"]],
//         body: data.map(student => [
//             student.cedula_escolar,
//             student.apellidos,
//             student.nombres,
//             student.cedula,
//             student.genero,
//             student.fecha_nacimiento
//         ]),
//         startY: 25
//     });

//     doc.save(`${fileName}.pdf`);
// };

export const exportToExcel = (data, fileName = 'estudiantes') => {
    // Limpiar datos para Excel
    const cleanData = data.map(item => {
        const cleanItem = {};
        Object.keys(item).forEach(key => {
            cleanItem[key] = item[key] === 'N/A' ? '' : item[key];
        });
        return cleanItem;
    });

    const worksheet = utils.json_to_sheet(cleanData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Estudiantes');

    // Agregar fecha al nombre del archivo
    const dateStr = new Date().toISOString().slice(0, 10);
    writeFile(workbook, `${fileName}_${dateStr}.xlsx`);
};


export const exportToPDF = (data, fileName = 'estudiantes') => {
    try {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm'
        });

        // Título
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Listado de Estudiantes', 105, 15, { align: 'center' });

        // Tabla
        autoTable(doc, {
            head: [
                [
                    'Cédula Escolar',
                    'Apellidos',
                    'Nombres',
                    'Cédula',
                    'Género',
                    'Fecha Nacimiento',
                    'Representante',
                    'Teléfono'
                ]
            ],
            body: data.map(student => [
                student.cedula_escolar || 'N/A',
                student.apellidos || 'N/A',
                student.nombres || 'N/A',
                student.cedula || 'N/A',
                student.genero || 'N/A',
                student.fecha_nacimiento ?
                    new Date(student.fecha_nacimiento).toLocaleDateString('es-ES')
                    : 'N/A',
                `${student.rep_nombres || ''} ${student.rep_apellidos || ''}`.trim() || 'N/A',
                student.rep_telefono || 'N/A'
            ]),
            startY: 25,
            styles: {
                fontSize: 9,
                cellPadding: 3,
                overflow: 'linebreak',
                valign: 'middle'
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontSize: 10
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            margin: { left: 10, right: 10 }
        });

        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(
                `Página ${i} de ${pageCount} - ${new Date().toLocaleDateString()}`,
                105,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        doc.save(`${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
        console.error('Error al generar PDF:', error);
        throw new Error('No se pudo generar el PDF');
    }
};
//     const doc = new jsPDF({
//         orientation: 'landscape' // Horizontal para más columnas
//     });

//     // Título con fecha
//     const dateStr = new Date().toLocaleDateString();
//     doc.setFontSize(16);
//     doc.text(`Listado de Estudiantes - ${dateStr}`, 14, 15);

//     // Configurar tabla
//     const headers = Object.keys(data[0] || []);
//     const body = data.map(item =>
//         headers.map(header => item[header] || '')
//     );

//     doc.autoTable({
//         head: [headers],
//         body: body,
//         startY: 25,
//         styles: {
//             fontSize: 8,
//             cellPadding: 3,
//             overflow: 'linebreak'
//         },
//         columnStyles: {
//             0: { cellWidth: 20 },
//             1: { cellWidth: 25 },
//             2: { cellWidth: 25 },
//             3: { cellWidth: 20 },
//             // ... ajustar según necesidad
//         },
//         headStyles: {
//             fillColor: [41, 128, 185], // Color azul
//             textColor: 255,
//             fontSize: 9
//         },
//         alternateRowStyles: {
//             fillColor: [240, 240, 240]
//         },
//         margin: { top: 20 }
//     });

//     // Guardar con fecha
//     doc.save(`${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
// };