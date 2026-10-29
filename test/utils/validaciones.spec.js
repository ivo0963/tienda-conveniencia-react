// Pruebas de las funciones de validación de formularios.
import {
  validarCategoria,
  validarCheckout,
  validarContacto,
  validarDominioCorreo,
  validarLogin,
  validarProducto,
  validarRegistro,
  validarRun,
  validarUsuario,
} from '../../src/utils/validaciones';

describe('validarRun', () => {
  it('acepta RUN con dígito verificador correcto (incluida la K)', () => {
    expect(validarRun('123456785')).toBeTrue();
    expect(validarRun('12.345.678-5')).toBeTrue();
    expect(validarRun('111111111')).toBeTrue();
    expect(validarRun('10000013k')).toBeTrue();
  });

  it('rechaza RUN con dígito verificador incorrecto o formato inválido', () => {
    expect(validarRun('123456780')).toBeFalse();
    expect(validarRun('12345')).toBeFalse();
    expect(validarRun('abcdefghi')).toBeFalse();
    expect(validarRun('')).toBeFalse();
  });
});

describe('validarDominioCorreo', () => {
  it('solo permite los dominios de la institución y gmail', () => {
    expect(validarDominioCorreo('alumno@duoc.cl')).toBeTrue();
    expect(validarDominioCorreo('profe@profesor.duoc.cl')).toBeTrue();
    expect(validarDominioCorreo('persona@gmail.com')).toBeTrue();
    expect(validarDominioCorreo('persona@hotmail.com')).toBeFalse();
  });
});

describe('validarLogin', () => {
  it('exige correo y contraseña', () => {
    const errores = validarLogin({ correo: '', password: '' });
    expect(Object.keys(errores)).toEqual(['correo', 'password']);
  });

  it('valida el largo de la contraseña (4 a 10)', () => {
    expect(validarLogin({ correo: 'a@duoc.cl', password: '123' }).password).toContain('entre 4 y 10');
    expect(validarLogin({ correo: 'a@duoc.cl', password: '12345678901' }).password).toBeDefined();
    expect(validarLogin({ correo: 'a@duoc.cl', password: '1234' })).toEqual({});
  });

  it('rechaza dominios no permitidos', () => {
    expect(validarLogin({ correo: 'a@yahoo.com', password: '1234' }).correo).toContain('@duoc.cl');
  });
});

describe('validarRegistro', () => {
  const valido = { run: '123456785', nombre: 'Ana', apellidos: 'Rojas', correo: 'ana@gmail.com', password: 'abcd', confirmarPassword: 'abcd', region: 'Biobío', comuna: 'Concepción' };

  it('no devuelve errores con datos válidos', () => {
    expect(validarRegistro(valido)).toEqual({});
  });

  it('detecta RUN inválido, contraseñas distintas y comuna faltante', () => {
    const errores = validarRegistro({ ...valido, run: '123456780', confirmarPassword: 'otra', comuna: '' });
    expect(Object.keys(errores).sort()).toEqual(['comuna', 'confirmarPassword', 'run']);
  });
});

describe('validarContacto', () => {
  it('acepta cualquier dominio de correo pero limita el comentario a 500 caracteres', () => {
    expect(validarContacto({ nombre: 'Ana', correo: 'ana@empresa.cl', comentario: 'Hola' })).toEqual({});
    expect(validarContacto({ nombre: 'Ana', correo: 'ana@empresa.cl', comentario: 'x'.repeat(501) }).comentario).toBeDefined();
  });
});

describe('validarCheckout', () => {
  const base = { nombre: 'Ana', apellidos: 'Rojas', correo: 'ana@gmail.com', calle: '', region: '', comuna: '' };

  it('exige dirección solo para despacho a domicilio', () => {
    expect(Object.keys(validarCheckout({ ...base, entrega: 'domicilio' })).sort()).toEqual(['calle', 'comuna', 'region']);
    expect(validarCheckout({ ...base, entrega: 'retiro' })).toEqual({});
  });
});

describe('validarProducto', () => {
  const valido = { codigo: 'A-1', nombre: 'Algo', categoriaId: '1', precio: '1000', precioOferta: '', stock: '5', stockCritico: '1' };

  it('acepta un producto válido sin oferta', () => {
    expect(validarProducto(valido)).toEqual({});
  });

  it('rechaza precios negativos, stock decimal y ofertas mayores al precio', () => {
    const errores = validarProducto({ ...valido, precio: '-1', stock: '2.5', precioOferta: '5000' });
    expect(errores.precio).toBeDefined();
    expect(errores.stock).toBeDefined();
    expect(errores.precioOferta).toBeDefined();
  });

  it('exige los campos obligatorios', () => {
    const errores = validarProducto({ codigo: '', nombre: '', categoriaId: '', precio: '', precioOferta: '', stock: '', stockCritico: '' });
    expect(Object.keys(errores).sort()).toEqual(['categoriaId', 'codigo', 'nombre', 'precio', 'stock', 'stockCritico']);
  });
});

describe('validarUsuario y validarCategoria', () => {
  const usuario = { run: '123456785', nombre: 'Ana', apellidos: 'Rojas', correo: 'ana@duoc.cl', password: '', rol: 'cliente' };

  it('exige contraseña solo al crear un usuario nuevo', () => {
    expect(validarUsuario(usuario, { esNuevo: true }).password).toBeDefined();
    expect(validarUsuario(usuario, { esNuevo: false })).toEqual({});
  });

  it('exige el nombre de la categoría', () => {
    expect(validarCategoria({ nombre: ' ' }).nombre).toBeDefined();
    expect(validarCategoria({ nombre: 'Congelados' })).toEqual({});
  });
});
