import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import * as api from '../services/api';
import { useToast } from './Toast';
import { ConfirmDialog, Field, Modal } from './ui';
import { AVISO_DIAS, fmtFecha, plural, renovarFecha } from '../utils/fechas';

const TONOS = {
  ok: 'bg-plate-green',
  warn: 'bg-plate-yellow',
  bad: 'bg-plate-red',
};

/** Estado de la membresía en una línea, con un punto de color. No se muestra para administradores. */
export function MembresiaBadge({ m }) {
  if (!m || m.exento) return null;
  let tono = 'ok';
  let texto;
  if (m.sinMembresia) {
    tono = 'bad';
    texto = 'Sin membresía';
  } else if (!m.vigente) {
    tono = 'bad';
    texto = `Venció el ${fmtFecha(m.vence)}`;
  } else if (m.diasRestantes <= AVISO_DIAS) {
    tono = 'warn';
    texto = `Vence en ${plural(m.diasRestantes, 'día', 'días')} (${fmtFecha(m.vence)})`;
  } else {
    texto = `Vigente hasta ${fmtFecha(m.vence)} (${plural(m.diasRestantes, 'día', 'días')})`;
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${TONOS[tono]}`} aria-hidden="true" />
      {texto}
    </span>
  );
}

const ATAJOS = [7, 15, 30, 60, 90];

/** El administrador elige cuántos días darle al usuario. */
export function RenewModal({ usuario, onClose, onDone }) {
  const toast = useToast();
  const m = usuario.membresia;
  const [dias, setDias] = useState(30);
  const [busy, setBusy] = useState(false);
  const [confirmOff, setConfirmOff] = useState(false);

  const n = Number(dias);
  const valido = Number.isInteger(n) && n >= 1 && n <= 3650;
  const nuevo = valido ? renovarFecha(m.vence, n, m.hoy) : null;

  const renovar = async (e) => {
    e.preventDefault();
    if (!valido) return;
    setBusy(true);
    try {
      const u = await api.usuarios.renovar(usuario.id, n);
      toast(`Membresía renovada hasta el ${fmtFecha(u.membresia.vence)}`);
      onDone();
    } catch (err) {
      toast(api.errMsg(err), 'error');
      setBusy(false);
    }
  };

  const desactivar = async () => {
    setBusy(true);
    try {
      await api.usuarios.desactivar(usuario.id);
      toast('Membresía desactivada');
      onDone();
    } catch (err) {
      toast(api.errMsg(err), 'error');
      setBusy(false);
      setConfirmOff(false);
    }
  };

  return (
    <Modal title={`Renovar a ${usuario.nombre}`} onClose={onClose}>
      <form onSubmit={renovar} className="space-y-4">
        <div className="rounded-md bg-rubber px-3 py-3">
          <p className="mb-1 text-xs text-mute">Estado actual</p>
          <MembresiaBadge m={m} />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Días a dar</legend>
          <div className="flex flex-wrap gap-2">
            {ATAJOS.map((d) => (
              <button
                type="button"
                key={d}
                aria-pressed={n === d}
                onClick={() => setDias(d)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  n === d ? 'border-plate-bluelight bg-plate-blue/20 text-plate-bluelight' : 'border-rubber-4 text-mute hover:text-chalk'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </fieldset>

        <Field label="Otra cantidad de días">
          <input className="input" type="number" min="1" max="3650" value={dias} onChange={(e) => setDias(e.target.value)} />
        </Field>

        <p className="rounded-md bg-rubber px-3 py-3 text-sm" aria-live="polite">
          {valido ? (
            <>
              Va a quedar vigente hasta el <strong>{fmtFecha(nuevo)}</strong>.{' '}
              <span className="text-mute">
                {m.vigente ? 'Los días se suman a lo que le queda.' : 'Los días cuentan desde hoy.'}
              </span>
            </>
          ) : (
            <span className="text-mute">Ingresá una cantidad de días entre 1 y 3650.</span>
          )}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {m.vigente ? (
            <button type="button" className="btn btn-danger" disabled={busy} onClick={() => setConfirmOff(true)}>
              Desactivar ahora
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" disabled={!valido || busy}>
              {busy && <Loader2 size={16} className="animate-spin" />}
              Renovar membresía
            </button>
          </div>
        </div>
      </form>

      {confirmOff && (
        <ConfirmDialog
          title="Desactivar membresía"
          message={`${usuario.nombre} no va a poder usar la app hasta que le renueves la membresía.`}
          confirmLabel="Desactivar"
          busy={busy}
          onConfirm={desactivar}
          onCancel={() => setConfirmOff(false)}
        />
      )}
    </Modal>
  );
}

/** El administrador le pone una contraseña nueva a un usuario. */
export function PasswordModal({ usuario, onClose }) {
  const toast = useToast();
  const [nueva, setNueva] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.usuarios.resetPassword(usuario.id, nueva);
      toast('Contraseña actualizada');
      onClose();
    } catch (err) {
      toast(api.errMsg(err), 'error');
      setBusy(false);
    }
  };

  return (
    <Modal title={`Contraseña de ${usuario.nombre}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Contraseña nueva" hint="Mínimo 6 caracteres. Pasásela al usuario; él puede cambiarla desde Mi cuenta.">
          <input className="input" type="text" required minLength={6} autoComplete="off" value={nueva} onChange={(e) => setNueva(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            Guardar contraseña
          </button>
        </div>
      </form>
    </Modal>
  );
}
