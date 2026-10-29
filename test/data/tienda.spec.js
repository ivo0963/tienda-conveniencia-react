// Pruebas de las reglas de negocio: precios, envío, compras y reportes.
import { ordenesDB, productosDB } from '../../src/data/db';
import {
  buscarUsuarioDuplicado,
  calcularEnvio,
  esStockCritico,
  estaEnOferta,
  generarCodigoOrden,
  porcentajeDescuento,
  precioFinal,
  procesarCompra,
  productosCriticos,
  resumenVentas,
} from '../../src/data/tienda';
import { productoDePrueba, reiniciarDatos } from '../utils';

const cliente = { nombre: 'Ana', apellidos: 'Rojas', correo: 'ana@gmail.com' };
const direccion = { calle: 'Calle 1', departamento: '', region: 'Metropolitana', comuna: 'Santiago', indicaciones: '' };

describe('Reglas de precios y stock', () => {
  it('detecta ofertas y calcula el precio final y el descuento', () => {
    const normal = productoDePrueba({ precio: 1000 });
    const oferta = productoDePrueba({ precio: 1000, precioOferta: 750 });

    expect(estaEnOferta(normal)).toBeFalse();
    expect(precioFinal(normal)).toBe(1000);
    expect(porcentajeDescuento(normal)).toBe(0);
    expect(estaEnOferta(oferta)).toBeTrue();
    expect(precioFinal(oferta)).toBe(750);
    expect(porcentajeDescuento(oferta)).toBe(25);
  });

  it('no considera oferta un precio de oferta mayor o igual al normal', () => {
    expect(estaEnOferta(productoDePrueba({ precio: 1000, precioOferta: 1000 }))).toBeFalse();
  });

  it('identifica productos con stock crítico', () => {
    const productos = [productoDePrueba({ id: 1, stock: 2, stockCritico: 5 }), productoDePrueba({ id: 2, stock: 9, stockCritico: 5 })];
    expect(esStockCritico(productos[0])).toBeTrue();
    expect(productosCriticos(productos).map((p) => p.id)).toEqual([1]);
  });

  it('calcula el envío según subtotal y tipo de entrega', () => {
    expect(calcularEnvio(5000, 'domicilio')).toBe(2000);
    expect(calcularEnvio(25000, 'domicilio')).toBe(0);
    expect(calcularEnvio(5000, 'retiro')).toBe(0);
    expect(calcularEnvio(0, 'domicilio')).toBe(0);
  });

  it('genera códigos de orden con ceros a la izquierda', () => {
    expect(generarCodigoOrden(7)).toBe('ORD00007');
  });
});

describe('procesarCompra', () => {
  beforeEach(() => reiniciarDatos());

  it('registra una orden pagada y descuenta el stock', () => {
    const leche = productosDB.obtener(4); // precio 1050, oferta 890, stock 40
    const ordenesAntes = ordenesDB.listar().length;

    const orden = procesarCompra({ items: [{ producto: leche, cantidad: 3 }], cliente, direccion, entrega: 'domicilio', metodoPago: 'debito' });

    expect(orden.estado).toBe('pagada');
    expect(orden.codigo).toBe(generarCodigoOrden(orden.id));
    expect(orden.subtotal).toBe(890 * 3);
    expect(orden.envio).toBe(2000);
    expect(orden.total).toBe(890 * 3 + 2000);
    expect(ordenesDB.listar().length).toBe(ordenesAntes + 1);
    expect(productosDB.obtener(4).stock).toBe(37);
  });

  it('rechaza la compra si se simula un rechazo del banco y no toca el stock', () => {
    const pan = productosDB.obtener(3);
    const orden = procesarCompra({ items: [{ producto: pan, cantidad: 1 }], cliente, direccion, entrega: 'retiro', metodoPago: 'credito', simularRechazo: true });

    expect(orden.estado).toBe('rechazada');
    expect(orden.motivoRechazo).toContain('rechazado');
    expect(productosDB.obtener(3).stock).toBe(pan.stock);
  });

  it('rechaza la compra si no hay stock suficiente', () => {
    const cervezas = productosDB.obtener(7); // stock 3
    const orden = procesarCompra({ items: [{ producto: cervezas, cantidad: 10 }], cliente, direccion, entrega: 'domicilio', metodoPago: 'debito' });

    expect(orden.estado).toBe('rechazada');
    expect(orden.motivoRechazo).toContain('Pack 6 Cervezas');
    expect(productosDB.obtener(7).stock).toBe(3);
  });
});

describe('resumenVentas', () => {
  it('calcula totales ignorando las órdenes rechazadas', () => {
    const productos = [productoDePrueba({ id: 1, categoriaId: 1 }), productoDePrueba({ id: 2, categoriaId: 2 })];
    const categorias = [{ id: 1, nombre: 'A' }, { id: 2, nombre: 'B' }];
    const ordenes = [
      { estado: 'pagada', total: 3000, items: [{ productoId: 1, nombre: 'P1', precio: 1000, cantidad: 3 }] },
      { estado: 'entregada', total: 2000, items: [{ productoId: 2, nombre: 'P2', precio: 500, cantidad: 4 }] },
      { estado: 'rechazada', total: 9999, items: [{ productoId: 1, nombre: 'P1', precio: 1000, cantidad: 9 }] },
    ];

    const r = resumenVentas(ordenes, productos, categorias);

    expect(r.totalVendido).toBe(5000);
    expect(r.cantidadOrdenes).toBe(3);
    expect(r.cantidadPagadas).toBe(2);
    expect(r.ticketPromedio).toBe(2500);
    expect(r.ventasPorProducto[0]).toEqual({ productoId: 1, nombre: 'P1', unidades: 3, monto: 3000 });
    expect(r.ventasPorCategoria.find((c) => c.categoriaId === 2).monto).toBe(2000);
    expect(r.ordenesPorEstado.find((e) => e.estado === 'rechazada').cantidad).toBe(1);
  });

  it('devuelve ticket promedio 0 si no hay ventas', () => {
    expect(resumenVentas([], [], []).ticketPromedio).toBe(0);
  });
});

describe('buscarUsuarioDuplicado', () => {
  beforeEach(() => reiniciarDatos());

  it('detecta correos y RUN ya registrados', () => {
    expect(buscarUsuarioDuplicado({ correo: 'ADMIN@duoc.cl', run: '1' })).toContain('correo');
    expect(buscarUsuarioDuplicado({ correo: 'nuevo@gmail.com', run: '123456785' })).toContain('RUN');
    expect(buscarUsuarioDuplicado({ correo: 'nuevo@gmail.com', run: '201234565' })).toBeNull();
  });

  it('ignora al propio usuario al editar', () => {
    expect(buscarUsuarioDuplicado({ correo: 'admin@duoc.cl', run: '111111111' }, 1)).toBeNull();
  });
});
