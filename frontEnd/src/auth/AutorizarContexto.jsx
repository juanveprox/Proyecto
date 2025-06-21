import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { API_ULR } from "./constURL"

const AutorizarContexto = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = useMemo(() => {
        return !!user && !!accessToken; // Devuelve true si existen user y accessToken
    }, [user, accessToken]);


    // Inicializar estado de autenticación al cargar la app
    useEffect(() => {
        const inicializarAutenticación = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    // Verificar si el token es válido obteniendo datos de usuario
                    // const userResponse = await api.get('/auth/me');
                    const userRespuesta = await fetch(`${API_ULR}/usuario`, {
                        method: "get",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    })

                    if (!userRespuesta.ok) throw new Error("Error en la respuesta");
                    const userData = await userRespuesta.json(); // Convertir respuesta a JSON

                    setUser(userData);
                    setAccessToken(token);
                }
            } catch (error) {
                console.error('Error inicializando autenticación:', error);
                //*Si el token está expirado, podrías redirigir al login:
                logout(); // Limpiar estado si hay error
                localStorage.removeItem('accessToken');
            } finally {
                setLoading(false);
            }
        };

        inicializarAutenticación();
    }, []);

    // Función de login
    const login = async (usuario, password) => {
        try {
            const respuesta = await fetch(`${API_ULR}/login`, {
                method: "POST",
                credentials: "include",// Necesario para recibir cookies
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario,
                    password
                })
            });

            if (!respuesta.ok) {
                const errorInfo = await respuesta.json();
                throw new Error(errorInfo || "Error al iniciar sesión");
            }

            const json = (await respuesta.json())
            localStorage.setItem('accessToken', json.body.accessToken);

            setUser(json.body.datosUsuario);
            setAccessToken(json.body.accessToken);

            return json.body.datosUsuario;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    //* Función de logout
    const logout = async () => {
        try {
            await fetch(`${API_ULR}/cerrar-sesion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });
        } catch (error) {

            console.error('Error al Cerrar Sesion:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
            setAccessToken(null);
        }
    };

    // Función para refrescar el token (usada internamente)
    const refreshToken = async () => {
        try {
            const respuesta = await fetch(`${API_ULR}/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            })

            localStorage.setItem('accessToken', respuesta.body.accessToken);
            setAccessToken(respuesta.body.accessToken);
            return respuesta.body.accessToken;

        } catch (error) {
            logout();
            throw error;
        }
    };

    // Valor que estará disponible en los componentes
    const value = {
        user,
        accessToken,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshToken // Exportamos para poder usarlo manualmente si es necesario
    };

    return (
        <AutorizarContexto.Provider value={value}>
            {children}
        </AutorizarContexto.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuthContext = () => {
    const context = useContext(AutorizarContexto);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

