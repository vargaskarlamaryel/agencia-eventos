import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminHome from './pages/AdminHome'
import ProtectedRoute from './components/ProtectedRoute'
import AdminSalones from './pages/AdminSalones'
import AdminServicios from './pages/AdminServicios'
import CatalogoPublico from './pages/CatalogoPublico'
import Registro from './pages/Registro'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<Navigate to="/catalogo" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/salones"
          element={
            <ProtectedRoute>
              <AdminSalones />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/servicios"
          element={
            <ProtectedRoute>
              <AdminServicios />
            </ProtectedRoute>
          }
        />

        <Route path="/catalogo" element={<CatalogoPublico />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App