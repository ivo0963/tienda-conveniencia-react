// src/data/tienda.js
// Reglas de negocio de la tienda construidas sobre las colecciones de db.js.
import { productosDB, ordenesDB, usuariosDB } from './db';

export const COSTO_ENVIO = 2000;
export const ENVIO_GRATIS_DESDE = 20000;

export const ESTADOS_ORDEN = {
  pagada: { etiqueta: 'Pagada', color: 'primary' },
  enviada: { etiqueta: 'Enviada', color: 'info' },
  entregada: { etiqueta: 'Entregada', color: 'success' },
  rechazada: { etiqueta: 'Pago rechazado', color: 'danger' },
};

export const METODOS_PAGO = {
  debito: 'Tarjeta de débito',
  credito: 'Tarjeta de crédito',
  transferencia: 'Transferencia bancaria',
};

export const estaEnOferta = (producto) =>
  producto.precioOferta != null && producto.precioOferta < producto.precio;

export const precioFinal = (producto) =>
  estaEnOferta(producto) ? producto.precioOferta : producto.precio;

export const porcentajeDescuento = (producto) =>
  estaEnOferta(producto) ? Math.round((1 - producto.precioOferta / producto.precio) * 100) : 0;

export const esStockCritico = (producto) => producto.stock <= producto.stockCritico;

export const productosCriticos = (productos) => productos.filter(esStockCritico);

export function calcularEnvio(subtotal, entrega = 'domicilio') {
  if (entrega === 'retiro' || subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE) return 0;
  return COSTO_ENVIO;
}

export const generarCodigoOrden = (id) => `ORD${String(id).padStart(5, '0')}`;

// Registra una compra. Si el pago es rechazado o falta stock, la orden queda
// como "rechazada" y el inventario no se modifica.
// items: [{ producto, cantidad }]
export function procesarCompra({ items, cliente, direccion, entrega, metodoPago, usuarioId = null, simularRechazo = false }) {
  const lineas = items.map(({ producto, cantidad }) => ({
    productoId: producto.id,
    nombre: producto.nombre,
    precio: precioFinal(producto),
    cantidad,
    imagen: producto.imagen,
  }));
  const subtotal = lineas.reduce((acc, l) => acc + l.precio * l.cantidad, 0);
  const envio = calcularEnvio(subtotal, entrega);

  const sinStock = items.filter(({ producto, cantidad }) => {
    const actual = productosDB.obtener(producto.id);
    return !actual || actual.stock < cantidad;
  });

  let motivoRechazo = null;
  if (sinStock.length > 0) {
    motivoRechazo = `Stock insuficiente para: ${sinStock.map((i) => i.producto.nombre).join(', ')}.`;
  } else if (simularRechazo) {
    motivoRechazo = 'El medio de pago fue rechazado por el banco emisor.';
  }

  const orden = ordenesDB.crear({
    codigo: '',
    fecha: new Date().toISOString(),
    usuarioId,
    cliente,
    direccion,
    entrega,
    metodoPago,
    items: lineas,
    subtotal,
    envio,
    total: subtotal + envio,
    estado: motivoRechazo ? 'rechazada' : 'pagada',
    motivoRechazo,
  });
  ordenesDB.actualizar(orden.id, { codigo: generarCodigoOrden(orden.id) });

  if (!motivoRechazo) {
    items.forEach(({ producto, cantidad }) => {
      const actual = productosDB.obtener(producto.id);
      productosDB.actualizar(producto.id, { stock: actual.stock - cantidad });
    });
  }

  return ordenesDB.obtener(orden.id);
}

// Estadísticas usadas por el dashboard y los reportes del administrador.
export function resumenVentas(ordenes, productos, categorias) {
  const pagadas = ordenes.filter((o) => o.estado !== 'rechazada');
  const totalVendido = pagadas.reduce((acc, o) => acc + o.total, 0);

  const porProducto = {};
  pagadas.forEach((o) =>
    o.items.forEach((i) => {
      const fila = porProducto[i.productoId] ?? { productoId: i.productoId, nombre: i.nombre, unidades: 0, monto: 0 };
      fila.unidades += i.cantidad;
      fila.monto += i.precio * i.cantidad;
      porProducto[i.productoId] = fila;
    })
  );
  const ventasPorProducto = Object.values(porProducto).sort((a, b) => b.monto - a.monto);

  const ventasPorCategoria = categorias.map((c) => {
    const ids = productos.filter((p) => p.categoriaId === c.id).map((p) => p.id);
    const monto = ventasPorProducto.filter((v) => ids.includes(v.productoId)).reduce((acc, v) => acc + v.monto, 0);
    return { categoriaId: c.id, nombre: c.nombre, monto };
  });

  const ordenesPorEstado = Object.keys(ESTADOS_ORDEN).map((estado) => ({
    estado,
    cantidad: ordenes.filter((o) => o.estado === estado).length,
  }));

  return {
    totalVendido,
    cantidadOrdenes: ordenes.length,
    cantidadPagadas: pagadas.length,
    ticketPromedio: pagadas.length ? Math.round(totalVendido / pagadas.length) : 0,
    ventasPorProducto,
    ventasPorCategoria,
    ordenesPorEstado,
    inventarioValorizado: productos.reduce((acc, p) => acc + p.precio * p.stock, 0),
  };
}

// Devuelve un mensaje si otro usuario ya usa el mismo correo o RUN.
export function buscarUsuarioDuplicado(datos, idActual = null) {
  const otros = usuariosDB.listar().filter((u) => u.id !== idActual);
  if (otros.some((u) => u.correo.toLowerCase() === datos.correo.trim().toLowerCase())) return 'Ya existe un usuario con ese correo.';
  if (otros.some((u) => u.run === datos.run.toUpperCase())) return 'Ya existe un usuario con ese RUN.';
  return null;
}
