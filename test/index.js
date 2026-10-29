// test/index.js
// Punto de entrada único para Karma: prepara el entorno y carga todas las pruebas.

// Chrome Headless a veces deja el documento sin foco (document.hasFocus() === false).
// En ese estado element.focus() no emite eventos "focus", y @testing-library/user-event
// los necesita para simular la escritura: React no recibiría el onChange y las pruebas
// fallarían de forma intermitente. Se emiten los eventos que daría una ventana enfocada.
const focusNativo = HTMLElement.prototype.focus;
HTMLElement.prototype.focus = function focusConEventos(...args) {
  const yaEstabaActivo = document.activeElement === this;
  focusNativo.apply(this, args);
  if (!document.hasFocus() && !yaEstabaActivo && document.activeElement === this) {
    this.dispatchEvent(new FocusEvent('focus'));
    this.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  }
};

const pruebas = import.meta.webpackContext('.', { recursive: true, regExp: /\.spec\.jsx?$/ });
pruebas.keys().forEach(pruebas);

// También se cargan todos los módulos de /src (excepto main.jsx) para que el
// reporte de cobertura muestre los archivos que aún no tienen pruebas.
const fuentes = import.meta.webpackContext('../src', { recursive: true, regExp: /^\.\/(?!main\.jsx$).+\.jsx?$/ });
fuentes.keys().forEach(fuentes);
