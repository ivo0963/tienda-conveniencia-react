import { NavLink, Link } from 'react-router-dom';

export default function Header({ contadorCarrito = 0 }) {
  return (
    <>
      <header className="header-principal">
        <div className="logo-container">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>🏪 MiniMarket DSY</h1>
          </Link>
        </div>
        <div className="acciones-usuario">
          <NavLink to="/login" className={({ isActive }) => isActive ? "btn activo" : "btn"}>
            Iniciar Sesión
          </NavLink>
          <NavLink to="/registro" className={({ isActive }) => isActive ? "btn activo" : "btn"}>
            Regístrate
          </NavLink>
          <NavLink to="/carrito" className={({ isActive }) => isActive ? "btn-carrito activo" : "btn-carrito"}>
            🛒 Carrito (<span>{contadorCarrito}</span>)
          </NavLink>
        </div>
      </header>

      <nav className="nav-principal">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "activo" : ""}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/productos" className={({ isActive }) => isActive ? "activo" : ""}>
              Catálogo de Productos
            </NavLink>
          </li>
          <li>
            <NavLink to="/nosotros" className={({ isActive }) => isActive ? "activo" : ""}>
              Nosotros
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={({ isActive }) => isActive ? "activo" : ""}>
              Blog / Novedades
            </NavLink>
          </li>
          <li>
            <NavLink to="/contacto" className={({ isActive }) => isActive ? "activo" : ""}>
              Contacto
            </NavLink>
          </li>
          <li>
            <Link to="/admin" className="link-admin">⚙️ Panel Admin</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}