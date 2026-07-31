const API_URL = import.meta.env.VITE_API_URL

export async function login(correo, contrasena) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  })

  if (!res.ok) {
    throw new Error('Correo o contraseña incorrectos')
  }

  return res.json() // { access_token, token_type }
}