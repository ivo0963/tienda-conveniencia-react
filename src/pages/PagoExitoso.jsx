// src/pages/PagoExitoso.jsx
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetalleOrden from '../components/compra/DetalleOrden';
import Boton from '../components/ui/Boton';
import { ordenesDB } from '../data/db';
import useColeccion from '../hooks/useColeccion';
import { formatearFechaHora } from '../utils/formato';
import NoEncontrado from './NoEncontrado';

export default function PagoExitoso() {
  const { id } = useParams();
  const ordenes = useColeccion(ordenesDB);
  const [correoEnviado, setCorreoEnviado] = useState(false);

  const orden = ordenes.find((o) => o.id === Number(id));
  if (!orden || orden.estado === 'rechazada') return <NoEncontrado mensaje="No encontramos una compra exitosa con ese número." />;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="card shadow-sm area-imprimible">
          <div className="card-body p-4">
            <div className="d-flex flex-wrap justify-content-between gap-2">
              <h1 className="h4 text-success mb-0">
                <i className="bi bi-check-circle me-2"></i>Se ha realizado la compra. Nro #{orden.id}
              </h1>
              <small className="text-body-secondary">Código orden: <strong>{orden.codigo}</strong></small>
            </div>
            <p className="text-body-secondary small">Fecha: {formatearFechaHora(orden.fecha)}. Te enviamos el detalle a {orden.cliente.correo}.</p>

            <DetalleOrden orden={orden} />

            <div className="d-flex flex-wrap justify-content-center gap-2 mt-4 no-imprimir">
              <Boton etiqueta="Imprimir boleta en PDF" icono="file-earmark-pdf" variante="danger" onClick={() => window.print()} />
              <Boton etiqueta="Enviar boleta por email" icono="envelope" variante="success" onClick={() => setCorreoEnviado(true)} />
              <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
            </div>
            {correoEnviado && (
              <div className="alert alert-success mt-3 mb-0 no-imprimir" role="status">
                Boleta enviada a {orden.cliente.correo} (simulado).
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
