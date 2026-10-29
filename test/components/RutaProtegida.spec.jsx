// Pruebas de renderizado condicional según la sesión y el rol del usuario.
import { screen } from '@testing-library/react';
import RutaProtegida from '../../src/components/RutaProtegida';
import { renderConApp, reiniciarDatos } from '../utils';

const vistaProtegida = (
  <RutaProtegida roles={['admin']}>
    <h1>Contenido privado</h1>
  </RutaProtegida>
);

const opciones = { ruta: '/privado', path: '/privado', rutas: { '/login': <h1>Pantalla login</h1> } };

describe('RutaProtegida', () => {
  it('redirige al login cuando no hay sesión', () => {
    reiniciarDatos();
    renderConApp(vistaProtegida, opciones);
    expect(screen.getByRole('heading', { name: 'Pantalla login' })).toBeTruthy();
    expect(screen.queryByText('Contenido privado')).toBeNull();
  });

  it('muestra un aviso si el rol no tiene permiso', () => {
    reiniciarDatos({ sesion: 3 }); // cliente
    renderConApp(vistaProtegida, opciones);
    expect(screen.getByRole('alert').textContent).toContain('No tienes permisos');
    expect(screen.queryByText('Contenido privado')).toBeNull();
  });

  it('muestra el contenido si el rol está permitido', () => {
    reiniciarDatos({ sesion: 1 }); // admin
    renderConApp(vistaProtegida, opciones);
    expect(screen.getByRole('heading', { name: 'Contenido privado' })).toBeTruthy();
  });
});
