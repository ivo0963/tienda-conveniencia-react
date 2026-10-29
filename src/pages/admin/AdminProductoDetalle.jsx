// src/pages/admin/AdminProductoDetalle.jsx
import { Link, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import PrecioProducto from '../../components/productos/PrecioProducto';
import { categoriasDB, ordenesDB, productosDB } from '../../data/db';
import { esStockCritico } from '../../data/tienda';
import { useAuth } from '../../context/contextos';
import useColeccion from '../../hooks/useColeccion';

export default function AdminProductoDetalle() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const productos = useColeccion(productosDB);
  const categorias = useColeccion(categoriasDB);
  const ordenes = useColeccion(ordenesDB);

  const producto = productos.find((p) => p.id === Number(id));
  if (!producto) return <div className="alert alert-warning">El producto no existe. <Link to="/admin/productos">Volver</Link></div>;

  const categoria = categorias.find((c) => c.id === producto.categoriaId);
  const unidadesVendidas = ordenes
    .filter((o) => o.estado !== 'rechazada')
    .flatMap((o) => o.items)
    .filter((i) => i.productoId === producto.id)
    .reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <>
      <EncabezadoSeccion titulo={producto.nombre} subtitulo={`Código ${producto.codigo}`}>
        <div className="d-flex gap-2">
          <Link to="/admin/productos" className="btn btn-sm btn-outline-secondary">Volver</Link>
          {usuario.rol === 'admin' && <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-sm btn-primary"><i className="bi bi-pencil me-1"></i>Editar producto</Link>}
        </div>
      </EncabezadoSeccion>

      <div className="card shadow-sm">
        <div className="card-body row g-4">
          <div className="col-md-4">
            <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
          </div>
          <div className="col-md-8">
            <dl className="row mb-0">
              <dt className="col-sm-4">Categoría</dt><dd className="col-sm-8">{categoria?.nombre ?? 'Sin categoría'}</dd>
              <dt className="col-sm-4">Descripción</dt><dd className="col-sm-8">{producto.descripcion || '—'}</dd>
              <dt className="col-sm-4">Precio</dt><dd className="col-sm-8"><PrecioProducto producto={producto} /></dd>
              <dt className="col-sm-4">Stock</dt>
              <dd className="col-sm-8">
                {producto.stock} unidades{' '}
                {esStockCritico(producto) && <span className="badge text-bg-warning">Stock crítico (mín. {producto.stockCritico})</span>}
              </dd>
              <dt className="col-sm-4">Unidades vendidas</dt><dd className="col-sm-8">{unidadesVendidas}</dd>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
