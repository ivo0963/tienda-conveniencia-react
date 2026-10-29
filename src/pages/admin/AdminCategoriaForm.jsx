// src/pages/admin/AdminCategoriaForm.jsx
// Nueva categoría (/admin/categorias/nueva) y editar categoría (/admin/categorias/:id/editar).
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import CampoFormulario from '../../components/ui/CampoFormulario';
import Boton from '../../components/ui/Boton';
import { categoriasDB } from '../../data/db';
import { validarCategoria } from '../../utils/validaciones';

export default function AdminCategoriaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoria = id ? categoriasDB.obtener(id) : null;
  const [datos, setDatos] = useState(() => ({ nombre: categoria?.nombre ?? '', descripcion: categoria?.descripcion ?? '', imagen: categoria?.imagen ?? '' }));
  const [errores, setErrores] = useState({});

  if (id && !categoria) return <div className="alert alert-warning">La categoría no existe. <Link to="/admin/categorias">Volver</Link></div>;

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const guardar = (e) => {
    e.preventDefault();
    const nuevosErrores = validarCategoria(datos);
    const repetida = categoriasDB.listar().some((c) => c.nombre.toLowerCase() === datos.nombre.trim().toLowerCase() && c.id !== categoria?.id);
    if (repetida) nuevosErrores.nombre = 'Ya existe una categoría con ese nombre.';
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const valores = { nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(), imagen: datos.imagen.trim() || '/img/sin-imagen.svg' };
    if (categoria) categoriasDB.actualizar(categoria.id, valores);
    else categoriasDB.crear(valores);
    navigate('/admin/categorias');
  };

  return (
    <>
      <EncabezadoSeccion titulo={categoria ? `Editar categoría: ${categoria.nombre}` : 'Nueva categoría'} />
      <div className="card shadow-sm">
        <div className="card-body">
          <form noValidate onSubmit={guardar} aria-label="Formulario de categoría">
            <CampoFormulario id="nombre" name="nombre" etiqueta="Nombre" requerido maxLength="60" value={datos.nombre} onChange={cambiar} error={errores.nombre} />
            <CampoFormulario como="textarea" id="descripcion" name="descripcion" etiqueta="Descripción" rows="2" maxLength="200" value={datos.descripcion} onChange={cambiar} />
            <CampoFormulario id="imagen" name="imagen" etiqueta="Ruta de imagen" placeholder="/img/categoria.jpg" value={datos.imagen} onChange={cambiar} />
            <div className="d-flex gap-2">
              <Boton tipo="submit" etiqueta={categoria ? 'Guardar cambios' : 'Crear categoría'} icono="save" />
              <Boton etiqueta="Cancelar" variante="outline-secondary" onClick={() => navigate('/admin/categorias')} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
