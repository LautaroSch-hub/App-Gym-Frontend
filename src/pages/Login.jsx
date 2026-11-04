import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../services/api';
import { Field } from '../components/ui';

function leerAviso() {
  try {
    const msg = sessionStorage.getItem('gym_flash');
    sessionStorage.removeItem('gym_flash');
    return msg || '';
  } catch {
    return '';
  }
}

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aviso] = useState(leerAviso);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [lento, setLento] = useState(false);

  // El servidor gratuito se "duerme" y la primera conexión puede tardar bastante.
  useEffect(() => {
    if (!busy) {
      setLento(false);
      return undefined;
    }
    const t = setTimeout(() => setLento(true), 5000);
    return () => clearTimeout(t);
  }, [busy]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Barra con discos: el elemento que identifica la app */}
      <div className="relative hidden items-center overflow-hidden bg-rubber-2 lg:flex" aria-hidden="true">
        <svg viewBox="0 0 600 300" className="w-full" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="144" width="600" height="12" rx="6" fill="#3A4641" />
          <rect x="120" y="120" width="26" height="60" rx="4" fill="#93A09B" />
          {[
            [160, 30, 190, '#E5484D'],
            [194, 30, 160, '#E8C23A'],
            [228, 30, 130, '#3FB26B'],
            [262, 30, 100, '#2F6BF0'],
          ].map(([x, w, h, c]) => (
            <rect key={x} x={x} y={150 - h / 2} width={w} height={h} rx="5" fill={c} />
          ))}
          {[
            [440, 30, 100, '#2F6BF0'],
            [474, 30, 130, '#3FB26B'],
            [508, 30, 160, '#E8C23A'],
            [542, 30, 190, '#E5484D'],
          ].map(([x, w, h, c]) => (
            <rect key={x} x={x} y={150 - h / 2} width={w} height={h} rx="5" fill={c} />
          ))}
          <rect x="400" y="120" width="26" height="60" rx="4" fill="#93A09B" />
        </svg>
        <p className="absolute bottom-10 left-10 max-w-sm font-display text-5xl font-semibold leading-none">
          Tu semana de entrenamiento, ordenada.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="text-5xl font-bold leading-none">Gym Manager</h1>
            <p className="mt-2 text-sm text-mute">Ingresá con tu email y contraseña.</p>
          </div>

          {aviso && (
            <p role="status" className="rounded-md border border-plate-yellow/40 bg-plate-yellow/10 px-3 py-2 text-sm">
              {aviso}
            </p>
          )}

          <Field label="Email">
            <input className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Contraseña">
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          {error && (
            <p role="alert" className="rounded-md border border-plate-red/40 bg-plate-red/10 px-3 py-2 text-sm text-[#ffb3b5]">
              {error}
            </p>
          )}

          <button className="btn btn-primary w-full !py-2.5" disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            Ingresar
          </button>

          {lento && (
            <p className="text-xs text-mute" role="status">
              El servidor estaba descansando y está arrancando. Puede tardar hasta un minuto la primera vez.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
