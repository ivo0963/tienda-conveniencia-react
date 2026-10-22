// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes del sitio principal
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas públicas
import Home from './pages/Home';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Registro from './pages/Registro';

// Páginas de administración
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductos from './pages/admin/AdminProductos';
import AdminUsuarios from './pages/admin/AdminUsuarios';

export default function App() {
  const [itemsCarrito, setItemsCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem('carrito');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(itemsCarrito));
  }, [itemsCarrito]);

  const agregarAlCarrito = (producto) => {
    setItemsCarrito((prevItems) => {
      const existe = prevItems.find((item) => item.id === producto.id);
      if (existe) {
        return prevItems.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevItems, { ...producto, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarItem(id);
      return;
    }
    setItemsCarrito((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, cantidad: nuevaCantidad } : item))
    );
  };

  const eliminarItem = (id) => {
    setItemsCarrito((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setItemsCarrito([]);
  };

  const totalCantidad = itemsCarrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Panel Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
        </Route>

        {/* Tienda Pública con Header y Footer individuales */}
        <Route path="/" element={<><Header contadorCarrito={totalCantidad} /><Home /><Footer /></>} />
        <Route path="/productos" element={<><Header contadorCarrito={totalCantidad} /><Productos agregarAlCarrito={agregarAlCarrito} /><Footer /></>} />
        <Route 
          path="/carrito" 
          element={
            <>
              <Header contadorCarrito={totalCantidad} />
              <Carrito 
                itemsCarrito={itemsCarrito} 
                cambiarCantidad={cambiarCantidad} 
                eliminarItem={eliminarItem} 
                vaciarCarrito={vaciarCarrito} 
              />
              <Footer />
            </>
          } 
        />
        <Route path="/nosotros" element={<><Header contadorCarrito={totalCantidad} /><Nosotros /><Footer /></>} />
        <Route path="/contacto" element={<><Header contadorCarrito={totalCantidad} /><Contacto /><Footer /></>} />
        <Route path="/blog" element={<><Header contadorCarrito={totalCantidad} /><Blog /><Footer /></>} />
        <Route path="/login" element={<><Header contadorCarrito={totalCantidad} /><Login /><Footer /></>} />
        <Route path="/registro" element={<><Header contadorCarrito={totalCantidad} /><Registro /><Footer /></>} />
      </Routes>
    </BrowserRouter>
  );
}