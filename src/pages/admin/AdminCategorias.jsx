// src/pages/admin/AdminCategorias.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import { categoriasDB, productosDB } from '../../data/db';
import useColeccion from '../../hooks/useColeccion';

export default function AdminCategorias() {
  const categorias = useColeccion(categoriasDB);
  const productos = useColeccion(productosDB);
  const [mensaje, setMensaje] = useState(null);

  const cantidadProductos = (id) => productos.filter((p) => p.categoriaId === id).length;

  const eliminar = (categoria) => {
    if (cantidadProductos(categoria.id) > 0) {
      setMensaje({ tipo: 'warning', texto: `No se puede eliminar "${categoria.nombre}" porque tiene productos asociados.` });
      return;
    }
    categoriasDB.eliminar(categoria.id);
    setMensaje({ tipo: 'success', texto: `Categoría "${categoria.nombre}" eliminada.` });
  };

  return (
    <>
      <EncabezadoSeccion titulo="Categorías" subtitulo={`${categorias.length} categorías`}>
        <Link to="/admin/categorias/nueva" className="btn btn-primary btn-sm"><i className="bi bi-plus-lg me-1"></i>Nueva categoría</Link>
      </EncabezadoSeccion>

      {mensaje && <div className={`alert alert-${mensaje.tipo}`} role="status">{mensaje.texto}</div>}

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Categoría</th>
                <th scope="col">Descripción</th>
                <th scope="col">Productos</th>
                <th scope="col"><span className="visually-hidden">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={c.imagen} alt="" className="miniatura rounded" />
                      <strong>{c.nombre}</strong>
                    </div>
                  </td>
                  <td className="small">{c.descripcion}</td>
                  <td>{cantidadProductos(c.id)}</td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/categorias/${c.id}/editar`} className="btn btn-sm btn-outline-secondary me-1" aria-label={`Editar ${c.nombre}`}><i className="bi bi-pencil"></i></Link>
                    <button type="button" className="btn btn-sm btn-outline-danger" aria-label={`Eliminar ${c.nombre}`} onClick={() => eliminar(c)}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
