// src/components/admin/FormularioUsuario.jsx
import { useState } from 'react';
import CampoFormulario from '../ui/CampoFormulario';
import SelectorRegionComuna from '../compra/SelectorRegionComuna';
import Boton from '../ui/Boton';
import { validarUsuario } from '../../utils/validaciones';

const VACIO = { run: '', nombre: '', apellidos: '', correo: '', password: '', rol: '', estado: 'activo', region: '', comuna: '', direccion: '', departamento: '' };

export default function FormularioUsuario({ usuario, onGuardar, onCancelar, permitirRol = true, errorExterno }) {
  const esNuevo = !usuario;
  const [datos, setDatos] = useState(() => (usuario ? { ...VACIO, ...usuario, password: '' } : VACIO));
  const [errores, setErrores] = useState({});

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const nuevosErrores = validarUsuario(datos, { esNuevo });
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const { password, id: _id, ...resto } = datos;
    onGuardar({
      ...resto,
      run: resto.run.toUpperCase(),
      correo: resto.correo.trim(),
      ...(password ? { password } : {}),
    });
  };

  return (
    <form noValidate onSubmit={enviar} aria-label="Formulario de usuario">
      {errorExterno && <div className="alert alert-danger">{errorExterno}</div>}
      <div className="row">
        <CampoFormulario id="run" name="run" etiqueta="RUN" requerido className="col-md-4" maxLength="9" placeholder="123456785" value={datos.run} onChange={cambiar} error={errores.run} />
        <CampoFormulario id="nombre" name="nombre" etiqueta="Nombre" requerido className="col-md-4" value={datos.nombre} onChange={cambiar} error={errores.nombre} />
        <CampoFormulario id="apellidos" name="apellidos" etiqueta="Apellidos" requerido className="col-md-4" value={datos.apellidos} onChange={cambiar} error={errores.apellidos} />
        <CampoFormulario id="correo" name="correo" type="email" etiqueta="Correo" requerido className="col-md-6" value={datos.correo} onChange={cambiar} error={errores.correo} />
        <CampoFormulario
          id="password"
          name="password"
          type="password"
          etiqueta="Contraseña"
          requerido={esNuevo}
          className="col-md-6"
          maxLength="10"
          value={datos.password}
          onChange={cambiar}
          error={errores.password}
          ayuda={esNuevo ? 'Entre 4 y 10 caracteres.' : 'Déjala vacía para mantener la actual.'}
        />
        {permitirRol && (
          <>
            <CampoFormulario como="select" id="rol" name="rol" etiqueta="Rol" requerido className="col-md-6" value={datos.rol} onChange={cambiar} error={errores.rol}>
              <option value="">Seleccione un rol</option>
              <option value="admin">Administrador</option>
              <option value="vendedor">Vendedor</option>
              <option value="cliente">Cliente</option>
            </CampoFormulario>
            <CampoFormulario como="select" id="estado" name="estado" etiqueta="Estado" className="col-md-6" value={datos.estado} onChange={cambiar}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </CampoFormulario>
          </>
        )}
      </div>
      <SelectorRegionComuna region={datos.region} comuna={datos.comuna} requerido={false} onCambiar={(rc) => setDatos({ ...datos, ...rc })} />
      <div className="row">
        <CampoFormulario id="direccion" name="direccion" etiqueta="Dirección" className="col-md-8" value={datos.direccion} onChange={cambiar} />
        <CampoFormulario id="departamento" name="departamento" etiqueta="Depto." className="col-md-4" value={datos.departamento} onChange={cambiar} />
      </div>
      <div className="d-flex gap-2">
        <Boton tipo="submit" etiqueta={esNuevo ? 'Crear usuario' : 'Guardar cambios'} icono="save" />
        {onCancelar && <Boton etiqueta="Cancelar" variante="outline-secondary" onClick={onCancelar} />}
      </div>
    </form>
  );
}
