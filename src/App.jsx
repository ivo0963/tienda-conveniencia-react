// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthProvider from './context/AuthProvider';
import CarritoProvider from './context/CarritoProvider';
import TiendaLayout from './components/layout/TiendaLayout';
import RutaProtegida from './components/RutaProtegida';

// Tienda
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Categorias from './pages/Categorias';
import CategoriaDetalle from './pages/CategoriaDetalle';
import Ofertas from './pages/Ofertas';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import PagoExitoso from './pages/PagoExitoso';
import PagoError from './pages/PagoError';
import Nosotros from './pages/Nosotros';
import Blog from './pages/Blog';
import BlogDetalle from './pages/BlogDetalle';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import NoEncontrado from './pages/NoEncontrado';

// Administrador
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrdenes from './pages/admin/AdminOrdenes';
import AdminBoleta from './pages/admin/AdminBoleta';
import AdminProductos from './pages/admin/AdminProductos';
import AdminProductoForm from './pages/admin/AdminProductoForm';
import AdminProductoDetalle from './pages/admin/AdminProductoDetalle';
import AdminProductosCriticos from './pages/admin/AdminProductosCriticos';
import AdminReportesProductos from './pages/admin/AdminReportesProductos';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminCategoriaForm from './pages/admin/AdminCategoriaForm';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminUsuarioForm from './pages/admin/AdminUsuarioForm';
import AdminUsuarioDetalle from './pages/admin/AdminUsuarioDetalle';
import AdminUsuarioHistorial from './pages/admin/AdminUsuarioHistorial';
import AdminReportes from './pages/admin/AdminReportes';
import AdminPerfil from './pages/admin/AdminPerfil';

const soloAdmin = (elemento) => <RutaProtegida roles={['admin']}>{elemento}</RutaProtegida>;

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<TiendaLayout />}>
              <Route index element={<Home />} />
              <Route path="productos" element={<Productos />} />
              <Route path="productos/:id" element={<ProductoDetalle />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="categorias/:id" element={<CategoriaDetalle />} />
              <Route path="ofertas" element={<Ofertas />} />
              <Route path="carrito" element={<Carrito />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="compra/exito/:id" element={<PagoExitoso />} />
              <Route path="compra/error/:id" element={<PagoError />} />
              <Route path="nosotros" element={<Nosotros />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:id" element={<BlogDetalle />} />
              <Route path="contacto" element={<Contacto />} />
              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Registro />} />
              <Route path="*" element={<NoEncontrado />} />
            </Route>

            <Route path="admin" element={<RutaProtegida roles={['admin', 'vendedor']}><AdminLayout /></RutaProtegida>}>
              <Route index element={<AdminDashboard />} />
              <Route path="ordenes" element={<AdminOrdenes />} />
              <Route path="ordenes/:id" element={<AdminBoleta />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="productos/nuevo" element={soloAdmin(<AdminProductoForm />)} />
              <Route path="productos/criticos" element={<AdminProductosCriticos />} />
              <Route path="productos/reportes" element={soloAdmin(<AdminReportesProductos />)} />
              <Route path="productos/:id" element={<AdminProductoDetalle />} />
              <Route path="productos/:id/editar" element={soloAdmin(<AdminProductoForm />)} />
              <Route path="categorias" element={soloAdmin(<AdminCategorias />)} />
              <Route path="categorias/nueva" element={soloAdmin(<AdminCategoriaForm />)} />
              <Route path="categorias/:id/editar" element={soloAdmin(<AdminCategoriaForm />)} />
              <Route path="usuarios" element={soloAdmin(<AdminUsuarios />)} />
              <Route path="usuarios/nuevo" element={soloAdmin(<AdminUsuarioForm />)} />
              <Route path="usuarios/:id" element={soloAdmin(<AdminUsuarioDetalle />)} />
              <Route path="usuarios/:id/editar" element={soloAdmin(<AdminUsuarioForm />)} />
              <Route path="usuarios/:id/historial" element={soloAdmin(<AdminUsuarioHistorial />)} />
              <Route path="reportes" element={soloAdmin(<AdminReportes />)} />
              <Route path="perfil" element={<AdminPerfil />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}
