// src/pages/PagoError.jsx
import { Link, useParams } from 'react-router-dom';
import DetalleOrden from '../components/compra/DetalleOrden';
import { ordenesDB } from '../data/db';
import useColeccion from '../hooks/useColeccion';
import NoEncontrado from './NoEncontrado';

export default function PagoError() {
  const { id } = useParams();
  const ordenes = useColeccion(ordenesDB);

  const orden = ordenes.find((o) => o.id === Number(id));
  if (!orden) return <NoEncontrado mensaje="No encontramos la orden indicada." />;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h4 text-danger">
              <i className="bi bi-x-circle me-2"></i>No se pudo realizar el pago. Nro #{orden.id}
            </h1>
            <p className="text-body-secondary mb-2">Detalle de compra</p>
            {orden.motivoRechazo && <div className="alert alert-danger" role="alert">{orden.motivoRechazo}</div>}
            <p className="small">Tus productos siguen en el carrito. Puedes revisar los datos e intentarlo nuevamente.</p>

            <div className="text-center my-3">
              <Link to="/checkout" className="btn btn-success">VOLVER A REALIZAR EL PAGO</Link>
            </div>

            <DetalleOrden orden={orden} etiquetaTotal="Total a pagar" />
          </div>
        </div>
      </div>
    </div>
  );
}
