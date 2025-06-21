import DefaultLayout from "../layout/DefaultLayout"
import { useState } from "react"
// import { useAutorizacion } from "../auth/AutorizarUsuario";
import { Navigate, useNavigate } from "react-router-dom";


import { useAuthContext } from "../auth/AutorizarContexto"


const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("")
    const [error, setError] = useState('');
    const { login } = useAuthContext();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            await login(usuario, password);

            console.log("Usuario autenticado correctamente");
            navigate("/inicio");

        } catch (error) {
            console.log(error)
            setError('Usuario o contraseña incorrectos');
        }
    }




    return (
        <DefaultLayout>
            <form onSubmit={handleSubmit}>
                {error && <div className="error">{error}</div>}
                <h1>Iniciar Sesion</h1>
                <label htmlFor="usuario">Usuario</label>
                <input type="text" id="usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)} />

                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />

                <input type="submit" value="Iniciar Sesion" />
            </form>
        </DefaultLayout>

    )
}

export default Login