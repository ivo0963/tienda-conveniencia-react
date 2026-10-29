// src/utils/formato.js
export const formatearMoneda = (monto) => `$${Number(monto || 0).toLocaleString('es-CL')}`;

export const formatearFecha = (fechaIso) =>
  new Date(fechaIso).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });

export const formatearFechaHora = (fechaIso) =>
  new Date(fechaIso).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });

export const nombreCompleto = (persona) => `${persona.nombre} ${persona.apellidos ?? ''}`.trim();
