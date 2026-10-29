// src/pages/admin/AdminDashboard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import TarjetaKpi from '../../components/admin/TarjetaKpi';
import TablaOrdenes from '../../components/admin/TablaOrdenes';
import { categoriasDB, ordenesDB, productosDB, reiniciarBaseDatos, usuariosDB } from '../../data/db';
import { productosCriticos, resumenVentas } from '../../data/tienda';
import { useAuth } from '../../context/contextos';
import useColeccion from '../../hooks/useColeccion';
import { formatearMoneda } from '../../utils/formato';
import { MENU_ADMIN } from './configAdmin';

export default function AdminDashboard() {
  const { usuario } = useAuth();
  const ordenes = useColeccion(ordenesDB);
  const productos = useColeccion(productosDB);
  const categorias = useColeccion(categoriasDB);
  const usuarios = useColeccion(usuariosDB);
  const [confirmarReinicio, setConfirmarReinicio] = useState(false);

  const resumen = resumenVentas(ordenes, productos, categorias);
  const criticos = productosCriticos(productos);
  const stockTotal = productos.reduce((acc, p) => acc + p.stock, 0);
  const recientes = [...ordenes].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5);
  const modulos = MENU_ADMIN.filter((m) => !m.soloAdmin || usuario.rol === 'admin');

  return (
    <>
      <EncabezadoSeccion titulo="Dashboard" subtitulo="Resumen de las actividades diarias" />

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <TarjetaKpi titulo="Compras" valor={resumen.cantidadPagadas} icono="cart-check" color="primary" detalle={`Total vendido: ${formatearMoneda(resumen.totalVendido)}`} />
        </div>
        <div className="col-md-4">
          <TarjetaKpi titulo="Productos" valor={productos.length} icono="box-seam" color="success" detalle={`Inventario actual: ${stockTotal} unidades`} />
        </div>
        <div className="col-md-4">
          <TarjetaKpi titulo="Usuarios" valor={usuarios.length} icono="people" color="warning" detalle={`Clientes: ${usuarios.filter((u) => u.rol === 'cliente').length}`} />
        </div>
      </div>

      {criticos.length > 0 && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span><i className="bi bi-exclamation-triangle me-1"></i>{criticos.length} productos con stock crítico.</span>
          <Link to="/admin/productos/criticos" className="btn btn-sm btn-warning">Revisar</Link>
        </div>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        {modulos.map((m) => (
          <div className="col" key={m.to}>
            <Link to={m.to} className="card h-100 text-center text-decoration-none shadow-sm tarjeta-modulo">
              <div className="card-body">
                <i className={`bi bi-${m.icono} fs-2 text-primary`}></i>
                <h2 className="h6 mt-2">{m.texto}</h2>
                <p className="small text-body-secondary mb-0">{m.descripcion}</p>
              </div>
            </Link>
          </div>
        ))}
        <div className="col">
          <Link to="/" className="card h-100 text-center text-decoration-none shadow-sm tarjeta-modulo">
            <div className="card-body">
              <i className="bi bi-shop fs-2 text-primary"></i>
              <h2 className="h6 mt-2">Tienda</h2>
              <p className="small text-body-secondary mb-0">Visualiza tu tienda en tiempo real.</p>
            </div>
          </Link>
        </div>
      </div>

      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">Últimas órdenes</h2>
          <TablaOrdenes ordenes={recientes} />
        </div>
      </section>

      {usuario.rol === 'admin' && (
        <section className="card border-danger-subtle">
          <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h2 className="h6 mb-0">Datos de demostración</h2>
              <small className="text-body-secondary">Restablece productos, usuarios y órdenes a los valores iniciales.</small>
            </div>
            {confirmarReinicio ? (
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-sm btn-danger" onClick={() => { reiniciarBaseDatos(); setConfirmarReinicio(false); }}>Sí, restablecer</button>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setConfirmarReinicio(false)}>Cancelar</button>
              </div>
            ) : (
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setConfirmarReinicio(true)}>Restablecer datos</button>
            )}
          </div>
        </section>
      )}
    </>
  );
}
