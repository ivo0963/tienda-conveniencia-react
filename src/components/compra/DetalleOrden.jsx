// src/components/compra/DetalleOrden.jsx
// Resumen de solo lectura de una orden: cliente, entrega, productos y totales.
import TablaItemsOrden from './TablaItemsOrden';
import { METODOS_PAGO } from '../../data/tienda';
import { formatearMoneda, nombreCompleto } from '../../utils/formato';

function Dato({ etiqueta, valor, className = 'col-md-4' }) {
  return (
    <div className={className}>
      <small className="text-body-secondary d-block">{etiqueta}</small>
      <span className="form-control bg-body-tertiary">{valor || '—'}</span>
    </div>
  );
}

export default function DetalleOrden({ orden, etiquetaTotal = 'Total pagado' }) {
  const { cliente, direccion } = orden;

  return (
    <>
      <h2 className="h6 mt-3">Datos del cliente</h2>
      <div className="row g-2 mb-3">
        <Dato etiqueta="Nombre" valor={nombreCompleto(cliente)} className="col-md-6" />
        <Dato etiqueta="Correo" valor={cliente.correo} className="col-md-6" />
      </div>

      <h2 className="h6">{orden.entrega === 'retiro' ? 'Retiro en tienda' : 'Dirección de entrega'}</h2>
      {orden.entrega === 'retiro' ? (
        <p className="text-body-secondary">El pedido se retira en MiniMarket DSY, Av. España 8, Santiago.</p>
      ) : (
        <div className="row g-2 mb-3">
          <Dato etiqueta="Calle" valor={direccion.calle} className="col-md-8" />
          <Dato etiqueta="Departamento" valor={direccion.departamento} />
          <Dato etiqueta="Región" valor={direccion.region} className="col-md-6" />
          <Dato etiqueta="Comuna" valor={direccion.comuna} className="col-md-6" />
          <Dato etiqueta="Indicaciones" valor={direccion.indicaciones} className="col-12" />
        </div>
      )}

      <p className="small text-body-secondary mb-2">Medio de pago: {METODOS_PAGO[orden.metodoPago] ?? orden.metodoPago}</p>

      <TablaItemsOrden items={orden.items} />

      <div className="card mt-3 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between"><span>Subtotal</span><span>{formatearMoneda(orden.subtotal)}</span></div>
          <div className="d-flex justify-content-between"><span>Envío</span><span>{formatearMoneda(orden.envio)}</span></div>
          <div className="d-flex justify-content-between fs-5 fw-semibold mt-2">
            <span>{etiquetaTotal}</span>
            <span data-testid="total-orden">{formatearMoneda(orden.total)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
