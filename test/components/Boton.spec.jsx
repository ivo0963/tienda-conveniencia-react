// Pruebas de propiedades (props) y eventos del componente Boton.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Boton from '../../src/components/ui/Boton';

describe('Boton', () => {
  it('muestra la etiqueta recibida por props', () => {
    render(<Boton etiqueta="Comprar ahora" />);
    expect(screen.getByRole('button', { name: 'Comprar ahora' })).toBeTruthy();
  });

  it('ejecuta la función onClick al hacer clic', async () => {
    const onClick = jasmine.createSpy('onClick');
    render(<Boton etiqueta="Guardar" onClick={onClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('no ejecuta onClick cuando está deshabilitado', async () => {
    const onClick = jasmine.createSpy('onClick');
    render(<Boton etiqueta="Agotado" onClick={onClick} deshabilitado />);

    const boton = screen.getByRole('button', { name: 'Agotado' });
    await userEvent.click(boton);

    expect(boton.disabled).toBeTrue();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('aplica la variante de Bootstrap y el tipo indicado', () => {
    render(<Boton etiqueta="Enviar" variante="success" tipo="submit" />);
    const boton = screen.getByRole('button', { name: 'Enviar' });

    expect(boton.classList).toContain('btn-success');
    expect(boton.getAttribute('type')).toBe('submit');
  });

  it('usa "button" y "primary" como valores por defecto', () => {
    render(<Boton etiqueta="Por defecto" />);
    const boton = screen.getByRole('button');

    expect(boton.getAttribute('type')).toBe('button');
    expect(boton.classList).toContain('btn-primary');
  });

  it('renderiza el ícono solo si se indica', () => {
    const { container, rerender } = render(<Boton etiqueta="Sin icono" />);
    expect(container.querySelector('.bi')).toBeNull();

    rerender(<Boton etiqueta="Con icono" icono="cart" />);
    expect(container.querySelector('.bi-cart')).not.toBeNull();
  });
});
