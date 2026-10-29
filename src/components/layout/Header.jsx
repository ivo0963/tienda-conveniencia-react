// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth, useCarrito } from '../../context/contextos';
import { categoriasDB } from '../../data/db';
import useColeccion from '../../hooks/useColeccion';
import { formatearMoneda } from '../../utils/formato';

const enlaces = [
  { to: '/', texto: 'Home', end: true },
  { to: '/productos', texto: 'Productos' },
  { to: '/ofertas', texto: 'Ofertas' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/blog', texto: 'Blog' },
  { to: '/contacto', texto: 'Contacto' },
];

const claseNav = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

export default function Header() {
  const categorias = useColeccion(categoriasDB);
  const { totalCantidad, subtotal } = useCarrito();
  const { usuario, esStaff, cerrarSesion } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const buscar = (e) => {
    e.preventDefault();
    navigate(`/productos?texto=${encodeURIComponent(busqueda.trim())}`);
  };

  const salir = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <header className="sticky-top shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-dark bg-marca">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold">
            <i className="bi bi-shop me-1"></i>MiniMarket DSY
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu-principal" aria-controls="menu-principal" aria-expanded="false" aria-label="Abrir menú">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menu-principal">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {enlaces.slice(0, 2).map((e) => (
                <li className="nav-item" key={e.to}><NavLink to={e.to} end={e.end} className={claseNav}>{e.texto}</NavLink></li>
              ))}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Categorías
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/categorias">Todas las categorías</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  {categorias.map((c) => (
                    <li key={c.id}><Link className="dropdown-item" to={`/categorias/${c.id}`}>{c.nombre}</Link></li>
                  ))}
                </ul>
              </li>
              {enlaces.slice(2).map((e) => (
                <li className="nav-item" key={e.to}><NavLink to={e.to} className={claseNav}>{e.texto}</NavLink></li>
              ))}
            </ul>

            <form className="d-flex my-2 my-lg-0 me-lg-3" role="search" onSubmit={buscar}>
              <input className="form-control form-control-sm me-2" type="search" placeholder="Buscar productos" aria-label="Buscar productos" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              <button className="btn btn-sm btn-outline-light" type="submit" aria-label="Buscar"><i className="bi bi-search"></i></button>
            </form>

            <div className="d-flex flex-wrap gap-2 align-items-center">
              <NavLink to="/carrito" className="btn btn-sm btn-acento position-relative">
                <i className="bi bi-cart3 me-1"></i>Carrito {formatearMoneda(subtotal)}
                {totalCantidad > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" data-testid="contador-carrito">
                    {totalCantidad}
                  </span>
                )}
              </NavLink>

              {usuario ? (
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-person-circle me-1"></i>{usuario.nombre}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {esStaff && <li><Link className="dropdown-item" to="/admin"><i className="bi bi-speedometer2 me-1"></i>Panel administrador</Link></li>}
                    <li><button className="dropdown-item" type="button" onClick={salir}><i className="bi bi-box-arrow-right me-1"></i>Cerrar sesión</button></li>
                  </ul>
                </div>
              ) : (
                <>
                  <NavLink to="/login" className="btn btn-sm btn-outline-light">Iniciar sesión</NavLink>
                  <NavLink to="/registro" className="btn btn-sm btn-light">Crear cuenta</NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
