// Pruebas del flujo de compra: checkout → pago correcto / pago con error.
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from '../../src/pages/Checkout';
import PagoExitoso from '../../src/pages/PagoExitoso';
import PagoError from '../../src/pages/PagoError';
import { ordenesDB, productosDB } from '../../src/data/db';
import { renderConApp, reiniciarDatos } from '../utils';

const rutas = {
  '/compra/exito/:id': <PagoExitoso />,
  '/compra/error/:id': <PagoError />,
};

const renderCheckout = () => renderConApp(<Checkout />, { ruta: '/checkout', path: '/checkout', rutas });

describe('Página Checkout', () => {
  it('avisa cuando el carrito está vacío', () => {
    reiniciarDatos();
    renderCheckout();
    expect(screen.getByText(/No tienes productos en el carrito/)).toBeTruthy();
  });

  it('autocompleta los datos del cliente con la sesión iniciada', () => {
    reiniciarDatos({ sesion: 3, carrito: [{ id: 1, cantidad: 1 }] });
    renderCheckout();

    expect(screen.getByLabelText(/^Nombre/).value).toBe('Juan');
    expect(screen.getByLabelText(/Apellidos/).value).toBe('Pérez');
    expect(screen.getByLabelText(/^Calle/).value).toBe('Av. Providencia 1234');
    expect(screen.getByLabelText(/Comuna/).value).toBe('Providencia');
  });

  it('muestra errores si faltan datos obligatorios', async () => {
    reiniciarDatos({ carrito: [{ id: 1, cantidad: 1 }] });
    renderCheckout();

    await userEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    expect(screen.getByText('El nombre es obligatorio.')).toBeTruthy();
    expect(screen.getByText('La calle es obligatoria.')).toBeTruthy();
  });

  it('cambiar a retiro en tienda oculta la dirección y elimina el costo de envío', async () => {
    reiniciarDatos({ carrito: [{ id: 1, cantidad: 1 }] }); // $2.500 + $2.000 envío
    renderCheckout();
    expect(screen.getByRole('button', { name: /Pagar ahora/ }).textContent).toContain('$4.500');

    await userEvent.click(screen.getByLabelText(/Retiro en tienda/));

    expect(screen.queryByLabelText(/^Calle/)).toBeNull();
    expect(screen.getByRole('button', { name: /Pagar ahora/ }).textContent).toContain('$2.500');
  });

  it('con pago correcto crea la orden, descuenta stock, vacía el carrito y muestra el resumen', async () => {
    reiniciarDatos({ sesion: 3, carrito: [{ id: 1, cantidad: 2 }] });
    renderCheckout();

    await userEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    const orden = ordenesDB.listar().at(-1);
    expect(screen.getByRole('heading', { name: new RegExp(`Se ha realizado la compra. Nro #${orden.id}`) })).toBeTruthy();
    expect(orden.estado).toBe('pagada');
    expect(orden.usuarioId).toBe(3);
    expect(productosDB.obtener(1).stock).toBe(48);
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([]);
  });

  it('con pago rechazado muestra la vista de error y mantiene el carrito', async () => {
    reiniciarDatos({ sesion: 3, carrito: [{ id: 1, cantidad: 1 }] });
    renderCheckout();

    await userEvent.click(screen.getByLabelText(/Simular pago rechazado/));
    await userEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    expect(screen.getByRole('heading', { name: /No se pudo realizar el pago/ })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'VOLVER A REALIZAR EL PAGO' }).getAttribute('href')).toBe('/checkout');
    expect(productosDB.obtener(1).stock).toBe(50);
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([{ id: 1, cantidad: 1 }]);
  });
});
