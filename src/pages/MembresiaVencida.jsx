import { useState } from 'react';
import { Loader2, LockKeyhole, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { errMsg } from '../services/api';
import { fmtFecha } from '../utils/fechas';

/** Pantalla que ve un usuario con la membresía vencida: no puede usar nada más hasta que se la renueven. */
export default function MembresiaVencida() {
  const { user, membresia, refresh, logout } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const actualizar = async () => {
    setBusy(true);
    try {
      const m = await refresh();
      if (!m.vigente) toast('Tu membresía todavía figura vencida.', 'error');
    } catch (e) {
      toast(errMsg(e), 'error');
    }
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="card w-full max-w-md p-6 text-center">
        <LockKeyhole size={36} className="mx-auto text-plate-red" aria-hidden="true" />
        <h1 className="mt-4 text-5xl font-semibold leading-none">Tu membresía venció</h1>
        <p className="mt-3 text-sm text-mute">
          {user?.nombre}, {membresia?.vence ? `tu acceso terminó el ${fmtFecha(membresia.vence)}.` : 'todavía no tenés una membresía activa.'}
        </p>
        <p className="mt-2 text-sm text-mute">
          Pedí la renovación en el gimnasio. Cuando te la activen, tocá Actualizar y vas a poder entrar de nuevo con todo tu historial.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button className="btn btn-primary" onClick={actualizar} disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            Actualizar estado
          </button>
          <button className="btn btn-ghost" onClick={logout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
