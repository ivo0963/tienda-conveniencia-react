// Pruebas de renderizado, props y eventos de la tarjeta de producto.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductoCard from '../../src/components/productos/ProductoCard';
import { productoDePrueba } from '../utils';

const renderTarjeta = (producto, props = {}) =>
  render(
    <MemoryRouter>
      <ProductoCard producto={producto} onAgregar={() => {}} {...props} />
    </MemoryRouter>
  );

describe('ProductoCard', () => {
  it('renderiza nombre, precio, stock e imagen del producto', () => {
    renderTarjeta(productoDePrueba({ nombre: 'Leche Entera', precio: 1050, stock: 7 }));

    expect(screen.getByRole('heading', { name: 'Leche Entera' })).toBeTruthy();
    expect(screen.getByText('$1.050')).toBeTruthy();
    expect(screen.getByText('Stock disponible: 7')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Leche Entera' }).getAttribute('src')).toBe('/img/sin-imagen.svg');
  });

  it('enlaza al detalle del producto', () => {
    renderTarjeta(productoDePrueba({ id: 5 }));
    const enlaces = screen.getAllByRole('link');
    expect(enlaces.every((a) => a.getAttribute('href') === '/productos/5')).toBeTrue();
  });

  it('muestra precio tachado y porcentaje solo si está en oferta', () => {
    const { rerender } = renderTarjeta(productoDePrueba());
    expect(screen.queryByTestId('precio-normal')).toBeNull();
    expect(screen.queryByText(/^-\d+%$/)).toBeNull();

    rerender(
      <MemoryRouter>
        <ProductoCard producto={productoDePrueba({ precio: 1000, precioOferta: 800 })} onAgregar={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('precio-normal').textContent).toBe('$1.000');
    expect(screen.getByText('$800')).toBeTruthy();
    expect(screen.getByText('-20%')).toBeTruthy();
  });

  it('muestra la categoría recibida por props', () => {
    renderTarjeta(productoDePrueba(), { categoria: 'Lácteos' });
    expect(screen.getByText('Lácteos')).toBeTruthy();
  });

  it('llama a onAgregar con el producto al hacer clic en "Añadir al carrito"', async () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    const producto = productoDePrueba();
    renderTarjeta(producto, { onAgregar });

    await userEvent.click(screen.getByRole('button', { name: /Añadir al carrito/ }));

    expect(onAgregar).toHaveBeenCalledOnceWith(producto);
  });

  it('deshabilita el botón cuando no hay stock', async () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    renderTarjeta(productoDePrueba({ stock: 0 }), { onAgregar });

    const boton = screen.getByRole('button', { name: /Agotado/ });
    await userEvent.click(boton);

    expect(boton.disabled).toBeTrue();
    expect(screen.getByText('Sin stock')).toBeTruthy();
    expect(onAgregar).not.toHaveBeenCalled();
  });
});
