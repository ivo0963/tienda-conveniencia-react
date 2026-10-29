// src/components/ui/MensajeError.jsx
// Solo se renderiza cuando existe un mensaje de error.
export default function MensajeError({ mensaje, id }) {
  if (!mensaje) return null;
  return (
    <div id={id} className="invalid-feedback d-block" role="alert">
      {mensaje}
    </div>
  );
}
