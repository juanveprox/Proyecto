import React from 'react'
import { useAuthContext } from "../auth/AutorizarContexto"


const BotonCerrar = () => {
    const { logout } = useAuthContext();


    return (
        <button onClick={logout}>Cerrar Sesion</button>
    )
}

export default BotonCerrar 