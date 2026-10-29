// src/components/RutaProtegida.jsx
// Solo deja pasar a usuarios con sesión y con alguno de los roles indicados.
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/contextos';

export default function RutaProtegida({ roles, children }) {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }
  if (roles && !roles.includes(usuario.rol)) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        No tienes permisos para ver esta sección.
      </div>
    );
  }
  return children;
}
