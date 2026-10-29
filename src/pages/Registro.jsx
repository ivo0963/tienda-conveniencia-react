// src/pages/Registro.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoFormulario from '../components/ui/CampoFormulario';
import SelectorRegionComuna from '../components/compra/SelectorRegionComuna';
import Boton from '../components/ui/Boton';
import { useAuth } from '../context/contextos';
import { validarRegistro } from '../utils/validaciones';

const VACIO = { run: '', nombre: '', apellidos: '', correo: '', password: '', confirmarPassword: '', region: '', comuna: '', direccion: '', departamento: '' };

export default function Registro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const nuevosErrores = validarRegistro(datos);
    setErrores(nuevosErrores);
    setErrorGlobal('');
    if (Object.keys(nuevosErrores).length > 0) return;

    const { confirmarPassword: _omitido, ...usuario } = datos;
    const resultado = registrar(usuario);
    if (!resultado.ok) {
      setErrorGlobal(resultado.error);
      return;
    }
    navigate('/', { replace: true });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <section className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h4">Crear cuenta</h1>
            <p className="text-body-secondary">Regístrate para comprar más rápido: tus datos se completarán solos en el checkout.</p>

            {errorGlobal && <div className="alert alert-danger" role="alert">{errorGlobal}</div>}

            <form noValidate onSubmit={enviar} aria-label="Formulario de registro">
              <div className="row">
                <CampoFormulario id="run" name="run" etiqueta="RUN" requerido className="col-md-6" maxLength="9" placeholder="123456785" value={datos.run} onChange={cambiar} error={errores.run} ayuda="Sin puntos ni guion." />
                <CampoFormulario id="correo" name="correo" type="email" etiqueta="Correo electrónico" requerido className="col-md-6" maxLength="100" placeholder="ejemplo@duoc.cl" value={datos.correo} onChange={cambiar} error={errores.correo} ayuda="@duoc.cl, @profesor.duoc.cl o @gmail.com" />
                <CampoFormulario id="nombre" name="nombre" etiqueta="Nombre" requerido className="col-md-6" maxLength="50" value={datos.nombre} onChange={cambiar} error={errores.nombre} />
                <CampoFormulario id="apellidos" name="apellidos" etiqueta="Apellidos" requerido className="col-md-6" maxLength="100" value={datos.apellidos} onChange={cambiar} error={errores.apellidos} />
                <CampoFormulario id="password" name="password" type="password" etiqueta="Contraseña" requerido className="col-md-6" maxLength="10" value={datos.password} onChange={cambiar} error={errores.password} ayuda="Entre 4 y 10 caracteres." />
                <CampoFormulario id="confirmarPassword" name="confirmarPassword" type="password" etiqueta="Confirmar contraseña" requerido className="col-md-6" maxLength="10" value={datos.confirmarPassword} onChange={cambiar} error={errores.confirmarPassword} />
              </div>

              <SelectorRegionComuna region={datos.region} comuna={datos.comuna} errores={errores} onCambiar={(rc) => setDatos({ ...datos, ...rc })} />

              <div className="row">
                <CampoFormulario id="direccion" name="direccion" etiqueta="Dirección (opcional)" className="col-md-8" maxLength="300" value={datos.direccion} onChange={cambiar} />
                <CampoFormulario id="departamento" name="departamento" etiqueta="Depto. (opcional)" className="col-md-4" maxLength="20" value={datos.departamento} onChange={cambiar} />
              </div>

              <Boton tipo="submit" etiqueta="Registrarse" icono="person-plus" variante="marca" className="w-100" />
            </form>

            <p className="text-center mt-3 mb-0">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
