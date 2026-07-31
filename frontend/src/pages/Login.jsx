import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await loginRequest(email, password)
      login(data.access_token)
      navigate('/admin')
    } catch {
      setError('Correo o contraseña incorrectos')
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-card">
        <h1>Agencia de eventos</h1>
        <p>Acceso al panel de administración</p>

        <label>Correo</label>
        <input type="email" placeholder="admin@correo.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required />

        <label>Contraseña</label>
        <input type="password" placeholder="••••••••" value={password}
          onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="error">{error}</p>}

        <button type="submit">Ingresar</button>
      </form>
    </div>
  )
}