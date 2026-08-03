import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Registro() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleRegistro = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      const data = await register(correo, password)
      login(data.access_token)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={handleRegistro} className="login-card">
        <h1>Agencia de eventos</h1>
        <p>Crear cuenta de administrador</p>

        <label>Correo</label>
        <input type="email" placeholder="admin@correo.com" value={correo}
          onChange={(e) => setCorreo(e.target.value)} required />

        <label>Contraseña</label>
        <input type="password" placeholder="••••••••" value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        <label>Confirmar contraseña</label>
        <input type="password" placeholder="••••••••" value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)} required />

        {error && <p className="error">{error}</p>}

        <button type="submit">Registrarse</button>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  )
}