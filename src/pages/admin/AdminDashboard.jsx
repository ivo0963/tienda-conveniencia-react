export default function AdminDashboard() {
  return (
    <>
      <h2>Resumen General del Sistema</h2>

      <section className="tarjetas-resumen">
        <article className="tarjeta-kpi">
          <h3>Ventas del Día</h3>
          <p className="kpi-numero" id="dash-ventas-monto">$154.900</p>
          <small id="dash-ventas-pedidos">12 pedidos procesados</small>
        </article>

        <article className="tarjeta-kpi alerta">
          <h3>Stock Crítico</h3>
          <p className="kpi-numero" id="dash-stock-critico">0 Productos</p>
          <small>Requieren reabastecimiento</small>
        </article>

        <article className="tarjeta-kpi">
          <h3>Usuarios Activos</h3>
          <p className="kpi-numero" id="dash-usuarios-activos">3</p>
          <small>Clientes registrados</small>
        </article>
      </section>

      <section className="seccion-roles-info">
        <h3>Control de Permisos y Roles</h3>
        <div className="grilla-roles">
          <article className="caja-rol admin">
            <h4>🔴 Administrador</h4>
            <p>Acceso total: gestión de inventario, usuarios, precios y configuración del sistema.</p>
          </article>
          <article className="caja-rol vendedor">
            <h4>🟡 Vendedor</h4>
            <p>Acceso restringido: visualización de productos y procesamiento de órdenes de compra.</p>
          </article>
          <article className="caja-rol cliente">
            <h4>🟢 Cliente</h4>
            <p>Acceso exclusivo a la tienda pública, catálogo, carrito y compras en línea.</p>
          </article>
        </div>
      </section>
    </>
  );
}