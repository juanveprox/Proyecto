
import { API_ULR } from '../auth/constURL';
import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import estudianteIcono from "../assets/iconos/estudiantes_icono.svg"
import administrativoIcono from "../assets/iconos/administrator_icono.svg"
import docenteIcono from "../assets/iconos/docente_icono.svg"
import obreroIcono from "../assets/iconos/obrero_icono.svg"
import seccioIcono from "../assets/iconos/secciones_icono.svg"

import style from "../css/InformacionEstadista.module.css"


const inicio = () => {

    const [counts, setCounts] = useState({
        estudiantes: 0,
        docentes: 0,
        administrativos: 0,
        obreros: 0,
        secciones: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_ULR}/estadistica/counts`);
                setCounts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar las estadísticas');
                setLoading(false);
                console.error(err);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (


        <div className={style.contenedor}>

            <div className={`${style.carta} ${style.carta1}`}>
                <h2 className={style.carta_titulo}>Estudiantes Registrados</h2>

                <div className={style.carta_contenedor}>
                    <span className={style.numero_registrado}>{counts.estudiantes}</span>
                    <img src={estudianteIcono} alt="icono estudiantes" />
                </div>
            </div>


            <div className={`${style.carta} ${style.carta2}`}>
                <h2 className={style.carta_titulo}>Administrativos Registrados</h2>

                <div className={style.carta_contenedor}>
                    <span className={style.numero_registrado}>{counts.administrativos}</span>

                    <img src={administrativoIcono} alt="icono estudiantes" />
                </div>
            </div>

            <div className={`${style.carta} ${style.carta3}`}>
                <h2 className={style.carta_titulo}>Docentes Registrados</h2>

                <div className={style.carta_contenedor}>
                    <span className={style.numero_registrado}>{counts.docentes}</span>

                    <img src={docenteIcono} alt="icono estudiantes" />
                </div>
            </div>

            <div className={`${style.carta} ${style.carta4}`}>
                <h2 className={style.carta_titulo}>Obreros Registrados</h2>

                <div className={style.carta_contenedor}>
                    <span className={style.numero_registrado}>{counts.obreros}</span>

                    <img src={obreroIcono} alt="icono estudiantes" />
                </div>
            </div>

            <div className={`${style.carta} ${style.carta5}`}>
                <h2 className={style.carta_titulo}>Secciones Registradas</h2>

                <div className={style.carta_contenedor}>
                    <span className={style.numero_registrado}>{counts.secciones}</span>

                    <img src={seccioIcono} alt="icono estudiantes" />
                </div>
            </div>


        </div>


    );
};

export default inicio;