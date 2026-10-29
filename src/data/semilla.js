// src/data/semilla.js
// Datos iniciales de la "base de datos" simulada. Se copian a localStorage
// la primera vez que se abre la aplicación (o al restablecer los datos).

export const categoriasIniciales = [
  { id: 1, nombre: 'Bebidas y Licores', descripcion: 'Bebidas, jugos, aguas y cervezas para toda ocasión.', imagen: '/img/coca cola.jpg' },
  { id: 2, nombre: 'Snacks y Golosinas', descripcion: 'Papas fritas, galletas y dulces para picotear.', imagen: '/img/papas fritas.jpg' },
  { id: 3, nombre: 'Abarrotes', descripcion: 'Pan, arroz, fideos y todo lo básico para tu despensa.', imagen: '/img/pan de molde.webp' },
  { id: 4, nombre: 'Lácteos y Cecinas', descripcion: 'Leche, yogurt, quesos y cecinas siempre frescos.', imagen: '/img/leche.jpg' },
];

export const productosIniciales = [
  { id: 1, codigo: 'BEB-001', nombre: 'Bebida Cola 2.5 L', descripcion: 'Bebida gaseosa sabor cola en formato familiar retornable.', precio: 2500, precioOferta: null, stock: 50, stockCritico: 5, categoriaId: 1, imagen: '/img/coca cola.jpg' },
  { id: 2, codigo: 'SNK-001', nombre: 'Papas Fritas 250 g', descripcion: 'Papas fritas corte americano, crujientes y con sal de mar.', precio: 1890, precioOferta: 1490, stock: 20, stockCritico: 5, categoriaId: 2, imagen: '/img/papas fritas.jpg' },
  { id: 3, codigo: 'ABA-001', nombre: 'Pan de Molde Familiar', descripcion: 'Pan de molde blanco de 750 g, ideal para el desayuno.', precio: 2100, precioOferta: null, stock: 15, stockCritico: 4, categoriaId: 3, imagen: '/img/pan de molde.webp' },
  { id: 4, codigo: 'LAC-001', nombre: 'Leche Entera 1 L', descripcion: 'Leche entera UHT larga vida, fuente de calcio.', precio: 1050, precioOferta: 890, stock: 40, stockCritico: 10, categoriaId: 4, imagen: '/img/leche.jpg' },
  { id: 5, codigo: 'SNK-002', nombre: 'Galletas Chocolate 120 g', descripcion: 'Galletas con chips de chocolate, perfectas para la once.', precio: 990, precioOferta: 790, stock: 4, stockCritico: 5, categoriaId: 2, imagen: '/img/Galletas de Chocolate.jpg' },
  { id: 6, codigo: 'BEB-002', nombre: 'Jugo Naranja 1 L', descripcion: 'Jugo de naranja néctar sin colorantes artificiales.', precio: 1450, precioOferta: null, stock: 25, stockCritico: 5, categoriaId: 1, imagen: '/img/jugo naranja.jpg' },
  { id: 7, codigo: 'BEB-003', nombre: 'Pack 6 Cervezas', descripcion: 'Pack de 6 latas de cerveza lager de 350 cc. Venta solo a mayores de 18 años.', precio: 5990, precioOferta: 4990, stock: 3, stockCritico: 5, categoriaId: 1, imagen: '/img/pack 6 cervesas.jpg' },
  { id: 8, codigo: 'ABA-002', nombre: 'Arroz Grado 1 1 kg', descripcion: 'Arroz grano largo grado 1, rinde y no se pega.', precio: 1290, precioOferta: null, stock: 30, stockCritico: 8, categoriaId: 3, imagen: '/img/sin-imagen.svg' },
  { id: 9, codigo: 'LAC-002', nombre: 'Yogurt Frutilla 4 un.', descripcion: 'Pack de 4 yogures batidos sabor frutilla.', precio: 1590, precioOferta: null, stock: 12, stockCritico: 6, categoriaId: 4, imagen: '/img/sin-imagen.svg' },
  { id: 10, codigo: 'ABA-003', nombre: 'Fideos Spaghetti 400 g', descripcion: 'Fideos de sémola de trigo, cocción en 8 minutos.', precio: 890, precioOferta: null, stock: 0, stockCritico: 10, categoriaId: 3, imagen: '/img/sin-imagen.svg' },
];

// Las contraseñas se guardan en texto plano solo porque es una base de datos simulada.
export const usuariosIniciales = [
  { id: 1, run: '111111111', nombre: 'Admin', apellidos: 'Duoc', correo: 'admin@duoc.cl', password: 'admin123', rol: 'admin', estado: 'activo', region: 'Metropolitana', comuna: 'Santiago', direccion: 'Av. España 8', departamento: '' },
  { id: 2, run: '198765430', nombre: 'María', apellidos: 'Vendedora', correo: 'vendedor@profesor.duoc.cl', password: 'vende123', rol: 'vendedor', estado: 'activo', region: 'Valparaíso', comuna: 'Viña del Mar', direccion: 'Calle Valparaíso 555', departamento: '' },
  { id: 3, run: '123456785', nombre: 'Juan', apellidos: 'Pérez', correo: 'juan.perez@gmail.com', password: 'juan1234', rol: 'cliente', estado: 'activo', region: 'Metropolitana', comuna: 'Providencia', direccion: 'Av. Providencia 1234', departamento: 'Depto 603' },
];

export const ordenesIniciales = [
  {
    id: 1,
    codigo: 'ORD00001',
    fecha: '2026-10-20T14:32:00.000Z',
    usuarioId: 3,
    cliente: { nombre: 'Juan', apellidos: 'Pérez', correo: 'juan.perez@gmail.com' },
    direccion: { calle: 'Av. Providencia 1234', departamento: 'Depto 603', region: 'Metropolitana', comuna: 'Providencia', indicaciones: 'Dejar con el conserje.' },
    entrega: 'domicilio',
    metodoPago: 'debito',
    items: [
      { productoId: 1, nombre: 'Bebida Cola 2.5 L', precio: 2500, cantidad: 2, imagen: '/img/coca cola.jpg' },
      { productoId: 2, nombre: 'Papas Fritas 250 g', precio: 1490, cantidad: 3, imagen: '/img/papas fritas.jpg' },
    ],
    subtotal: 9470,
    envio: 2000,
    total: 11470,
    estado: 'entregada',
  },
  {
    id: 2,
    codigo: 'ORD00002',
    fecha: '2026-10-25T19:05:00.000Z',
    usuarioId: null,
    cliente: { nombre: 'Pedro', apellidos: 'González', correo: 'pedro.gonzalez@gmail.com' },
    direccion: { calle: 'Los Crisantemos 220', departamento: '', region: 'Biobío', comuna: 'Concepción', indicaciones: '' },
    entrega: 'retiro',
    metodoPago: 'credito',
    items: [
      { productoId: 7, nombre: 'Pack 6 Cervezas', precio: 4990, cantidad: 2, imagen: '/img/pack 6 cervesas.jpg' },
      { productoId: 4, nombre: 'Leche Entera 1 L', precio: 890, cantidad: 6, imagen: '/img/leche.jpg' },
      { productoId: 3, nombre: 'Pan de Molde Familiar', precio: 2100, cantidad: 1, imagen: '/img/pan de molde.webp' },
    ],
    subtotal: 17420,
    envio: 0,
    total: 17420,
    estado: 'pagada',
  },
  {
    id: 3,
    codigo: 'ORD00003',
    fecha: '2026-10-27T10:15:00.000Z',
    usuarioId: 3,
    cliente: { nombre: 'Juan', apellidos: 'Pérez', correo: 'juan.perez@gmail.com' },
    direccion: { calle: 'Av. Providencia 1234', departamento: 'Depto 603', region: 'Metropolitana', comuna: 'Providencia', indicaciones: '' },
    entrega: 'domicilio',
    metodoPago: 'credito',
    items: [
      { productoId: 6, nombre: 'Jugo Naranja 1 L', precio: 1450, cantidad: 2, imagen: '/img/jugo naranja.jpg' },
    ],
    subtotal: 2900,
    envio: 2000,
    total: 4900,
    estado: 'rechazada',
  },
];

export const blogsIniciales = [
  {
    id: 1,
    titulo: '5 recetas rápidas usando abarrotes básicos',
    fecha: '2026-03-15',
    autor: 'Equipo MiniMarket',
    imagen: '/img/gemini-svg recetas.svg',
    resumen: 'Prepara platos deliciosos en menos de 15 minutos usando insumos que ya tienes en tu despensa.',
    contenido: [
      'No siempre hay tiempo para cocinar elaborado, pero con arroz, fideos, huevos y algunas verduras puedes resolver un almuerzo completo en minutos.',
      'Nuestra favorita: spaghetti al ajo y aceite. Cuece los fideos 8 minutos, dora dos dientes de ajo en aceite de oliva, mezcla y termina con queso rallado.',
      'Otras ideas: arroz salteado con huevo, tortilla de papas express, quesadillas de jamón y queso, y sopa de verduras con fideos cabello de ángel.',
    ],
  },
  {
    id: 2,
    titulo: 'Guía para armar una despensa económica',
    fecha: '2026-03-10',
    autor: 'Equipo MiniMarket',
    imagen: '/img/gemini-svg despensa.svg',
    resumen: 'Planifica tus compras mensuales para maximizar tu presupuesto sin perder calidad.',
    contenido: [
      'El primer paso es hacer un inventario de lo que ya tienes. Así evitas comprar productos repetidos y reduces el desperdicio.',
      'Prioriza productos de larga duración: arroz, legumbres, fideos, conservas y leche larga vida. Compra frescos solo para la semana.',
      'Revisa la sección de ofertas de nuestra tienda: cada semana publicamos descuentos en productos de la canasta básica.',
    ],
  },
  {
    id: 3,
    titulo: 'Snacks saludables para la jornada de estudio',
    fecha: '2026-03-02',
    autor: 'Equipo MiniMarket',
    imagen: '/img/gemini-svg snacks.svg',
    resumen: 'Opciones nutritivas y llenas de energía ideales para tus horas de concentración académica.',
    contenido: [
      'Estudiar requiere energía constante. En vez de azúcar rápida, prefiere colaciones con fibra y proteína que te mantengan saciado.',
      'Algunas opciones: yogurt con avena, frutos secos, fruta picada, galletas integrales y barritas de cereal sin azúcar añadida.',
      'Y no olvides hidratarte: tener una botella de agua a mano mejora la concentración durante las sesiones largas.',
    ],
  },
];

export const regionesComunas = {
  'Metropolitana': ['Santiago', 'Providencia', 'Ñuñoa', 'Maipú', 'Puente Alto', 'Cerrillos', 'Melipilla'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
  'Biobío': ['Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles'],
};
