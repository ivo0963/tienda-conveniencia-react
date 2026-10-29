// Pruebas de la lógica de búsqueda y filtros del catálogo.
import { filtrarProductos } from '../../src/utils/filtros';
import { productosIniciales } from '../../src/data/semilla';

const nombres = (lista) => lista.map((p) => p.nombre);

describe('filtrarProductos', () => {
  it('sin filtros devuelve todos los productos', () => {
    expect(filtrarProductos(productosIniciales, {}).length).toBe(productosIniciales.length);
  });

  it('busca por texto sin distinguir mayúsculas ni tildes', () => {
    expect(nombres(filtrarProductos(productosIniciales, { texto: 'LECHE' }))).toEqual(['Leche Entera 1 L']);
    expect(nombres(filtrarProductos(productosIniciales, { texto: 'semola' }))).toEqual(['Fideos Spaghetti 400 g']);
  });

  it('busca también por código', () => {
    expect(nombres(filtrarProductos(productosIniciales, { texto: 'beb-003' }))).toEqual(['Pack 6 Cervezas']);
  });

  it('filtra por categoría', () => {
    const resultado = filtrarProductos(productosIniciales, { categoriaId: '2' });
    expect(resultado.every((p) => p.categoriaId === 2)).toBeTrue();
    expect(resultado.length).toBe(2);
  });

  it('filtra por precio máximo usando el precio final (con oferta)', () => {
    const resultado = filtrarProductos(productosIniciales, { precioMax: '900' });
    expect(nombres(resultado).sort()).toEqual(['Fideos Spaghetti 400 g', 'Galletas Chocolate 120 g', 'Leche Entera 1 L']);
  });

  it('combina "solo ofertas" y "solo con stock"', () => {
    const ofertas = filtrarProductos(productosIniciales, { soloOfertas: true });
    expect(ofertas.length).toBe(4);
    const conStock = filtrarProductos(productosIniciales, { soloStock: true });
    expect(conStock.some((p) => p.stock === 0)).toBeFalse();
  });

  it('ordena por precio ascendente, descendente y por nombre', () => {
    const asc = filtrarProductos(productosIniciales, { orden: 'precio-asc' });
    const desc = filtrarProductos(productosIniciales, { orden: 'precio-desc' });
    const alfabetico = filtrarProductos(productosIniciales, { orden: 'nombre' });

    expect(asc[0].nombre).toBe('Galletas Chocolate 120 g');
    expect(desc[0].nombre).toBe('Pack 6 Cervezas');
    expect(alfabetico[0].nombre).toBe('Arroz Grado 1 1 kg');
  });

  it('no modifica el arreglo original al ordenar', () => {
    const copia = [...productosIniciales];
    filtrarProductos(productosIniciales, { orden: 'nombre' });
    expect(productosIniciales).toEqual(copia);
  });
});
