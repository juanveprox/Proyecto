
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../auth/AutorizarContexto';

const AdminRouter = ({ children }) => {
    const { user } = useAuthContext();

    if (!user || user.rol !== "administrador") {
        return <Navigate to="/acceso-denegado" replace />;
    }

    return children;
};

export default AdminRouter;