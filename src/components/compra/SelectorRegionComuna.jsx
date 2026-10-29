// src/components/compra/SelectorRegionComuna.jsx
// Par de selects dependientes: al cambiar la región se limpia la comuna.
import CampoFormulario from '../ui/CampoFormulario';
import { regionesComunas } from '../../data/semilla';

export default function SelectorRegionComuna({ region, comuna, onCambiar, errores = {}, prefijoId = '', requerido = true, deshabilitado = false }) {
  const comunas = regionesComunas[region] ?? [];

  return (
    <div className="row">
      <CampoFormulario
        como="select"
        id={`${prefijoId}region`}
        name="region"
        etiqueta="Región"
        requerido={requerido}
        className="col-md-6"
        value={region}
        disabled={deshabilitado}
        error={errores.region}
        onChange={(e) => onCambiar({ region: e.target.value, comuna: '' })}
      >
        <option value="">Seleccione una región</option>
        {Object.keys(regionesComunas).map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </CampoFormulario>

      <CampoFormulario
        como="select"
        id={`${prefijoId}comuna`}
        name="comuna"
        etiqueta="Comuna"
        requerido={requerido}
        className="col-md-6"
        value={comuna}
        disabled={deshabilitado || !region}
        error={errores.comuna}
        onChange={(e) => onCambiar({ region, comuna: e.target.value })}
      >
        <option value="">{region ? 'Seleccione una comuna' : 'Seleccione primero una región'}</option>
        {comunas.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </CampoFormulario>
    </div>
  );
}
