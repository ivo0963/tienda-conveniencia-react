// src/pages/admin/AdminProductos.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import { categoriasDB, productosDB } from '../../data/db';
import { esStockCritico, estaEnOferta } from '../../data/tienda';
import { useAuth } from '../../context/contextos';
import useColeccion from '../../hooks/useColeccion';
import { filtrarProductos } from '../../utils/filtros';
import { formatearMoneda } from '../../utils/formato';

export default function AdminProductos() {
  const { usuario } = useAuth();
  const productos = useColeccion(productosDB);
  const categorias = useColeccion(categoriasDB);
  const [texto, setTexto] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [aEliminar, setAEliminar] = useState(null);

  const esAdmin = usuario.rol === 'admin';
  const filtrados = filtrarProductos(productos, { texto, categoriaId });
  const nombreCategoria = (id) => categorias.find((c) => c.id === id)?.nombre ?? 'Sin categoría';

  return (
    <>
      <EncabezadoSeccion titulo="Productos" subtitulo={`${filtrados.length} de ${productos.length} productos`}>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/productos/criticos" className="btn btn-outline-warning btn-sm"><i className="bi bi-exclamation-triangle me-1"></i>Stock crítico</Link>
          {esAdmin && <Link to="/admin/productos/reportes" className="btn btn-outline-secondary btn-sm"><i className="bi bi-bar-chart me-1"></i>Reportes</Link>}
          {esAdmin && <Link to="/admin/productos/nuevo" className="btn btn-primary btn-sm"><i className="bi bi-plus-lg me-1"></i>Nuevo producto</Link>}
        </div>
      </EncabezadoSeccion>

      {aEliminar && (
        <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2" role="alert">
          <span>¿Eliminar el producto <strong>{aEliminar.nombre}</strong>? Esta acción no se puede deshacer.</span>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm btn-danger" onClick={() => { productosDB.eliminar(aEliminar.id); setAEliminar(null); }}>Eliminar</button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setAEliminar(null)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <input type="search" className="form-control" placeholder="Buscar por nombre o código" aria-label="Buscar productos" value={texto} onChange={(e) => setTexto(e.target.value)} />
            </div>
            <div className="col-md-4">
              <select className="form-select" aria-label="Filtrar por categoría" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Producto</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                  <th scope="col"><span className="visually-hidden">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr key={p.id}>
                    <td>{p.codigo}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={p.imagen} alt="" className="miniatura rounded" />
                        <span>{p.nombre}</span>
                      </div>
                    </td>
                    <td>{nombreCategoria(p.categoriaId)}</td>
                    <td>
                      {formatearMoneda(p.precio)}
                      {estaEnOferta(p) && <span className="badge text-bg-danger ms-1">Oferta {formatearMoneda(p.precioOferta)}</span>}
                    </td>
                    <td>
                      <span className={`badge ${esStockCritico(p) ? 'text-bg-warning' : 'text-bg-success'}`}>{p.stock}</span>
                    </td>
                    <td className="text-end text-nowrap">
                      <Link to={`/admin/productos/${p.id}`} className="btn btn-sm btn-outline-primary me-1" aria-label={`Ver ${p.nombre}`}><i className="bi bi-eye"></i></Link>
                      {esAdmin && (
                        <>
                          <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-secondary me-1" aria-label={`Editar ${p.nombre}`}><i className="bi bi-pencil"></i></Link>
                          <button type="button" className="btn btn-sm btn-outline-danger" aria-label={`Eliminar ${p.nombre}`} onClick={() => setAEliminar(p)}><i className="bi bi-trash"></i></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
