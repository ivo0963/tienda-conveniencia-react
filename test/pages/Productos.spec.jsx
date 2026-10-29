// Pruebas de integración del catálogo: filtros, búsqueda por URL y agregar al carrito.
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Productos from '../../src/pages/Productos';
import Header from '../../src/components/layout/Header';
import { productosIniciales } from '../../src/data/semilla';
import { renderConApp, reiniciarDatos } from '../utils';

const tarjetas = () => within(screen.getByTestId('lista-productos')).getAllByRole('article');

describe('Página Productos', () => {
  beforeEach(() => reiniciarDatos());

  it('muestra todo el catálogo inicialmente', () => {
    renderConApp(<Productos />, { ruta: '/productos' });
    expect(tarjetas().length).toBe(productosIniciales.length);
  });

  it('lee la búsqueda desde la URL (?texto=)', () => {
    renderConApp(<Productos />, { ruta: '/productos?texto=jugo' });
    expect(screen.getByLabelText('Buscar').value).toBe('jugo');
    expect(tarjetas().length).toBe(1);
  });

  it('filtra al escribir y muestra un mensaje si no hay resultados', async () => {
    renderConApp(<Productos />, { ruta: '/productos' });

    await userEvent.type(screen.getByLabelText('Buscar'), 'zzz');

    expect(screen.getByRole('status').textContent).toContain('No hay productos');
  });

  it('al agregar un producto se actualiza el contador del carrito en el header', async () => {
    renderConApp(<><Header /><Productos /></>, { ruta: '/productos' });
    expect(screen.queryByTestId('contador-carrito')).toBeNull();

    const tarjetaLeche = tarjetas().find((t) => t.textContent.includes('Leche Entera'));
    await userEvent.click(within(tarjetaLeche).getByRole('button', { name: /Añadir al carrito/ }));
    await userEvent.click(within(tarjetaLeche).getByRole('button', { name: /Añadir al carrito/ }));

    expect(screen.getByTestId('contador-carrito').textContent).toBe('2');
  });
});
