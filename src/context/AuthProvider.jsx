// src/context/AuthProvider.jsx
// Maneja la sesión del usuario contra la colección usuariosDB.
import { useEffect, useState } from 'react';
import { AuthContext } from './contextos';
import { usuariosDB } from '../data/db';
import useColeccion from '../hooks/useColeccion';

const CLAVE = 'sesion';

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE));
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const usuarios = useColeccion(usuariosDB);
  const [usuarioId, setUsuarioId] = useState(leerSesion);

  useEffect(() => {
    if (usuarioId == null) localStorage.removeItem(CLAVE);
    else localStorage.setItem(CLAVE, JSON.stringify(usuarioId));
  }, [usuarioId]);

  // Si el usuario fue eliminado o desactivado desde el panel, la sesión deja de ser válida.
  const usuario = usuarios.find((u) => u.id === usuarioId && u.estado === 'activo') ?? null;

  const iniciarSesion = (correo, password) => {
    const encontrado = usuarios.find((u) => u.correo.toLowerCase() === correo.trim().toLowerCase());
    if (!encontrado || encontrado.password !== password) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }
    if (encontrado.estado !== 'activo') {
      return { ok: false, error: 'Tu cuenta está inactiva. Contacta al administrador.' };
    }
    setUsuarioId(encontrado.id);
    return { ok: true, usuario: encontrado };
  };

  const registrar = (datos) => {
    if (usuarios.some((u) => u.correo.toLowerCase() === datos.correo.trim().toLowerCase())) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }
    if (usuarios.some((u) => u.run === datos.run.toUpperCase())) {
      return { ok: false, error: 'Ya existe una cuenta con ese RUN.' };
    }
    const nuevo = usuariosDB.crear({
      ...datos,
      correo: datos.correo.trim(),
      run: datos.run.toUpperCase(),
      rol: 'cliente',
      estado: 'activo',
    });
    setUsuarioId(nuevo.id);
    return { ok: true, usuario: nuevo };
  };

  const cerrarSesion = () => setUsuarioId(null);

  const esStaff = usuario?.rol === 'admin' || usuario?.rol === 'vendedor';

  return (
    <AuthContext.Provider value={{ usuario, esStaff, iniciarSesion, registrar, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}
