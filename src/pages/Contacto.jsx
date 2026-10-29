// src/pages/Contacto.jsx
import { useState } from 'react';
import CampoFormulario from '../components/ui/CampoFormulario';
import Boton from '../components/ui/Boton';
import { validarContacto } from '../utils/validaciones';

const VACIO = { nombre: '', correo: '', asunto: '', comentario: '' };

export default function Contacto() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setEnviado(false);
  };

  const enviar = (e) => {
    e.preventDefault();
    const nuevosErrores = validarContacto(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviado(true);
      setDatos(VACIO);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <section className="card shadow-sm">
          <div className="card-body p-4">
            <h1 className="h4">Contacto</h1>
            <p className="text-body-secondary">¿Tienes dudas o comentarios? Escríbenos y te responderemos a la brevedad.</p>

            <form noValidate onSubmit={enviar} aria-label="Formulario de contacto">
              <CampoFormulario id="nombre" name="nombre" etiqueta="Nombre completo" requerido maxLength="100" value={datos.nombre} onChange={cambiar} error={errores.nombre} />
              <CampoFormulario id="correo" name="correo" type="email" etiqueta="Correo electrónico" requerido maxLength="100" placeholder="ejemplo@duoc.cl" value={datos.correo} onChange={cambiar} error={errores.correo} />
              <CampoFormulario id="asunto" name="asunto" etiqueta="Asunto" maxLength="100" value={datos.asunto} onChange={cambiar} />
              <CampoFormulario
                como="textarea"
                id="comentario"
                name="comentario"
                etiqueta="Comentario"
                requerido
                rows="5"
                maxLength="500"
                value={datos.comentario}
                onChange={cambiar}
                error={errores.comentario}
                ayuda={`${datos.comentario.length}/500 caracteres`}
              />
              <Boton tipo="submit" etiqueta="Enviar mensaje" icono="send" variante="marca" className="w-100" />
              {enviado && (
                <div className="alert alert-success mt-3 mb-0" role="status">
                  ¡Mensaje enviado con éxito! Te responderemos pronto.
                </div>
              )}
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
