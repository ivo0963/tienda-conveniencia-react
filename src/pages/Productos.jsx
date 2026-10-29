// src/pages/Productos.jsx
// Los filtros se guardan en la URL (?texto=...&categoriaId=...) para que la
// búsqueda del header funcione y el botón "atrás" del navegador los respete.
import { useSearchParams } from 'react-router-dom';
import EncabezadoSeccion from '../components/ui/EncabezadoSeccion';
import FiltrosProductos from '../components/productos/FiltrosProductos';
import ListaProductos from '../components/productos/ListaProductos';
import { categoriasDB, productosDB } from '../data/db';
import { useCarrito } from '../context/contextos';
import useColeccion from '../hooks/useColeccion';
import { FILTROS_VACIOS, filtrarProductos } from '../utils/filtros';

function leerFiltros(params) {
  return {
    texto: params.get('texto') ?? '',
    categoriaId: params.get('categoriaId') ?? '',
    precioMax: params.get('precioMax') ?? '',
    soloOfertas: params.get('soloOfertas') === '1',
    soloStock: params.get('soloStock') === '1',
    orden: params.get('orden') ?? FILTROS_VACIOS.orden,
  };
}

function escribirFiltros(filtros) {
  const params = {};
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor === true) params[clave] = '1';
    else if (valor && valor !== FILTROS_VACIOS[clave]) params[clave] = valor;
  });
  return params;
}

export default function Productos() {
  const productos = useColeccion(productosDB);
  const categorias = useColeccion(categoriasDB);
  const { agregar } = useCarrito();
  const [params, setParams] = useSearchParams();

  const filtros = leerFiltros(params);
  const resultado = filtrarProductos(productos, filtros);

  return (
    <>
      <EncabezadoSeccion titulo="Catálogo de productos" subtitulo="Encuentra tus abarrotes, snacks y bebidas favoritas.">
        <span className="text-body-secondary small">{resultado.length} de {productos.length} productos</span>
      </EncabezadoSeccion>

      <div className="row g-4">
        <aside className="col-lg-3">
          <FiltrosProductos
            filtros={filtros}
            categorias={categorias}
            onCambiar={(nuevos) => setParams(escribirFiltros(nuevos), { replace: true })}
            onLimpiar={() => setParams({})}
          />
        </aside>
        <section className="col-lg-9">
          <ListaProductos productos={resultado} categorias={categorias} onAgregar={(p) => agregar(p)} mensajeVacio="No hay productos que coincidan con los filtros." />
        </section>
      </div>
    </>
  );
}
