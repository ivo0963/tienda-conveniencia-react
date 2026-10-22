import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <section className="hero-banner">
        <div className="hero-contenido">
          <h2>Bienvenido a MiniMarket DSY</h2>
          <p>Inicia sesión o regístrate para acceder a tu cuenta y realizar tus compras.</p>
          
          <div className="hero-acciones">
            <Link to="/login" className="btn-hero btn-login">🔑 Iniciar Sesión</Link>
            <Link to="/registro" className="btn-hero btn-registro">📝 Registrarse</Link>
          </div>
        </div>
      </section>

      <section className="productos-destacados">
        <h2 className="titulo-seccion">🔥 Destacados de la Semana</h2>
        
        <div className="grilla-productos" id="contenedor-destacados">
          <article className="tarjeta-producto">
            <div className="espacio-foto">
              <img src="/img/coca cola.jpg" alt="Bebida Cola 2.5L" className="img-producto" />
            </div>
            <div className="info-producto">
              <h3>Bebida Cola 2.5 Litros</h3>
              <p className="precio">$2.500</p>
            </div>
          </article>

          <article className="tarjeta-producto">
            <div className="espacio-foto">
              <img src="/img/pan de molde.webp" alt="Pan de Molde Familiar" className="img-producto" />
            </div>
            <div className="info-producto">
              <h3>Pan de Molde Familiar</h3>
              <p className="precio">$2.100</p>
            </div>
          </article>

          <article className="tarjeta-producto">
            <div className="espacio-foto">
              <img src="/img/pack 6 cervesas.jpg" alt="Pack Cervezas 6x" className="img-producto" />
            </div>
            <div className="info-producto">
              <h3>Pack Cervezas 6x</h3>
              <p className="precio">$5.990</p>
            </div>
          </article>
        </div>
      </section>
      
      <section className="info-tienda">
        <article className="info-caja">
          <h4>🕒 Horario Continuado</h4>
          <p>Lunes a Domingo de 08:00 a 23:00 hrs.</p>
        </article>
        <article className="info-caja">
          <h4>🛵 Despacho Rápido</h4>
          <p>Entregas en todo el sector en menos de 45 minutos.</p>
        </article>
      </section>
    </main>
  );
}