// src/data/db.js
// Fuente de datos simulada (similar a una base de datos) para la aplicación.
// Cada colección expone operaciones CRUD y persiste sus registros en localStorage.
// Los componentes se suscriben a los cambios para actualizar la interfaz en tiempo real.
import {
  categoriasIniciales,
  productosIniciales,
  usuariosIniciales,
  ordenesIniciales,
  blogsIniciales,
} from './semilla';

const copiar = (valor) => JSON.parse(JSON.stringify(valor));

export function crearColeccion(nombre, semilla) {
  const clave = `db_${nombre}`;
  const suscriptores = new Set();

  const leer = () => {
    try {
      const guardado = localStorage.getItem(clave);
      if (guardado) return JSON.parse(guardado);
    } catch {
      // Si localStorage no está disponible o el JSON está corrupto, se usa la semilla.
    }
    return copiar(semilla);
  };

  let registros = leer();

  const notificar = () => suscriptores.forEach((fn) => fn());

  const guardar = (nuevos) => {
    registros = nuevos;
    try {
      localStorage.setItem(clave, JSON.stringify(registros));
    } catch {
      // Se mantiene en memoria aunque no se pueda persistir.
    }
    notificar();
  };

  // Sincroniza los cambios hechos en otra pestaña del navegador.
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === clave) {
        registros = leer();
        notificar();
      }
    });
  }

  const coleccion = {
    nombre,

    // READ
    listar: () => registros,
    obtener: (id) => registros.find((r) => r.id === Number(id)) ?? null,
    buscar: (criterio) => registros.filter(criterio),

    // CREATE
    crear(datos) {
      const id = registros.reduce((max, r) => Math.max(max, r.id), 0) + 1;
      const nuevo = { ...datos, id };
      guardar([...registros, nuevo]);
      return nuevo;
    },

    // UPDATE
    actualizar(id, cambios) {
      const existente = coleccion.obtener(id);
      if (!existente) return null;
      const actualizado = { ...existente, ...cambios, id: existente.id };
      guardar(registros.map((r) => (r.id === existente.id ? actualizado : r)));
      return actualizado;
    },

    // DELETE
    eliminar(id) {
      const restantes = registros.filter((r) => r.id !== Number(id));
      const eliminado = restantes.length < registros.length;
      if (eliminado) guardar(restantes);
      return eliminado;
    },

    reiniciar: () => guardar(copiar(semilla)),

    suscribir(fn) {
      suscriptores.add(fn);
      return () => suscriptores.delete(fn);
    },
  };

  return coleccion;
}

export const categoriasDB = crearColeccion('categorias', categoriasIniciales);
export const productosDB = crearColeccion('productos', productosIniciales);
export const usuariosDB = crearColeccion('usuarios', usuariosIniciales);
export const ordenesDB = crearColeccion('ordenes', ordenesIniciales);
export const blogsDB = crearColeccion('blogs', blogsIniciales);

// Vuelve todas las colecciones a sus datos de ejemplo.
export function reiniciarBaseDatos() {
  [categoriasDB, productosDB, usuariosDB, ordenesDB, blogsDB].forEach((c) => c.reiniciar());
}
