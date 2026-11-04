import { useState } from 'react';
import { Download, Loader2, Share } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Field, PageHeader } from '../components/ui';
import { MembresiaBadge } from '../components/Membresia';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { auth as authApi, errMsg } from '../services/api';
import { roleOf } from '../utils/helpers';

function CambiarPassword() {
  const toast = useToast();
  const [f, setF] = useState({ actual: '', nueva: '', repetir: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (f.nueva !== f.repetir) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }
    setBusy(true);
    try {
      await authApi.changePassword(f.actual, f.nueva);
      toast('Contraseña actualizada');
      setF({ actual: '', nueva: '', repetir: '' });
    } catch (err) {
      setError(errMsg(err));
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-5">
      <div>
        <h2 className="text-3xl font-semibold">Cambiar contraseña</h2>
        <p className="mt-1 text-sm text-mute">Podés quedarte con la que te dio el gimnasio o elegir una propia.</p>
      </div>
      <Field label="Contraseña actual">
        <input className="input" type="password" autoComplete="current-password" required value={f.actual} onChange={set('actual')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Contraseña nueva" hint="Mínimo 6 caracteres.">
          <input className="input" type="password" autoComplete="new-password" required minLength={6} value={f.nueva} onChange={set('nueva')} />
        </Field>
        <Field label="Repetir contraseña nueva">
          <input className="input" type="password" autoComplete="new-password" required minLength={6} value={f.repetir} onChange={set('repetir')} />
        </Field>
      </div>
      {error && (
        <p role="alert" className="rounded-md border border-plate-red/40 bg-plate-red/10 px-3 py-2 text-sm text-[#ffb3b5]">
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <button className="btn btn-primary" disabled={busy}>
          {busy && <Loader2 size={16} className="animate-spin" />}
          Guardar contraseña
        </button>
      </div>
    </form>
  );
}

function InstalarApp() {
  const { puedeInstalar, instalar, instalada, esIOS } = useInstallPrompt();
  if (instalada) return null;

  return (
    <section className="card space-y-3 p-5">
      <h2 className="text-3xl font-semibold">Instalar la app</h2>
      <p className="text-sm text-mute">Agregala a la pantalla de inicio de tu celular para abrirla como cualquier otra app, sin buscarla en el navegador.</p>
      {puedeInstalar && (
        <button className="btn btn-primary" onClick={instalar}>
          <Download size={16} /> Instalar Gym Manager
        </button>
      )}
      {!puedeInstalar && esIOS && (
        <p className="flex items-start gap-2 text-sm">
          <Share size={16} className="mt-0.5 shrink-0 text-plate-bluelight" />
          <span>
            En iPhone: abrí esta página en Safari, tocá el botón Compartir y elegí <strong>Agregar a pantalla de inicio</strong>.
          </span>
        </p>
      )}
      {!puedeInstalar && !esIOS && (
        <p className="text-sm text-mute">
          Si usás Chrome en Android, abrí el menú del navegador y elegí <strong className="text-chalk">Instalar aplicación</strong> o <strong className="text-chalk">Agregar a pantalla principal</strong>.
        </p>
      )}
    </section>
  );
}

export default function Cuenta() {
  const { user, membresia } = useAuth();

  return (
    <>
      <PageHeader title="Mi cuenta" />
      <div className="mx-auto max-w-2xl space-y-5">
        <section className="card space-y-3 p-5">
          <div>
            <p className="text-xl font-medium">{user.nombre}</p>
            <p className="text-sm text-mute">{user.email}</p>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-mute">Rol</dt>
              <dd className="font-medium">{roleOf(user)}</dd>
            </div>
            {membresia && !membresia.exento && (
              <div>
                <dt className="text-mute">Membresía</dt>
                <dd>
                  <MembresiaBadge m={membresia} />
                </dd>
              </div>
            )}
          </dl>
          {membresia && !membresia.exento && (
            <p className="text-xs text-mute">La renovación la hace el gimnasio. Cuando te la activen, se actualiza sola.</p>
          )}
        </section>

        <CambiarPassword />
        <InstalarApp />
      </div>
    </>
  );
}
