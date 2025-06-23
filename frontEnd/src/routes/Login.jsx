import { useState } from "react"
// import { useAutorizacion } from "../auth/AutorizarUsuario";
import { Navigate, useNavigate } from "react-router-dom";
import style from "../css/Login.module.css"

import { useAuthContext } from "../auth/AutorizarContexto"
import icono from "../assets/iconos/login_icono.svg"

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

            if (usuario.length === 0 || password.length === 0) {
                setError('Usuario y contraseña son obligatorios');
                return;
            }

            await login(usuario, password);

            console.log("Usuario autenticado correctamente");
            navigate("/inicio");

        } catch (error) {
            console.log(error)
            setError('Usuario o contraseña incorrecta');
        }
    }

    return (
        // <DefaultLayout>
        <main className={style.main}>
            <div className={style.div_fondo}></div>
            <form onSubmit={handleSubmit} className={style.formulario}>
                <img src={icono} alt="icono de candado" className={style.icono} />

                <h1 className={style.titulo}>Iniciar Sesion</h1>
                <label className={style.label} htmlFor="usuario">Usuario</label>
                <input className={style.input} type="text" id="usuario"
                    required
                    placeholder="Introduce tu usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)} />

                <label className={style.label} htmlFor="password">Contraseña</label>

                <input className={style.input} type="password" id="password"
                    required
                    placeholder="Introduce tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />

                {error && <div className={style.div_error}>{error}</div>}
                <input type="submit" className={style.boton} value="Iniciar Sesion" />
            </form>
        </main>
        // </DefaultLayout>

    )
}

export default Login