import { useMemo, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import * as api from '../../services/api';
import { useToast } from '../Toast';
import { Empty, ErrorBox, Field, Spinner } from '../ui';
import LineChart from '../LineChart';
import { fmtFecha, hoyLocal } from '../../utils/fechas';

const num = (n) => (Math.round(n * 10) / 10).toString().replace('.', ',');

/** Peso y repeticiones por ejercicio, con su evolución. Con usuarioId es la vista (solo lectura) del administrador. */
export default function ProgresoView({ usuarioId, initialEjercicio }) {
  const readOnly = !!usuarioId;
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(
    () => Promise.all([api.progreso.list(usuarioId), api.ejercicios.list()]),
    [usuarioId]
  );
  const [sel, setSel] = useState(initialEjercicio ? Number(initialEjercicio) : null);
  const [form, setForm] = useState({ peso: '', reps: '', series: '1', fecha: hoyLocal() });
  const [busy, setBusy] = useState(false);

  const [registros, ejercicios] = data || [[], []];

  const opciones = useMemo(() => {
    if (!readOnly) return [...ejercicios].sort((a, b) => a.nombre.localeCompare(b.nombre));
    const usados = new Set(registros.map((r) => r.ejercicioId));
    return ejercicios.filter((e) => usados.has(e.id)).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [ejercicios, registros, readOnly]);

  const ultimoUsado = registros.length ? registros[registros.length - 1].ejercicioId : null;
  const ejercicioId = sel ?? ultimoUsado ?? opciones[0]?.id ?? null;
  const filas = registros.filter((r) => r.ejercicioId === ejercicioId);

  // Un punto por día: el peso más alto de ese día
  const puntos = useMemo(() => {
    const porDia = new Map();
    filas.forEach((r) => porDia.set(r.fecha, Math.max(porDia.get(r.fecha) ?? 0, r.peso_kg)));
    return [...porDia.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([x, y]) => ({ x, y }));
  }, [filas]);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!opciones.length) {
    return readOnly ? (
      <Empty title="Sin registros">Este usuario todavía no anotó pesos en sus ejercicios.</Empty>
    ) : (
      <Empty title="Todavía no hay ejercicios">Tu entrenador va a cargar los ejercicios y vas a poder anotar lo que levantás.</Empty>
    );
  }

  const mejor = filas.reduce((m, r) => (!m || r.peso_kg > m.peso_kg ? r : m), null);
  const ultima = filas[filas.length - 1];
  const cambio = puntos.length > 1 ? puntos[puntos.length - 1].y - puntos[0].y : null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.progreso.create({
        ejercicioId,
        peso_kg: Number(form.peso.replace(',', '.')),
        repeticiones: Number(form.reps),
        series: Number(form.series) || 1,
        fecha: form.fecha || undefined,
      });
      toast('Registro guardado');
      setForm({ ...form, peso: '', reps: '' });
      await reload();
    } catch (err) {
      toast(api.errMsg(err), 'error');
    }
    setBusy(false);
  };

  const borrar = async (r) => {
    try {
      await api.progreso.remove(r.id);
      toast('Registro eliminado');
      await reload();
    } catch (err) {
      toast(api.errMsg(err), 'error');
    }
  };

  return (
    <div className="space-y-5">
      <Field label="Ejercicio">
        <select className="input max-w-md" value={ejercicioId ?? ''} onChange={(e) => setSel(Number(e.target.value))}>
          {opciones.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </Field>

      {!readOnly && (
        <form onSubmit={guardar} className="card grid grid-cols-2 gap-3 p-4 sm:grid-cols-[1fr_1fr_1fr_1.3fr_auto] sm:items-end">
          <Field label="Peso (kg)">
            <input className="input" inputMode="decimal" required value={form.peso} onChange={set('peso')} placeholder="40" />
          </Field>
          <Field label="Repeticiones">
            <input className="input" type="number" min="1" max="1000" required value={form.reps} onChange={set('reps')} placeholder="10" />
          </Field>
          <Field label="Series">
            <input className="input" type="number" min="1" max="50" value={form.series} onChange={set('series')} />
          </Field>
          <Field label="Fecha">
            <input className="input" type="date" max={hoyLocal()} value={form.fecha} onChange={set('fecha')} />
          </Field>
          <button className="btn btn-primary col-span-2 sm:col-span-1" disabled={busy}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Guardar
          </button>
        </form>
      )}

      {filas.length === 0 ? (
        <Empty title="Sin registros para este ejercicio">
          {readOnly ? 'No hay anotaciones para este ejercicio.' : 'Anotá tu primer peso arriba y acá vas a ver cómo evoluciona.'}
        </Empty>
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-3">
            <div className="card p-4">
              <dd className="font-display text-4xl font-semibold leading-none">{num(mejor.peso_kg)} kg</dd>
              <dt className="mt-1 text-xs text-mute sm:text-sm">Mejor marca ({mejor.repeticiones} rep.)</dt>
            </div>
            <div className="card p-4">
              <dd className="font-display text-4xl font-semibold leading-none">{num(ultima.peso_kg)} kg</dd>
              <dt className="mt-1 text-xs text-mute sm:text-sm">Último, {fmtFecha(ultima.fecha)}</dt>
            </div>
            <div className="card p-4">
              <dd className="font-display text-4xl font-semibold leading-none">
                {cambio === null ? '—' : `${cambio > 0 ? '+' : ''}${num(cambio)} kg`}
              </dd>
              <dt className="mt-1 text-xs text-mute sm:text-sm">Desde el primer registro</dt>
            </div>
          </dl>

          <section className="card p-4">
            <h3 className="mb-2 text-2xl font-semibold">Peso máximo por día</h3>
            <LineChart points={puntos} unit="kg" label="Peso máximo por día" />
          </section>

          <section>
            <h3 className="mb-2 text-2xl font-semibold">Historial</h3>
            <ul className="card divide-y divide-rubber-3">
              {[...filas].reverse().map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="text-mute">{fmtFecha(r.fecha)}</span>
                  <span className="flex-1 text-right font-medium">
                    {num(r.peso_kg)} kg × {r.repeticiones} rep. {r.series > 1 && <span className="text-mute">× {r.series} series</span>}
                  </span>
                  {!readOnly && (
                    <button
                      className="rounded p-1.5 text-mute hover:bg-plate-red/15 hover:text-[#ff9a9d]"
                      onClick={() => borrar(r)}
                      aria-label={`Eliminar registro del ${fmtFecha(r.fecha)}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
