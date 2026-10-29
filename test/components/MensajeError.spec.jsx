// Pruebas de renderizado condicional: el mensaje solo aparece si hay error.
import { render, screen } from '@testing-library/react';
import MensajeError from '../../src/components/ui/MensajeError';
import CampoFormulario from '../../src/components/ui/CampoFormulario';

describe('MensajeError', () => {
  it('no renderiza nada cuando no hay error', () => {
    const { container } = render(<MensajeError mensaje="" />);
    expect(container.innerHTML).toBe('');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('muestra el mensaje cuando hay un error presente', () => {
    render(<MensajeError mensaje="El correo es obligatorio." id="error-correo" />);
    const alerta = screen.getByRole('alert');

    expect(alerta.textContent).toBe('El correo es obligatorio.');
    expect(alerta.id).toBe('error-correo');
  });
});

describe('CampoFormulario', () => {
  it('asocia la etiqueta con el campo y marca los obligatorios', () => {
    render(<CampoFormulario id="nombre" etiqueta="Nombre" requerido value="" onChange={() => {}} />);
    const campo = screen.getByLabelText(/Nombre/);

    expect(campo.id).toBe('nombre');
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('muestra la ayuda solo mientras no hay error', () => {
    const { rerender } = render(<CampoFormulario id="clave" etiqueta="Clave" ayuda="Entre 4 y 10 caracteres." value="" onChange={() => {}} />);
    expect(screen.queryByText('Entre 4 y 10 caracteres.')).not.toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();

    rerender(<CampoFormulario id="clave" etiqueta="Clave" ayuda="Entre 4 y 10 caracteres." error="Muy corta" value="" onChange={() => {}} />);
    expect(screen.queryByText('Entre 4 y 10 caracteres.')).toBeNull();
    expect(screen.getByRole('alert').textContent).toBe('Muy corta');
    expect(screen.getByLabelText('Clave').classList).toContain('is-invalid');
  });

  it('renderiza un select con sus opciones', () => {
    render(
      <CampoFormulario como="select" id="rol" etiqueta="Rol" value="" onChange={() => {}}>
        <option value="">Elegir</option>
        <option value="admin">Admin</option>
      </CampoFormulario>
    );
    const select = screen.getByLabelText('Rol');

    expect(select.tagName).toBe('SELECT');
    expect(select.classList).toContain('form-select');
    expect(select.options.length).toBe(2);
  });
});
