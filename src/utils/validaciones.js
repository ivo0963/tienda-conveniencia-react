// src/utils/validaciones.js
// Funciones puras de validación. Cada validador de formulario devuelve un
// objeto { campo: 'mensaje' }; si está vacío, el formulario es válido.

export const DOMINIOS_PERMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

const vacio = (valor) => String(valor ?? '').trim() === '';

// RUN sin puntos ni guion, con dígito verificador (módulo 11). Ej: 123456785
export function validarRun(run) {
  const limpio = String(run ?? '').toUpperCase().replace(/[.-]/g, '');
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  let suma = 0;
  let multiplo = 2;
  for (const digito of cuerpo.split('').reverse()) {
    suma += Number(digito) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === esperado;
}

export const validarFormatoCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo ?? '').trim());

export const validarDominioCorreo = (correo) =>
  DOMINIOS_PERMITIDOS.some((d) => String(correo ?? '').toLowerCase().trim().endsWith(d));

export const validarPassword = (password) => String(password ?? '').length >= 4 && String(password ?? '').length <= 10;

function errorCorreo(correo, exigirDominio = true) {
  if (vacio(correo)) return 'El correo es obligatorio.';
  if (!validarFormatoCorreo(correo)) return 'Formato de correo inválido.';
  if (exigirDominio && !validarDominioCorreo(correo)) return `El correo debe ser ${DOMINIOS_PERMITIDOS.join(', ')}.`;
  return null;
}

const limpiarNulos = (errores) => Object.fromEntries(Object.entries(errores).filter(([, v]) => v));

export function validarLogin({ correo, password }) {
  return limpiarNulos({
    correo: errorCorreo(correo),
    password: vacio(password) ? 'La contraseña es obligatoria.' : !validarPassword(password) ? 'La contraseña debe tener entre 4 y 10 caracteres.' : null,
  });
}

export function validarRegistro(datos) {
  return limpiarNulos({
    run: vacio(datos.run) ? 'El RUN es obligatorio.' : !validarRun(datos.run) ? 'RUN inválido. Escríbelo sin puntos ni guion (ej: 123456785).' : null,
    nombre: vacio(datos.nombre) ? 'El nombre es obligatorio.' : null,
    apellidos: vacio(datos.apellidos) ? 'Los apellidos son obligatorios.' : null,
    correo: errorCorreo(datos.correo),
    password: vacio(datos.password) ? 'La contraseña es obligatoria.' : !validarPassword(datos.password) ? 'La contraseña debe tener entre 4 y 10 caracteres.' : null,
    confirmarPassword: datos.confirmarPassword !== undefined && datos.confirmarPassword !== datos.password ? 'Las contraseñas no coinciden.' : null,
    region: vacio(datos.region) ? 'Debe seleccionar una región.' : null,
    comuna: vacio(datos.comuna) ? 'Debe seleccionar una comuna.' : null,
  });
}

export function validarContacto({ nombre, correo, comentario }) {
  return limpiarNulos({
    nombre: vacio(nombre) ? 'El nombre es obligatorio.' : null,
    correo: errorCorreo(correo, false),
    comentario: vacio(comentario) ? 'El comentario es obligatorio.' : String(comentario).length > 500 ? 'Máximo 500 caracteres.' : null,
  });
}

export function validarCheckout(datos) {
  return limpiarNulos({
    nombre: vacio(datos.nombre) ? 'El nombre es obligatorio.' : null,
    apellidos: vacio(datos.apellidos) ? 'Los apellidos son obligatorios.' : null,
    correo: errorCorreo(datos.correo, false),
    calle: datos.entrega === 'domicilio' && vacio(datos.calle) ? 'La calle es obligatoria.' : null,
    region: datos.entrega === 'domicilio' && vacio(datos.region) ? 'Debe seleccionar una región.' : null,
    comuna: datos.entrega === 'domicilio' && vacio(datos.comuna) ? 'Debe seleccionar una comuna.' : null,
  });
}

export function validarProducto(datos) {
  const numero = (v) => (vacio(v) ? NaN : Number(v));
  const precio = numero(datos.precio);
  const precioOferta = vacio(datos.precioOferta) ? null : Number(datos.precioOferta);
  const stock = numero(datos.stock);
  const stockCritico = numero(datos.stockCritico);
  return limpiarNulos({
    codigo: vacio(datos.codigo) ? 'El código es obligatorio.' : null,
    nombre: vacio(datos.nombre) ? 'El nombre es obligatorio.' : null,
    categoriaId: vacio(datos.categoriaId) ? 'Seleccione una categoría.' : null,
    precio: Number.isNaN(precio) || precio < 0 ? 'El precio debe ser un número mayor o igual a 0.' : null,
    precioOferta: precioOferta !== null && (Number.isNaN(precioOferta) || precioOferta < 0 || precioOferta >= precio) ? 'La oferta debe ser menor al precio normal.' : null,
    stock: !Number.isInteger(stock) || stock < 0 ? 'El stock debe ser un entero mayor o igual a 0.' : null,
    stockCritico: !Number.isInteger(stockCritico) || stockCritico < 0 ? 'El stock crítico debe ser un entero mayor o igual a 0.' : null,
  });
}

export function validarCategoria({ nombre }) {
  return limpiarNulos({ nombre: vacio(nombre) ? 'El nombre es obligatorio.' : null });
}

export function validarUsuario(datos, { esNuevo }) {
  return limpiarNulos({
    run: vacio(datos.run) ? 'El RUN es obligatorio.' : !validarRun(datos.run) ? 'RUN inválido.' : null,
    nombre: vacio(datos.nombre) ? 'El nombre es obligatorio.' : null,
    apellidos: vacio(datos.apellidos) ? 'Los apellidos son obligatorios.' : null,
    correo: errorCorreo(datos.correo),
    password: esNuevo || !vacio(datos.password)
      ? (!validarPassword(datos.password) ? 'La contraseña debe tener entre 4 y 10 caracteres.' : null)
      : null,
    rol: vacio(datos.rol) ? 'Seleccione un rol.' : null,
  });
}
