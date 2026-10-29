// src/pages/CategoriaDetalle.jsx
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../components/ui/EncabezadoSeccion';
import FiltrosProductos from '../components/productos/FiltrosProductos';
import ListaProductos from '../components/productos/ListaProductos';
import { categoriasDB, productosDB } from '../data/db';
import { useCarrito } from '../context/contextos';
import useColeccion from '../hooks/useColeccion';
import { FILTROS_VACIOS, filtrarProductos } from '../utils/filtros';
import NoEncontrado from './NoEncontrado';

export default function CategoriaDetalle() {
  const { id } = useParams();
  const categorias = useColeccion(categoriasDB);
  const productos = useColeccion(productosDB);
  const { agregar } = useCarrito();
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);

  const categoria = categorias.find((c) => c.id === Number(id));
  if (!categoria) return <NoEncontrado mensaje="La categoría no existe." />;

  const resultado = filtrarProductos(productos, { ...filtros, categoriaId: categoria.id });

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/categorias">Categorías</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{categoria.nombre}</li>
        </ol>
      </nav>

      <EncabezadoSeccion titulo={categoria.nombre} subtitulo={categoria.descripcion} />

      <div className="row g-4">
        <aside className="col-lg-3">
          <FiltrosProductos filtros={filtros} categorias={categorias} mostrarCategoria={false} onCambiar={setFiltros} onLimpiar={() => setFiltros(FILTROS_VACIOS)} />
        </aside>
        <section className="col-lg-9">
          <ListaProductos productos={resultado} onAgregar={(p) => agregar(p)} mensajeVacio="No hay productos en esta categoría con esos filtros." />
        </section>
      </div>
    </>
  );
}
