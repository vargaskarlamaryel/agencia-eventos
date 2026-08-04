import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    listarSalones,
    crearSalon,
    actualizarSalon,
    eliminarSalon,
} from '../services/api'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

const vacio = { nombre: '', capacidad: '', precio: '', descripcion: '', imagen_url: '' }

export default function AdminSalones() {
    const { token } = useAuth()
    const [salones, setSalones] = useState([])
    const [form, setForm] = useState(vacio)
    const [editandoId, setEditandoId] = useState(null)
    const [error, setError] = useState('')
    const [archivo, setArchivo] = useState(null)
    const [subiendo, setSubiendo] = useState(false)

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

        if (!form.nombre || !form.capacidad || !form.precio) {
            setError('Nombre, capacidad y precio son obligatorios')
            return
        }
        if (Number(form.precio) < 0 || Number(form.capacidad) < 0) {
            setError('Capacidad y precio no pueden ser negativos')
            return
        }

        try {
            setSubiendo(true)
            const imagenUrl = await subirImagen()

            const datos = {
                nombre: form.nombre,
                capacidad: Number(form.capacidad),
                precio: Number(form.precio),
                descripcion: form.descripcion || null,
                imagen_url: imagenUrl,
            }

            if (editandoId) {
                await actualizarSalon(editandoId, datos, token)
            } else {
                await crearSalon(datos, token)
            }
            setForm(vacio)
            setArchivo(null)
            setEditandoId(null)
            cargar()
        } catch {
            setError('No se pudo guardar el salón')
        } finally {
            setSubiendo(false)
        }
    }

    const handleEditar = (salon) => {
        setForm({
            nombre: salon.nombre,
            capacidad: salon.capacidad,
            precio: salon.precio,
            descripcion: salon.descripcion || '',
            imagen_url: salon.imagen_url || '',
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
        setArchivo(null)
        setEditandoId(null)
    }

    return (
        <div>
            <Link to="/admin" className="btn-header" style={{ marginBottom: '16px' }}>
                ← Volver al panel
            </Link>
            <h2 className="section-title">Salones</h2>

            <form onSubmit={handleSubmit} className="crud-form">
                <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
                <input name="capacidad" type="number" placeholder="Capacidad" value={form.capacidad} onChange={handleChange} />
                <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={handleChange} />
                <input name="descripcion" placeholder="Descripción (opcional)" value={form.descripcion} onChange={handleChange} />
                <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files[0])} />

                {error && <p className="error">{error}</p>}

                <div className="crud-form-actions">
                    <button type="submit" disabled={subiendo}>
                        {subiendo ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Crear salón'}
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
                        <th>Capacidad</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {salones.map((s) => (
                        <tr key={s.id}>
                            <td>
                                {s.imagen_url && (
                                    <img src={s.imagen_url} alt={s.nombre} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />
                                )}
                            </td>
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