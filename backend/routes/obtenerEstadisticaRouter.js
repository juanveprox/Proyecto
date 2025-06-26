const router = require("express").Router();
const db = require('../bd/conexionBD');

router.get('/counts', async (req, res) => {
    try {
        // Consulta para estudiantes
        const [estudiantes] = await db.query('SELECT COUNT(*) as count FROM estudiantes');

        // Consultas para personal (docentes, administrativos, obreros)
        const [docentes] = await db.query('SELECT COUNT(*) as count FROM personal WHERE tipo = "docente"');
        const [administrativos] = await db.query('SELECT COUNT(*) as count FROM personal WHERE tipo = "administrativo"');
        const [obreros] = await db.query('SELECT COUNT(*) as count FROM personal WHERE tipo = "obrero"');

        // Consulta para secciones
        const [secciones] = await db.query('SELECT COUNT(*) as count FROM grados');

        res.json({
            estudiantes: estudiantes[0].count,
            docentes: docentes[0].count,
            administrativos: administrativos[0].count,
            obreros: obreros[0].count,
            secciones: secciones[0].count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las estadísticas' });
    }
});

module.exports = router;