import React from 'react'
import InformacionEstadistica from "../../components/InformacionEstadista"
import ContenedorInfoEscuela from '../../components/ContenedorInfoEscuela'
import { useAuthContext } from "../../auth/AutorizarContexto"

const Inicio = () => {
    const { user } = useAuthContext()
    console.log(user)
    return (
        <>
            <ContenedorInfoEscuela />
            <InformacionEstadistica />
        </>
    )
}

export default Inicio