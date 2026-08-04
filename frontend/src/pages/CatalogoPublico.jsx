import { useEffect, useState } from 'react'
import { listarSalones, listarServicios, crearReserva } from '../services/api'
import { Link } from 'react-router-dom'

const RESERVA_VACIA = { nombre_cliente: '', correo: '', telefono: '', fecha_evento: '', comentarios: '' }

export default function CatalogoPublico() {
    const [salones, setSalones] = useState([])
    const [servicios, setServicios] = useState([])
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(true)

    const [itemSeleccionado, setItemSeleccionado] = useState(null) // { tipo, nombre }
    const [form, setForm] = useState(RESERVA_VACIA)
    const [enviando, setEnviando] = useState(false)
    const [enviado, setEnviado] = useState(false)
    const [errorReserva, setErrorReserva] = useState('')

    useEffect(() => {
        const cargar = async () => {
            try {
                const [s, sv] = await Promise.all([listarSalones(), listarServicios()])
                setSalones(s)
                setServicios(sv)
            } catch {
                setError('No se pudo cargar el catálogo. Intenta de nuevo más tarde.')
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [])

    const abrirReserva = (tipo, nombre) => {
        setItemSeleccionado({ tipo, nombre })
        setForm(RESERVA_VACIA)
        setEnviado(false)
        setErrorReserva('')
    }

    const cerrarModal = () => {
        setItemSeleccionado(null)
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmitReserva = async (e) => {
        e.preventDefault()
        setErrorReserva('')

        if (!form.nombre_cliente || !form.correo || !form.telefono) {
            setErrorReserva('Nombre, correo y teléfono son obligatorios')
            return
        }

        try {
            setEnviando(true)
            await crearReserva({
                tipo_item: itemSeleccionado.tipo,
                item_nombre: itemSeleccionado.nombre,
                ...form,
            })
            setEnviado(true)
        } catch {
            setErrorReserva('No se pudo enviar tu solicitud. Intenta de nuevo.')
        } finally {
            setEnviando(false)
        }
    }

    if (cargando) return <div className="catalogo-estado">Cargando catálogo...</div>
    if (error) return <div className="catalogo-estado error">{error}</div>

    return (
        <div className="catalogo-container">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px' }}>
                <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}>
                    Panel Admin
                </Link>
            </div>
            <header className="catalogo-header">
                <h1>Servicios Ofrecidos</h1>
                <p>Reserva salones y servicios para tu próximo evento</p>
            </header>

            <section>
                <h2 className="section-title">Salones</h2>
                <div className="catalogo-grid">
                    {salones.length === 0 && <p>No hay salones disponibles por el momento.</p>}
                    {salones.map((s) => (
                        <div key={s.id} className="catalogo-card">
                            {s.imagen_url ? (
                                <img src={s.imagen_url} alt={s.nombre} className="catalogo-imagen" />
                            ) : (
                                <div className="catalogo-imagen catalogo-imagen-placeholder">Sin imagen</div>
                            )}
                            <h3>{s.nombre}</h3>
                            <p className="catalogo-capacidad">Capacidad: {s.capacidad} personas</p>
                            {s.descripcion && <p className="catalogo-descripcion">{s.descripcion}</p>}
                            <p className="catalogo-precio">${s.precio}</p>
                            <button className="btn-reservar" onClick={() => abrirReserva('salon', s.nombre)}>
                                Reservar
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="section-title">Servicios</h2>
                <div className="catalogo-grid">
                    {servicios.length === 0 && <p>No hay servicios disponibles por el momento.</p>}
                    {servicios.map((s) => (
                        <div key={s.id} className="catalogo-card">
                            {s.imagen_url ? (
                                <img src={s.imagen_url} alt={s.nombre} className="catalogo-imagen" />
                            ) : (
                                <div className="catalogo-imagen catalogo-imagen-placeholder">Sin imagen</div>
                            )}
                            <h3>{s.nombre}</h3>
                            <p className="catalogo-categoria">{s.categoria}</p>
                            <p className="catalogo-precio">${s.precio}</p>
                            <button className="btn-reservar" onClick={() => abrirReserva('servicio', s.nombre)}>
                                Reservar
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {itemSeleccionado && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-cerrar" onClick={cerrarModal}>×</button>

                        {enviado ? (
                            <div className="modal-confirmacion">
                                <h3>¡Gracias!</h3>
                                <p>Te estaremos contactando pronto para coordinar tu reserva de "{itemSeleccionado.nombre}".</p>
                                <button className="btn-header" onClick={cerrarModal}>Cerrar</button>
                            </div>
                        ) : (
                            <>
                                <h3>Reservar: {itemSeleccionado.nombre}</h3>
                                <form onSubmit={handleSubmitReserva} className="crud-form" style={{ flexDirection: 'column' }}>
                                    <input name="nombre_cliente" placeholder="Nombre completo" value={form.nombre_cliente} onChange={handleChange} />
                                    <input name="correo" type="email" placeholder="Correo electrónico" value={form.correo} onChange={handleChange} />
                                    <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
                                    <input name="fecha_evento" type="date" value={form.fecha_evento} onChange={handleChange} />
                                    <textarea name="comentarios" placeholder="Comentarios (opcional)" value={form.comentarios} onChange={handleChange} rows={3} />

                                    {errorReserva && <p className="error">{errorReserva}</p>}

                                    <button type="submit" disabled={enviando}>
                                        {enviando ? 'Enviando...' : 'Enviar solicitud'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}