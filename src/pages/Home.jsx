// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import ListaProductos from '../components/productos/ListaProductos';
import CategoriaCard from '../components/categorias/CategoriaCard';
import { categoriasDB, productosDB } from '../data/db';
import { estaEnOferta } from '../data/tienda';
import { useCarrito } from '../context/contextos';
import useColeccion from '../hooks/useColeccion';

const diapositivas = [
  { titulo: 'Bienvenido a MiniMarket DSY', texto: 'Abarrotes, snacks y bebidas a la puerta de tu casa en menos de 45 minutos.', enlace: '/productos', boton: 'Ver productos', clase: 'hero-1' },
  { titulo: 'Ofertas de la semana', texto: 'Descuentos de hasta 20% en productos seleccionados.', enlace: '/ofertas', boton: 'Ver ofertas', clase: 'hero-2' },
  { titulo: 'Despacho gratis', texto: 'En compras sobre $20.000 el envío corre por nuestra cuenta.', enlace: '/categorias', boton: 'Explorar categorías', clase: 'hero-3' },
];

export default function Home() {
  const productos = useColeccion(productosDB);
  const categorias = useColeccion(categoriasDB);
  const { agregar } = useCarrito();

  const destacados = productos.filter((p) => estaEnOferta(p) && p.stock > 0).slice(0, 4);

  return (
    <>
      <div id="carrusel-home" className="carousel slide mb-5 rounded overflow-hidden shadow-sm" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {diapositivas.map((d, i) => (
            <button key={d.clase} type="button" data-bs-target="#carrusel-home" data-bs-slide-to={i} className={i === 0 ? 'active' : ''} aria-current={i === 0 ? 'true' : undefined} aria-label={`Diapositiva ${i + 1}`}></button>
          ))}
        </div>
        <div className="carousel-inner">
          {diapositivas.map((d, i) => (
            <div key={d.clase} className={`carousel-item ${d.clase}${i === 0 ? ' active' : ''}`}>
              <div className="hero-contenido text-center text-white px-4">
                <h1 className="display-6 fw-bold">{d.titulo}</h1>
                <p className="lead">{d.texto}</p>
                <Link to={d.enlace} className="btn btn-acento btn-lg">{d.boton}</Link>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carrusel-home" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carrusel-home" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      <section className="mb-5">
        <h2 className="h4 text-center mb-4">Categorías</h2>
        <div className="row row-cols-2 row-cols-md-4 g-3">
          {categorias.map((c) => (
            <div className="col" key={c.id}>
              <CategoriaCard categoria={c} />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0"><i className="bi bi-fire text-danger me-1"></i>Destacados de la semana</h2>
          <Link to="/ofertas" className="btn btn-sm btn-outline-marca">Ver todas las ofertas</Link>
        </div>
        <ListaProductos productos={destacados} categorias={categorias} onAgregar={(p) => agregar(p)} />
      </section>

      <section className="row g-3">
        {[
          { icono: 'clock', titulo: 'Horario continuado', texto: 'Lunes a domingo de 08:00 a 23:00 hrs.' },
          { icono: 'truck', titulo: 'Despacho rápido', texto: 'Entregas en todo el sector en menos de 45 minutos.' },
          { icono: 'shield-check', titulo: 'Compra segura', texto: 'Paga con débito, crédito o transferencia.' },
        ].map((info) => (
          <div className="col-md-4" key={info.icono}>
            <div className="card h-100 border-0 bg-body-tertiary text-center p-3">
              <i className={`bi bi-${info.icono} fs-2 text-acento`}></i>
              <h3 className="h6 mt-2">{info.titulo}</h3>
              <p className="small mb-0 text-body-secondary">{info.texto}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
