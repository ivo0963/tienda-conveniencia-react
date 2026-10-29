// Pruebas de renderizado de listas: se muestran todos los elementos del conjunto de datos.
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListaProductos from '../../src/components/productos/ListaProductos';
import { productosIniciales, categoriasIniciales } from '../../src/data/semilla';

const renderLista = (props) =>
  render(
    <MemoryRouter>
      <ListaProductos onAgregar={() => {}} {...props} />
    </MemoryRouter>
  );

describe('ListaProductos', () => {
  it('renderiza una tarjeta por cada producto del conjunto de datos', () => {
    renderLista({ productos: productosIniciales });

    const lista = screen.getByTestId('lista-productos');
    expect(within(lista).getAllByRole('article').length).toBe(productosIniciales.length);
    productosIniciales.forEach((p) => {
      expect(within(lista).getByRole('heading', { name: p.nombre })).toBeTruthy();
    });
  });

  it('muestra el nombre de la categoría de cada producto', () => {
    const productos = productosIniciales.filter((p) => p.categoriaId === 4);
    renderLista({ productos, categorias: categoriasIniciales });

    expect(screen.getAllByText('Lácteos y Cecinas').length).toBe(productos.length);
  });

  it('muestra el mensaje de lista vacía cuando no hay productos', () => {
    renderLista({ productos: [], mensajeVacio: 'Nada por aquí' });

    expect(screen.getByRole('status').textContent).toBe('Nada por aquí');
    expect(screen.queryByTestId('lista-productos')).toBeNull();
  });
});
