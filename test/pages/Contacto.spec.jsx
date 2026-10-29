// Pruebas de estado de un formulario: el valor cambia al escribir y se validan los errores.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from '../../src/pages/Contacto';

describe('Página Contacto', () => {
  it('actualiza el estado del formulario cuando el usuario escribe', async () => {
    render(<Contacto />);
    const nombre = screen.getByLabelText(/Nombre completo/);
    const comentario = screen.getByLabelText(/Comentario/);

    await userEvent.type(nombre, 'Ana Rojas');
    await userEvent.type(comentario, 'Hola');

    expect(nombre.value).toBe('Ana Rojas');
    expect(comentario.value).toBe('Hola');
    expect(screen.getByText('4/500 caracteres')).toBeTruthy();
  });

  it('muestra los errores solo después de enviar con campos vacíos', async () => {
    render(<Contacto />);
    expect(screen.queryAllByRole('alert').length).toBe(0);

    await userEvent.click(screen.getByRole('button', { name: /Enviar mensaje/ }));

    const errores = screen.getAllByRole('alert').map((e) => e.textContent);
    expect(errores).toContain('El nombre es obligatorio.');
    expect(errores).toContain('El correo es obligatorio.');
    expect(errores).toContain('El comentario es obligatorio.');
  });

  it('muestra error de formato de correo', async () => {
    render(<Contacto />);
    await userEvent.type(screen.getByLabelText(/Correo/), 'correo-malo');
    await userEvent.click(screen.getByRole('button', { name: /Enviar mensaje/ }));
    expect(screen.getByText('Formato de correo inválido.')).toBeTruthy();
  });

  it('con datos válidos muestra el mensaje de éxito y limpia el formulario', async () => {
    render(<Contacto />);
    await userEvent.type(screen.getByLabelText(/Nombre completo/), 'Ana');
    await userEvent.type(screen.getByLabelText(/Correo/), 'ana@gmail.com');
    await userEvent.type(screen.getByLabelText(/Comentario/), 'Consulta');

    await userEvent.click(screen.getByRole('button', { name: /Enviar mensaje/ }));

    expect(screen.getByRole('status').textContent).toContain('Mensaje enviado con éxito');
    expect(screen.getByLabelText(/Nombre completo/).value).toBe('');
    expect(screen.queryAllByRole('alert').length).toBe(0);
  });
});
