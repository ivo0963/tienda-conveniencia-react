import { NavLink, Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="body-admin">
      <header className="header-admin">
        <div className="logo-admin">
          <h1>⚙️ Panel Administrador - MiniMarket DSY</h1>
        </div>
        <div className="admin-usuario-info">
          <span>Hola, <strong>Admin Duoc</strong> (Administrador)</span>
          <Link to="/" className="btn-volver-tienda">Volver a la Tienda 🏪</Link>
        </div>
      </header>

      <div className="layout-admin">
        <aside className="sidebar-admin">
          <nav className="nav-admin">
            <ul>
              <li>
                <NavLink to="/admin" end className={({ isActive }) => isActive ? "activo" : ""}>
                  📊 Dashboard Principal
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/productos" className={({ isActive }) => isActive ? "activo" : ""}>
                  📦 Mantenedor Productos
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? "activo" : ""}>
                  👥 Mantenedor Usuarios / Roles
                </NavLink>
              </li>
              <li>
                <Link to="/">🚪 Cerrar Sesión Admin</Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="contenido-admin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}