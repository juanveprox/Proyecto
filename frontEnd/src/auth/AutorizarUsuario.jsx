import { createContext, use, useContext, useEffect, useState } from "react"
import { API_ULR } from "./constURL"

const AutorizarContexto = createContext({
    estaAutenticado: false,
    getAccessToeken: () => { },
    guardarUsuario: (infoUsuario) => { },
    getRefresToeken: () => { },
    getUser: () => { user | undefined }

})


export default function AutorizarUsuario({ children }) {

    const [estaAutenticado, seteEstaAutenticado] = useState(false)
    const [accessToken, setAccessToken] = useState()
    const [user, setUser] = useState()
    // const [refreshToken, setRefreshToeken] = useState()


    useEffect(() => {
        checkAutorizacion()
    }, [])

    async function solcitarNuevoToken(refreshToken) {
        try {
            const respuesta = await fetch(`${API_ULR}/refresh-token`, {
                method: "get",
                headers: {
                    "Content-Type": "aplication/json",
                    "Authorization": `Bearer ${refreshToken}`
                }
            });

            if (respuesta.ok) {
                const json = await respuesta.json();
                if (json.error) {
                    throw new Error(json.error);
                }
                return json.body.accessToken;
            } else {
                throw new Error("No se pudo obtener un nuevo token");
            }

        } catch (error) {
            console.log(error)
            return null;
        }
    }

    async function getUserInfo(accessToken) {
        try {
            const respuesta = await fetch(`${API_ULR}/usuario`, {
                method: "get",
                headers: {
                    "Content-Type": "aplication/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (respuesta.ok) {
                const json = await respuesta.json();

                if (json.error) {
                    throw new Error(json.error);
                }

                return json.body;

            } else {
                throw new Error("No se pudo obtener un nuevo token");
            }

        } catch (error) {
            console.log(error)
            return null;
        }
    }


    async function checkAutorizacion() {
        if (accessToken) {
            //sadasd
        } else {
            const token = getRefresToeken()
            if (token) {
                const nuevoToken = await solcitarNuevoToken(token);
                if (nuevoToken) {
                    const userInfo = await getUserInfo(nuevoToken);

                    if (userInfo) {
                        guardarInfoSesion(
                            userInfo.user,
                            nuevoToken,
                            token);

                    }
                }
            }
        }
    }

    function guardarInfoSesion(sesionInfo, accessToken, refreshToken) {
        setAccessToken(accessToken);
        localStorage.setItem("Token", JSON.stringify(refreshToken))
        seteEstaAutenticado("true")
        setUser(sesionInfo)
    }

    function getAccessToeken() {
        return accessToken
    }

    function getRefresToeken() {
        const tokenData = localStorage.getItem("Token") || null;
        if (tokenData) {
            const { token } = JSON.parse(tokenData)
            return token
        }
        return null
    }

    function guardarUsuario(infoUsuario) {
        guardarInfoSesion(
            infoUsuario.body.user,
            infoUsuario.body.accessToken,
            infoUsuario.body.refreshToken);
    }


    function getUser() {
        return user
    }

    return <AutorizarContexto.Provider value={{
        estaAutenticado,
        getAccessToeken,
        guardarUsuario,
        getRefresToeken,
        getUser
    }}>
        {children}
    </AutorizarContexto.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAutorizacion = () => useContext(AutorizarContexto)