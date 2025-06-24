const fs = require('fs');
const path = require('path');

const deleteUploadedFiles = (files) => {
    if (!files || files.length === 0) return;

    files.forEach(file => {
        try {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        } catch (err) {
            console.error('Error al eliminar archivo:', err);
        }
    });
};

module.exports = {
    deleteUploadedFiles
};