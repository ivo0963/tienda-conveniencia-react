// Pruebas de eventos del formulario de filtros (componente controlado).
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiltrosProductos from '../../src/components/productos/FiltrosProductos';
import { categoriasIniciales } from '../../src/data/semilla';
import { FILTROS_VACIOS } from '../../src/utils/filtros';

// Envoltorio con estado para simular cómo lo usa una página real.
function FiltrosConEstado({ onCambiar }) {
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  return (
    <FiltrosProductos
      filtros={filtros}
      categorias={categoriasIniciales}
      onCambiar={(f) => { setFiltros(f); onCambiar(f); }}
      onLimpiar={() => setFiltros(FILTROS_VACIOS)}
    />
  );
}

describe('FiltrosProductos', () => {
  it('lista todas las categorías en el select', () => {
    render(<FiltrosProductos filtros={FILTROS_VACIOS} categorias={categoriasIniciales} onCambiar={() => {}} onLimpiar={() => {}} />);
    // +1 por la opción "Todas las categorías"
    expect(screen.getByLabelText('Categoría').options.length).toBe(categoriasIniciales.length + 1);
  });

  it('notifica el texto escrito en el buscador', async () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    render(<FiltrosConEstado onCambiar={onCambiar} />);

    await userEvent.type(screen.getByLabelText('Buscar'), 'pan');

    expect(screen.getByLabelText('Buscar').value).toBe('pan');
    expect(onCambiar.calls.mostRecent().args[0].texto).toBe('pan');
  });

  it('convierte los checkbox en valores booleanos', async () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    render(<FiltrosConEstado onCambiar={onCambiar} />);

    await userEvent.click(screen.getByLabelText('Solo ofertas'));

    expect(onCambiar.calls.mostRecent().args[0].soloOfertas).toBeTrue();
  });

  it('notifica la categoría seleccionada', async () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    render(<FiltrosConEstado onCambiar={onCambiar} />);

    await userEvent.selectOptions(screen.getByLabelText('Categoría'), '2');

    expect(onCambiar.calls.mostRecent().args[0].categoriaId).toBe('2');
  });

  it('oculta el filtro de categoría cuando mostrarCategoria es false', () => {
    render(<FiltrosProductos filtros={FILTROS_VACIOS} categorias={categoriasIniciales} mostrarCategoria={false} onCambiar={() => {}} onLimpiar={() => {}} />);
    expect(screen.queryByLabelText('Categoría')).toBeNull();
  });

  it('el botón "Limpiar filtros" ejecuta onLimpiar', async () => {
    const onLimpiar = jasmine.createSpy('onLimpiar');
    render(<FiltrosProductos filtros={FILTROS_VACIOS} categorias={[]} onCambiar={() => {}} onLimpiar={onLimpiar} />);

    await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));

    expect(onLimpiar).toHaveBeenCalled();
  });
});
