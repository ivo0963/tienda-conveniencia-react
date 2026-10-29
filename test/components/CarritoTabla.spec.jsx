// Pruebas de eventos de la tabla del carrito.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarritoTabla from '../../src/components/carrito/CarritoTabla';
import { productoDePrueba } from '../utils';

const item = (cambios = {}, cantidad = 2) => {
  const producto = productoDePrueba(cambios);
  return { producto, cantidad, precio: producto.precio, subtotal: producto.precio * cantidad };
};

describe('CarritoTabla', () => {
  let onCambiarCantidad;
  let onEliminar;

  beforeEach(() => {
    onCambiarCantidad = jasmine.createSpy('onCambiarCantidad');
    onEliminar = jasmine.createSpy('onEliminar');
  });

  const renderTabla = (items) => render(<CarritoTabla items={items} onCambiarCantidad={onCambiarCantidad} onEliminar={onEliminar} />);

  it('renderiza una fila por producto con su subtotal', () => {
    renderTabla([item({ id: 1, nombre: 'Pan', precio: 2100 }, 3), item({ id: 2, nombre: 'Leche', precio: 1000 }, 1)]);

    expect(screen.getByTestId('fila-carrito-1').textContent).toContain('$6.300');
    expect(screen.getByTestId('fila-carrito-2').textContent).toContain('$1.000');
  });

  it('al hacer clic en "+" pide aumentar la cantidad en 1', async () => {
    renderTabla([item({ id: 7, nombre: 'Pan' }, 2)]);
    await userEvent.click(screen.getByRole('button', { name: 'Agregar uno de Pan' }));
    expect(onCambiarCantidad).toHaveBeenCalledWith(7, 3);
  });

  it('al hacer clic en "-" pide disminuir la cantidad en 1', async () => {
    renderTabla([item({ id: 7, nombre: 'Pan' }, 2)]);
    await userEvent.click(screen.getByRole('button', { name: 'Quitar uno de Pan' }));
    expect(onCambiarCantidad).toHaveBeenCalledWith(7, 1);
  });

  it('al hacer clic en eliminar llama a onEliminar con el id', async () => {
    renderTabla([item({ id: 7, nombre: 'Pan' })]);
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Pan' }));
    expect(onEliminar).toHaveBeenCalledOnceWith(7);
  });

  it('deshabilita "+" cuando la cantidad alcanza el stock', () => {
    renderTabla([item({ id: 7, nombre: 'Pan', stock: 2 }, 2)]);
    expect(screen.getByRole('button', { name: 'Agregar uno de Pan' }).disabled).toBeTrue();
  });
});
