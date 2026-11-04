import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AVISO_DIAS, fmtFecha } from '../utils/fechas';

/** Aviso dentro de la app cuando a la membresía le quedan pocos días. */
export default function MembresiaBanner() {
  const { membresia: m, isAdmin } = useAuth();
  const clave = m?.vence ? `gym_banner_${m.vence}` : null;
  const [oculto, setOculto] = useState(() => {
    try {
      return clave ? sessionStorage.getItem(clave) === '1' : false;
    } catch {
      return false;
    }
  });

  if (isAdmin || !m || !m.vigente || m.diasRestantes == null || m.diasRestantes > AVISO_DIAS || oculto) return null;

  const cerrar = () => {
    setOculto(true);
    try {
      sessionStorage.setItem(clave, '1');
    } catch {
      /* sin sessionStorage */
    }
  };

  const ultimo = m.diasRestantes === 1;
  return (
    <div role="status" className="mb-5 flex items-start gap-3 rounded-lg border border-plate-yellow/40 bg-plate-yellow/10 px-4 py-3 text-sm">
      <Clock size={18} className="mt-0.5 shrink-0 text-plate-yellow" />
      <p className="flex-1">
        <strong className="font-medium">
          {ultimo ? 'Hoy es el último día de tu membresía.' : `Tu membresía vence en ${m.diasRestantes} días (${fmtFecha(m.vence)}).`}
        </strong>{' '}
        <span className="text-mute">
          Pedí la renovación en el gimnasio para no perder el acceso. <Link to="/cuenta" className="text-plate-bluelight underline">Ver mi cuenta</Link>
        </span>
      </p>
      <button className="rounded p-1 text-mute hover:text-chalk" onClick={cerrar} aria-label="Cerrar aviso">
        <X size={16} />
      </button>
    </div>
  );
}
