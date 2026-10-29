// src/pages/admin/AdminProductoForm.jsx
// Sirve tanto para "Nuevo producto" (/admin/productos/nuevo) como para
// "Editar producto" (/admin/productos/:id/editar).
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import FormularioProducto from '../../components/admin/FormularioProducto';
import { categoriasDB, productosDB } from '../../data/db';
import useColeccion from '../../hooks/useColeccion';

export default function AdminProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productos = useColeccion(productosDB);
  const categorias = useColeccion(categoriasDB);
  const [error, setError] = useState('');

  const producto = id ? productos.find((p) => p.id === Number(id)) : null;
  if (id && !producto) return <div className="alert alert-warning">El producto no existe. <Link to="/admin/productos">Volver</Link></div>;

  const guardar = (datos) => {
    const codigoRepetido = productos.some((p) => p.codigo === datos.codigo && p.id !== producto?.id);
    if (codigoRepetido) {
      setError(`Ya existe un producto con el código ${datos.codigo}.`);
      return;
    }
    const guardado = producto ? productosDB.actualizar(producto.id, datos) : productosDB.crear(datos);
    navigate(`/admin/productos/${guardado.id}`);
  };

  return (
    <>
      <EncabezadoSeccion titulo={producto ? `Editar producto: ${producto.nombre}` : 'Nuevo producto'} subtitulo="Los campos con * son obligatorios." />
      <div className="card shadow-sm">
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <FormularioProducto producto={producto} categorias={categorias} onGuardar={guardar} onCancelar={() => navigate(-1)} />
        </div>
      </div>
    </>
  );
}
