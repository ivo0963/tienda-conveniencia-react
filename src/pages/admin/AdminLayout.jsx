// src/pages/admin/AdminLayout.jsx
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/contextos';
import { MENU_ADMIN } from './configAdmin';

export default function AdminLayout() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const menu = MENU_ADMIN.filter((m) => !m.soloAdmin || usuario.rol === 'admin');

  const salir = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-body-tertiary">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <button className="navbar-toggler d-md-none me-2" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-admin" aria-controls="sidebar-admin" aria-expanded="false" aria-label="Abrir menú">
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link to="/admin" className="navbar-brand me-auto"><i className="bi bi-shop me-1"></i>MiniMarket DSY · Admin</Link>
          <span className="navbar-text small d-none d-sm-inline">
            {usuario.nombre} ({usuario.rol === 'admin' ? 'Administrador' : 'Vendedor'})
          </span>
        </div>
      </nav>

      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <aside id="sidebar-admin" className="col-md-3 col-lg-2 collapse d-md-block bg-white border-end p-3 sidebar-admin">
            <ul className="nav nav-pills flex-column gap-1">
              {menu.map((m) => (
                <li className="nav-item" key={m.to}>
                  <NavLink to={m.to} end={m.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ' link-body-emphasis'}`}>
                    <i className={`bi bi-${m.icono} me-2`}></i>{m.texto}
                  </NavLink>
                </li>
              ))}
            </ul>
            <hr />
            <div className="d-grid gap-2">
              <Link to="/" className="btn btn-dark btn-sm"><i className="bi bi-shop me-1"></i>Tienda</Link>
              <button type="button" className="btn btn-danger btn-sm" onClick={salir}><i className="bi bi-box-arrow-right me-1"></i>Cerrar sesión</button>
            </div>
          </aside>

          <main className="col-md-9 col-lg-10 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
