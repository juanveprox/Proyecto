import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from "./routes/AppRouter.jsx"
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './auth/AutorizarContexto.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={AppRouter} />
    </AuthProvider>
  </StrictMode>,
)
