// src/hooks/useColeccion.js
// Devuelve los registros de una colección de db.js y vuelve a renderizar el
// componente cada vez que la colección cambia (crear, actualizar o eliminar).
import { useSyncExternalStore } from 'react';

export default function useColeccion(coleccion) {
  return useSyncExternalStore(coleccion.suscribir, coleccion.listar);
}
