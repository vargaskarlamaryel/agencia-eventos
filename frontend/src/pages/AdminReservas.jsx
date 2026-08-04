import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listarReservas } from '../services/api'

export default function AdminReservas() {
    const { token } = useAuth()
    const [reservas, setReservas] = useState([])
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargar = async () => {
            try {
                setReservas(await listarReservas(token))
            } catch {
                setError('No se pudieron cargar las reservaciones')
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [token])

    return (
        <div>
            <Link to="/admin" className="btn-header" style={{ marginBottom: '16px' }}>
                ← Volver al panel
            </Link>
            <h2 className="section-title">Reservaciones</h2>

            {cargando && <p>Cargando...</p>}
            {error && <p className="error">{error}</p>}

            {!cargando && !error && (
                <table className="crud-table">
                    <thead>
                        <tr>
                            <th>Item reservado</th>
                            <th>Tipo</th>
                            <th>Cliente</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Fecha evento</th>
                            <th>Comentarios</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.length === 0 && (
                            <tr><td colSpan={7}>Todavía no hay reservaciones.</td></tr>
                        )}
                        {reservas.map((r) => (
                            <tr key={r.id}>
                                <td>{r.item_nombre}</td>
                                <td>{r.tipo_item}</td>
                                <td>{r.nombre_cliente}</td>
                                <td>{r.correo}</td>
                                <td>{r.telefono}</td>
                                <td>{r.fecha_evento || '—'}</td>
                                <td>{r.comentarios || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}