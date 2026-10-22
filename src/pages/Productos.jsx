// src/pages/Productos.jsx
import { useState } from 'react';

export default function Productos({ agregarAlCarrito }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');

  const productos = [
    { id: 1, nombre: 'Bebida Cola 2.5 L', precio: 2500, categoria: 'bebidas', etiqueta: 'Bebidas', imagen: '/img/coca cola.jpg' },
    { id: 2, nombre: 'Papas Fritas 250g', precio: 1890, categoria: 'snacks', etiqueta: 'Snacks', imagen: '/img/papas fritas.jpg' },
    { id: 3, nombre: 'Pan de Molde Familiar', precio: 2100, categoria: 'abarrotes', etiqueta: 'Abarrotes', imagen: '/img/pan de molde.webp' },
    { id: 4, nombre: 'Leche Entera 1 Litro', precio: 1050, categoria: 'lacteos', etiqueta: 'Lácteos', imagen: '/img/leche.jpg' },
    { id: 5, nombre: 'Galletas Chocolate 120g', precio: 990, categoria: 'snacks', etiqueta: 'Snacks', imagen: '/img/Galletas de Chocolate.jpg' },
    { id: 6, nombre: 'Jugo Naranja 1 Litro', precio: 1450, categoria: 'bebidas', etiqueta: 'Bebidas', imagen: '/img/jugo naranja.jpg' }
  ];

  const productosFiltrados = categoriaSeleccionada === 'todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <main className="contenedor-catalogo">
      <section className="encabezado-seccion">
        <h2>Catálogo Completo</h2>
        <p>Encuentra tus abarrotes, snacks y bebidas favoritas.</p>
      </section>

      <section className="filtros-categoria">
        <label htmlFor="select-categoria">Filtrar por categoría:</label>
        <select 
          id="select-categoria"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="todos">Todas las categorías</option>
          <option value="bebidas">Bebidas y Licores</option>
          <option value="snacks">Snacks y Golosinas</option>
          <option value="abarrotes">Abarrotes</option>
          <option value="lacteos">Lácteos y Cecinas</option>
        </select>
      </section>

      <section className="productos-catalogo">
        <div className="grilla-productos">
          {productosFiltrados.map((prod) => (
            <article key={prod.id} className="tarjeta-producto">
              <div className="espacio-foto">
                <img src={prod.imagen} alt={prod.nombre} className="img-producto" />
              </div>
              <div className="info-producto">
                <span className="categoria-etiqueta">{prod.etiqueta}</span>
                <h3>{prod.nombre}</h3>
                <p className="precio">${prod.precio.toLocaleString('es-CL')}</p>
                <div className="acciones-tarjeta">
                  <button 
                    className="btn-agregar" 
                    onClick={() => agregarAlCarrito(prod)}
                  >
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}