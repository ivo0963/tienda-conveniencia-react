// Pruebas de navegación: cada ruta del diagrama de flujo renderiza su vista.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import { reiniciarDatos } from './utils';

const urlOriginal = window.location.pathname + window.location.search;

function renderEn(ruta) {
  window.history.pushState({}, '', ruta);
  return render(<App />);
}

describe('App - navegación de la tienda', () => {
  beforeEach(() => reiniciarDatos());
  afterEach(() => window.history.pushState({}, '', urlOriginal));

  const vistasTienda = [
    ['/', /Bienvenido a MiniMarket DSY/],
    ['/productos', /Catálogo de productos/],
    ['/productos/1', /Bebida Cola 2.5 L/],
    ['/categorias', /^Categorías$/],
    ['/categorias/2', /Snacks y Golosinas/],
    ['/ofertas', /^Ofertas$/],
    ['/carrito', /Tu carrito está vacío/],
    ['/nosotros', /Sobre nosotros/],
    ['/blog', /Novedades y consejos/],
    ['/blog/2', /despensa económica/],
    ['/contacto', /^Contacto$/],
    ['/login', /Iniciar sesión/],
    ['/registro', /Crear cuenta/],
    ['/compra/exito/1', /Se ha realizado la compra/],
    ['/compra/error/3', /No se pudo realizar el pago/],
  ];

  vistasTienda.forEach(([ruta, titulo]) => {
    it(`renderiza la vista ${ruta}`, () => {
      renderEn(ruta);
      expect(screen.getAllByRole('heading', { level: 1, name: titulo }).length).toBeGreaterThan(0);
    });
  });

  it('muestra la página 404 en rutas inexistentes y para ids que no existen', () => {
    renderEn('/no-existe');
    expect(screen.getByText('404')).toBeTruthy();
  });

  it('muestra 404 para un producto, categoría o blog inexistente', () => {
    const { unmount } = renderEn('/productos/999');
    expect(screen.getByText('El producto que buscas no existe.')).toBeTruthy();
    unmount();
    renderEn('/blog/999');
    expect(screen.getByText('El artículo no existe.')).toBeTruthy();
  });

  it('la búsqueda del header lleva al catálogo filtrado', async () => {
    renderEn('/');
    await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar productos' }), 'leche');
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(window.location.pathname).toBe('/productos');
    expect(window.location.search).toBe('?texto=leche');
    expect(within(screen.getByTestId('lista-productos')).getAllByRole('article').length).toBe(1);
  });

  it('el detalle de producto agrega la cantidad elegida al carrito', async () => {
    renderEn('/productos/4');
    const cantidad = screen.getByLabelText('Cantidad');
    await userEvent.clear(cantidad);
    await userEvent.type(cantidad, '3');
    // El primer botón es el del producto; los siguientes son de "productos relacionados".
    await userEvent.click(screen.getAllByRole('button', { name: /Añadir al carrito/ })[0]);

    expect(screen.getByRole('status').textContent).toContain('Producto agregado');
    expect(screen.getByTestId('contador-carrito').textContent).toBe('3');
  });

  it('el carrito permite modificar cantidades y vaciarse', async () => {
    reiniciarDatos({ carrito: [{ id: 1, cantidad: 2 }, { id: 3, cantidad: 1 }] });
    renderEn('/carrito');
    expect(screen.getByTestId('subtotal-carrito').textContent).toBe('$7.100');

    await userEvent.click(screen.getByRole('button', { name: 'Agregar uno de Bebida Cola 2.5 L' }));
    expect(screen.getByTestId('subtotal-carrito').textContent).toBe('$9.600');

    await userEvent.click(screen.getByRole('button', { name: /Vaciar carrito/ }));
    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeTruthy();
  });

  it('el registro crea la cuenta e inicia sesión', async () => {
    renderEn('/registro');
    await userEvent.type(screen.getByLabelText(/^RUN/), '201234565');
    await userEvent.type(screen.getByLabelText(/Correo electrónico/), 'nueva@duoc.cl');
    await userEvent.type(screen.getByLabelText(/^Nombre/), 'Camila');
    await userEvent.type(screen.getByLabelText(/^Apellidos/), 'Soto');
    await userEvent.type(screen.getByLabelText(/^Contraseña/), 'clave1');
    await userEvent.type(screen.getByLabelText(/Confirmar contraseña/), 'clave1');
    await userEvent.selectOptions(screen.getByLabelText(/Región/), 'Valparaíso');
    await userEvent.selectOptions(screen.getByLabelText(/Comuna/), 'Quilpué');
    await userEvent.click(screen.getByRole('button', { name: /Registrarse/ }));

    expect(window.location.pathname).toBe('/');
    expect(screen.getByRole('button', { name: /Camila/ })).toBeTruthy();
  });

  it('el registro rechaza un correo ya existente', async () => {
    renderEn('/registro');
    await userEvent.type(screen.getByLabelText(/^RUN/), '201234565');
    await userEvent.type(screen.getByLabelText(/Correo electrónico/), 'admin@duoc.cl');
    await userEvent.type(screen.getByLabelText(/^Nombre/), 'X');
    await userEvent.type(screen.getByLabelText(/^Apellidos/), 'Y');
    await userEvent.type(screen.getByLabelText(/^Contraseña/), 'clave1');
    await userEvent.type(screen.getByLabelText(/Confirmar contraseña/), 'clave1');
    await userEvent.selectOptions(screen.getByLabelText(/Región/), 'Biobío');
    await userEvent.selectOptions(screen.getByLabelText(/Comuna/), 'Chillán');
    await userEvent.click(screen.getByRole('button', { name: /Registrarse/ }));

    expect(screen.getAllByRole('alert').map((a) => a.textContent)).toContain('Ya existe una cuenta con ese correo.');
  });
});
