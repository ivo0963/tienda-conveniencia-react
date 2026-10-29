// src/components/ui/BadgeEstado.jsx
import { ESTADOS_ORDEN } from '../../data/tienda';

export default function BadgeEstado({ estado }) {
  const info = ESTADOS_ORDEN[estado] ?? { etiqueta: estado, color: 'secondary' };
  return <span className={`badge text-bg-${info.color}`}>{info.etiqueta}</span>;
}
