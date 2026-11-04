import { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import * as api from '../../services/api';
import { useToast } from '../Toast';
import { Empty, ErrorBox, Field, Spinner } from '../ui';
import LineChart from '../LineChart';
import { fmtFecha, hoyLocal } from '../../utils/fechas';

const METRICAS = [
  { key: 'peso_kg', label: 'Peso', unit: 'kg' },
  { key: 'grasa_pct', label: 'Grasa corporal', unit: '%' },
  { key: 'cintura_cm', label: 'Cintura', unit: 'cm' },
  { key: 'pecho_cm', label: 'Pecho', unit: 'cm' },
  { key: 'cadera_cm', label: 'Cadera', unit: 'cm' },
  { key: 'brazo_cm', label: 'Brazo', unit: 'cm' },
  { key: 'muslo_cm', label: 'Muslo', unit: 'cm' },
];

const num = (n) => (Math.round(n * 10) / 10).toString().replace('.', ',');
const vacio = () => ({ fecha: hoyLocal(), ...Object.fromEntries(METRICAS.map((m) => [m.key, ''])) });

/** Medidas corporales con gráfico. Con usuarioId es la vista (solo lectura) del administrador. */
export default function MedidasView({ usuarioId }) {
  const readOnly = !!usuarioId;
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => api.medidas.list(usuarioId), [usuarioId]);
  const [form, setForm] = useState(vacio);
  const [metrica, setMetrica] = useState(null);
  const [busy, setBusy] = useState(false);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const filas = data;
  const disponibles = METRICAS.filter((m) => filas.some((f) => f[m.key] != null));
  const actual = disponibles.find((m) => m.key === metrica) || disponibles[0] || null;
  const puntos = actual ? filas.filter((f) => f[actual.key] != null).map((f) => ({ x: f.fecha, y: f[actual.key] })) : [];
  const primero = puntos[0];
  const ultimo = puntos[puntos.length - 1];
  const cambio = puntos.length > 1 ? ultimo.y - primero.y : null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    const body = { fecha: form.fecha || undefined };
    METRICAS.forEach((m) => {
      if (form[m.key] !== '') body[m.key] = Number(String(form[m.key]).replace(',', '.'));
    });
    if (!METRICAS.some((m) => form[m.key] !== '')) {
      toast('Cargá al menos una medida.', 'error');
      return;
    }
    setBusy(true);
    try {
      await api.medidas.create(body);
      toast('Medidas guardadas');
      setForm(vacio());
      await reload();
    } catch (err) {
      toast(api.errMsg(err), 'error');
    }
    setBusy(false);
  };

  const borrar = async (f) => {
    try {
      await api.medidas.remove(f.id);
      toast('Registro eliminado');
      await reload();
    } catch (err) {
      toast(api.errMsg(err), 'error');
    }
  };

  return (
    <div className="space-y-5">
      {!readOnly && (
        <form onSubmit={guardar} className="card space-y-4 p-4">
          <h3 className="text-2xl font-semibold">Nueva medición</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Fecha">
              <input className="input" type="date" max={hoyLocal()} value={form.fecha} onChange={set('fecha')} />
            </Field>
            {METRICAS.map((m) => (
              <Field key={m.key} label={`${m.label} (${m.unit})`}>
                <input className="input" inputMode="decimal" value={form[m.key]} onChange={set(m.key)} />
              </Field>
            ))}
          </div>
          <p className="text-xs text-mute">Completá solo lo que te mediste hoy; el resto puede quedar vacío.</p>
          <div className="flex justify-end">
            <button className="btn btn-primary" disabled={busy}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Guardar medidas
            </button>
          </div>
        </form>
      )}

      {filas.length === 0 ? (
        <Empty title="Todavía no hay medidas">
          {readOnly ? 'Este usuario todavía no cargó medidas.' : 'Cargá tu primera medición y acá vas a ver cómo cambia con el tiempo.'}
        </Empty>
      ) : (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Medida a graficar">
            {disponibles.map((m) => (
              <button
                key={m.key}
                aria-pressed={actual?.key === m.key}
                onClick={() => setMetrica(m.key)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  actual?.key === m.key ? 'border-plate-bluelight bg-plate-blue/20 text-plate-bluelight' : 'border-rubber-4 text-mute hover:text-chalk'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {actual && (
            <>
              <dl className="grid grid-cols-3 gap-3">
                <div className="card p-4">
                  <dd className="font-display text-4xl font-semibold leading-none">
                    {num(ultimo.y)} {actual.unit}
                  </dd>
                  <dt className="mt-1 text-xs text-mute sm:text-sm">Último, {fmtFecha(ultimo.x)}</dt>
                </div>
                <div className="card p-4">
                  <dd className="font-display text-4xl font-semibold leading-none">
                    {num(primero.y)} {actual.unit}
                  </dd>
                  <dt className="mt-1 text-xs text-mute sm:text-sm">Primero, {fmtFecha(primero.x)}</dt>
                </div>
                <div className="card p-4">
                  <dd className="font-display text-4xl font-semibold leading-none">
                    {cambio === null ? '—' : `${cambio > 0 ? '+' : ''}${num(cambio)} ${actual.unit}`}
                  </dd>
                  <dt className="mt-1 text-xs text-mute sm:text-sm">Cambio total</dt>
                </div>
              </dl>

              <section className="card p-4">
                <h3 className="mb-2 text-2xl font-semibold">{actual.label}</h3>
                <LineChart points={puntos} unit={actual.unit} label={actual.label} />
              </section>
            </>
          )}

          <section>
            <h3 className="mb-2 text-2xl font-semibold">Historial</h3>
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-mute">
                  <tr>
                    <th className="px-4 py-2 font-medium">Fecha</th>
                    {disponibles.map((m) => (
                      <th key={m.key} className="px-2 py-2 font-medium">
                        {m.label}
                      </th>
                    ))}
                    {!readOnly && <th className="w-10" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-rubber-3">
                  {[...filas].reverse().map((f) => (
                    <tr key={f.id}>
                      <td className="px-4 py-2.5 text-mute">{fmtFecha(f.fecha)}</td>
                      {disponibles.map((m) => (
                        <td key={m.key} className="px-2 py-2.5">
                          {f[m.key] != null ? num(f[m.key]) : <span className="text-mute">—</span>}
                        </td>
                      ))}
                      {!readOnly && (
                        <td className="pr-2">
                          <button
                            className="rounded p-1.5 text-mute hover:bg-plate-red/15 hover:text-[#ff9a9d]"
                            onClick={() => borrar(f)}
                            aria-label={`Eliminar medidas del ${fmtFecha(f.fecha)}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
