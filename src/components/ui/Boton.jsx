// src/components/ui/Boton.jsx
export default function Boton({ etiqueta, onClick, variante = 'primary', tipo = 'button', icono, deshabilitado = false, className = '', ...resto }) {
  return (
    <button
      type={tipo}
      className={`btn btn-${variante} ${className}`.trim()}
      onClick={onClick}
      disabled={deshabilitado}
      {...resto}
    >
      {icono && <i className={`bi bi-${icono} me-1`} aria-hidden="true"></i>}
      {etiqueta}
    </button>
  );
}
