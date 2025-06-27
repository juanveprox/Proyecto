const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticate = (req, res, next) => {
    // 1. Obtener token de headers, cookies o query params
    const token = req.headers.authorization?.split(' ')[1] ||
        req.cookies?.token ||
        req.query?.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado. Token no proporcionado.'
        });
    }

    // 2. Verificar token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }

        // 3. Adjuntar datos del usuario al request
        req.user = {
            userId: decoded.userId,
            rol: decoded.rol,
            email: decoded.email
        };
        next(); // Continuar a la ruta protegida
    });
};

// Middleware para roles específicos (ej: admin)
//authorize(['admin', 'editor']),
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: `Acceso restringido. Requiere rol: ${roles.join(', ')}`
            });
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize
}