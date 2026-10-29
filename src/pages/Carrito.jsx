// src/pages/Carrito.jsx
import { Link, useNavigate } from 'react-router-dom';
import EncabezadoSeccion from '../components/ui/EncabezadoSeccion';
import CarritoTabla from '../components/carrito/CarritoTabla';
import Boton from '../components/ui/Boton';
import { useCarrito } from '../context/contextos';
import { ENVIO_GRATIS_DESDE } from '../data/tienda';
import { formatearMoneda } from '../utils/formato';

export default function Carrito() {
  const { items, subtotal, totalCantidad, cambiarCantidad, eliminar, vaciar } = useCarrito();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-cart-x display-1 text-body-secondary"></i>
        <h1 className="h4 mt-3">Tu carrito está vacío</h1>
        <p className="text-body-secondary">Agrega productos desde el catálogo para comenzar tu compra.</p>
        <Link to="/productos" className="btn btn-marca">Ver catálogo</Link>
      </div>
    );
  }

  const faltaEnvioGratis = ENVIO_GRATIS_DESDE - subtotal;

  return (
    <>
      <EncabezadoSeccion titulo="Carrito de compras" subtitulo={`${totalCantidad} productos en tu carrito`} />
      <div className="row g-4">
        <section className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <CarritoTabla items={items} onCambiarCantidad={cambiarCantidad} onEliminar={eliminar} />
            </div>
          </div>
          <Link to="/productos" className="btn btn-link px-0 mt-2"><i className="bi bi-arrow-left me-1"></i>Seguir comprando</Link>
        </section>

        <aside className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5">Resumen</h2>
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <strong data-testid="subtotal-carrito">{formatearMoneda(subtotal)}</strong>
              </div>
              <p className="small text-body-secondary mt-2">
                {faltaEnvioGratis > 0
                  ? `Agrega ${formatearMoneda(faltaEnvioGratis)} más para obtener despacho gratis.`
                  : '¡Tu compra tiene despacho gratis!'}
              </p>
              <div className="d-grid gap-2">
                <Boton etiqueta="Comprar ahora" icono="credit-card" variante="success" onClick={() => navigate('/checkout')} />
                <Boton etiqueta="Vaciar carrito" icono="trash" variante="outline-secondary" onClick={vaciar} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
