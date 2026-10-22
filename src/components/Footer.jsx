import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-principal">
      <div className="footer-info">
        <p>&copy; 2026 MiniMarket DSY - Evaluación Parcial 1.</p>
        <p>Desarrollado por [Ivo Martinez]</p>
      </div>
      <div className="footer-enlaces">
        <Link to="/contacto">Soporte</Link>
        <Link to="/nosotros">Términos y Condiciones</Link>
      </div>
    </footer>
  );
}