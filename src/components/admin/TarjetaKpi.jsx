// src/components/admin/TarjetaKpi.jsx
export default function TarjetaKpi({ titulo, valor, detalle, icono, color = 'primary' }) {
  return (
    <div className={`card text-bg-${color} shadow-sm h-100`}>
      <div className="card-body d-flex align-items-center gap-3">
        <i className={`bi bi-${icono} display-6`} aria-hidden="true"></i>
        <div>
          <h2 className="h6 mb-0">{titulo}</h2>
          <p className="fs-3 fw-bold mb-0">{valor}</p>
          {detalle && <small>{detalle}</small>}
        </div>
      </div>
    </div>
  );
}
