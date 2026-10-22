import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Registro() {
  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    correo: '',
    password: '',
    region: '',
    comuna: ''
  });

  const [errores, setErrores] = useState({});
  const [mensajeGlobal, setMensajeGlobal] = useState('');

  // Datos para regiones y comunas
  const regionesComunas = {
    'Metropolitana': ['Santiago', 'Providencia', 'Maipú', 'Puente Alto', 'Melipilla'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
    'Biobío': ['Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'region') {
      setFormData({ ...formData, region: value, comuna: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    // Validar RUN
    if (!formData.run.trim()) {
      nuevosErrores.run = 'El RUN es obligatorio.';
    } else if (formData.run.length < 7 || formData.run.length > 9) {
      nuevosErrores.run = 'El RUN debe tener entre 7 y 9 caracteres.';
    }

    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';

    // Validar Correo
    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio.';
    } else {
      const dominiosValidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
      const dominioValido = dominiosValidos.some(d => formData.correo.toLowerCase().endsWith(d));
      if (!dominioValido) {
        nuevosErrores.correo = 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.';
      }
    }

    // Validar Contraseña
    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 4 || formData.password.length > 10) {
      nuevosErrores.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }

    if (!formData.region) nuevosErrores.region = 'Debe seleccionar una región.';
    if (!formData.comuna) nuevosErrores.comuna = 'Debe seleccionar una comuna.';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setMensajeGlobal('');
    } else {
      setErrores({});
      setMensajeGlobal('¡Registro completado con éxito!');
      setFormData({ run: '', nombre: '', correo: '', password: '', region: '', comuna: '' });
    }
  };

  return (
    <main className="contenedor-formulario">
      <section className="tarjeta-formulario">
        <h2>Crear Cuenta</h2>
        <p className="subtitulo-form">Crea tu cuenta para realizar tus compras en línea</p>

        <form id="form-registro" noValidate onSubmit={handleSubmit}>
          <div className="grupo-input">
            <label htmlFor="run">RUN *</label>
            <input 
              type="text" 
              id="run" 
              name="run" 
              minLength="7" 
              maxLength="9" 
              placeholder="12345678K" 
              value={formData.run}
              onChange={handleChange}
              required
            />
            {errores.run && <span className="mensaje-error" id="error-run">{errores.run}</span>}
            <small className="texto-ayuda">Sin puntos ni guión (7 a 9 caracteres).</small>
          </div>

          <div className="grupo-input">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              maxLength="100" 
              placeholder="Juan Pérez" 
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            {errores.nombre && <span className="mensaje-error" id="error-nombre">{errores.nombre}</span>}
          </div>

          <div className="grupo-input">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input 
              type="email" 
              id="correo" 
              name="correo" 
              maxLength="100" 
              placeholder="ejemplo@duoc.cl" 
              value={formData.correo}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errores.password && <span className="mensaje-error" id="error-password">{errores.password}</span>}
            <small className="texto-ayuda">Longitud entre 4 y 10 caracteres.</small>
          </div>

          <div className="grupo-input">
            <label htmlFor="region">Región *</label>
            <select id="region" name="region" value={formData.region} onChange={handleChange} required>
              <option value="">Seleccione una región</option>
              {Object.keys(regionesComunas).map((reg) => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
            {errores.region && <span className="mensaje-error" id="error-region">{errores.region}</span>}
          </div>

          <div className="grupo-input">
            <label htmlFor="comuna">Comuna *</label>
            <select 
              id="comuna" 
              name="comuna" 
              value={formData.comuna} 
              onChange={handleChange} 
              required 
              disabled={!formData.region}
            >
              <option value="">
                {formData.region ? 'Seleccione una comuna' : 'Seleccione primero una región'}
              </option>
              {formData.region && regionesComunas[formData.region].map((com) => (
                <option key={com} value={com}>{com}</option>
              ))}
            </select>
            {errores.comuna && <span className="mensaje-error" id="error-comuna">{errores.comuna}</span>}
          </div>

          <button type="submit" className="btn-submit">Registrarse</button>

          {mensajeGlobal && <div id="mensaje-global" className="mensaje-global exito">{mensajeGlobal}</div>}
        </form>

        <div className="footer-form">
          <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </section>
    </main>
  );
}