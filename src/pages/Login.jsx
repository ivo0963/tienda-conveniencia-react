// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CampoFormulario from '../components/ui/CampoFormulario';
import Boton from '../components/ui/Boton';
import { useAuth } from '../context/contextos';
import { validarLogin } from '../utils/validaciones';

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [datos, setDatos] = useState({ correo: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const ingresar = (e) => {
    e.preventDefault();
    const nuevosErrores = validarLogin(datos);
    setErrores(nuevosErrores);
    setErrorGlobal('');
    if (Object.keys(nuevosErrores).length > 0) return;

    const resultado = iniciarSesion(datos.correo, datos.password);
    if (!resultado.ok) {
      setErrorGlobal(resultado.error);
      return;
    }
    const esStaff = ['admin', 'vendedor'].includes(resultado.usuario.rol);
    navigate(location.state?.desde ?? (esStaff ? '/admin' : '/'), { replace: true });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-5">
        <section className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h4">Iniciar sesión</h1>
            <p className="text-body-secondary">Ingresa a tu cuenta para continuar con la compra</p>

            {errorGlobal && <div className="alert alert-danger" role="alert">{errorGlobal}</div>}

            <form noValidate onSubmit={ingresar} aria-label="Formulario de inicio de sesión">
              <CampoFormulario id="correo" name="correo" type="email" etiqueta="Correo electrónico" requerido maxLength="100" placeholder="ejemplo@duoc.cl" value={datos.correo} onChange={cambiar} error={errores.correo} ayuda="Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com" />
              <CampoFormulario id="password" name="password" type="password" etiqueta="Contraseña" requerido maxLength="10" value={datos.password} onChange={cambiar} error={errores.password} ayuda="Entre 4 y 10 caracteres." />
              <Boton tipo="submit" etiqueta="Ingresar" icono="box-arrow-in-right" variante="marca" className="w-100" />
            </form>

            <p className="text-center mt-3 mb-0">
              ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
            </p>

            <details className="mt-3 small text-body-secondary">
              <summary>Cuentas de prueba</summary>
              <ul className="mb-0 mt-2">
                <li>Administrador: admin@duoc.cl / admin123</li>
                <li>Vendedor: vendedor@profesor.duoc.cl / vende123</li>
                <li>Cliente: juan.perez@gmail.com / juan1234</li>
              </ul>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}
