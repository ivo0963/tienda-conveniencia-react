// src/pages/admin/AdminUsuarioForm.jsx
// Nuevo usuario (/admin/usuarios/nuevo) y editar usuario (/admin/usuarios/:id/editar).
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import FormularioUsuario from '../../components/admin/FormularioUsuario';
import { usuariosDB } from '../../data/db';
import { buscarUsuarioDuplicado } from '../../data/tienda';
import { nombreCompleto } from '../../utils/formato';

export default function AdminUsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = id ? usuariosDB.obtener(id) : null;
  const [error, setError] = useState('');

  if (id && !usuario) return <div className="alert alert-warning">El usuario no existe. <Link to="/admin/usuarios">Volver</Link></div>;

  const guardar = (datos) => {
    const duplicado = buscarUsuarioDuplicado(datos, usuario?.id);
    if (duplicado) {
      setError(duplicado);
      return;
    }
    const guardado = usuario ? usuariosDB.actualizar(usuario.id, datos) : usuariosDB.crear(datos);
    navigate(`/admin/usuarios/${guardado.id}`);
  };

  return (
    <>
      <EncabezadoSeccion titulo={usuario ? `Editar usuario: ${nombreCompleto(usuario)}` : 'Nuevo usuario'} subtitulo="Los campos con * son obligatorios." />
      <div className="card shadow-sm">
        <div className="card-body">
          <FormularioUsuario usuario={usuario} errorExterno={error} onGuardar={guardar} onCancelar={() => navigate(-1)} />
        </div>
      </div>
    </>
  );
}
