import { useEffect, useState } from 'react';
import { Loader2, X, AlertTriangle, ImageOff } from 'lucide-react';
import { LEVELS } from '../utils/helpers';

export function Spinner({ label = 'Cargando' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-mute" role="status">
      <Loader2 className="animate-spin" size={20} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="card flex flex-col items-start gap-3 p-5">
      <div className="flex items-start gap-2 text-[#ffb3b5]">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <p className="text-sm">{message}</p>
      </div>
      {onRetry && (
        <button className="btn btn-ghost" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function Empty({ title, children }) {
  return (
    <div className="card px-6 py-10 text-center">
      <p className="font-display text-2xl font-semibold">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-sm text-sm text-mute">{children}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-4xl font-semibold leading-none sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-mute">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-chalk">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-mute">{hint}</span>}
    </label>
  );
}

const modalStack = [];

export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    // Con modales apilados, Escape cierra solo el de arriba
    const token = {};
    modalStack.push(token);
    const onKey = (e) => e.key === 'Escape' && modalStack[modalStack.length - 1] === token && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      modalStack.splice(modalStack.indexOf(token), 1);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={`card max-h-[92vh] w-full overflow-y-auto rounded-b-none sm:rounded-b-lg ${wide ? 'max-w-2xl' : 'max-w-md'}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-rubber-3 bg-rubber-2 px-5 py-3">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button className="rounded p-1 text-mute hover:text-chalk" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmLabel = 'Eliminar', busy, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-mute">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
          {busy && <Loader2 size={16} className="animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

/** Discos sobre una barra: 1, 2 o 3 según la dificultad. */
export function Plates({ level, size = 1 }) {
  const lv = LEVELS[level] || LEVELS.principiante;
  const heights = [16, 13, 10];
  return (
    <svg width={28 * size} height={18 * size} viewBox="0 0 28 18" aria-hidden="true" className="shrink-0">
      <rect x="0" y="8" width="28" height="2" rx="1" fill="#93A09B" />
      {Array.from({ length: lv.n }).map((_, i) => (
        <rect key={i} x={4 + i * 6} y={(18 - heights[i]) / 2} width="4.5" height={heights[i]} rx="1" fill={lv.color} />
      ))}
    </svg>
  );
}

export function DifficultyBadge({ level }) {
  const lv = LEVELS[level];
  if (!lv) return null;
  return (
    <span className="inline-flex items-center gap-2 text-sm text-chalk">
      <Plates level={level} />
      {lv.label}
    </span>
  );
}

export function Thumb({ src, alt = '', className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-rubber-3 text-rubber-4 ${className}`} aria-hidden="true">
        <ImageOff size={22} />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

/** Pestañas. tabs = [{ key, label }] */
export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="mb-5 flex gap-1 overflow-x-auto border-b border-rubber-3" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={`-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            value === t.key ? 'border-plate-bluelight text-chalk' : 'border-transparent text-mute hover:text-chalk'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function RoleBadge({ u }) {
  const base = 'rounded px-2 py-0.5 text-xs font-medium';
  if (u.super_admin) return <span className={`${base} bg-chalk text-rubber`}>Super admin</span>;
  if (u.admin) return <span className={`${base} bg-plate-blue/20 text-plate-bluelight`}>Administrador</span>;
  return <span className={`${base} bg-rubber-3 text-mute`}>Usuario</span>;
}
