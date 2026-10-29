// src/pages/BlogDetalle.jsx
import { Link, useParams } from 'react-router-dom';
import { blogsDB } from '../data/db';
import useColeccion from '../hooks/useColeccion';
import { formatearFecha } from '../utils/formato';
import NoEncontrado from './NoEncontrado';

export default function BlogDetalle() {
  const { id } = useParams();
  const blogs = useColeccion(blogsDB);

  const indice = blogs.findIndex((b) => b.id === Number(id));
  if (indice === -1) return <NoEncontrado mensaje="El artículo no existe." />;

  const blog = blogs[indice];
  const anterior = blogs[indice - 1];
  const siguiente = blogs[indice + 1];

  return (
    <article className="row justify-content-center">
      <div className="col-lg-8">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{blog.titulo}</li>
          </ol>
        </nav>
        <h1 className="h2">{blog.titulo}</h1>
        <p className="text-body-secondary small">{formatearFecha(`${blog.fecha}T12:00:00`)} · {blog.autor}</p>
        <img src={blog.imagen} alt={blog.titulo} className="img-fluid rounded shadow-sm mb-4 w-100 img-blog-detalle" />
        {blog.contenido.map((parrafo, i) => (
          <p key={i} className="lh-lg">{parrafo}</p>
        ))}

        <hr />
        <div className="d-flex justify-content-between">
          {anterior ? <Link to={`/blog/${anterior.id}`} className="btn btn-outline-marca btn-sm"><i className="bi bi-arrow-left me-1"></i>Anterior</Link> : <span />}
          {siguiente ? <Link to={`/blog/${siguiente.id}`} className="btn btn-outline-marca btn-sm">Siguiente<i className="bi bi-arrow-right ms-1"></i></Link> : <span />}
        </div>
      </div>
    </article>
  );
}
