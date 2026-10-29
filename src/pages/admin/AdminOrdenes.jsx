// src/pages/admin/AdminOrdenes.jsx
import { useState } from 'react';
import EncabezadoSeccion from '../../components/ui/EncabezadoSeccion';
import TablaOrdenes from '../../components/admin/TablaOrdenes';
import { ordenesDB } from '../../data/db';
import { ESTADOS_ORDEN } from '../../data/tienda';
import useColeccion from '../../hooks/useColeccion';
import { nombreCompleto } from '../../utils/formato';

export default function AdminOrdenes() {
  const ordenes = useColeccion(ordenesDB);
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState('');

  const busqueda = texto.trim().toLowerCase();
  const filtradas = [...ordenes]
    .filter((o) => !estado || o.estado === estado)
    .filter((o) => !busqueda || `${o.codigo} ${nombreCompleto(o.cliente)} ${o.cliente.correo}`.toLowerCase().includes(busqueda))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <>
      <EncabezadoSeccion titulo="Órdenes / Boletas" subtitulo={`${filtradas.length} órdenes`} />
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <input type="search" className="form-control" placeholder="Buscar por código, cliente o correo" aria-label="Buscar órdenes" value={texto} onChange={(e) => setTexto(e.target.value)} />
            </div>
            <div className="col-md-4">
              <select className="form-select" aria-label="Filtrar por estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Todos los estados</option>
                {Object.entries(ESTADOS_ORDEN).map(([valor, info]) => (
                  <option key={valor} value={valor}>{info.etiqueta}</option>
                ))}
              </select>
            </div>
          </div>
          <TablaOrdenes ordenes={filtradas} mensajeVacio="No hay órdenes que coincidan con la búsqueda." />
        </div>
      </div>
    </>
  );
}
