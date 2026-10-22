import { useState } from 'react';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    comentario: ''
  });

  const [errores, setErrores] = useState({});
  const [mensajeGlobal, setMensajeGlobal] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoserrores = {};

    if (!formData.nombre.trim()) nuevoserrores.nombre = 'El nombre es obligatorio';
    if (!formData.correo.trim()) {
      nuevoserrores.correo = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      nuevoserrores.correo = 'Formato de correo inválido';
    }
    if (!formData.comentario.trim()) nuevoserrores.comentario = 'El comentario es obligatorio';

    if (Object.keys(nuevoserrores).length > 0) {
      setErrores(nuevoserrores);
      setMensajeGlobal('');
    } else {
      setErrores({});
      setMensajeGlobal('¡Mensaje enviado con éxito! Te responderemos pronto.');
      setFormData({ nombre: '', correo: '', asunto: '', comentario: '' });
    }
  };

  return (
    <main className="contenedor-formulario">
      <section className="tarjeta-formulario">
        <h2>Contacto</h2>
        <p className="subtitulo-form">¿Tienes dudas o comentarios? Escríbenos y te responderemos a la brevedad.</p>

        <form id="form-contacto" noValidate onSubmit={handleSubmit}>
          <div className="grupo-input">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              maxLength="100" 
              placeholder="Tu nombre completo" 
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
          </div>

          <div className="grupo-input">
            <label htmlFor="asunto">Asunto</label>
            <input 
              type="text" 
              id="asunto" 
              name="asunto" 
              maxLength="100" 
              placeholder="Motivo de tu mensaje"
              value={formData.asunto}
              onChange={handleChange}
            />
          </div>

          <div className="grupo-input">
            <label htmlFor="comentario">Comentario *</label>
            <textarea 
              id="comentario" 
              name="comentario" 
              maxLength="500" 
              rows="5" 
              placeholder="Escribe tu mensaje aquí (máximo 500 caracteres)..." 
              value={formData.comentario}
              onChange={handleChange}
              required
            ></textarea>
            {errores.comentario && <span className="mensaje-error" id="error-comentario">{errores.comentario}</span>}
            <small className="texto-ayuda">Máximo 500 caracteres.</small>
          </div>

          <button type="submit" className="btn-submit">Enviar Mensaje</button>

          {mensajeGlobal && <div id="mensaje-global" className="mensaje-global exito">{mensajeGlobal}</div>}
        </form>
      </section>
    </main>
  );
}