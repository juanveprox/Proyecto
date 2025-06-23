import Login from "./Login.jsx"
import Signup from "./Signup.jsx"
import Dashboard from "./Dashboard.jsx"
import ProtectedRoute from './RutaProtegida.jsx';
import { createBrowserRouter } from "react-router-dom";
import LayoutConSidebar from "../layout/LayoutConSidebar.jsx";
import Inicio from "../pages/Inicio/Inicio.jsx"
import Estudiantes from "../pages/Estudiantes/Estudiantes.jsx"
import Docentes from "../pages/Docentes/Docentes.jsx"
import Administrativo from "../pages/Actividades/Actividades.jsx"
import Secciones from "../pages/Secciones/Secciones.jsx"
import Reportes from "../pages/Reportes/Reportes.jsx"
import Actividades from "../pages/Actividades/Actividades.jsx";
import Obreros from "../pages/Obreros/Obreros.jsx";



// Router con las rutas
const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    // {
    //     path: "/registrar",
    //     element: <Signup />
    // },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                element: <LayoutConSidebar />, // Layout para rutas protegidas
                children: [
                    {
                        path: "/inicio",
                        element: <Inicio />
                    },
                    {
                        path: "/estudiantes",
                        element: <Estudiantes />
                    },
                    {
                        path: "/administrativo",
                        element: <Administrativo />
                    },
                    {
                        path: "/obreros",
                        element: <Obreros />
                    },
                    {
                        path: "/secciones",
                        element: <Secciones />
                    },
                    {
                        path: "/reportes",
                        element: <Reportes />
                    },
                    {
                        path: "/actividades",
                        element: <Actividades />
                    },
                    {
                        path: "/docentes",
                        element: <Docentes />
                    },



                    {
                        path: "/registrar",
                        element: <Signup />
                    }
                ]
            },
        ]
    }
]);
export default router;