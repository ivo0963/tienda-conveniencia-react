// src/components/productos/ListaProductos.jsx
import ProductoCard from './ProductoCard';

export default function ListaProductos({ productos, categorias = [], onAgregar, mensajeVacio = 'No se encontraron productos.' }) {
  if (productos.length === 0) {
    return (
      <div className="alert alert-info" role="status">
        {mensajeVacio}
      </div>
    );
  }

  const nombreCategoria = (id) => categorias.find((c) => c.id === id)?.nombre;

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4" data-testid="lista-productos">
      {productos.map((producto) => (
        <div className="col" key={producto.id}>
          <ProductoCard producto={producto} categoria={nombreCategoria(producto.categoriaId)} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}
