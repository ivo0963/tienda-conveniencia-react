// src/pages/admin/AdminPerfil.jsx
import { useState } from 'react';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import FormularioUsuario from '../../components/admin/FormularioUsuario';
import { usuariosDB } from '../../data/db';
import { useAuth } from '../../context/contextos';
import { buscarUsuarioDuplicado } from '../../data/tienda';

export default function AdminPerfil() {
  const { usuario } = useAuth();
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const guardar = (datos) => {
    const duplicado = buscarUsuarioDuplicado(datos, usuario.id);
    setError(duplicado ?? '');
    if (duplicado) return;
    // El rol y el estado propios no se pueden cambiar desde el perfil.
    const { rol: _rol, estado: _estado, ...cambios } = datos;
    usuariosDB.actualizar(usuario.id, cambios);
    setMensaje('Perfil actualizado correctamente.');
  };

  return (
    <>
      <EncabezadoSeccion titulo="Mi perfil" subtitulo="Actualiza tu información personal y contraseña." />
      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}
      <div className="card shadow-sm">
        <div className="card-body">
          <FormularioUsuario usuario={usuario} permitirRol={false} errorExterno={error} onGuardar={guardar} />
        </div>
      </div>
    </>
  );
}
