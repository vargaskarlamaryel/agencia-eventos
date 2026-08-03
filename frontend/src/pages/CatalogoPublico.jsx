import { useEffect, useState } from 'react'
import { listarSalones, listarServicios } from '../services/api'

export default function CatalogoPublico() {
  const [salones, setSalones] = useState([])
  const [servicios, setServicios] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

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

  if (cargando) return <div className="catalogo-estado">Cargando catálogo...</div>
  if (error) return <div className="catalogo-estado error">{error}</div>

  return (
    <div className="catalogo-container">
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
              <h3>{s.nombre}</h3>
              <p className="catalogo-capacidad">Capacidad: {s.capacidad} personas</p>
              {s.descripcion && <p className="catalogo-descripcion">{s.descripcion}</p>}
              <p className="catalogo-precio">${s.precio}</p>
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
              <h3>{s.nombre}</h3>
              <p className="catalogo-categoria">{s.categoria}</p>
              <p className="catalogo-precio">${s.precio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}