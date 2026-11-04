import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import * as api from '../services/api';
import { DifficultyBadge, Empty, ErrorBox, PageHeader, Spinner, Thumb } from '../components/ui';
import { LEVELS } from '../utils/helpers';

export function RoutineCard({ r, to }) {
  return (
    <Link to={to} className="card group flex flex-col overflow-hidden transition-colors hover:border-rubber-4">
      <Thumb src={r.imagen_url} alt="" className="h-36 w-full" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-2xl font-semibold leading-tight">{r.nombre}</h3>
        <DifficultyBadge level={r.nivel_dificultad} />
        {r.Musculos?.length > 0 && (
          <p className="text-sm text-mute">{r.Musculos.map((m) => m.nombre).join(', ')}</p>
        )}
        <p className="mt-auto pt-2 text-xs text-mute">
          {r.Ejercicios?.length || 0} {r.Ejercicios?.length === 1 ? 'ejercicio' : 'ejercicios'}
        </p>
      </div>
    </Link>
  );
}

export default function Rutinas() {
  const { data, loading, error, reload } = useFetch(() => Promise.all([api.predef.list(), api.musculos.list()]));
  const [level, setLevel] = useState('');
  const [muscle, setMuscle] = useState('');
  const [q, setQ] = useState('');

  const [rutinas, musculos] = data || [[], []];
  const filtered = useMemo(
    () =>
      rutinas.filter(
        (r) =>
          (!level || r.nivel_dificultad === level) &&
          (!muscle || r.Musculos?.some((m) => String(m.id) === muscle)) &&
          (!q || r.nombre.toLowerCase().includes(q.toLowerCase()))
      ),
    [rutinas, level, muscle, q]
  );

  return (
    <>
      <PageHeader title="Rutinas" subtitle="Rutinas generales para elegir según tu nivel y el músculo que querés trabajar." />

      {loading && <Spinner />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && (
        <>
          <div className="mb-5 grid gap-2 sm:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
              <input className="input !pl-9" placeholder="Buscar por nombre" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar por nombre" />
            </div>
            <select className="input" value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Dificultad">
              <option value="">Toda dificultad</option>
              {Object.entries(LEVELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <select className="input" value={muscle} onChange={(e) => setMuscle(e.target.value)} aria-label="Músculo">
              <option value="">Todos los músculos</option>
              {musculos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <Empty title="No hay rutinas con esos filtros">Probá con otra dificultad o quitá el filtro de músculo.</Empty>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => (
                <RoutineCard key={r.id} r={r} to={`/rutinas/${r.id}`} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
