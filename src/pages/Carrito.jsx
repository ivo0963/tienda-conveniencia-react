// src/pages/Carrito.jsx
import { Link } from 'react-router-dom';

export default function Carrito({ itemsCarrito = [], cambiarCantidad, eliminarItem, vaciarCarrito }) {
  const costoEnvio = itemsCarrito.length > 0 ? 2000 : 0;
  const subtotal = itemsCarrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const total = subtotal + costoEnvio;

  const formatearMoneda = (monto) => `$${monto.toLocaleString('es-CL')}`;

  return (
    <main className="contenedor-carrito">
      <h2>Tu Carrito de Compras</h2>

      <div className="layout-carrito">
        <section className="seccion-items-carrito">
          <table className="tabla-carrito">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {itemsCarrito.length === 0 ? (
                <tr>
                  <td colSpan="5" className="carrito-vacio-mensaje">
                    Tu carrito está vacío. <Link to="/productos">Ver catálogo</Link>
                  </td>
                </tr>
              ) : (
                itemsCarrito.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>{formatearMoneda(item.precio)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          className="btn" 
                          style={{ padding: '2px 8px', cursor: 'pointer' }}
                          onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 'bold' }}>{item.cantidad}</span>
                        <button 
                          className="btn" 
                          style={{ padding: '2px 8px', cursor: 'pointer' }}
                          onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{formatearMoneda(item.precio * item.cantidad)}</td>
                    <td>
                      <button 
                        className="btn-vaciar" 
                        style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                        onClick={() => eliminarItem(item.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <aside className="resumen-compra">
          <h3>Resumen del Pedido</h3>
          <div className="linea-resumen">
            <span>Subtotal:</span>
            <span>{formatearMoneda(subtotal)}</span>
          </div>
          <div className="linea-resumen">
            <span>Costo Envío:</span>
            <span>{formatearMoneda(costoEnvio)}</span>
          </div>
          <hr />
          <div className="linea-resumen total">
            <span>Total a Pagar:</span>
            <span>{formatearMoneda(total)}</span>
          </div>

          <button 
            className="btn-submit" 
            disabled={itemsCarrito.length === 0}
            onClick={() => alert('¡Gracias por tu compra!')}
          >
            Proceder al Pago
          </button>
          
          {itemsCarrito.length > 0 && (
            <button className="btn-vaciar" onClick={vaciarCarrito} style={{ marginTop: '10px' }}>
              Vaciar Carrito Completo
            </button>
          )}
        </aside>
      </div>
    </main>
  );
}