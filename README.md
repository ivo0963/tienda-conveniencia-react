# MiniMarket DSY · Tienda online en React

Proyecto de la asignatura **DSY1104 – Evaluación Parcial 2**. Tienda de conveniencia desarrollada con
**React 19 + Vite**, diseño responsivo con **Bootstrap 5** y pruebas unitarias con **Jasmine + Karma**.

## Requisitos

- Node.js 20 o superior
- Google Chrome (para ejecutar las pruebas)

## Cómo ejecutar

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
npm test           # pruebas unitarias (Jasmine + Karma) + reporte de cobertura
npm run lint       # análisis estático con oxlint
npm run build      # build de producción en /dist
```

El reporte de cobertura queda en `coverage/html/index.html` (resumen en texto en `coverage/resumen.txt`).
Para repetir un orden aleatorio concreto de las pruebas: `SEMILLA=1234 npm test`.

## Cuentas de prueba

| Rol           | Correo                      | Contraseña |
|---------------|-----------------------------|------------|
| Administrador | admin@duoc.cl               | admin123   |
| Vendedor      | vendedor@profesor.duoc.cl   | vende123   |
| Cliente       | juan.perez@gmail.com        | juan1234   |

Desde el Dashboard del administrador se pueden **restablecer los datos de demostración**.

## Vistas

**Tienda (pública)**

| Ruta | Vista |
|------|-------|
| `/` | Home: carrusel, categorías y destacados |
| `/productos` | Catálogo con búsqueda, filtros (categoría, precio, ofertas, stock) y orden |
| `/productos/:id` | Detalle de producto y productos relacionados |
| `/categorias`, `/categorias/:id` | Productos agrupados por categoría / una categoría |
| `/ofertas` | Productos en oferta |
| `/carrito` | Carrito de compras |
| `/checkout` | Datos del cliente, opciones de entrega y medio de pago (autocompletado si hay sesión) |
| `/compra/exito/:id` | Pago correcto con resumen / boleta |
| `/compra/error/:id` | Pago con error y opción de reintentar |
| `/registro`, `/login` | Registro e inicio de sesión |
| `/nosotros`, `/contacto` | Información y formulario de contacto |
| `/blog`, `/blog/:id` | Listado y detalle de artículos |

**Administrador** (`/admin`, requiere rol administrador o vendedor)

| Ruta | Vista |
|------|-------|
| `/admin` | Dashboard con indicadores y accesos |
| `/admin/ordenes`, `/admin/ordenes/:id` | Órdenes / boletas y detalle de boleta (cambio de estado) |
| `/admin/productos` | Listado; `nuevo`, `:id` (mostrar), `:id/editar` |
| `/admin/productos/criticos` | Productos con stock crítico y reposición |
| `/admin/productos/reportes` | Reportes de ventas e inventario por producto |
| `/admin/categorias` | Listado; `nueva`, `:id/editar` |
| `/admin/usuarios` | Listado; `nuevo`, `:id` (mostrar), `:id/editar`, `:id/historial` |
| `/admin/reportes` | Reportes generales |
| `/admin/perfil` | Perfil del usuario conectado |

El vendedor solo accede a Dashboard, Órdenes, Productos (lectura) y Perfil.

> Para simular un pago rechazado, marca "Simular pago rechazado" en el checkout. Una compra también se
> rechaza si no hay stock suficiente.

## Estructura

```
src/
├── data/
│   ├── semilla.js        # Datos iniciales (productos, categorías, usuarios, órdenes, blogs, regiones)
│   ├── db.js             # "Base de datos" simulada: colecciones con CRUD persistidas en localStorage
│   └── tienda.js         # Reglas de negocio: precios, ofertas, envío, compra, reportes
├── hooks/useColeccion.js # Suscribe un componente a una colección (useSyncExternalStore)
├── context/              # Sesión (AuthProvider) y carrito (CarritoProvider)
├── utils/                # Formato de moneda/fechas, validaciones y filtros (funciones puras)
├── components/           # Componentes reutilizables (ui, productos, carrito, compra, admin, layout…)
├── pages/                # Vistas de la tienda
│   └── admin/            # Vistas del panel administrador
└── App.jsx               # Rutas de la aplicación
test/                     # Pruebas Jasmine (*.spec.js / *.spec.jsx) y utilidades
karma.conf.cjs            # Configuración de Karma (webpack + babel + cobertura istanbul)
```

### Persistencia en tiempo real

Cada colección de `db.js` (`productosDB`, `categoriasDB`, `usuariosDB`, `ordenesDB`, `blogsDB`) expone
`listar`, `obtener`, `buscar`, `crear`, `actualizar`, `eliminar`, `reiniciar` y `suscribir`. Los componentes
leen los datos con `useColeccion(coleccion)`, por lo que cualquier cambio (por ejemplo, editar un precio en
el panel o descontar stock al comprar) se refleja de inmediato en toda la interfaz, incluso entre pestañas.

## Pruebas

Las pruebas usan Jasmine como framework, Karma como runner (Chrome Headless) y Testing Library para
renderizar componentes y simular eventos de usuario. Cubren:

- **Renderizado**: listas que muestran todos los elementos (`ListaProductos`), todas las rutas de la app.
- **Renderizado condicional**: `MensajeError` solo con error, ofertas, stock agotado, rutas protegidas.
- **Props**: `Boton` recibe etiqueta y `onClick`; `ProductoCard`, `CarritoTabla`, `FormularioProducto`.
- **Estado**: formularios que cambian al escribir (`Contacto`, `Login`, `Checkout`), contexto del carrito.
- **Eventos**: clics en botones, selects y checkbox que ejecutan funciones o cambian el estado.
- **Lógica**: CRUD de `db.js`, reglas de `tienda.js`, validaciones (RUN con dígito verificador) y filtros.
