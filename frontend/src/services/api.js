const API_URL = import.meta.env.VITE_API_URL


export async function register(correo, contrasena) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  })

  if (!res.ok) {
    if (res.status === 400) throw new Error('Ese correo ya está registrado')
    throw new Error('No se pudo completar el registro')
  }

  return res.json() // { access_token, token_type } — mismo shape que login
}

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

async function authFetch(url, token, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (res.status === 401) {
    // Token vencido o inválido: forzamos recarga completa,
    // lo que reinicia el AuthContext (useState(null)) y manda al login
    window.location.href = '/login'
    throw new Error('Sesión expirada')
  }

  if (!res.ok) {
    throw new Error('Error en la petición')
  }

  if (res.status === 204) return null
  return res.json()
}

export async function listarSalones() {
  const res = await fetch(`${API_URL}/salones/`)
  if (!res.ok) throw new Error('Error al listar salones')
  return res.json()
}

export function crearSalon(salon, token) {
  return authFetch(`${API_URL}/salones/`, token, {
    method: 'POST',
    body: JSON.stringify(salon),
  })
}

export function actualizarSalon(id, salon, token) {
  return authFetch(`${API_URL}/salones/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(salon),
  })
}

export function eliminarSalon(id, token) {
  return authFetch(`${API_URL}/salones/${id}`, token, {
    method: 'DELETE',
  })
}

export async function listarServicios(categoria = null) {
  const url = categoria ? `${API_URL}/servicios/?categoria=${categoria}` : `${API_URL}/servicios/`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Error al listar servicios')
  return res.json()
}

export function crearServicio(servicio, token) {
  return authFetch(`${API_URL}/servicios/`, token, {
    method: 'POST',
    body: JSON.stringify(servicio),
  })
}

export function actualizarServicio(id, servicio, token) {
  return authFetch(`${API_URL}/servicios/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(servicio),
  })
}

export function eliminarServicio(id, token) {
  return authFetch(`${API_URL}/servicios/${id}`, token, {
    method: 'DELETE',
  })
}