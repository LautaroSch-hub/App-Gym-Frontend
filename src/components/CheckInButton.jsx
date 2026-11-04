import { useState } from 'react';
import { CheckCircle2, Loader2, CalendarCheck } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import * as api from '../services/api';
import { useToast } from './Toast';

/** Acceso rápido para marcar la asistencia de hoy desde "Mi semana". */
export default function CheckInButton() {
  const toast = useToast();
  const { data, reload } = useFetch(() => api.asistencia.list());
  const [busy, setBusy] = useState(false);

  if (!data) return null;
  if (data.marcadoHoy) {
    return (
      <span className="inline-flex items-center gap-2 rounded-md bg-rubber-2 px-3 py-2 text-sm text-mute">
        <CheckCircle2 size={16} className="text-plate-green" /> Asistencia de hoy marcada
      </span>
    );
  }

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

  return (
    <button className="btn btn-primary" onClick={marcar} disabled={busy}>
      {busy ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck size={16} />}
      Marcar asistencia de hoy
    </button>
  );
}
