import { Plus } from 'lucide-react';
import { DAYS } from '../utils/helpers';

/** Calendario semanal (lunes a sábado) con las rutinas personalizadas de cada día. */
export default function WeekGrid({ routines, onOpen, onAdd }) {
  const dow = new Date().getDay(); // 0 = domingo
  const today = dow >= 1 ? DAYS[dow - 1] : null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {DAYS.map((day) => {
        const list = routines.filter((r) => r.dia === day);
        const isToday = day === today;
        return (
          <section
            key={day}
            className={`card flex min-h-[170px] flex-col ${isToday ? '!border-plate-blue' : ''}`}
            aria-label={day}
          >
            <header className="flex items-baseline justify-between px-4 pt-3">
              <h3 className="text-3xl font-semibold">{day}</h3>
              {isToday && <span className="text-sm font-medium text-plate-bluelight">Hoy</span>}
            </header>

            <div className="flex-1 space-y-2 p-3">
              {list.length === 0 && <p className="px-1 py-2 text-sm text-mute">Día libre</p>}
              {list.map((r) => {
                const n = r.Ejercicios?.length;
                return (
                  <button
                    key={r.id}
                    onClick={() => onOpen(r)}
                    className="flex w-full items-stretch gap-3 rounded-md bg-rubber-3 text-left transition-colors hover:bg-rubber-4"
                  >
                    <span className="w-1 shrink-0 rounded-l-md bg-plate-blue" aria-hidden="true" />
                    <span className="min-w-0 flex-1 py-2.5 pr-3">
                      <span className="block truncate text-sm font-medium">{r.nombre}</span>
                      <span className="block text-xs text-mute">
                        {n === undefined ? 'Ver rutina' : `${n} ${n === 1 ? 'ejercicio' : 'ejercicios'}`}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {onAdd && (
              <button className="btn btn-ghost m-3 mt-0 !py-1.5" onClick={() => onAdd(day)}>
                <Plus size={16} /> Agregar rutina
              </button>
            )}
          </section>
        );
      })}
    </div>
  );
}
