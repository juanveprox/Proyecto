import { useState } from "react"
import DefaultLayout from "../layout/DefaultLayout"
import { useAutorizacion } from "../auth/AutorizarUsuario";
import { Navigate, useNavigate } from "react-router-dom";
import { API_ULR } from "../auth/ConstURL.JS";

const Signup = () => {
    const [nombre, setNombre] = useState("")
    const [usuario, setUsuario] = useState("");
    const [correo, setCorreo] = useState("")
    const [password, setPassword] = useState("")

    const autorizacion = useAutorizacion();
    if (autorizacion.estaAutenticado) {
        return <Navigate to="/inicio" />
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const goTo = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const respuesta = await fetch(`${API_ULR}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    usuario,
                    correo,
                    password
                })
            });
            if (respuesta.ok) {
                console.log("El usuario se creo correctamente")
                goTo("/")
            } else {
                console.log("Error al crear el usuario")
            }

        } catch (error) { console.log(error) }
    }

    //*NOTA AGREGAR VALIDACION DE CAMPOS Y MOSTRAR EN PANTALLA
    return (
        <DefaultLayout>
            <form onSubmit={handleSubmit}>
                <h1>Registrarse</h1>
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />

                <label htmlFor="usuario">Usuario</label>
                <input type="text" id="usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)} />

                <label htmlFor="correo">Correo Electronico</label>
                <input type="email" id="correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)} />

                <label htmlFor="password" >Contraseña</label>
                <input type="password" id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />

                <input type="submit" value="Registrarse" />
            </form>
        </DefaultLayout>
    )
}

export default Signup