// src/utils/filtros.js
import { estaEnOferta, precioFinal } from '../data/tienda';

export const FILTROS_VACIOS = { texto: '', categoriaId: '', precioMax: '', soloOfertas: false, soloStock: false, orden: 'relevancia' };

export const OPCIONES_ORDEN = {
  relevancia: 'Relevancia',
  'precio-asc': 'Precio: menor a mayor',
  'precio-desc': 'Precio: mayor a menor',
  nombre: 'Nombre (A-Z)',
};

const normalizar = (texto) => String(texto).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function filtrarProductos(productos, filtros) {
  const f = { ...FILTROS_VACIOS, ...filtros };
  const texto = normalizar(f.texto.trim());

  const resultado = productos.filter((p) => {
    if (texto && !normalizar(`${p.nombre} ${p.descripcion} ${p.codigo}`).includes(texto)) return false;
    if (f.categoriaId && p.categoriaId !== Number(f.categoriaId)) return false;
    if (f.precioMax && precioFinal(p) > Number(f.precioMax)) return false;
    if (f.soloOfertas && !estaEnOferta(p)) return false;
    if (f.soloStock && p.stock <= 0) return false;
    return true;
  });

  const comparadores = {
    'precio-asc': (a, b) => precioFinal(a) - precioFinal(b),
    'precio-desc': (a, b) => precioFinal(b) - precioFinal(a),
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
  };
  return comparadores[f.orden] ? [...resultado].sort(comparadores[f.orden]) : resultado;
}
