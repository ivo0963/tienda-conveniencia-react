// src/pages/Categorias.jsx
import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../components/ui/EncabezadoSeccion';
import CategoriaCard from '../components/categorias/CategoriaCard';
import ListaProductos from '../components/productos/ListaProductos';
import { categoriasDB, productosDB } from '../data/db';
import { useCarrito } from '../context/contextos';
import useColeccion from '../hooks/useColeccion';

export default function Categorias() {
  const categorias = useColeccion(categoriasDB);
  const productos = useColeccion(productosDB);
  const { agregar } = useCarrito();

  const productosDe = (categoriaId) => productos.filter((p) => p.categoriaId === categoriaId);

  return (
    <>
      <EncabezadoSeccion titulo="Categorías" subtitulo="Explora nuestros productos agrupados por categoría." />

      <div className="row row-cols-2 row-cols-md-4 g-3 mb-5">
        {categorias.map((c) => (
          <div className="col" key={c.id}>
            <CategoriaCard categoria={c} cantidadProductos={productosDe(c.id).length} />
          </div>
        ))}
      </div>

      {categorias.map((c) => (
        <section key={c.id} className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">{c.nombre}</h2>
            <Link to={`/categorias/${c.id}`} className="btn btn-sm btn-outline-marca">Ver categoría</Link>
          </div>
          <ListaProductos productos={productosDe(c.id).slice(0, 4)} onAgregar={(p) => agregar(p)} mensajeVacio="Aún no hay productos en esta categoría." />
        </section>
      ))}
    </>
  );
}
