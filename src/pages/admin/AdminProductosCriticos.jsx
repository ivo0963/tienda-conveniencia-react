// src/pages/admin/AdminProductosCriticos.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import { productosDB } from '../../data/db';
import { productosCriticos } from '../../data/tienda';
import { useAuth } from '../../context/contextos';
import useColeccion from '../../hooks/useColeccion';

export default function AdminProductosCriticos() {
  const { usuario } = useAuth();
  const productos = useColeccion(productosDB);
  const [reposicion, setReposicion] = useState({});

  const criticos = productosCriticos(productos).sort((a, b) => a.stock - b.stock);

  const reponer = (producto) => {
    const cantidad = Number(reposicion[producto.id]);
    if (!Number.isInteger(cantidad) || cantidad <= 0) return;
    productosDB.actualizar(producto.id, { stock: producto.stock + cantidad });
    setReposicion({ ...reposicion, [producto.id]: '' });
  };

  return (
    <>
      <EncabezadoSeccion titulo="Listado de productos críticos" subtitulo="Productos cuyo stock es igual o menor a su stock crítico.">
        <Link to="/admin/productos" className="btn btn-sm btn-outline-secondary">Volver a productos</Link>
      </EncabezadoSeccion>

      {criticos.length === 0 ? (
        <div className="alert alert-success">¡Todo en orden! No hay productos con stock crítico.</div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Stock actual</th>
                  <th scope="col">Stock crítico</th>
                  {usuario.rol === 'admin' && <th scope="col">Reponer</th>}
                </tr>
              </thead>
              <tbody>
                {criticos.map((p) => (
                  <tr key={p.id} className={p.stock === 0 ? 'table-danger' : 'table-warning'}>
                    <td><Link to={`/admin/productos/${p.id}`}>{p.nombre}</Link></td>
                    <td>{p.stock === 0 ? <strong>Agotado</strong> : p.stock}</td>
                    <td>{p.stockCritico}</td>
                    {usuario.rol === 'admin' && (
                      <td>
                        <div className="input-group input-group-sm" style={{ maxWidth: '12rem' }}>
                          <input type="number" min="1" className="form-control" placeholder="Unidades" aria-label={`Unidades a reponer de ${p.nombre}`} value={reposicion[p.id] ?? ''} onChange={(e) => setReposicion({ ...reposicion, [p.id]: e.target.value })} />
                          <button type="button" className="btn btn-success" onClick={() => reponer(p)}>Reponer</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
