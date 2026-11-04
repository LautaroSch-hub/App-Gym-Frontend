import { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Plus, Trash2, TrendingUp } from 'lucide-react';
import { Thumb } from './ui';
import VideoModal from './VideoModal';
import { getYouTubeId, youtubeThumb } from '../utils/youtube';

/** Miniatura del ejercicio; si tiene video de YouTube, se puede tocar para verlo. */
export function ExerciseThumb({ e, onPlay, className = 'h-12 w-12' }) {
  // El link de YouTube del ejercicio vive en imagen_url
  const vid = getYouTubeId(e.imagen_url);
  const src = vid ? youtubeThumb(vid) : e.imagen_url;
  if (!vid) return <Thumb src={src} className={`${className} shrink-0 rounded`} />;
  return (
    <button
      type="button"
      onClick={() => onPlay(e)}
      className={`group relative shrink-0 overflow-hidden rounded ${className}`}
      aria-label={`Ver video de ${e.nombre}`}
    >
      <Thumb src={src} className="h-full w-full" />
      <span className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/55">
        <Play size={18} className="fill-white text-white" />
      </span>
    </button>
  );
}

/** Lista de ejercicios normalizados: { id, nombre, series, repeticiones, imagen_url (link de YouTube), ... } */
export function ExerciseList({ items, onRemove, onLog, onMove, moveDisabled, emptyText = 'Todavía no tiene ejercicios.' }) {
  const [playing, setPlaying] = useState(null);

  if (!items.length) return <p className="rounded-md bg-rubber px-4 py-6 text-center text-sm text-mute">{emptyText}</p>;
  return (
    <>
      <ul className="divide-y divide-rubber-3 overflow-hidden rounded-md border border-rubber-3">
        {items.map((e, i) => {
          const hasVideo = !!getYouTubeId(e.imagen_url);
          return (
            <li key={e.id} className="flex items-center gap-2 bg-rubber px-3 py-2.5 sm:gap-3">
              {onMove && items.length > 1 && (
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    className="rounded p-0.5 text-mute hover:bg-rubber-3 hover:text-chalk disabled:opacity-25 disabled:hover:bg-transparent"
                    onClick={() => onMove(i, -1)}
                    disabled={moveDisabled || i === 0}
                    aria-label={`Subir ${e.nombre}`}
                    title="Subir"
                  >
                    <ChevronUp size={18} />
                  </button>
                  <button
                    type="button"
                    className="rounded p-0.5 text-mute hover:bg-rubber-3 hover:text-chalk disabled:opacity-25 disabled:hover:bg-transparent"
                    onClick={() => onMove(i, 1)}
                    disabled={moveDisabled || i === items.length - 1}
                    aria-label={`Bajar ${e.nombre}`}
                    title="Bajar"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
              )}
              {items.length > 1 && <span className="w-5 shrink-0 text-center font-display text-xl text-mute">{i + 1}</span>}
              <ExerciseThumb e={e} onPlay={setPlaying} />
              <div className="min-w-0 flex-1">
                {hasVideo ? (
                  <button type="button" onClick={() => setPlaying(e)} className="block max-w-full truncate text-left text-sm font-medium hover:text-plate-bluelight">
                    {e.nombre}
                  </button>
                ) : (
                  <p className="truncate text-sm font-medium">{e.nombre}</p>
                )}
                {e.notas ? (
                  <p className="truncate text-xs text-mute">{e.notas}</p>
                ) : hasVideo ? (
                  <p className="text-xs text-mute">Tocá para ver el video</p>
                ) : null}
              </div>
              <p className="shrink-0 font-display text-xl font-semibold">
                {e.series} <span className="text-mute">×</span> {e.repeticiones}
              </p>
              {onLog && (
                <button
                  type="button"
                  className="shrink-0 rounded p-2 text-mute hover:bg-rubber-3 hover:text-plate-bluelight"
                  onClick={() => onLog(e)}
                  aria-label={`Anotar peso de ${e.nombre}`}
                  title="Anotar peso y repeticiones"
                >
                  <TrendingUp size={16} />
                </button>
              )}
              {onRemove && (
                <button
                  type="button"
                  className="shrink-0 rounded p-2 text-mute hover:bg-plate-red/15 hover:text-[#ff9a9d]"
                  onClick={() => onRemove(e)}
                  aria-label={`Quitar ${e.nombre}`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {playing && <VideoModal ejercicio={playing} onClose={() => setPlaying(null)} />}
    </>
  );
}

/** Elige un ejercicio de la biblioteca y le pone series y repeticiones. */
export function AddExerciseForm({ library, usedIds = [], onAdd }) {
  const [id, setId] = useState('');
  const [series, setSeries] = useState(3);
  const [reps, setReps] = useState('10');
  const available = library.filter((e) => !usedIds.includes(e.id));

  if (!library.length) {
    return <p className="text-sm text-mute">Primero creá ejercicios en la sección Ejercicios para poder agregarlos acá.</p>;
  }
  if (!available.length) {
    return <p className="text-sm text-mute">Ya agregaste todos los ejercicios disponibles.</p>;
  }

  // No es un <form>: este componente se usa también dentro del formulario de la rutina,
  // y un formulario dentro de otro hacía que "Agregar" disparara el guardado de la rutina.
  const add = () => {
    const ex = available.find((e) => String(e.id) === String(id));
    if (!ex) return;
    onAdd(ex, { series: Number(series) || 1, repeticiones: String(reps || '10') });
    setId('');
  };

  // Enter agrega el ejercicio sin guardar la rutina
  const onEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="grid grid-cols-[1fr_72px_88px] gap-2 sm:grid-cols-[1fr_80px_100px_auto]" onKeyDown={onEnter}>
      <select className="input col-span-3 sm:col-span-1" value={id} onChange={(e) => setId(e.target.value)} aria-label="Ejercicio">
        <option value="">Elegí un ejercicio</option>
        {available.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nombre}
          </option>
        ))}
      </select>
      <input className="input" type="number" min="1" max="20" value={series} onChange={(e) => setSeries(e.target.value)} aria-label="Series" title="Series" />
      <input className="input" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="8-12" aria-label="Repeticiones" title="Repeticiones" />
      <button className="btn btn-primary col-span-3 sm:col-span-1" type="button" onClick={add} disabled={!id}>
        <Plus size={16} /> Agregar
      </button>
    </div>
  );
}
