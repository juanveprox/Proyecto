import Login from "./Login.jsx"
import Signup from "./Signup.jsx"
import ProtectedRoute from './RutaProtegida.jsx';
import { createBrowserRouter } from "react-router-dom";
import LayoutConSidebar from "../layout/LayoutConSidebar.jsx";
import Inicio from "../pages/Inicio/Inicio.jsx"
import Estudiantes from "../pages/Estudiantes/Estudiantes.jsx"
import Docentes from "../pages/Docentes/Docentes.jsx"
import Administrativo from "../pages/Administrativo/Administrativo.jsx"
import Secciones from "../pages/Secciones/Secciones.jsx"
import Reportes from "../pages/Reportes/Reportes.jsx"
import Actividades from "../pages/Actividades/Actividades.jsx";
import Obreros from "../pages/Obreros/Obreros.jsx";
import EstudianteFormulario from "../components/EstudianteFormulario.jsx"
import MostrarEstudiantes from "../pages/MostarEstudiantes/MostarEstudiantes.jsx"
import ListaActividades from "../pages/ListaActividades/ListaActividades.jsx";
import EditarPersonal from "../components/EditarPersonal.jsx";
import AdminRouter from "./AdminRouter.jsx";
import AccesoDenegado from "../pages/AccesoDenegado/AccesoDenegado.jsx";
import EditarUsuario from "../pages/EditarUsuario/EditarUsuario.jsx";

// Router con las rutas
const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    //* Activar para registrar por primera vez
    //*Borrar Despues de crear el primer Usuario
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
                        path: "/administrativos",
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
                        element: <ListaActividades />
                    },
                    {
                        path: "/crear-actividad",
                        element: <Actividades />
                    },
                    {
                        path: "/docentes",
                        element: <Docentes />
                    },
                    {
                        path: "/crear-estudiante",
                        element: <EstudianteFormulario />
                    },
                    {
                        path: "/editar-estudiante/:id",
                        element: <EstudianteFormulario isEdit={true} />
                    },
                    {
                        path: "/mostrar-estudiantes",
                        element: <MostrarEstudiantes />
                    },
                    {
                        path: "/editar-personal/:id",
                        element: <EditarPersonal />
                    },
                    {
                        path: "/acceso-denegado",
                        element: <AccesoDenegado />
                    },
                    {
                        path: "/registrar",
                        element: <AdminRouter><Signup /></AdminRouter>
                    },
                    {
                        path: "/editar-usuario",
                        element: <AdminRouter> <EditarUsuario /></AdminRouter>

                    }
                ]
            },
        ]
    }
]);
export default router;