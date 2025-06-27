// src/components/AdminOnly.jsx
import { useAuthContext } from '../auth/AutorizarContexto';

const MostarInfoAdmin = ({ children }) => {
    const { user } = useAuthContext();


    if (user?.rol !== "administrador") {
        return null;
    }

    return children;
};

export default MostarInfoAdmin;