import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [mensajeGlobal, setMensajeGlobal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    // Validar Correo
    if (!correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio.';
    } else {
      const dominiosValidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
      const dominioValido = dominiosValidos.some(d => correo.toLowerCase().endsWith(d));
      if (!dominioValido) {
        nuevosErrores.correo = 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.';
      }
    }

    // Validar Contraseña
    if (!password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (password.length < 4 || password.length > 10) {
      nuevosErrores.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setMensajeGlobal('');
    } else {
      setErrores({});
      setMensajeGlobal('¡Inicio de sesión exitoso!');
    }
  };

  return (
    <main className="contenedor-formulario">
      <section className="tarjeta-formulario">
        <h2>Iniciar Sesión</h2>
        <p className="subtitulo-form">Ingresa a tu cuenta para continuar con la compra</p>
        
        <form id="form-login" noValidate onSubmit={handleSubmit}>
          <div className="grupo-input">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input 
              type="email" 
              id="correo" 
              name="correo" 
              maxLength="100" 
              placeholder="ejemplo@duoc.cl" 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            {errores.correo && <span className="mensaje-error" id="error-correo">{errores.correo}</span>}
            <small className="texto-ayuda">Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com</small>
          </div>

          <div className="grupo-input">
            <label htmlFor="password">Contraseña *</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              minLength="4" 
              maxLength="10" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errores.password && <span className="mensaje-error" id="error-password">{errores.password}</span>}
            <small className="texto-ayuda">Longitud entre 4 y 10 caracteres.</small>
          </div>

          <button type="submit" className="btn-submit">Ingresar</button>

          {mensajeGlobal && <div id="mensaje-global" className="mensaje-global exito">{mensajeGlobal}</div>}
        </form>

        <div className="footer-form">
          <p>¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></p>
        </div>
      </section>
    </main>
  );
}