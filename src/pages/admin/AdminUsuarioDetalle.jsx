// src/pages/admin/AdminUsuarioDetalle.jsx
import { Link, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import { ordenesDB, usuariosDB } from '../../data/db';
import useColeccion from '../../hooks/useColeccion';
import { formatearMoneda, nombreCompleto } from '../../utils/formato';
import { ROLES } from './configAdmin';

export default function AdminUsuarioDetalle() {
  const { id } = useParams();
  const usuarios = useColeccion(usuariosDB);
  const ordenes = useColeccion(ordenesDB);

  const usuario = usuarios.find((u) => u.id === Number(id));
  if (!usuario) return <div className="alert alert-warning">El usuario no existe. <Link to="/admin/usuarios">Volver</Link></div>;

  const compras = ordenes.filter((o) => o.usuarioId === usuario.id && o.estado !== 'rechazada');
  const totalComprado = compras.reduce((acc, o) => acc + o.total, 0);

  return (
    <>
      <EncabezadoSeccion titulo={nombreCompleto(usuario)} subtitulo={usuario.correo}>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/usuarios" className="btn btn-sm btn-outline-secondary">Volver</Link>
          <Link to={`/admin/usuarios/${usuario.id}/historial`} className="btn btn-sm btn-outline-primary"><i className="bi bi-clock-history me-1"></i>Historial de compras</Link>
          <Link to={`/admin/usuarios/${usuario.id}/editar`} className="btn btn-sm btn-primary"><i className="bi bi-pencil me-1"></i>Editar usuario</Link>
        </div>
      </EncabezadoSeccion>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <dl className="row mb-0">
                <dt className="col-sm-4">RUN</dt><dd className="col-sm-8">{usuario.run}</dd>
                <dt className="col-sm-4">Rol</dt><dd className="col-sm-8"><span className={`badge text-bg-${ROLES[usuario.rol]?.color}`}>{ROLES[usuario.rol]?.etiqueta}</span></dd>
                <dt className="col-sm-4">Estado</dt><dd className="col-sm-8">{usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}</dd>
                <dt className="col-sm-4">Región / Comuna</dt><dd className="col-sm-8">{[usuario.region, usuario.comuna].filter(Boolean).join(' / ') || '—'}</dd>
                <dt className="col-sm-4">Dirección</dt><dd className="col-sm-8">{[usuario.direccion, usuario.departamento].filter(Boolean).join(', ') || '—'}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm text-center h-100">
            <div className="card-body">
              <small className="text-body-secondary">Compras realizadas</small>
              <p className="fs-2 fw-bold mb-0">{compras.length}</p>
              <small className="text-body-secondary">Total: {formatearMoneda(totalComprado)}</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
