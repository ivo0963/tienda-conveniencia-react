// src/pages/admin/AdminUsuarioHistorial.jsx
import { Link, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import TablaOrdenes from '../../components/admin/TablaOrdenes';
import { ordenesDB, usuariosDB } from '../../data/db';
import useColeccion from '../../hooks/useColeccion';
import { nombreCompleto } from '../../utils/formato';

export default function AdminUsuarioHistorial() {
  const { id } = useParams();
  const usuarios = useColeccion(usuariosDB);
  const ordenes = useColeccion(ordenesDB);

  const usuario = usuarios.find((u) => u.id === Number(id));
  if (!usuario) return <div className="alert alert-warning">El usuario no existe. <Link to="/admin/usuarios">Volver</Link></div>;

  // Incluye compras hechas como invitado con el mismo correo.
  const historial = ordenes
    .filter((o) => o.usuarioId === usuario.id || o.cliente.correo.toLowerCase() === usuario.correo.toLowerCase())
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <>
      <EncabezadoSeccion titulo="Historial de compras" subtitulo={nombreCompleto(usuario)}>
        <Link to={`/admin/usuarios/${usuario.id}`} className="btn btn-sm btn-outline-secondary">Volver al usuario</Link>
      </EncabezadoSeccion>
      <div className="card shadow-sm">
        <div className="card-body">
          <TablaOrdenes ordenes={historial} mensajeVacio="Este usuario aún no registra compras." />
        </div>
      </div>
    </>
  );
}
