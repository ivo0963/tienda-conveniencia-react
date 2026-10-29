// src/pages/Nosotros.jsx
import EncabezadoSeccion from '../components/ui/EncabezadoSeccion';

const pilares = [
  { icono: 'rocket-takeoff', titulo: 'Rapidez', texto: 'Entregas eficientes y preparadas en pocos minutos para resolver tus necesidades inmediatas.' },
  { icono: 'award', titulo: 'Calidad', texto: 'Seleccionamos cuidadosamente cada producto para garantizar la máxima frescura e higiene.' },
  { icono: 'people', titulo: 'Cercanía', texto: 'Atención personalizada centrada en entregar la mejor experiencia a nuestros clientes.' },
];

export default function Nosotros() {
  return (
    <>
      <EncabezadoSeccion titulo="Sobre nosotros" subtitulo="Tu minimarket de confianza, más cerca y rápido que nunca." />

      <section className="row g-4 align-items-center mb-5">
        <div className="col-md-7">
          <h2 className="h4">Nuestra historia</h2>
          <p>
            MiniMarket DSY nació con la misión de transformar la experiencia de compra de barrio en una plataforma digital
            ágil, accesible y confiable. Nos enfocamos en llevar productos esenciales de la canasta familiar, abarrotes,
            snacks y bebidas directamente a la puerta de nuestros clientes en tiempo récord.
          </p>
        </div>
        <div className="col-md-5">
          <img src="/img/gemini-svg nosotros.svg" alt="Local MiniMarket DSY" className="img-fluid rounded shadow-sm" />
        </div>
      </section>

      <section>
        <h2 className="h4 text-center mb-4">Nuestros pilares</h2>
        <div className="row g-3">
          {pilares.map((p) => (
            <div className="col-md-4" key={p.titulo}>
              <article className="card h-100 shadow-sm text-center p-3">
                <i className={`bi bi-${p.icono} fs-1 text-acento`}></i>
                <h3 className="h5 mt-2">{p.titulo}</h3>
                <p className="mb-0 text-body-secondary">{p.texto}</p>
              </article>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
