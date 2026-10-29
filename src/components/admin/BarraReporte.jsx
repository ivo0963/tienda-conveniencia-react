// src/components/admin/BarraReporte.jsx
// Fila de un gráfico de barras horizontal hecho con la barra de progreso de Bootstrap.
export default function BarraReporte({ etiqueta, valor, maximo, texto, color = 'primary' }) {
  const porcentaje = maximo > 0 ? Math.round((valor / maximo) * 100) : 0;
  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between small">
        <span>{etiqueta}</span>
        <span className="fw-semibold">{texto ?? valor}</span>
      </div>
      <div className="progress" role="progressbar" aria-label={etiqueta} aria-valuenow={porcentaje} aria-valuemin="0" aria-valuemax="100" style={{ height: '0.6rem' }}>
        <div className={`progress-bar bg-${color}`} style={{ width: `${porcentaje}%` }}></div>
      </div>
    </div>
  );
}
