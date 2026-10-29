// src/pages/Ofertas.jsx
import EncabezadoSeccion from '../components/ui/EncabezadoSeccion';
import ListaProductos from '../components/productos/ListaProductos';
import { categoriasDB, productosDB } from '../data/db';
import { estaEnOferta, porcentajeDescuento } from '../data/tienda';
import { useCarrito } from '../context/contextos';
import useColeccion from '../hooks/useColeccion';

export default function Ofertas() {
  const productos = useColeccion(productosDB);
  const categorias = useColeccion(categoriasDB);
  const { agregar } = useCarrito();

  const ofertas = productos.filter(estaEnOferta).sort((a, b) => porcentajeDescuento(b) - porcentajeDescuento(a));

  return (
    <>
      <EncabezadoSeccion titulo="Ofertas" subtitulo="Aprovecha los descuentos de la semana. ¡Stock limitado!" />
      <ListaProductos productos={ofertas} categorias={categorias} onAgregar={(p) => agregar(p)} mensajeVacio="No hay ofertas vigentes en este momento." />
    </>
  );
}
