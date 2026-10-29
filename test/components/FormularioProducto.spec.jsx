// Pruebas del formulario de productos del panel administrador.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormularioProducto from '../../src/components/admin/FormularioProducto';
import { categoriasIniciales } from '../../src/data/semilla';
import { productoDePrueba } from '../utils';

describe('FormularioProducto', () => {
  let onGuardar;

  beforeEach(() => {
    onGuardar = jasmine.createSpy('onGuardar');
  });

  const renderFormulario = (producto) =>
    render(<FormularioProducto producto={producto} categorias={categoriasIniciales} onGuardar={onGuardar} onCancelar={() => {}} />);

  it('en modo creación muestra el formulario vacío', () => {
    renderFormulario(null);
    expect(screen.getByLabelText(/Código/).value).toBe('');
    expect(screen.getByRole('button', { name: /Crear producto/ })).toBeTruthy();
  });

  it('en modo edición carga los datos del producto', () => {
    renderFormulario(productoDePrueba({ nombre: 'Café', precio: 3990, precioOferta: 2990 }));
    expect(screen.getByLabelText(/^Nombre/).value).toBe('Café');
    expect(screen.getByLabelText(/^Precio \(\$\)/).value).toBe('3990');
    expect(screen.getByLabelText(/Precio oferta/).value).toBe('2990');
    expect(screen.getByRole('button', { name: /Guardar cambios/ })).toBeTruthy();
  });

  it('no guarda y muestra errores si los datos son inválidos', async () => {
    renderFormulario(null);
    await userEvent.click(screen.getByRole('button', { name: /Crear producto/ }));

    expect(onGuardar).not.toHaveBeenCalled();
    expect(screen.getByText('El código es obligatorio.')).toBeTruthy();
    expect(screen.getByText('Seleccione una categoría.')).toBeTruthy();
  });

  it('entrega los datos convertidos a números al guardar', async () => {
    renderFormulario(null);
    await userEvent.type(screen.getByLabelText(/Código/), 'caf-001');
    await userEvent.type(screen.getByLabelText(/^Nombre/), 'Café molido');
    await userEvent.selectOptions(screen.getByLabelText(/Categoría/), '3');
    await userEvent.type(screen.getByLabelText(/^Precio \(\$\)/), '3990');
    await userEvent.type(screen.getByLabelText(/^Stock \*/), '12');
    await userEvent.type(screen.getByLabelText(/Stock crítico/), '3');

    await userEvent.click(screen.getByRole('button', { name: /Crear producto/ }));

    expect(onGuardar).toHaveBeenCalledOnceWith(jasmine.objectContaining({
      codigo: 'CAF-001',
      nombre: 'Café molido',
      categoriaId: 3,
      precio: 3990,
      precioOferta: null,
      stock: 12,
      stockCritico: 3,
      imagen: '/img/sin-imagen.svg',
    }));
  });
});
