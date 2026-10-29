// src/pages/admin/AdminReportesProductos.jsx
import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import BarraReporte from '../../components/admin/BarraReporte';
import { categoriasDB, ordenesDB, productosDB } from '../../data/db';
import { productosCriticos, resumenVentas } from '../../data/tienda';
import useColeccion from '../../hooks/useColeccion';
import { formatearMoneda } from '../../utils/formato';

export default function AdminReportesProductos() {
  const productos = useColeccion(productosDB);
  const categorias = useColeccion(categoriasDB);
  const ordenes = useColeccion(ordenesDB);

  const { ventasPorProducto, inventarioValorizado } = resumenVentas(ordenes, productos, categorias);
  const maxUnidades = Math.max(0, ...ventasPorProducto.map((v) => v.unidades));
  const maxStock = Math.max(0, ...productos.map((p) => p.stock));
  const vendidos = new Set(ventasPorProducto.map((v) => v.productoId));
  const sinVentas = productos.filter((p) => !vendidos.has(p.id));

  return (
    <>
      <EncabezadoSeccion titulo="Reportes de productos" subtitulo="Ventas e inventario por producto.">
        <Link to="/admin/productos" className="btn btn-sm btn-outline-secondary">Volver a productos</Link>
      </EncabezadoSeccion>

      <div className="row g-3 mb-4">
        <div className="col-md-4"><div className="card card-body shadow-sm"><small className="text-body-secondary">Inventario valorizado</small><p className="fs-4 fw-bold mb-0">{formatearMoneda(inventarioValorizado)}</p></div></div>
        <div className="col-md-4"><div className="card card-body shadow-sm"><small className="text-body-secondary">Productos con stock crítico</small><p className="fs-4 fw-bold mb-0">{productosCriticos(productos).length}</p></div></div>
        <div className="col-md-4"><div className="card card-body shadow-sm"><small className="text-body-secondary">Productos sin ventas</small><p className="fs-4 fw-bold mb-0">{sinVentas.length}</p></div></div>
      </div>

      <div className="row g-4">
        <section className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6">Unidades vendidas por producto</h2>
              {ventasPorProducto.length === 0 && <p className="text-body-secondary">Aún no hay ventas.</p>}
              {ventasPorProducto.map((v) => (
                <BarraReporte key={v.productoId} etiqueta={v.nombre} valor={v.unidades} maximo={maxUnidades} texto={`${v.unidades} un. · ${formatearMoneda(v.monto)}`} />
              ))}
            </div>
          </div>
        </section>
        <section className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6">Stock actual</h2>
              {productos.map((p) => (
                <BarraReporte key={p.id} etiqueta={p.nombre} valor={p.stock} maximo={maxStock} color={p.stock <= p.stockCritico ? 'warning' : 'success'} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
