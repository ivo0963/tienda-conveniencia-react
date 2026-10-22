export default function Blog() {
  return (
    <main className="contenedor-blog">
      <section className="encabezado-seccion">
        <h2>Novedades y Consejos</h2>
        <p>Descubre recetarios, ofertas semanales y tips para tu hogar.</p>
      </section>

      <section className="grilla-blog">
        <article className="tarjeta-blog">
          <div className="espacio-foto">
            <img src="/img/gemini-svg recetas.svg" alt="Recetas Rápidas" className="img-producto" />
          </div>
          <div className="info-blog">
            <span className="fecha-blog">15 de Marzo, 2026</span>
            <h3>5 Recetas rápidas usando abarrotes básicos</h3>
            <p>Prepara platos deliciosos en menos de 15 minutos usando insumos que ya tienes en tu despensa.</p>
            <a href="#" className="btn-leer-mas">Leer artículo</a>
          </div>
        </article>

        <article className="tarjeta-blog">
          <div className="espacio-foto">
            <img src="/img/gemini-svg despensa.svg" alt="Ahorro en Despensa" className="img-producto" />
          </div>
          <div className="info-blog">
            <span className="fecha-blog">10 de Marzo, 2026</span>
            <h3>Guía para armar una despensa económica</h3>
            <p>Te enseñamos a planificar tus compras mensuales para maximizar tu presupuesto sin perder calidad.</p>
            <a href="#" className="btn-leer-mas">Leer artículo</a>
          </div>
        </article>

        <article className="tarjeta-blog">
          <div className="espacio-foto">
            <img src="/img/gemini-svg snacks.svg" alt="Snacks Saludables" className="img-producto" />
          </div>
          <div className="info-blog">
            <span className="fecha-blog">02 de Marzo, 2026</span>
            <h3>Snacks saludables para la jornada de estudio</h3>
            <p>Opciones nutritivas y llenas de energía ideales para tus horas de concentración académica.</p>
            <a href="#" className="btn-leer-mas">Leer artículo</a>
          </div>
        </article>
      </section>
    </main>
  );
}