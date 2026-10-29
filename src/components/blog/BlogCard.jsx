// src/components/blog/BlogCard.jsx
import { Link } from 'react-router-dom';
import { formatearFecha } from '../../utils/formato';

export default function BlogCard({ blog }) {
  return (
    <article className="card h-100 shadow-sm">
      <img src={blog.imagen} alt={blog.titulo} className="card-img-top img-blog" />
      <div className="card-body d-flex flex-column">
        <small className="text-body-secondary">{formatearFecha(`${blog.fecha}T12:00:00`)}</small>
        <h2 className="h5 card-title mt-1">{blog.titulo}</h2>
        <p className="card-text">{blog.resumen}</p>
        <Link to={`/blog/${blog.id}`} className="btn btn-outline-marca mt-auto align-self-start">
          Leer artículo
        </Link>
      </div>
    </article>
  );
}
