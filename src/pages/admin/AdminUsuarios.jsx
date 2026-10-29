// src/pages/admin/AdminUsuarios.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import { usuariosDB } from '../../data/db';
import { useAuth } from '../../context/contextos';
import useColeccion from '../../hooks/useColeccion';
import { nombreCompleto } from '../../utils/formato';
import { ROLES } from './configAdmin';


export default function AdminUsuarios() {
  const { usuario: sesion } = useAuth();
  const usuarios = useColeccion(usuariosDB);
  const [texto, setTexto] = useState('');
  const [rol, setRol] = useState('');
  const [aEliminar, setAEliminar] = useState(null);

  const busqueda = texto.trim().toLowerCase();
  const filtrados = usuarios
    .filter((u) => !rol || u.rol === rol)
    .filter((u) => !busqueda || `${u.run} ${nombreCompleto(u)} ${u.correo}`.toLowerCase().includes(busqueda));

  return (
    <>
      <EncabezadoSeccion titulo="Usuarios" subtitulo={`${filtrados.length} de ${usuarios.length} usuarios`}>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary btn-sm"><i className="bi bi-person-plus me-1"></i>Nuevo usuario</Link>
      </EncabezadoSeccion>

      {aEliminar && (
        <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2" role="alert">
          <span>¿Eliminar al usuario <strong>{nombreCompleto(aEliminar)}</strong>?</span>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm btn-danger" onClick={() => { usuariosDB.eliminar(aEliminar.id); setAEliminar(null); }}>Eliminar</button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setAEliminar(null)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <input type="search" className="form-control" placeholder="Buscar por RUN, nombre o correo" aria-label="Buscar usuarios" value={texto} onChange={(e) => setTexto(e.target.value)} />
            </div>
            <div className="col-md-4">
              <select className="form-select" aria-label="Filtrar por rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="">Todos los roles</option>
                {Object.entries(ROLES).map(([valor, info]) => <option key={valor} value={valor}>{info.etiqueta}</option>)}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">RUN</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Correo</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Estado</th>
                  <th scope="col"><span className="visually-hidden">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((u) => (
                  <tr key={u.id}>
                    <td>{u.run}</td>
                    <td>{nombreCompleto(u)}</td>
                    <td>{u.correo}</td>
                    <td><span className={`badge text-bg-${ROLES[u.rol]?.color ?? 'secondary'}`}>{ROLES[u.rol]?.etiqueta ?? u.rol}</span></td>
                    <td><span className={`badge ${u.estado === 'activo' ? 'text-bg-success' : 'text-bg-secondary'}`}>{u.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
                    <td className="text-end text-nowrap">
                      <Link to={`/admin/usuarios/${u.id}`} className="btn btn-sm btn-outline-primary me-1" aria-label={`Ver ${nombreCompleto(u)}`}><i className="bi bi-eye"></i></Link>
                      <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-sm btn-outline-secondary me-1" aria-label={`Editar ${nombreCompleto(u)}`}><i className="bi bi-pencil"></i></Link>
                      <button type="button" className="btn btn-sm btn-outline-danger" aria-label={`Eliminar ${nombreCompleto(u)}`} disabled={u.id === sesion.id} title={u.id === sesion.id ? 'No puedes eliminar tu propia cuenta' : undefined} onClick={() => setAEliminar(u)}><i className="bi bi-trash"></i></button>
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
