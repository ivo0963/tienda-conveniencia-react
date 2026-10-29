// src/pages/NoEncontrado.jsx
import { Link } from 'react-router-dom';

export default function NoEncontrado({ mensaje = 'La página que buscas no existe.' }) {
  return (
    <div className="text-center py-5">
      <p className="display-4 fw-bold text-marca">404</p>
      <p className="lead">{mensaje}</p>
      <Link to="/" className="btn btn-marca">Volver al inicio</Link>
    </div>
  );
}
