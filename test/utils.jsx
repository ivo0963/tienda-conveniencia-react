// test/utils.jsx
// Utilidades compartidas por las pruebas.
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthProvider from '../src/context/AuthProvider';
import CarritoProvider from '../src/context/CarritoProvider';
import { reiniciarBaseDatos } from '../src/data/db';

// Deja la "base de datos", el carrito y la sesión en su estado inicial.
export function reiniciarDatos({ sesion = null, carrito = [] } = {}) {
  localStorage.clear();
  reiniciarBaseDatos();
  if (sesion != null) localStorage.setItem('sesion', JSON.stringify(sesion));
  if (carrito.length) localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Renderiza un componente con los mismos proveedores que usa la app.
// `rutas` permite registrar vistas extra para comprobar navegaciones.
export function renderConApp(ui, { ruta = '/', path = '*', rutas = {} } = {}) {
  return render(
    <AuthProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={[ruta]}>
          <Routes>
            <Route path={path} element={ui} />
            {Object.entries(rutas).map(([p, el]) => (
              <Route key={p} path={p} element={el} />
            ))}
          </Routes>
        </MemoryRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

export const productoDePrueba = (cambios = {}) => ({
  id: 99,
  codigo: 'TST-001',
  nombre: 'Producto de prueba',
  descripcion: 'Descripción de prueba',
  precio: 1000,
  precioOferta: null,
  stock: 10,
  stockCritico: 2,
  categoriaId: 1,
  imagen: '/img/sin-imagen.svg',
  ...cambios,
});
