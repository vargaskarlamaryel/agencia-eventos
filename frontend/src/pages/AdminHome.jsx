import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function AdminHome() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Backoffice</h2>
        <nav style={styles.nav}>
          <span style={styles.navItemActive}>Inicio</span>
          <Link to="/admin/salones" style={{ ...styles.navItem, textDecoration: 'none' }}>Salones</Link>
          <Link to="/admin/servicios" style={{ ...styles.navItem, textDecoration: 'none' }}>Servicios</Link>
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/catalogo" style={{ ...styles.logoutButton, textDecoration: 'none', display: 'inline-block' }}>
              Ver catálogo
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Cerrar sesión
            </button>
          </div>
          <h1 style={styles.title}>Panel de administración</h1>
        </header>
        <div style={styles.content}>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Bienvenido al backoffice. Aquí irá la edición de salones y servicios.
          </p>
        </div>
      </main>
    </div>
  )
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: '220px',
    background: 'var(--color-surface)',
    borderRight: '1px solid var(--color-border)',
    padding: '24px 16px',
  },
  logo: { fontSize: '16px', fontWeight: 600, margin: '0 0 24px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: {
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
  },
  navItemActive: {
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    background: '#eef0ff',
    color: 'var(--color-primary)',
  },
  main: { flex: 1, padding: '32px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: { fontSize: '20px', fontWeight: 600, margin: 0 },
  logoutButton: {
    padding: '8px 16px',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  content: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    padding: '24px',
  },
}