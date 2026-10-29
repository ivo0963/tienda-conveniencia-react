// src/components/ui/CampoFormulario.jsx
// Campo de formulario Bootstrap (input, select o textarea) con etiqueta, ayuda y error.
import MensajeError from './MensajeError';

export default function CampoFormulario({
  id,
  etiqueta,
  error,
  ayuda,
  como = 'input',
  requerido = false,
  className = '',
  children,
  ...propsCampo
}) {
  const claseBase = como === 'select' ? 'form-select' : 'form-control';
  const props = {
    id,
    className: `${claseBase}${error ? ' is-invalid' : ''}`,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `error-${id}` : undefined,
    ...propsCampo,
  };

  return (
    <div className={`mb-3 ${className}`.trim()}>
      <label htmlFor={id} className="form-label">
        {etiqueta}
        {requerido && <span className="text-danger"> *</span>}
      </label>
      {como === 'select' && <select {...props}>{children}</select>}
      {como === 'textarea' && <textarea {...props} />}
      {como === 'input' && <input {...props} />}
      {ayuda && !error && <div className="form-text">{ayuda}</div>}
      <MensajeError id={`error-${id}`} mensaje={error} />
    </div>
  );
}
