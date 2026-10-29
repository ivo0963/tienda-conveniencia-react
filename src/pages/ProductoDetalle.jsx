// src/pages/ProductoDetalle.jsx
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PrecioProducto from '../components/productos/PrecioProducto';
import ListaProductos from '../components/productos/ListaProductos';
import Boton from '../components/ui/Boton';
import { categoriasDB, productosDB } from '../data/db';
import { estaEnOferta, porcentajeDescuento } from '../data/tienda';
import { useCarrito } from '../context/contextos';
import useColeccion from '../hooks/useColeccion';
import NoEncontrado from './NoEncontrado';

// La key reinicia la cantidad y el aviso al navegar a un producto relacionado.
export default function ProductoDetalle() {
  const { id } = useParams();
  return <DetalleProducto key={id} id={id} />;
}

function DetalleProducto({ id }) {
  const productos = useColeccion(productosDB);
  const categorias = useColeccion(categoriasDB);
  const { agregar, items } = useCarrito();
  // Se guarda el texto del campo para permitir borrarlo mientras se escribe.
  const [cantidad, setCantidad] = useState('1');
  const [agregado, setAgregado] = useState(false);

  const producto = productos.find((p) => p.id === Number(id));
  if (!producto) return <NoEncontrado mensaje="El producto que buscas no existe." />;

  const categoria = categorias.find((c) => c.id === producto.categoriaId);
  const enCarrito = items.find((i) => i.producto.id === producto.id)?.cantidad ?? 0;
  const disponible = producto.stock - enCarrito;
  const relacionados = productos.filter((p) => p.categoriaId === producto.categoriaId && p.id !== producto.id).slice(0, 4);

  const cantidadValida = Math.max(1, Math.min(Math.trunc(Number(cantidad)) || 1, disponible));

  const agregarAlCarrito = () => {
    agregar(producto, cantidadValida);
    setCantidad('1');
    setAgregado(true);
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
          {categoria && <li className="breadcrumb-item"><Link to={`/categorias/${categoria.id}`}>{categoria.nombre}</Link></li>}
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="position-relative">
            <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded shadow-sm w-100 img-detalle" />
            {estaEnOferta(producto) && <span className="badge text-bg-danger fs-6 position-absolute top-0 start-0 m-3">-{porcentajeDescuento(producto)}%</span>}
          </div>
        </div>
        <div className="col-md-6">
          {categoria && <span className="badge text-bg-light border mb-2">{categoria.nombre}</span>}
          <h1 className="h2">{producto.nombre}</h1>
          <p className="text-body-secondary small">Código: {producto.codigo}</p>
          <PrecioProducto producto={producto} grande />
          <p className="mt-3">{producto.descripcion}</p>
          <p className={producto.stock > 0 ? 'text-success' : 'text-danger'}>
            <i className={`bi ${producto.stock > 0 ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
            {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Sin stock'}
          </p>

          <div className="d-flex gap-2 align-items-end flex-wrap">
            <div>
              <label htmlFor="cantidad" className="form-label small mb-1">Cantidad</label>
              <input
                id="cantidad"
                type="number"
                className="form-control"
                style={{ width: '6rem' }}
                min="1"
                max={Math.max(disponible, 1)}
                value={cantidad}
                disabled={disponible <= 0}
                onChange={(e) => setCantidad(e.target.value)}
                onBlur={() => setCantidad(String(cantidadValida))}
              />
            </div>
            <Boton etiqueta="Añadir al carrito" icono="cart-plus" variante="marca" deshabilitado={disponible <= 0} onClick={agregarAlCarrito} />
          </div>
          {enCarrito > 0 && <p className="small text-body-secondary mt-2 mb-0">Tienes {enCarrito} en tu carrito.</p>}
          {agregado && (
            <div className="alert alert-success mt-3 py-2" role="status">
              Producto agregado. <Link to="/carrito">Ir al carrito</Link>
            </div>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <section>
          <h2 className="h5 mb-3">Productos relacionados</h2>
          <ListaProductos productos={relacionados} categorias={categorias} onAgregar={(p) => agregar(p)} />
        </section>
      )}
    </>
  );
}
