import { useState } from 'react';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, run: '123456789', nombre: 'Admin Duoc', correo: 'admin@duoc.cl', rol: 'admin', estado: 'activo' },
    { id: 2, run: '987654321', nombre: 'María Vendedora', correo: 'vendedor@profesor.duoc.cl', rol: 'vendedor', estado: 'activo' },
    { id: 3, run: '112233445', nombre: 'Juan Pérez', correo: 'juan.perez@gmail.com', rol: 'cliente', estado: 'activo' }
  ]);

  const [formData, setFormData] = useState({
    id: null,
    run: '',
    nombre: '',
    correo: '',
    password: '',
    rol: '',
    estado: 'activo'
  });

  const [errores, setErrores] = useState({});
  const [mensajeGlobal, setMensajeGlobal] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLimpiar = () => {
    setFormData({ id: null, run: '', nombre: '', correo: '', password: '', rol: '', estado: 'activo' });
    setErrores({});
    setMensajeGlobal('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!formData.run.trim()) nuevosErrores.run = 'El RUN es obligatorio';
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!formData.correo.trim()) nuevosErrores.correo = 'El correo es obligatorio';
    if (!formData.id && (!formData.password || formData.password.length < 4)) {
      nuevosErrores.password = 'Contraseña mínima de 4 caracteres';
    }
    if (!formData.rol) nuevosErrores.rol = 'Seleccione un rol';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setMensajeGlobal('');
    } else {
      if (formData.id) {
        setUsuarios(usuarios.map(u => u.id === formData.id ? { ...formData } : u));
        setMensajeGlobal('¡Usuario actualizado correctamente!');
      } else {
        const nuevoUser = { ...formData, id: Date.now() };
        setUsuarios([...usuarios, nuevoUser]);
        setMensajeGlobal('¡Usuario registrado con éxito!');
      }
      handleLimpiar();
    }
  };

  const handleEditar = (user) => {
    setFormData({ ...user, password: '' });
    setErrores({});
    setMensajeGlobal('');
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  return (
    <>
      <h2>Control de Usuarios y Asignación de Roles</h2>

      <section className="tarjeta-formulario-admin">
        <h3 id="titulo-form-usuario">{formData.id ? 'Editar Usuario' : 'Crear Usuario'}</h3>
        <form id="form-usuario-admin" noValidate onSubmit={handleSubmit}>
          
          <div className="grilla-form-admin">
            <div className="grupo-input">
              <label htmlFor="run-user">RUN *</label>
              <input 
                type="text" 
                id="run-user" 
                name="run" 
                minLength="7" 
                maxLength="9" 
                placeholder="12345678K" 
                value={formData.run}
                onChange={handleChange}
                required
              />
              {errores.run && <span className="mensaje-error">{errores.run}</span>}
            </div>

            <div className="grupo-input">
              <label htmlFor="nombre-user">Nombre Completo *</label>
              <input 
                type="text" 
                id="nombre-user" 
                name="nombre" 
                maxLength="100" 
                placeholder="Carlos Tapia" 
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              {errores.nombre && <span className="mensaje-error">{errores.nombre}</span>}
            </div>

            <div className="grupo-input">
              <label htmlFor="correo-user">Correo Electrónico *</label>
              <input 
                type="email" 
                id="correo-user" 
                name="correo" 
                maxLength="100" 
                placeholder="usuario@duoc.cl" 
                value={formData.correo}
                onChange={handleChange}
                required
              />
              {errores.correo && <span className="mensaje-error">{errores.correo}</span>}
            </div>

            <div className="grupo-input">
              <label htmlFor="password-user">Contraseña *</label>
              <input 
                type="password" 
                id="password-user" 
                name="password" 
                minLength="4" 
                maxLength="10" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required={!formData.id}
              />
              {errores.password && <span className="mensaje-error">{errores.password}</span>}
            </div>

            <div className="grupo-input">
              <label htmlFor="rol-user">Rol del Sistema *</label>
              <select id="rol-user" name="rol" value={formData.rol} onChange={handleChange} required>
                <option value="">Seleccione un rol</option>
                <option value="admin">Administrador (Acceso Total)</option>
                <option value="vendedor">Vendedor (Ver productos y órdenes)</option>
                <option value="cliente">Cliente (Tienda pública)</option>
              </select>
              {errores.rol && <span className="mensaje-error">{errores.rol}</span>}
            </div>

            <div className="grupo-input">
              <label htmlFor="estado-user">Estado *</label>
              <select id="estado-user" name="estado" value={formData.estado} onChange={handleChange} required>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="acciones-form-admin">
            <button type="submit" className="btn-submit">Guardar Usuario</button>
            <button type="button" onClick={handleLimpiar} className="btn-vaciar">Limpiar Formulario</button>
          </div>

          {mensajeGlobal && <div className="mensaje-global exito">{mensajeGlobal}</div>}
        </form>
      </section>

      <section className="seccion-tabla-admin">
        <h3>Listado de Usuarios Registrados</h3>
        <table className="tabla-admin">
          <thead>
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td>{user.run}</td>
                <td>{user.nombre}</td>
                <td>{user.correo}</td>
                <td>
                  <span className={`badge ${user.rol}`}>
                    {user.rol === 'admin' ? 'Administrador' : user.rol === 'vendedor' ? 'Vendedor' : 'Cliente'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${user.estado === 'activo' ? 'ok' : 'alerta'}`}>
                    {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button className="btn-accion editar" onClick={() => handleEditar(user)}>Editar</button>
                  <button className="btn-accion eliminar" onClick={() => handleEliminar(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}