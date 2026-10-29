// Pruebas de las operaciones CRUD de la base de datos simulada.
import { crearColeccion, productosDB, reiniciarBaseDatos } from '../../src/data/db';

describe('crearColeccion (CRUD)', () => {
  const semilla = [
    { id: 1, nombre: 'Uno' },
    { id: 2, nombre: 'Dos' },
  ];
  let coleccion;

  beforeEach(() => {
    localStorage.removeItem('db_prueba');
    coleccion = crearColeccion('prueba', semilla);
  });

  it('READ: lista los registros iniciales y obtiene por id (número o texto)', () => {
    expect(coleccion.listar().length).toBe(2);
    expect(coleccion.obtener(2).nombre).toBe('Dos');
    expect(coleccion.obtener('1').nombre).toBe('Uno');
    expect(coleccion.obtener(99)).toBeNull();
    expect(coleccion.buscar((r) => r.nombre.startsWith('D')).length).toBe(1);
  });

  it('CREATE: asigna un id correlativo y persiste en localStorage', () => {
    const nuevo = coleccion.crear({ nombre: 'Tres' });

    expect(nuevo.id).toBe(3);
    expect(coleccion.listar().length).toBe(3);
    expect(JSON.parse(localStorage.getItem('db_prueba')).length).toBe(3);
  });

  it('UPDATE: modifica solo los campos indicados y no permite cambiar el id', () => {
    const actualizado = coleccion.actualizar(1, { nombre: 'Uno editado', id: 50 });

    expect(actualizado).toEqual({ id: 1, nombre: 'Uno editado' });
    expect(coleccion.obtener(1).nombre).toBe('Uno editado');
    expect(coleccion.actualizar(99, { nombre: 'X' })).toBeNull();
  });

  it('DELETE: elimina un registro existente y devuelve false si no existe', () => {
    expect(coleccion.eliminar(1)).toBeTrue();
    expect(coleccion.obtener(1)).toBeNull();
    expect(coleccion.eliminar(1)).toBeFalse();
  });

  it('carga los datos guardados en localStorage en lugar de la semilla', () => {
    coleccion.crear({ nombre: 'Persistido' });
    const recargada = crearColeccion('prueba', semilla);
    expect(recargada.listar().map((r) => r.nombre)).toContain('Persistido');
  });

  it('notifica a los suscriptores en cada cambio y permite desuscribirse', () => {
    const escucha = jasmine.createSpy('escucha');
    const desuscribir = coleccion.suscribir(escucha);

    coleccion.crear({ nombre: 'A' });
    coleccion.actualizar(1, { nombre: 'B' });
    coleccion.eliminar(2);
    expect(escucha).toHaveBeenCalledTimes(3);

    desuscribir();
    coleccion.crear({ nombre: 'C' });
    expect(escucha).toHaveBeenCalledTimes(3);
  });

  it('mantiene la misma referencia mientras no haya cambios (necesario para useSyncExternalStore)', () => {
    const antes = coleccion.listar();
    expect(coleccion.listar()).toBe(antes);
    coleccion.crear({ nombre: 'Nuevo' });
    expect(coleccion.listar()).not.toBe(antes);
  });

  it('reiniciar vuelve a los datos de la semilla sin modificar la semilla original', () => {
    coleccion.actualizar(1, { nombre: 'Cambiado' });
    coleccion.reiniciar();
    expect(coleccion.listar()).toEqual(semilla);
    expect(semilla[0].nombre).toBe('Uno');
  });

  it('usa la semilla si el JSON guardado está corrupto', () => {
    localStorage.setItem('db_prueba', '{no es json');
    const recuperada = crearColeccion('prueba', semilla);
    expect(recuperada.listar().length).toBe(2);
  });
});

describe('reiniciarBaseDatos', () => {
  it('restablece las colecciones de la tienda', () => {
    productosDB.eliminar(1);
    reiniciarBaseDatos();
    expect(productosDB.obtener(1)).not.toBeNull();
  });
});
