// src/context/CarritoProvider.jsx
// El carrito guarda solo { id, cantidad } en localStorage; los datos del producto
// (nombre, precio, stock) se leen siempre desde productosDB para estar al día.
import { useEffect, useMemo, useState } from 'react';
import { CarritoContext } from './contextos';
import { productosDB } from '../data/db';
import { precioFinal } from '../data/tienda';
import useColeccion from '../hooks/useColeccion';

const CLAVE = 'carrito';

function leerCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(guardado) ? guardado.map(({ id, cantidad }) => ({ id, cantidad })) : [];
  } catch {
    return [];
  }
}

export default function CarritoProvider({ children }) {
  const productos = useColeccion(productosDB);
  const [lineas, setLineas] = useState(leerCarrito);

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(lineas));
  }, [lineas]);

  const items = useMemo(
    () =>
      lineas
        .map(({ id, cantidad }) => {
          const producto = productos.find((p) => p.id === id);
          if (!producto) return null;
          const precio = precioFinal(producto);
          return { producto, cantidad, precio, subtotal: precio * cantidad };
        })
        .filter(Boolean),
    [lineas, productos]
  );

  const stockDe = (id) => productos.find((p) => p.id === id)?.stock ?? 0;

  const agregar = (producto, cantidad = 1) => {
    setLineas((prev) => {
      const existente = prev.find((l) => l.id === producto.id);
      const nueva = Math.min((existente?.cantidad ?? 0) + cantidad, stockDe(producto.id));
      if (nueva <= 0) return prev;
      if (existente) return prev.map((l) => (l.id === producto.id ? { ...l, cantidad: nueva } : l));
      return [...prev, { id: producto.id, cantidad: nueva }];
    });
  };

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad <= 0) {
      eliminar(id);
      return;
    }
    setLineas((prev) => prev.map((l) => (l.id === id ? { ...l, cantidad: Math.min(cantidad, stockDe(id)) } : l)));
  };

  const eliminar = (id) => setLineas((prev) => prev.filter((l) => l.id !== id));

  const vaciar = () => setLineas([]);

  const totalCantidad = items.reduce((acc, i) => acc + i.cantidad, 0);
  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);

  const valor = { items, totalCantidad, subtotal, agregar, cambiarCantidad, eliminar, vaciar };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}
