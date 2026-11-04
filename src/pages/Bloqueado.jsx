import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { fmtFecha } from '../utils/fechas';

/** Pantalla que ve un usuario con la membresía vencida. */
export default function Bloqueado() {
  const { user, membresia, refresh, logout } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const verificar = async () => {
    setBusy(true);
    try {
      const m = await refresh();
      if (m && !m.vigente) toast('Todavía figura vencida. Pedile al administrador que la renueve.', 'error');
    } catch {
      toast('No se pudo actualizar. Revisá tu conexión e intentá de nuevo.', 'error');
    }
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-plate-red/15 text-[#ff9a9d]">
          <Lock size={26} />
        </div>
        <h1 className="text-5xl font-bold leading-none">Tu membresía venció</h1>
        <p className="mt-3 text-sm text-mute">
          {membresia?.vence
            ? `Hola ${user.nombre}, tu acceso terminó el ${fmtFecha(membresia.vence)}.`
            : `Hola ${user.nombre}, todavía no tenés una membresía activa.`}{' '}
          Pedile al administrador del gimnasio que la renueve. Cuando lo haga, tocá el botón para volver a entrar.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button className="btn btn-primary !py-2.5" onClick={verificar} disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            Ya me renovaron
          </button>
          <button className="btn btn-ghost !py-2.5" onClick={() => logout()}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
