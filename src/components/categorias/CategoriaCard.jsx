// src/components/categorias/CategoriaCard.jsx
import { Link } from 'react-router-dom';

export default function CategoriaCard({ categoria, cantidadProductos }) {
  return (
    <Link to={`/categorias/${categoria.id}`} className="card h-100 shadow-sm text-decoration-none tarjeta-categoria">
      <img src={categoria.imagen} alt={categoria.nombre} className="card-img-top img-categoria" />
      <div className="card-body text-center">
        <h2 className="h6 card-title mb-1">{categoria.nombre}</h2>
        {cantidadProductos != null && <small className="text-body-secondary">{cantidadProductos} productos</small>}
      </div>
    </Link>
  );
}
