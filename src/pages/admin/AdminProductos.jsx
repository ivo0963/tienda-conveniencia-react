import { useState } from 'react';

export default function AdminProductos() {
  const [productos, setProductos] = useState([
    { id: 1, codigo: 'BEB-001', nombre: 'Bebida Cola 2.5L', categoria: 'bebidas', precio: 2500, stock: 50, stockCritico: 5, estado: 'Activo' },
    { id: 2, codigo: 'SNK-001', nombre: 'Papas Fritas 250g', categoria: 'snacks', precio: 1890, stock: 20, stockCritico: 5, estado: 'Activo' }
  ]);

  const [formData, setFormData] = useState({
    id: null,
    codigo: '',
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    stockCritico: ''
  });

  const [errores, setErrores] = useState({});
  const [mensajeGlobal, setMensajeGlobal] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLimpiar = () => {
    setFormData({ id: null, codigo: '', nombre: '', categoria: '', precio: '', stock: '', stockCritico: '' });
    setErrores({});
    setMensajeGlobal('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!formData.codigo.trim()) nuevosErrores.codigo = 'El código es obligatorio';
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!formData.categoria) nuevosErrores.categoria = 'Seleccione una categoría';
    if (!formData.precio || formData.precio < 0) nuevosErrores.precio = 'El precio debe ser válido';
    if (!formData.stock || formData.stock < 0) nuevosErrores.stock = 'El stock debe ser entero positivo';
    if (!formData.stockCritico || formData.stockCritico < 0) nuevosErrores.stockCritico = 'Stock crítico requerido';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setMensajeGlobal('');
    } else {
      if (formData.id) {
        // Editar
        setProductos(productos.map(p => p.id === formData.id ? { ...formData, precio: Number(formData.precio), stock: Number(formData.stock), stockCritico: Number(formData.stockCritico) } : p));
        setMensajeGlobal('¡Producto actualizado correctamente!');
      } else {
        // Crear
        const nuevoProd = {
          ...formData,
          id: Date.now(),
          precio: Number(formData.precio),
          stock: Number(formData.stock),
          stockCritico: Number(formData.stockCritico),
          estado: 'Activo'
        };
        setProductos([...productos, nuevoProd]);
        setMensajeGlobal('¡Producto guardado exitosamente!');
      }
      handleLimpiar();
    }
  };

  const handleEditar = (prod) => {
    setFormData(prod);
    setErrores({});
    setMensajeGlobal('');
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  return (
    <>
      <h2>Mantenedor de Productos</h2>

      <section className="tarjeta-formulario-admin">
        <h3 id="titulo-form-producto">{formData.id ? 'Editar Producto' : 'Agregar Producto'}</h3>
        <form id="form-producto" onSubmit={handleSubmit}>
          
          <div className="grilla-form-admin">
            <div className="grupo-input">
              <label htmlFor="codigo-prod">Código de Producto *</label>
              <input 
                type="text" 
                id="codigo-prod" 
                name="codigo" 
                placeholder="EJ: BEB-001" 
                value={formData.codigo}
                onChange={handleChange}
                required
              />
              {errores.codigo && <span className="mensaje-error">{errores.codigo}</span>}
            </div>

            <div className="grupo-input">
              <label htmlFor="nombre-prod">Nombre del Producto *</label>
              <input 
                type="text" 
                id="nombre-prod" 
                name="nombre" 
                maxLength="100" 
                placeholder="Bebida Cola 2.5L" 
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              {errores.nombre && <span className="mensaje-error">{errores.nombre}</span>}
            </div>

            <div className="grupo-input">
              <label htmlFor="categoria-prod">Categoría *</label>
              <select id="categoria-prod" name="categoria" value={formData.categoria} onChange={handleChange} required>
                <option value="">Seleccione una categoría</option>
                <option value="bebidas">Bebidas y Licores</option>
                <option value="snacks">Snacks y Golosinas</option>
                <option value="abarrotes">Abarrotes</option>
                <option value="lacteos">Lácteos y Cecinas</option>
              </select>
              {errores.categoria && <span className="mensaje-error">{errores.categoria}</span>}
            </div>

            <div className="grupo-input">
              <label htmlFor="precio-prod">Precio ($) *</label>
              <input 
                type="number" 
                id="precio-prod" 
                name="precio" 
                step="0.01" 
                min="0" 
                placeholder="2500" 
                value={formData.precio}
                onChange={handleChange}
                required
              />
              {errores.precio && <span className="mensaje-error">{errores.precio}</span>}
              <small className="texto-ayuda">Admite decimales, mínimo 0.</small>
            </div>

            <div className="grupo-input">
              <label htmlFor="stock-prod">Stock Actual *</label>
              <input 
                type="number" 
                id="stock-prod" 
                name="stock" 
                step="1" 
                min="0" 
                placeholder="50" 
                value={formData.stock}
                onChange={handleChange}
                required
              />
              {errores.stock && <span className="mensaje-error">{errores.stock}</span>}
              <small className="texto-ayuda">Números enteros, mínimo 0.</small>
            </div>

            <div className="grupo-input">
              <label htmlFor="stock-critico-prod">Stock Crítico *</label>
              <input 
                type="number" 
                id="stock-critico-prod" 
                name="stockCritico" 
                step="1" 
                min="0" 
                placeholder="5" 
                value={formData.stockCritico}
                onChange={handleChange}
                required
              />
              {errores.stockCritico && <span className="mensaje-error">{errores.stockCritico}</span>}
              <small className="texto-ayuda">Números enteros, mínimo 0.</small>
            </div>
          </div>

          <div className="acciones-form-admin">
            <button type="submit" className="btn-submit">Guardar Producto</button>
            <button type="button" onClick={handleLimpiar} className="btn-vaciar">Limpiar Formulario</button>
          </div>

          {mensajeGlobal && <div className="mensaje-global exito">{mensajeGlobal}</div>}
        </form>
      </section>

      <section className="seccion-tabla-admin">
        <h3>Inventario de Productos</h3>
        <table className="tabla-admin">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>St. Crítico</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.codigo}</td>
                <td>{prod.nombre}</td>
                <td>{prod.categoria}</td>
                <td>${prod.precio.toLocaleString('es-CL')}</td>
                <td>{prod.stock}</td>
                <td>{prod.stockCritico}</td>
                <td><span className="badge ok">{prod.estado}</span></td>
                <td>
                  <button className="btn-accion editar" onClick={() => handleEditar(prod)}>Editar</button>
                  <button className="btn-accion eliminar" onClick={() => handleEliminar(prod.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}