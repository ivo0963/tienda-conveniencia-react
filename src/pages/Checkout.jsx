// src/pages/Checkout.jsx
// Paso de pago: datos del cliente, opciones de entrega y medio de pago.
// Si el usuario tiene sesión iniciada, sus datos se completan automáticamente.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoFormulario from '../components/ui/CampoFormulario';
import SelectorRegionComuna from '../components/compra/SelectorRegionComuna';
import TablaItemsOrden from '../components/compra/TablaItemsOrden';
import Boton from '../components/ui/Boton';
import { useAuth, useCarrito } from '../context/contextos';
import { METODOS_PAGO, calcularEnvio, procesarCompra } from '../data/tienda';
import { formatearMoneda } from '../utils/formato';
import { validarCheckout } from '../utils/validaciones';

const datosDesdeUsuario = (usuario) => ({
  nombre: usuario?.nombre ?? '',
  apellidos: usuario?.apellidos ?? '',
  correo: usuario?.correo ?? '',
  calle: usuario?.direccion ?? '',
  departamento: usuario?.departamento ?? '',
  region: usuario?.region ?? '',
  comuna: usuario?.comuna ?? '',
  indicaciones: '',
  entrega: 'domicilio',
  metodoPago: 'debito',
  simularRechazo: false,
});

export default function Checkout() {
  const { items, subtotal, vaciar } = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(() => datosDesdeUsuario(usuario));
  const [errores, setErrores] = useState({});

  if (items.length === 0) {
    return (
      <div className="alert alert-info">
        No tienes productos en el carrito. <Link to="/productos">Ir al catálogo</Link>
      </div>
    );
  }

  const envio = calcularEnvio(subtotal, datos.entrega);
  const total = subtotal + envio;

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos({ ...datos, [name]: type === 'checkbox' ? checked : value });
  };

  const pagar = (e) => {
    e.preventDefault();
    const nuevosErrores = validarCheckout(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const orden = procesarCompra({
      items: items.map(({ producto, cantidad }) => ({ producto, cantidad })),
      cliente: { nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), correo: datos.correo.trim() },
      direccion: datos.entrega === 'domicilio'
        ? { calle: datos.calle.trim(), departamento: datos.departamento.trim(), region: datos.region, comuna: datos.comuna, indicaciones: datos.indicaciones.trim() }
        : { calle: '', departamento: '', region: '', comuna: '', indicaciones: '' },
      entrega: datos.entrega,
      metodoPago: datos.metodoPago,
      usuarioId: usuario?.id ?? null,
      simularRechazo: datos.simularRechazo,
    });

    if (orden.estado === 'pagada') {
      vaciar();
      navigate(`/compra/exito/${orden.id}`);
    } else {
      navigate(`/compra/error/${orden.id}`);
    }
  };

  return (
    <form className="row justify-content-center" noValidate onSubmit={pagar}>
      <div className="col-lg-9">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
              <div>
                <h1 className="h4 mb-0">Carrito de compra</h1>
                <small className="text-body-secondary">Completa la siguiente información</small>
              </div>
              <span className="badge text-bg-primary fs-6 p-2">Total a pagar: {formatearMoneda(total)}</span>
            </div>

            <TablaItemsOrden items={items.map(({ producto, cantidad, precio }) => ({ productoId: producto.id, nombre: producto.nombre, imagen: producto.imagen, precio, cantidad }))} />

            <h2 className="h5 mt-4">Información del cliente</h2>
            {!usuario && (
              <p className="small text-body-secondary">
                ¿Ya tienes cuenta? <Link to="/login" state={{ desde: '/checkout' }}>Inicia sesión</Link> para completar tus datos automáticamente.
              </p>
            )}
            <div className="row">
              <CampoFormulario id="nombre" name="nombre" etiqueta="Nombre" requerido className="col-md-6" value={datos.nombre} onChange={cambiar} error={errores.nombre} />
              <CampoFormulario id="apellidos" name="apellidos" etiqueta="Apellidos" requerido className="col-md-6" value={datos.apellidos} onChange={cambiar} error={errores.apellidos} />
              <CampoFormulario id="correo" name="correo" type="email" etiqueta="Correo" requerido className="col-md-6" value={datos.correo} onChange={cambiar} error={errores.correo} />
            </div>

            <h2 className="h5 mt-2">Opciones de entrega</h2>
            <div className="mb-3">
              {[
                { valor: 'domicilio', texto: 'Despacho a domicilio', detalle: calcularEnvio(subtotal, 'domicilio') === 0 ? 'Gratis' : formatearMoneda(calcularEnvio(subtotal, 'domicilio')) },
                { valor: 'retiro', texto: 'Retiro en tienda', detalle: 'Gratis' },
              ].map((op) => (
                <div className="form-check" key={op.valor}>
                  <input className="form-check-input" type="radio" name="entrega" id={`entrega-${op.valor}`} value={op.valor} checked={datos.entrega === op.valor} onChange={cambiar} />
                  <label className="form-check-label" htmlFor={`entrega-${op.valor}`}>{op.texto} <span className="text-body-secondary">({op.detalle})</span></label>
                </div>
              ))}
            </div>

            {datos.entrega === 'domicilio' && (
              <>
                <h2 className="h5">Dirección de entrega de los productos</h2>
                <p className="small text-body-secondary">Ingrese la dirección de forma detallada</p>
                <div className="row">
                  <CampoFormulario id="calle" name="calle" etiqueta="Calle" requerido className="col-md-8" value={datos.calle} onChange={cambiar} error={errores.calle} />
                  <CampoFormulario id="departamento" name="departamento" etiqueta="Departamento (opcional)" placeholder="Ej: 603" className="col-md-4" value={datos.departamento} onChange={cambiar} />
                </div>
                <SelectorRegionComuna region={datos.region} comuna={datos.comuna} errores={errores} onCambiar={(rc) => setDatos({ ...datos, ...rc })} />
                <CampoFormulario como="textarea" id="indicaciones" name="indicaciones" etiqueta="Indicaciones para la entrega (opcional)" rows="2" placeholder="Ej.: Entre calles, color del edificio, no tiene timbre." value={datos.indicaciones} onChange={cambiar} />
              </>
            )}

            <h2 className="h5">Medio de pago</h2>
            <CampoFormulario como="select" id="metodoPago" name="metodoPago" etiqueta="Selecciona cómo pagar" value={datos.metodoPago} onChange={cambiar}>
              {Object.entries(METODOS_PAGO).map(([valor, texto]) => (
                <option key={valor} value={valor}>{texto}</option>
              ))}
            </CampoFormulario>
            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" id="simularRechazo" name="simularRechazo" checked={datos.simularRechazo} onChange={cambiar} />
              <label className="form-check-label small text-body-secondary" htmlFor="simularRechazo">
                Simular pago rechazado (demostración del flujo de error)
              </label>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <Link to="/carrito" className="btn btn-outline-secondary"><i className="bi bi-arrow-left me-1"></i>Volver al carrito</Link>
              <Boton tipo="submit" variante="success" icono="lock" etiqueta={`Pagar ahora ${formatearMoneda(total)}`} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
