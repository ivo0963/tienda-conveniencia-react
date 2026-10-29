// src/pages/Blog.jsx
import EncabezadoSeccion from '../components/ui/EncabezadoSeccion';
import BlogCard from '../components/blog/BlogCard';
import { blogsDB } from '../data/db';
import useColeccion from '../hooks/useColeccion';

export default function Blog() {
  const blogs = useColeccion(blogsDB);

  return (
    <>
      <EncabezadoSeccion titulo="Novedades y consejos" subtitulo="Descubre recetas, ofertas semanales y tips para tu hogar." />
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {blogs.map((b) => (
          <div className="col" key={b.id}>
            <BlogCard blog={b} />
          </div>
        ))}
      </div>
    </>
  );
}
