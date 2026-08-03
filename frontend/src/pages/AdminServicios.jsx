import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  listarServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
} from '../services/api'

const vacio = { nombre: '', categoria: 'mobiliario', precio: '' }
const CATEGORIAS = ['mobiliario', 'dj', 'buffet']

export default function AdminServicios() {
  const { token } = useAuth()
  const [servicios, setServicios] = useState([])
  const [form, setForm] = useState(vacio)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      setServicios(await listarServicios())
    } catch {
      setError('No se pudieron cargar los servicios')
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.nombre || !form.precio) {
      setError('Nombre y precio son obligatorios')
      return
    }
    if (Number(form.precio) < 0) {
      setError('El precio no puede ser negativo')
      return
    }

    const datos = {
      nombre: form.nombre,
      categoria: form.categoria,
      precio: Number(form.precio),
    }

    try {
      if (editandoId) {
        await actualizarServicio(editandoId, datos, token)
      } else {
        await crearServicio(datos, token)
      }
      setForm(vacio)
      setEditandoId(null)
      cargar()
    } catch {
      setError('No se pudo guardar el servicio')
    }
  }

  const handleEditar = (servicio) => {
    setForm({
      nombre: servicio.nombre,
      categoria: servicio.categoria,
      precio: servicio.precio,
    })
    setEditandoId(servicio.id)
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este servicio?')) return
    try {
      await eliminarServicio(id, token)
      cargar()
    } catch {
      setError('No se pudo eliminar el servicio')
    }
  }

  const cancelarEdicion = () => {
    setForm(vacio)
    setEditandoId(null)
  }

  return (
    <div>
      <h2 className="section-title">Servicios</h2>

      <form onSubmit={handleSubmit} className="crud-form">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <select name="categoria" value={form.categoria} onChange={handleChange}>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={handleChange} />

        {error && <p className="error">{error}</p>}

        <div className="crud-form-actions">
          <button type="submit">{editandoId ? 'Guardar cambios' : 'Crear servicio'}</button>
          {editandoId && (
            <button type="button" className="btn-secondary" onClick={cancelarEdicion}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table className="crud-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((s) => (
            <tr key={s.id}>
              <td>{s.nombre}</td>
              <td>{s.categoria}</td>
              <td>${s.precio}</td>
              <td className="crud-table-actions">
                <button onClick={() => handleEditar(s)}>Editar</button>
                <button className="btn-danger" onClick={() => handleEliminar(s.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}