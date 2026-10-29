// src/pages/admin/AdminReportes.jsx
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import BarraReporte from '../../components/admin/BarraReporte';
import TarjetaKpi from '../../components/admin/TarjetaKpi';
import { categoriasDB, ordenesDB, productosDB, usuariosDB } from '../../data/db';
import { ESTADOS_ORDEN, resumenVentas } from '../../data/tienda';
import useColeccion from '../../hooks/useColeccion';
import { formatearMoneda } from '../../utils/formato';

export default function AdminReportes() {
  const ordenes = useColeccion(ordenesDB);
  const productos = useColeccion(productosDB);
  const categorias = useColeccion(categoriasDB);
  const usuarios = useColeccion(usuariosDB);

  const r = resumenVentas(ordenes, productos, categorias);
  const maxCategoria = Math.max(0, ...r.ventasPorCategoria.map((c) => c.monto));
  const maxEstado = Math.max(0, ...r.ordenesPorEstado.map((e) => e.cantidad));
  const top = r.ventasPorProducto.slice(0, 5);

  return (
    <>
      <EncabezadoSeccion titulo="Reportes" subtitulo="Indicadores generales de ventas y operación." />

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><TarjetaKpi titulo="Total vendido" valor={formatearMoneda(r.totalVendido)} icono="cash-stack" color="success" /></div>
        <div className="col-sm-6 col-xl-3"><TarjetaKpi titulo="Órdenes" valor={r.cantidadOrdenes} icono="receipt" color="primary" detalle={`${r.cantidadPagadas} pagadas`} /></div>
        <div className="col-sm-6 col-xl-3"><TarjetaKpi titulo="Ticket promedio" valor={formatearMoneda(r.ticketPromedio)} icono="graph-up" color="info" /></div>
        <div className="col-sm-6 col-xl-3"><TarjetaKpi titulo="Clientes" valor={usuarios.filter((u) => u.rol === 'cliente').length} icono="people" color="warning" /></div>
      </div>

      <div className="row g-4">
        <section className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6">Ventas por categoría</h2>
              {r.ventasPorCategoria.map((c) => (
                <BarraReporte key={c.categoriaId} etiqueta={c.nombre} valor={c.monto} maximo={maxCategoria} texto={formatearMoneda(c.monto)} color="success" />
              ))}
            </div>
          </div>
        </section>
        <section className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6">Órdenes por estado</h2>
              {r.ordenesPorEstado.map((e) => (
                <BarraReporte key={e.estado} etiqueta={ESTADOS_ORDEN[e.estado].etiqueta} valor={e.cantidad} maximo={maxEstado} color={ESTADOS_ORDEN[e.estado].color} />
              ))}
            </div>
          </div>
        </section>
        <section className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h6">Top 5 productos más vendidos</h2>
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead><tr><th scope="col">#</th><th scope="col">Producto</th><th scope="col">Unidades</th><th scope="col">Monto</th></tr></thead>
                  <tbody>
                    {top.map((v, i) => (
                      <tr key={v.productoId}><td>{i + 1}</td><td>{v.nombre}</td><td>{v.unidades}</td><td>{formatearMoneda(v.monto)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
