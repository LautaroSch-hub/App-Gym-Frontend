import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import * as api from '../services/api';
import { DifficultyBadge, ErrorBox, Spinner, Thumb } from '../components/ui';
import { ExerciseList } from '../components/ExerciseList';
import { normEx } from '../utils/helpers';

export default function RutinaDetalle() {
  const { id } = useParams();
  const { data: r, loading, error, reload } = useFetch(() => api.predef.get(id), [id]);

  return (
    <>
      <Link to="/rutinas" className="mb-5 inline-flex items-center gap-1.5 text-sm text-mute hover:text-chalk">
        <ArrowLeft size={16} /> Volver a rutinas
      </Link>

      {loading && <Spinner />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {r && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div>
            <Thumb src={r.imagen_url} className="h-56 w-full rounded-lg" />
            <h1 className="mt-4 text-5xl font-semibold leading-none">{r.nombre}</h1>
            <div className="mt-3">
              <DifficultyBadge level={r.nivel_dificultad} />
            </div>
            {r.Musculos?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {r.Musculos.map((m) => (
                  <span key={m.id} className="rounded bg-rubber-3 px-2.5 py-1 text-sm">
                    {m.nombre}
                  </span>
                ))}
              </div>
            )}
            {r.descripcion && <p className="mt-4 text-sm text-mute">{r.descripcion}</p>}
          </div>

          <div>
            <h2 className="mb-3 text-3xl font-semibold">Ejercicios</h2>
            <ExerciseList items={(r.Ejercicios || []).map(normEx)} emptyText="Esta rutina todavía no tiene ejercicios." />
          </div>
        </div>
      )}
    </>
  );
}
