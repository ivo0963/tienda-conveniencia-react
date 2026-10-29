// src/components/productos/ProductoCard.jsx
import { Link } from 'react-router-dom';
import PrecioProducto from './PrecioProducto';
import Boton from '../ui/Boton';
import { estaEnOferta, porcentajeDescuento } from '../../data/tienda';

export default function ProductoCard({ producto, categoria, onAgregar }) {
  const sinStock = producto.stock <= 0;

  return (
    <article className="card h-100 shadow-sm tarjeta-producto">
      <Link to={`/productos/${producto.id}`} className="position-relative">
        <img src={producto.imagen} alt={producto.nombre} className="card-img-top img-producto" />
        {estaEnOferta(producto) && (
          <span className="badge text-bg-danger position-absolute top-0 start-0 m-2">-{porcentajeDescuento(producto)}%</span>
        )}
      </Link>
      <div className="card-body d-flex flex-column">
        {categoria && <span className="badge text-bg-light border align-self-start mb-2">{categoria}</span>}
        <h2 className="h6 card-title">
          <Link to={`/productos/${producto.id}`} className="text-reset text-decoration-none">
            {producto.nombre}
          </Link>
        </h2>
        <PrecioProducto producto={producto} />
        <small className={sinStock ? 'text-danger' : 'text-body-secondary'}>
          {sinStock ? 'Sin stock' : `Stock disponible: ${producto.stock}`}
        </small>
        <div className="mt-auto pt-3">
          <Boton
            etiqueta={sinStock ? 'Agotado' : 'Añadir al carrito'}
            icono="cart-plus"
            variante="marca"
            className="w-100"
            deshabilitado={sinStock}
            onClick={() => onAgregar(producto)}
          />
        </div>
      </div>
    </article>
  );
}
