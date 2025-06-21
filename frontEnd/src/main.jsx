import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import Login from "./routes/Login.jsx"
import Signup from "./routes/Signup.jsx"
import Dashboard from "./routes/Dashboard.jsx"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ProtectedRoute from './routes/RutaProtegida.jsx';

import { AuthProvider } from './auth/AutorizarContexto.jsx';

// Router con las rutas
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/registrar",
    element: <Signup />
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/inicio",
        element: <Dashboard />
      }]
  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
