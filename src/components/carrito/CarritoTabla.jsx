// src/components/carrito/CarritoTabla.jsx
// Tabla editable del carrito: permite cambiar cantidades y eliminar productos.
import { formatearMoneda } from '../../utils/formato';

export default function CarritoTabla({ items, onCambiarCantidad, onEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Precio</th>
            <th scope="col" className="text-center">Cantidad</th>
            <th scope="col">Subtotal</th>
            <th scope="col"><span className="visually-hidden">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ producto, cantidad, precio, subtotal }) => (
            <tr key={producto.id} data-testid={`fila-carrito-${producto.id}`}>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <img src={producto.imagen} alt="" className="miniatura rounded" />
                  <span>{producto.nombre}</span>
                </div>
              </td>
              <td>{formatearMoneda(precio)}</td>
              <td>
                <div className="input-group input-group-sm justify-content-center flex-nowrap">
                  <button type="button" className="btn btn-outline-secondary" aria-label={`Quitar uno de ${producto.nombre}`} onClick={() => onCambiarCantidad(producto.id, cantidad - 1)}>
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className="input-group-text bg-white" data-testid="cantidad">{cantidad}</span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    aria-label={`Agregar uno de ${producto.nombre}`}
                    disabled={cantidad >= producto.stock}
                    onClick={() => onCambiarCantidad(producto.id, cantidad + 1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </td>
              <td>{formatearMoneda(subtotal)}</td>
              <td className="text-end">
                <button type="button" className="btn btn-sm btn-outline-danger" aria-label={`Eliminar ${producto.nombre}`} onClick={() => onEliminar(producto.id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
