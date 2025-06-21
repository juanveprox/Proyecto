import { useAuthContext } from '../auth/AutorizarContexto';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) return <div>Cargando...</div>;
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;