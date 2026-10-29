// src/pages/admin/AdminBoleta.jsx
import { Link, useParams } from 'react-router-dom';
import DetalleOrden from '../../components/compra/DetalleOrden';
import BadgeEstado from '../../components/ui/BadgeEstado';
import Boton from '../../components/ui/Boton';
import { ordenesDB } from '../../data/db';
import { ESTADOS_ORDEN } from '../../data/tienda';
import useColeccion from '../../hooks/useColeccion';
import { formatearFechaHora } from '../../utils/formato';

export default function AdminBoleta() {
  const { id } = useParams();
  const ordenes = useColeccion(ordenesDB);
  const orden = ordenes.find((o) => o.id === Number(id));

  if (!orden) return <div className="alert alert-warning">La orden no existe. <Link to="/admin/ordenes">Volver</Link></div>;

  return (
    <div className="card shadow-sm area-imprimible">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
          <div>
            <h1 className="h4 mb-1">Boleta {orden.codigo}</h1>
            <small className="text-body-secondary">Emitida el {formatearFechaHora(orden.fecha)}</small>
          </div>
          <BadgeEstado estado={orden.estado} />
        </div>
        {orden.motivoRechazo && <div className="alert alert-danger mt-3 mb-0">{orden.motivoRechazo}</div>}

        <DetalleOrden orden={orden} etiquetaTotal="Total" />

        <div className="d-flex flex-wrap gap-2 align-items-end mt-4 no-imprimir">
          {orden.estado !== 'rechazada' && (
            <div>
              <label htmlFor="estado-orden" className="form-label small mb-1">Cambiar estado</label>
              <select id="estado-orden" className="form-select form-select-sm" value={orden.estado} onChange={(e) => ordenesDB.actualizar(orden.id, { estado: e.target.value })}>
                {Object.entries(ESTADOS_ORDEN).filter(([v]) => v !== 'rechazada').map(([valor, info]) => (
                  <option key={valor} value={valor}>{info.etiqueta}</option>
                ))}
              </select>
            </div>
          )}
          <Boton etiqueta="Imprimir" icono="printer" variante="outline-dark" className="btn-sm" onClick={() => window.print()} />
          <Link to="/admin/ordenes" className="btn btn-sm btn-outline-secondary ms-auto">Volver a órdenes</Link>
        </div>
      </div>
    </div>
  );
}
