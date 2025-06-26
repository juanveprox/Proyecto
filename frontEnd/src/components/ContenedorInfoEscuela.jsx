import style from "../css/ContenedorInfoEscuela.module.css"
import logoEscuela from "../assets/img/logo_escuela.png"
const ContenedorInfoEscuela = () => {
    return (
        <div className={style.contenedor}>
            <img className={style.logo} src={logoEscuela} alt="logo de la institucion" />
            <div >
                <h1 className={style.titulo}>Complejo Educativo “Marielba Rodriguez”</h1>
                <div className={style.contenedor_info}>
                    <p className={style.info}>Codigo DEA: <span className={style.info_numero}>OD06231201</span></p>
                    <p className={style.info}>Codigo Dependencia: <span className={style.info_numero}>006970393</span></p>
                </div>
            </div>
        </div>
    )
}

export default ContenedorInfoEscuela