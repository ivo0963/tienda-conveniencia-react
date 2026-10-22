export default function Nosotros() {
  return (
    <main className="contenedor-nosotros">
      <section className="encabezado-seccion">
        <h2>Sobre Nosotros</h2>
        <p>Tu minimarket de confianza, más cerca y rápido que nunca.</p>
      </section>

      <section className="seccion-historia">
        <div className="contenido-historia">
          <article className="texto-historia">
            <h3>Nuestra Historia</h3>
            <p>MiniMarket DSY nació con la misión de transformar la experiencia de compra de barrio en una plataforma digital ágil, accesible y confiable. Nos enfocamos en llevar productos esenciales de la canasta familiar, abarrotes, snacks y bebidas directamente a la puerta de nuestros clientes en tiempo récord.</p>
          </article>
          <div className="espacio-foto">
            <img src="/img/gemini-svg nosotros.svg" alt="Local MiniMarket DSY" className="img-producto" />
          </div>
        </div>
      </section>

      <section className="seccion-valores">
        <h3 className="titulo-seccion">Nuestros Pilares</h3>
        <div className="grilla-valores">
          <article className="tarjeta-valor">
            <h4>🚀 Rapidez</h4>
            <p>Entregas eficientes y preparadas en pocos minutos para resolver tus necesidades inmediatas.</p>
          </article>
          <article className="tarjeta-valor">
            <h4>💯 Calidad</h4>
            <p>Seleccionamos cuidadosamente cada producto para garantizar la máxima frescura e higiene.</p>
          </article>
          <article className="tarjeta-valor">
            <h4>🤝 Cercanía</h4>
            <p>Atención personalizada centrada en entregar la mejor experiencia a nuestros clientes.</p>
          </article>
        </div>
      </section>
    </main>
  );
}