// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-marca text-white mt-auto py-4">
      <div className="container">
        <div className="row g-3">
          <div className="col-md-5">
            <h2 className="h6 fw-bold"><i className="bi bi-shop me-1"></i>MiniMarket DSY</h2>
            <p className="small mb-0 opacity-75">Tu minimarket de confianza. Lunes a domingo de 08:00 a 23:00 hrs.</p>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="h6">Tienda</h2>
            <ul className="list-unstyled small mb-0">
              <li><Link to="/productos" className="link-light">Productos</Link></li>
              <li><Link to="/categorias" className="link-light">Categorías</Link></li>
              <li><Link to="/ofertas" className="link-light">Ofertas</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h2 className="h6">Ayuda</h2>
            <ul className="list-unstyled small mb-0">
              <li><Link to="/contacto" className="link-light">Soporte y contacto</Link></li>
              <li><Link to="/nosotros" className="link-light">Sobre nosotros</Link></li>
              <li><Link to="/blog" className="link-light">Blog</Link></li>
            </ul>
          </div>
        </div>
        <hr className="border-light opacity-25" />
        <p className="small mb-0 opacity-75">&copy; 2026 MiniMarket DSY · DSY1104 Evaluación Parcial 2 · Desarrollado por Ivo Martínez</p>
      </div>
    </footer>
  );
}
