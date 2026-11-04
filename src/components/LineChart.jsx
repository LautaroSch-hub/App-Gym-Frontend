import { fmtCorta, fmtFecha } from '../utils/fechas';

const W = 400;
const H = 220;
const M = { l: 42, r: 18, t: 24, b: 28 };

const tiempo = (f) => {
  const [y, m, d] = f.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

const redondear = (v) => (Math.abs(v) >= 100 ? Math.round(v) : Math.round(v * 10) / 10);

/**
 * Gráfico de línea simple. points: [{ x: 'YYYY-MM-DD', y: número }] ordenados por fecha.
 * El último valor se rotula directamente; el resto se ve al apoyarse sobre cada punto.
 */
export default function LineChart({ points, unit = '', label }) {
  if (!points.length) {
    return <p className="rounded-md bg-rubber px-4 py-10 text-center text-sm text-mute">Todavía no hay datos para graficar.</p>;
  }

  const ts = points.map((p) => tiempo(p.x));
  const t0 = Math.min(...ts);
  const t1 = Math.max(...ts);
  const ys = points.map((p) => p.y);
  let lo = Math.min(...ys);
  let hi = Math.max(...ys);
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  const pad = (hi - lo) * 0.15;
  lo -= pad;
  hi += pad;

  const sx = (t) => (t1 === t0 ? (M.l + W - M.r) / 2 : M.l + ((t - t0) / (t1 - t0)) * (W - M.l - M.r));
  const sy = (v) => M.t + (1 - (v - lo) / (hi - lo)) * (H - M.t - M.b);

  const ticks = [0, 1, 2, 3].map((i) => lo + ((hi - lo) * i) / 3);
  const coords = points.map((p, i) => [sx(ts[i]), sy(p.y)]);
  const ultimo = points[points.length - 1];
  const [ux, uy] = coords[coords.length - 1];
  const resumen = `${label || 'Evolución'}: ${points.length} registros, último valor ${redondear(ultimo.y)} ${unit} el ${fmtFecha(ultimo.x)}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={resumen}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={sy(v)} y2={sy(v)} stroke="#2D3733" strokeWidth="1" />
          <text x={M.l - 6} y={sy(v) + 4} textAnchor="end" fontSize="11" fill="#93A09B">
            {redondear(v)}
          </text>
        </g>
      ))}

      {points.length > 1 && (
        <polyline points={coords.map((c) => c.join(',')).join(' ')} fill="none" stroke="#8AAEFF" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      )}

      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === coords.length - 1 ? 5 : 3.5} fill={i === coords.length - 1 ? '#8AAEFF' : '#1B2220'} stroke="#8AAEFF" strokeWidth="2">
          <title>{`${fmtFecha(points[i].x)}: ${redondear(points[i].y)} ${unit}`}</title>
        </circle>
      ))}

      {/* Rótulo directo del último valor */}
      <text x={Math.min(ux, W - M.r - 4)} y={uy - 11} textAnchor="end" fontSize="12" fontWeight="600" fill="#E7ECEE">
        {redondear(ultimo.y)} {unit}
      </text>

      {/* Fechas del primer y último punto */}
      <text x={M.l} y={H - 8} textAnchor="start" fontSize="11" fill="#93A09B">
        {fmtCorta(points[0].x)}
      </text>
      {t1 !== t0 && (
        <text x={W - M.r} y={H - 8} textAnchor="end" fontSize="11" fill="#93A09B">
          {fmtCorta(ultimo.x)}
        </text>
      )}
    </svg>
  );
}
