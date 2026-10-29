// src/components/admin/FormularioProducto.jsx
// Formulario para crear o editar un producto. No sabe de la base de datos:
// valida y entrega los datos convertidos a través de onGuardar.
import { useState } from 'react';
import CampoFormulario from '../ui/CampoFormulario';
import Boton from '../ui/Boton';
import { validarProducto } from '../../utils/validaciones';

const VACIO = { codigo: '', nombre: '', descripcion: '', categoriaId: '', precio: '', precioOferta: '', stock: '', stockCritico: '', imagen: '' };

const aFormulario = (producto) =>
  producto
    ? { ...VACIO, ...producto, categoriaId: String(producto.categoriaId), precioOferta: producto.precioOferta ?? '' }
    : VACIO;

export default function FormularioProducto({ producto, categorias, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(() => aFormulario(producto));
  const [errores, setErrores] = useState({});

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const nuevosErrores = validarProducto(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onGuardar({
      codigo: datos.codigo.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      categoriaId: Number(datos.categoriaId),
      precio: Number(datos.precio),
      precioOferta: datos.precioOferta === '' ? null : Number(datos.precioOferta),
      stock: Number(datos.stock),
      stockCritico: Number(datos.stockCritico),
      imagen: datos.imagen.trim() || '/img/sin-imagen.svg',
    });
  };

  return (
    <form noValidate onSubmit={enviar} aria-label="Formulario de producto">
      <div className="row">
        <CampoFormulario id="codigo" name="codigo" etiqueta="Código" requerido className="col-md-4" placeholder="BEB-001" value={datos.codigo} onChange={cambiar} error={errores.codigo} />
        <CampoFormulario id="nombre" name="nombre" etiqueta="Nombre" requerido className="col-md-8" maxLength="100" value={datos.nombre} onChange={cambiar} error={errores.nombre} />
        <CampoFormulario como="textarea" id="descripcion" name="descripcion" etiqueta="Descripción" className="col-12" rows="2" maxLength="500" value={datos.descripcion} onChange={cambiar} />
        <CampoFormulario como="select" id="categoriaId" name="categoriaId" etiqueta="Categoría" requerido className="col-md-6" value={datos.categoriaId} onChange={cambiar} error={errores.categoriaId}>
          <option value="">Seleccione una categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </CampoFormulario>
        <CampoFormulario id="imagen" name="imagen" etiqueta="Ruta de imagen" className="col-md-6" placeholder="/img/mi-producto.jpg" value={datos.imagen} onChange={cambiar} ayuda="Opcional. Imágenes dentro de /public/img." />
        <CampoFormulario id="precio" name="precio" type="number" min="0" etiqueta="Precio ($)" requerido className="col-md-3" value={datos.precio} onChange={cambiar} error={errores.precio} />
        <CampoFormulario id="precioOferta" name="precioOferta" type="number" min="0" etiqueta="Precio oferta ($)" className="col-md-3" value={datos.precioOferta} onChange={cambiar} error={errores.precioOferta} ayuda="Vacío = sin oferta." />
        <CampoFormulario id="stock" name="stock" type="number" min="0" step="1" etiqueta="Stock" requerido className="col-md-3" value={datos.stock} onChange={cambiar} error={errores.stock} />
        <CampoFormulario id="stockCritico" name="stockCritico" type="number" min="0" step="1" etiqueta="Stock crítico" requerido className="col-md-3" value={datos.stockCritico} onChange={cambiar} error={errores.stockCritico} />
      </div>
      <div className="d-flex gap-2">
        <Boton tipo="submit" etiqueta={producto ? 'Guardar cambios' : 'Crear producto'} icono="save" />
        <Boton etiqueta="Cancelar" variante="outline-secondary" onClick={onCancelar} />
      </div>
    </form>
  );
}
