// src/components/productos/FiltrosProductos.jsx
// Formulario de filtros controlado: recibe los filtros actuales y notifica cada cambio.
import { OPCIONES_ORDEN } from '../../utils/filtros';

export default function FiltrosProductos({ filtros, categorias, onCambiar, onLimpiar, mostrarCategoria = true }) {
  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    onCambiar({ ...filtros, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <form className="card card-body shadow-sm" role="search" aria-label="Filtros de productos" onSubmit={(e) => e.preventDefault()}>
      <h2 className="h6 mb-3"><i className="bi bi-funnel me-1"></i>Filtrar productos</h2>

      <div className="mb-3">
        <label htmlFor="filtro-texto" className="form-label">Buscar</label>
        <input id="filtro-texto" name="texto" type="search" className="form-control" placeholder="Nombre o código" value={filtros.texto} onChange={cambiar} />
      </div>

      {mostrarCategoria && (
        <div className="mb-3">
          <label htmlFor="filtro-categoria" className="form-label">Categoría</label>
          <select id="filtro-categoria" name="categoriaId" className="form-select" value={filtros.categoriaId} onChange={cambiar}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="filtro-precio" className="form-label">Precio máximo</label>
        <input id="filtro-precio" name="precioMax" type="number" min="0" step="100" className="form-control" placeholder="Sin límite" value={filtros.precioMax} onChange={cambiar} />
      </div>

      <div className="mb-3">
        <label htmlFor="filtro-orden" className="form-label">Ordenar por</label>
        <select id="filtro-orden" name="orden" className="form-select" value={filtros.orden} onChange={cambiar}>
          {Object.entries(OPCIONES_ORDEN).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>{etiqueta}</option>
          ))}
        </select>
      </div>

      <div className="form-check">
        <input id="filtro-ofertas" name="soloOfertas" type="checkbox" className="form-check-input" checked={filtros.soloOfertas} onChange={cambiar} />
        <label htmlFor="filtro-ofertas" className="form-check-label">Solo ofertas</label>
      </div>
      <div className="form-check mb-3">
        <input id="filtro-stock" name="soloStock" type="checkbox" className="form-check-input" checked={filtros.soloStock} onChange={cambiar} />
        <label htmlFor="filtro-stock" className="form-check-label">Solo con stock</label>
      </div>

      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onLimpiar}>
        Limpiar filtros
      </button>
    </form>
  );
}
