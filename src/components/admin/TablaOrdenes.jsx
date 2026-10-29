// src/components/admin/TablaOrdenes.jsx
import { Link } from 'react-router-dom';
import BadgeEstado from '../ui/BadgeEstado';
import { formatearFechaHora, formatearMoneda, nombreCompleto } from '../../utils/formato';

export default function TablaOrdenes({ ordenes, mensajeVacio = 'No hay órdenes registradas.' }) {
  if (ordenes.length === 0) return <div className="alert alert-info mb-0">{mensajeVacio}</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Fecha</th>
            <th scope="col">Cliente</th>
            <th scope="col">Total</th>
            <th scope="col">Estado</th>
            <th scope="col"><span className="visually-hidden">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.id}>
              <td className="fw-semibold">{o.codigo}</td>
              <td>{formatearFechaHora(o.fecha)}</td>
              <td>{nombreCompleto(o.cliente)}<br /><small className="text-body-secondary">{o.cliente.correo}</small></td>
              <td>{formatearMoneda(o.total)}</td>
              <td><BadgeEstado estado={o.estado} /></td>
              <td className="text-end">
                <Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-outline-primary">
                  <i className="bi bi-receipt me-1"></i>Ver boleta
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
