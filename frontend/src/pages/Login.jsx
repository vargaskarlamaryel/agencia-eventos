import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return setError('Correo o contraseña incorrectos')
    navigate('/admin')
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