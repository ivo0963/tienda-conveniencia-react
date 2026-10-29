// src/components/productos/PrecioProducto.jsx
import { estaEnOferta, precioFinal } from '../../data/tienda';
import { formatearMoneda } from '../../utils/formato';

export default function PrecioProducto({ producto, grande = false }) {
  return (
    <p className={`mb-0 ${grande ? 'fs-3' : 'fs-5'}`}>
      {estaEnOferta(producto) && (
        <del className="text-body-secondary fs-6 me-2" data-testid="precio-normal">
          {formatearMoneda(producto.precio)}
        </del>
      )}
      <strong className={estaEnOferta(producto) ? 'text-danger' : 'text-marca'}>
        {formatearMoneda(precioFinal(producto))}
      </strong>
    </p>
  );
}
