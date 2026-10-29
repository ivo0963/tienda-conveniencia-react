// src/pages/admin/configAdmin.js
// Configuración compartida por las vistas del panel administrador.

export const MENU_ADMIN = [
  { to: '/admin', icono: 'speedometer2', texto: 'Dashboard', descripcion: 'Visión general de las métricas y estadísticas clave del sistema.', end: true },
  { to: '/admin/ordenes', icono: 'receipt', texto: 'Órdenes', descripcion: 'Gestión y seguimiento de todas las órdenes de compra realizadas.' },
  { to: '/admin/productos', icono: 'box-seam', texto: 'Productos', descripcion: 'Administrar inventario y detalles de los productos disponibles.' },
  { to: '/admin/categorias', icono: 'tags', texto: 'Categorías', descripcion: 'Organizar productos en categorías para facilitar su navegación.', soloAdmin: true },
  { to: '/admin/usuarios', icono: 'people', texto: 'Usuarios', descripcion: 'Gestión de cuentas de usuario y sus roles dentro del sistema.', soloAdmin: true },
  { to: '/admin/reportes', icono: 'bar-chart', texto: 'Reportes', descripcion: 'Generación de informes detallados sobre las operaciones del sistema.', soloAdmin: true },
  { to: '/admin/perfil', icono: 'person-circle', texto: 'Perfil', descripcion: 'Administración de la información personal y configuración de cuenta.' },
];

export const ROLES = {
  admin: { etiqueta: 'Administrador', color: 'danger' },
  vendedor: { etiqueta: 'Vendedor', color: 'warning' },
  cliente: { etiqueta: 'Cliente', color: 'success' },
};
