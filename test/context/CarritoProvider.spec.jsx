// Pruebas de estado del carrito (contexto) y su persistencia en localStorage.
import { act, render } from '@testing-library/react';
import CarritoProvider from '../../src/context/CarritoProvider';
import { useCarrito } from '../../src/context/contextos';
import { productosDB } from '../../src/data/db';
import { reiniciarDatos } from '../utils';

// Componente auxiliar que expone el valor del contexto a la prueba.
function Espia({ onValor }) {
  onValor(useCarrito());
  return null;
}

function renderCarrito() {
  const ref = { actual: null };
  render(<CarritoProvider><Espia onValor={(valor) => { ref.actual = valor; }} /></CarritoProvider>);
  return ref;
}

describe('CarritoProvider', () => {
  beforeEach(() => reiniciarDatos());

  it('agrega productos y acumula la cantidad si ya existían', () => {
    const carrito = renderCarrito();
    const cola = productosDB.obtener(1);

    act(() => carrito.actual.agregar(cola));
    act(() => carrito.actual.agregar(cola, 2));

    expect(carrito.actual.items.length).toBe(1);
    expect(carrito.actual.totalCantidad).toBe(3);
    expect(carrito.actual.subtotal).toBe(2500 * 3);
  });

  it('usa el precio de oferta para calcular el subtotal', () => {
    const carrito = renderCarrito();
    act(() => carrito.actual.agregar(productosDB.obtener(2), 2)); // oferta 1490
    expect(carrito.actual.subtotal).toBe(2980);
  });

  it('no permite superar el stock disponible', () => {
    const carrito = renderCarrito();
    const cervezas = productosDB.obtener(7); // stock 3

    act(() => carrito.actual.agregar(cervezas, 10));
    expect(carrito.actual.totalCantidad).toBe(3);

    act(() => carrito.actual.cambiarCantidad(7, 8));
    expect(carrito.actual.totalCantidad).toBe(3);
  });

  it('no agrega productos sin stock', () => {
    const carrito = renderCarrito();
    act(() => carrito.actual.agregar(productosDB.obtener(10)));
    expect(carrito.actual.items.length).toBe(0);
  });

  it('elimina el producto al dejar la cantidad en 0 y permite vaciar', () => {
    const carrito = renderCarrito();
    act(() => {
      carrito.actual.agregar(productosDB.obtener(1));
      carrito.actual.agregar(productosDB.obtener(3));
    });
    act(() => carrito.actual.cambiarCantidad(1, 0));
    expect(carrito.actual.items.map((i) => i.producto.id)).toEqual([3]);

    act(() => carrito.actual.vaciar());
    expect(carrito.actual.items.length).toBe(0);
  });

  it('guarda el carrito en localStorage y lo restaura al volver a montar', () => {
    const carrito = renderCarrito();
    act(() => carrito.actual.agregar(productosDB.obtener(4), 2));
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([{ id: 4, cantidad: 2 }]);

    const otro = renderCarrito();
    expect(otro.actual.totalCantidad).toBe(2);
  });

  it('refleja en tiempo real los cambios de precio hechos en la base de datos', () => {
    const carrito = renderCarrito();
    act(() => carrito.actual.agregar(productosDB.obtener(1)));
    act(() => { productosDB.actualizar(1, { precio: 3000 }); });
    expect(carrito.actual.subtotal).toBe(3000);
  });
});
