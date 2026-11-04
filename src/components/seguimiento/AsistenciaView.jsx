import { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import * as api from '../../services/api';
import { useToast } from '../Toast';
import { ErrorBox, Spinner } from '../ui';
import { addDays, fmtFecha, mesTexto, plural } from '../../utils/fechas';

const DIAS_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function Calendario({ fechas, hoy }) {
  const [cursor, setCursor] = useState(hoy.slice(0, 7));
  const [y, m] = cursor.split('-').map(Number);
  const primero = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7; // lunes = 0
  const cantidad = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const set = new Set(fechas);
  const esMesActual = cursor === hoy.slice(0, 7);

  const mover = (n) => {
    const d = new Date(Date.UTC(y, m - 1 + n, 1));
    setCursor(d.toISOString().slice(0, 7));
  };

  const celdas = [...Array(primero).fill(null), ...Array.from({ length: cantidad }, (_, i) => i + 1)];

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-2xl font-semibold capitalize">{mesTexto(cursor)}</h3>
        <div className="flex gap-1">
          <button className="rounded p-2 text-mute hover:bg-rubber-3 hover:text-chalk" onClick={() => mover(-1)} aria-label="Mes anterior">
            <ChevronLeft size={18} />
          </button>
          <button
            className="rounded p-2 text-mute hover:bg-rubber-3 hover:text-chalk disabled:opacity-30"
            onClick={() => mover(1)}
            disabled={esMesActual}
            aria-label="Mes siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-mute">
        {DIAS_SEMANA.map((d, i) => (
          <span key={i} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {celdas.map((dia, i) => {
          if (!dia) return <span key={`v${i}`} />;
          const fecha = `${cursor}-${String(dia).padStart(2, '0')}`;
          const asistio = set.has(fecha);
          const esHoy = fecha === hoy;
          return (
            <span
              key={fecha}
              className={`flex aspect-square items-center justify-center rounded-md text-sm ${
                asistio ? 'bg-plate-blue font-semibold text-white' : 'text-mute'
              } ${esHoy ? 'ring-2 ring-plate-bluelight' : ''}`}
              aria-label={`${dia}${asistio ? ', asistió' : ''}${esHoy ? ', hoy' : ''}`}
            >
              {dia}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Check-in diario y calendario de asistencia. Con usuarioId es la vista (solo lectura) del administrador. */
export default function AsistenciaView({ usuarioId }) {
  const readOnly = !!usuarioId;
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => api.asistencia.list(usuarioId), [usuarioId]);
  const [busy, setBusy] = useState(false);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const { hoy, fechas, marcadoHoy } = data;
  const mes = fechas.filter((f) => f.startsWith(hoy.slice(0, 7))).length;
  const ultimos30 = fechas.filter((f) => f >= addDays(hoy, -29)).length;

  const marcar = async () => {
    setBusy(true);
    try {
      await api.asistencia.mark();
      toast('Asistencia marcada. ¡Buen entrenamiento!');
      await reload();
    } catch (e) {
      toast(api.errMsg(e), 'error');
    }
    setBusy(false);
  };

  const deshacer = async () => {
    setBusy(true);
    try {
      await api.asistencia.undoToday();
      toast('Se quitó la asistencia de hoy');
      await reload();
    } catch (e) {
      toast(api.errMsg(e), 'error');
    }
    setBusy(false);
  };

  return (
    <div className="space-y-5">
      {!readOnly && (
        <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
          {marcadoHoy ? (
            <>
              <p className="flex items-center gap-2 text-lg font-medium">
                <CheckCircle2 className="text-plate-green" size={22} /> Hoy ya marcaste tu asistencia
              </p>
              <button className="btn btn-ghost" onClick={deshacer} disabled={busy}>
                Deshacer
              </button>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">¿Entrenaste hoy?</p>
              <button className="btn btn-primary !px-6 !py-3 !text-base" onClick={marcar} disabled={busy}>
                {busy && <Loader2 size={18} className="animate-spin" />}
                Marcar asistencia de hoy
              </button>
            </>
          )}
        </div>
      )}

      <dl className="grid grid-cols-3 gap-3">
        {[
          [mes, 'Este mes'],
          [ultimos30, 'Últimos 30 días'],
          [fechas.length, 'Total registrado'],
        ].map(([n, label]) => (
          <div key={label} className="card p-4">
            <dd className="font-display text-5xl font-semibold leading-none">{n}</dd>
            <dt className="mt-1 text-xs text-mute sm:text-sm">{label}</dt>
          </div>
        ))}
      </dl>

      <Calendario fechas={fechas} hoy={hoy} />

      {readOnly && fechas.length === 0 && <p className="text-sm text-mute">Este usuario todavía no marcó asistencia.</p>}
      {fechas.length > 0 && (
        <p className="text-sm text-mute">
          Última asistencia: {fmtFecha(fechas[0])}. {plural(fechas.length, 'día registrado', 'días registrados')} en total.
        </p>
      )}
    </div>
  );
}
