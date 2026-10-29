// Pruebas de eventos e integración del inicio de sesión.
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../src/pages/Login';
import { usuariosDB } from '../../src/data/db';
import { renderConApp, reiniciarDatos } from '../utils';

const rutas = {
  '/': <h1>Inicio tienda</h1>,
  '/admin': <h1>Panel admin</h1>,
};

async function ingresar(correo, password) {
  await userEvent.type(screen.getByLabelText(/Correo electrónico/), correo);
  await userEvent.type(screen.getByLabelText(/Contraseña/), password);
  await userEvent.click(screen.getByRole('button', { name: /Ingresar/ }));
}

describe('Página Login', () => {
  beforeEach(() => reiniciarDatos());

  it('valida el formulario antes de intentar ingresar', async () => {
    renderConApp(<Login />, { ruta: '/login', path: '/login', rutas });
    await userEvent.click(screen.getByRole('button', { name: /Ingresar/ }));

    expect(screen.getByText('El correo es obligatorio.')).toBeTruthy();
    expect(screen.getByText('La contraseña es obligatoria.')).toBeTruthy();
  });

  it('muestra un error si las credenciales no coinciden', async () => {
    renderConApp(<Login />, { ruta: '/login', path: '/login', rutas });
    await ingresar('admin@duoc.cl', 'malaclave');

    expect(screen.getByRole('alert').textContent).toBe('Correo o contraseña incorrectos.');
    expect(localStorage.getItem('sesion')).toBeNull();
  });

  it('un administrador es redirigido al panel', async () => {
    renderConApp(<Login />, { ruta: '/login', path: '/login', rutas });
    await ingresar('admin@duoc.cl', 'admin123');

    expect(screen.getByRole('heading', { name: 'Panel admin' })).toBeTruthy();
    expect(localStorage.getItem('sesion')).toBe('1');
  });

  it('un cliente es redirigido a la tienda', async () => {
    renderConApp(<Login />, { ruta: '/login', path: '/login', rutas });
    await ingresar('juan.perez@gmail.com', 'juan1234');

    expect(screen.getByRole('heading', { name: 'Inicio tienda' })).toBeTruthy();
  });

  it('no permite ingresar a una cuenta inactiva', async () => {
    usuariosDB.actualizar(3, { estado: 'inactivo' });
    renderConApp(<Login />, { ruta: '/login', path: '/login', rutas });
    await ingresar('juan.perez@gmail.com', 'juan1234');

    expect(screen.getByRole('alert').textContent).toContain('inactiva');
  });
});
