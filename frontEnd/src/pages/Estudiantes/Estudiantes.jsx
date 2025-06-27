import { useNavigate } from 'react-router-dom';
import style from "./Estudiantes.module.css"
import StudentSearch from '../../components/buscarEstudiante';


const Estudiantes = () => {
    const navigate = useNavigate();
    const redirigir = () => {
        navigate("/crear-estudiante")
    }

    return (
        <div className={style.main}>
            <h1 className={style.titulo}>Estudiantes</h1>
            <div className={style.buscarContenedor}>
                <div className={style.opciones}>
                    <button type="button" className="btn btn-primary" onClick={() =>
                        navigate("/mostrar-estudiantes")}>Ver todos los Estudiantes</button>
                    <button type="button" className="btn btn-success" onClick={redirigir}> Registrar Nuevo Estudiante</button>
                </div>
                {/* <hr className={style.linea} /> */}
                {/* <h2 className={style.subtitulo}>Buscar Estudiante</h2>
                <hr className={style.linea} /> */}

                {/* <form className="row g-3 m-4">
                    <div className="col-md-6">
                        <label htmlFor="inputEmail4" className="form-label">Cedula Identidad</label>
                        <input type="text" className="form-control border border-black" id="inputEmail4" />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputPassword4" className="form-label">Cedula Escolar</label>
                        <input type="text" className="form-control border border-black" id="inputPassword4" />
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <button type="submit" className="btn btn-primary mx-auto w-25">Buscar Estudiante</button>
                    </div>
                </form> */}
                <StudentSearch />
            </div>



        </div>

    )
}

export default Estudiantes