import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  listarSalones,
  crearSalon,
  actualizarSalon,
  eliminarSalon,
} from '../services/api'

const vacio = { nombre: '', capacidad: '', precio: '', descripcion: '' }

export default function AdminSalones() {
  const { token } = useAuth()
  const [salones, setSalones] = useState([])
  const [form, setForm] = useState(vacio)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')

  const cargar = async () => {
    try {
      setSalones(await listarSalones())
    } catch {
      setError('No se pudieron cargar los salones')
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

    if (!form.nombre || !form.capacidad || !form.precio) {
      setError('Nombre, capacidad y precio son obligatorios')
      return
    }
    if (Number(form.precio) < 0 || Number(form.capacidad) < 0) {
      setError('Capacidad y precio no pueden ser negativos')
      return
    }

    const datos = {
      nombre: form.nombre,
      capacidad: Number(form.capacidad),
      precio: Number(form.precio),
      descripcion: form.descripcion || null,
    }

    try {
      if (editandoId) {
        await actualizarSalon(editandoId, datos, token)
      } else {
        await crearSalon(datos, token)
      }
      setForm(vacio)
      setEditandoId(null)
      cargar()
    } catch {
      setError('No se pudo guardar el salón')
    }
  }

  const handleEditar = (salon) => {
    setForm({
      nombre: salon.nombre,
      capacidad: salon.capacidad,
      precio: salon.precio,
      descripcion: salon.descripcion || '',
    })
    setEditandoId(salon.id)
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este salón?')) return
    try {
      await eliminarSalon(id, token)
      cargar()
    } catch {
      setError('No se pudo eliminar el salón')
    }
  }

  const cancelarEdicion = () => {
    setForm(vacio)
    setEditandoId(null)
  }

  return (
    <div>
      <h2 className="section-title">Salones</h2>

      <form onSubmit={handleSubmit} className="crud-form">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input name="capacidad" type="number" placeholder="Capacidad" value={form.capacidad} onChange={handleChange} />
        <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={handleChange} />
        <input name="descripcion" placeholder="Descripción (opcional)" value={form.descripcion} onChange={handleChange} />

        {error && <p className="error">{error}</p>}

        <div className="crud-form-actions">
          <button type="submit">{editandoId ? 'Guardar cambios' : 'Crear salón'}</button>
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
            <th>Capacidad</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {salones.map((s) => (
            <tr key={s.id}>
              <td>{s.nombre}</td>
              <td>{s.capacidad}</td>
              <td>${s.precio}</td>
              <td>{s.descripcion}</td>
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