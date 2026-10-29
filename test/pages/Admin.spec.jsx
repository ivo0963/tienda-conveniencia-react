// Pruebas del panel administrador: navegación, permisos por rol y operaciones CRUD.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';
import { categoriasDB, ordenesDB, productosDB, usuariosDB } from '../../src/data/db';
import { reiniciarDatos } from '../utils';

const urlOriginal = window.location.pathname + window.location.search;

let contenedor;

function renderEn(ruta, sesion = 1) {
  reiniciarDatos({ sesion });
  window.history.pushState({}, '', ruta);
  const resultado = render(<App />);
  contenedor = resultado.container;
  return resultado;
}

const tituloPrincipal = () => within(contenedor).getAllByRole('heading', { level: 1 })[0].textContent;

describe('Panel administrador', () => {
  afterEach(() => window.history.pushState({}, '', urlOriginal));

  const vistasAdmin = [
    ['/admin', 'Dashboard'],
    ['/admin/ordenes', 'Órdenes / Boletas'],
    ['/admin/ordenes/1', 'Boleta ORD00001'],
    ['/admin/productos', 'Productos'],
    ['/admin/productos/nuevo', 'Nuevo producto'],
    ['/admin/productos/1', 'Bebida Cola 2.5 L'],
    ['/admin/productos/1/editar', 'Editar producto: Bebida Cola 2.5 L'],
    ['/admin/productos/criticos', 'Listado de productos críticos'],
    ['/admin/productos/reportes', 'Reportes de productos'],
    ['/admin/categorias', 'Categorías'],
    ['/admin/categorias/nueva', 'Nueva categoría'],
    ['/admin/categorias/1/editar', 'Editar categoría: Bebidas y Licores'],
    ['/admin/usuarios', 'Usuarios'],
    ['/admin/usuarios/nuevo', 'Nuevo usuario'],
    ['/admin/usuarios/3', 'Juan Pérez'],
    ['/admin/usuarios/3/editar', 'Editar usuario: Juan Pérez'],
    ['/admin/usuarios/3/historial', 'Historial de compras'],
    ['/admin/reportes', 'Reportes'],
    ['/admin/perfil', 'Mi perfil'],
  ];

  vistasAdmin.forEach(([ruta, titulo]) => {
    it(`renderiza la vista ${ruta}`, () => {
      renderEn(ruta);
      expect(tituloPrincipal()).toBe(titulo);
    });
  });

  it('el vendedor no ve los módulos exclusivos del administrador', () => {
    renderEn('/admin', 2);
    const menu = screen.getByRole('complementary');
    expect(within(menu).queryByRole('link', { name: /Usuarios/ })).toBeNull();
    expect(within(menu).getByRole('link', { name: /Órdenes/ })).toBeTruthy();
  });

  it('el vendedor no puede entrar a usuarios por URL', () => {
    renderEn('/admin/usuarios', 2);
    expect(screen.getByRole('alert').textContent).toContain('No tienes permisos');
  });

  it('un cliente no puede entrar al panel', () => {
    renderEn('/admin', 3);
    expect(screen.getByRole('alert').textContent).toContain('No tienes permisos');
  });

  it('crea un producto nuevo y lo muestra en su detalle', async () => {
    renderEn('/admin/productos/nuevo');
    await userEvent.type(screen.getByLabelText(/Código/), 'CON-001');
    await userEvent.type(screen.getByLabelText(/^Nombre/), 'Helado 1 L');
    await userEvent.selectOptions(screen.getByLabelText(/Categoría/), '4');
    await userEvent.type(screen.getByLabelText(/^Precio \(\$\)/), '3500');
    await userEvent.type(screen.getByLabelText(/^Stock \*/), '8');
    await userEvent.type(screen.getByLabelText(/Stock crítico/), '2');
    await userEvent.click(screen.getByRole('button', { name: /Crear producto/ }));

    expect(tituloPrincipal()).toBe('Helado 1 L');
    expect(productosDB.listar().some((p) => p.codigo === 'CON-001')).toBeTrue();
  });

  it('no permite crear un producto con un código repetido', async () => {
    renderEn('/admin/productos/nuevo');
    await userEvent.type(screen.getByLabelText(/Código/), 'BEB-001');
    await userEvent.type(screen.getByLabelText(/^Nombre/), 'Duplicado');
    await userEvent.selectOptions(screen.getByLabelText(/Categoría/), '1');
    await userEvent.type(screen.getByLabelText(/^Precio \(\$\)/), '100');
    await userEvent.type(screen.getByLabelText(/^Stock \*/), '1');
    await userEvent.type(screen.getByLabelText(/Stock crítico/), '1');
    await userEvent.click(screen.getByRole('button', { name: /Crear producto/ }));

    expect(screen.getByText('Ya existe un producto con el código BEB-001.')).toBeTruthy();
  });

  it('elimina un producto tras confirmar', async () => {
    renderEn('/admin/productos');
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Arroz Grado 1 1 kg' }));
    await userEvent.click(within(screen.getByRole('alert')).getByRole('button', { name: 'Eliminar' }));

    expect(productosDB.obtener(8)).toBeNull();
    expect(screen.queryByText('Arroz Grado 1 1 kg')).toBeNull();
  });

  it('repone stock desde el listado de críticos', async () => {
    renderEn('/admin/productos/criticos');
    await userEvent.type(screen.getByLabelText('Unidades a reponer de Fideos Spaghetti 400 g'), '20');
    const fila = screen.getByLabelText('Unidades a reponer de Fideos Spaghetti 400 g').closest('tr');
    await userEvent.click(within(fila).getByRole('button', { name: 'Reponer' }));

    expect(productosDB.obtener(10).stock).toBe(20);
  });

  it('no elimina una categoría que tiene productos', async () => {
    renderEn('/admin/categorias');
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Abarrotes' }));

    expect(screen.getByRole('status').textContent).toContain('tiene productos asociados');
    expect(categoriasDB.obtener(3)).not.toBeNull();
  });

  it('crea una categoría nueva', async () => {
    renderEn('/admin/categorias/nueva');
    await userEvent.type(screen.getByLabelText(/Nombre/), 'Congelados');
    await userEvent.click(screen.getByRole('button', { name: /Crear categoría/ }));

    expect(tituloPrincipal()).toBe('Categorías');
    expect(categoriasDB.listar().some((c) => c.nombre === 'Congelados')).toBeTrue();
  });

  it('edita un usuario manteniendo su contraseña si se deja vacía', async () => {
    renderEn('/admin/usuarios/3/editar');
    const nombre = screen.getByLabelText(/^Nombre/);
    await userEvent.clear(nombre);
    await userEvent.type(nombre, 'Juan Carlos');
    await userEvent.click(screen.getByRole('button', { name: /Guardar cambios/ }));

    expect(usuariosDB.obtener(3).nombre).toBe('Juan Carlos');
    expect(usuariosDB.obtener(3).password).toBe('juan1234');
  });

  it('cambia el estado de una orden desde la boleta', async () => {
    renderEn('/admin/ordenes/2');
    await userEvent.selectOptions(screen.getByLabelText('Cambiar estado'), 'enviada');
    expect(ordenesDB.obtener(2).estado).toBe('enviada');
  });

  it('filtra órdenes por estado', async () => {
    renderEn('/admin/ordenes');
    await userEvent.selectOptions(screen.getByLabelText('Filtrar por estado'), 'rechazada');
    expect(screen.getAllByText(/^ORD\d+$/).map((c) => c.textContent)).toEqual(['ORD00003']);
  });
});
