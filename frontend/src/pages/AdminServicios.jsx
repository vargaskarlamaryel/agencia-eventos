import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    listarServicios,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
} from '../services/api'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

const vacio = { nombre: '', categoria: 'mobiliario', precio: '', imagen_url: '' }
const CATEGORIAS = ['mobiliario', 'dj', 'buffet']

export default function AdminServicios() {
    const { token } = useAuth()
    const [servicios, setServicios] = useState([])
    const [form, setForm] = useState(vacio)
    const [editandoId, setEditandoId] = useState(null)
    const [error, setError] = useState('')
    const [archivo, setArchivo] = useState(null)
    const [subiendo, setSubiendo] = useState(false)

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

    const subirImagen = async () => {
        if (!archivo) return form.imagen_url || null

        const nombreArchivo = `${Date.now()}-${archivo.name}`
        const { error } = await supabase.storage
            .from('imagenes')
            .upload(nombreArchivo, archivo)

        if (error) throw new Error('Error al subir la imagen')

        const { data } = supabase.storage.from('imagenes').getPublicUrl(nombreArchivo)
        return data.publicUrl
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

        try {
            setSubiendo(true)
            const imagenUrl = await subirImagen()

            const datos = {
                nombre: form.nombre,
                categoria: form.categoria,
                precio: Number(form.precio),
                imagen_url: imagenUrl,
            }

            if (editandoId) {
                await actualizarServicio(editandoId, datos, token)
            } else {
                await crearServicio(datos, token)
            }
            setForm(vacio)
            setArchivo(null)
            setEditandoId(null)
            cargar()
        } catch {
            setError('No se pudo guardar el servicio')
        } finally {
            setSubiendo(false)
        }
    }

    const handleEditar = (servicio) => {
        setForm({
            nombre: servicio.nombre,
            categoria: servicio.categoria,
            precio: servicio.precio,
            imagen_url: servicio.imagen_url || '',
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
        setArchivo(null)
        setEditandoId(null)
    }

    return (
        <div>
            <Link to="/admin" className="btn-header" style={{ marginBottom: '16px' }}>
                ← Volver al panel
            </Link>
            <h2 className="section-title">Servicios</h2>

            <form onSubmit={handleSubmit} className="crud-form">
                <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
                <select name="categoria" value={form.categoria} onChange={handleChange}>
                    {CATEGORIAS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={handleChange} />
                <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files[0])} />

                {error && <p className="error">{error}</p>}

                <div className="crud-form-actions">
                    <button type="submit" disabled={subiendo}>
                        {subiendo ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Crear servicio'}
                    </button>
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
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {servicios.map((s) => (
                        <tr key={s.id}>
                            <td>
                                {s.imagen_url && (
                                    <img src={s.imagen_url} alt={s.nombre} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />
                                )}
                            </td>
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