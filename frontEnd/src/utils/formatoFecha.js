export const formatoFecha = (dateString, includeTime = false) => {
    if (!dateString) return 'No especificado';

    try {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            ...(includeTime && {
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            })
        };

        return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return dateString; // Si falla, mostrar el valor original
    }
};