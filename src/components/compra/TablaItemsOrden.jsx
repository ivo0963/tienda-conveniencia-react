// src/components/compra/TablaItemsOrden.jsx
// Tabla de solo lectura con los productos de un pedido (checkout, boleta, resultado del pago).
import { formatearMoneda } from '../../utils/formato';

export default function TablaItemsOrden({ items }) {
  return (
    <div className="table-responsive">
      <table className="table table-sm align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Imagen</th>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productoId}>
              <td><img src={item.imagen} alt="" className="miniatura rounded" /></td>
              <td>{item.nombre}</td>
              <td>{formatearMoneda(item.precio)}</td>
              <td>{item.cantidad}</td>
              <td>{formatearMoneda(item.precio * item.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
