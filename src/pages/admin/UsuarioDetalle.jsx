import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import * as api from '../../services/api';
import { useToast } from '../../components/Toast';
import { ConfirmDialog, Empty, ErrorBox, Field, Modal, RoleBadge, Spinner, Tabs } from '../../components/ui';
import { MembresiaBadge, RenewModal } from '../../components/Membresia';
import AsistenciaView from '../../components/seguimiento/AsistenciaView';
import ProgresoView from '../../components/seguimiento/ProgresoView';
import MedidasView from '../../components/seguimiento/MedidasView';
import { AddExerciseForm, ExerciseList } from '../../components/ExerciseList';
import WeekGrid from '../../components/WeekGrid';
import { DAYS, normEx } from '../../utils/helpers';
import { fmtFecha, plural } from '../../utils/fechas';

/** Crear una rutina personalizada en un día, opcionalmente copiando una rutina general. */
function CreateModal({ usuarioId, dia, predefs, onClose, onCreated }) {
  const toast = useToast();
  const [f, setF] = useState({ nombre: '', descripcion: '', imagen_url: '', dia, base: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const pickBase = (e) => {
    const base = e.target.value;
    const p = predefs.find((x) => String(x.id) === base);
    setF({ ...f, base, nombre: f.nombre || p?.nombre || '' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api.personal.create({
        nombre: f.nombre.trim(),
        descripcion: f.descripcion,
        imagen_url: f.imagen_url,
        dia: f.dia,
        usuarioId,
      });
      const base = predefs.find((x) => String(x.id) === f.base);
      for (const ex of (base?.Ejercicios || []).map(normEx)) {
        await api.personal.addEjercicio(r.id, ex.id, { series: ex.series, repeticiones: ex.repeticiones });
      }
      toast('Rutina creada');
      onCreated();
    } catch (err) {
      toast(api.errMsg(err), 'error');
      setBusy(false);
    }
  };

  return (
    <Modal title="Nueva rutina personalizada" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Día">
          <select className="input" value={f.dia} onChange={set('dia')}>
            {DAYS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Partir de una rutina general" hint="Opcional. Copia sus ejercicios, series y repeticiones; después podés cambiarlos.">
          <select className="input" value={f.base} onChange={pickBase}>
            <option value="">Empezar vacía</option>
            {predefs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Nombre">
          <input className="input" required maxLength={100} value={f.nombre} onChange={set('nombre')} />
        </Field>
        <Field label="Descripción">
          <textarea className="input" rows={2} value={f.descripcion} onChange={set('descripcion')} />
        </Field>
        <Field label="URL de la imagen" hint="Opcional.">
          <input className="input" type="url" maxLength={255} value={f.imagen_url} onChange={set('imagen_url')} placeholder="https://" />
        </Field>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            Crear rutina
          </button>
        </div>
      </form>
    </Modal>
  );
}

/** Editar una rutina personalizada: datos, ejercicios y eliminación. */
function EditModal({ id, library, onClose, onChanged }) {
  const toast = useToast();
  const { data: r, loading, error, reload } = useFetch(() => api.personal.get(id), [id]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (r) setForm({ nombre: r.nombre, descripcion: r.descripcion || '', imagen_url: r.imagen_url || '', dia: r.dia });
  }, [r]);

  const run = async (fn, okMsg) => {
    try {
      await fn();
      if (okMsg) toast(okMsg);
      await reload();
      onChanged();
    } catch (e) {
      toast(api.errMsg(e), 'error');
    }
  };

  const save = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    await run(
      () => api.personal.update(id, { Nombre: form.nombre.trim(), Descripcion: form.descripcion, imagen: form.imagen_url, dia: form.dia }),
      'Rutina guardada'
    );
    setSaving(false);
  };

  const items = (r?.Ejercicios || []).map(normEx);

  // Sube (-1) o baja (+1) un ejercicio y guarda el orden enseguida
  const [moviendo, setMoviendo] = useState(false);
  const mover = async (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const ids = items.map((e) => e.id);
    [ids[i], ids[j]] = [ids[j], ids[i]];
    setMoviendo(true);
    await run(() => api.personal.reorder(id, ids));
    setMoviendo(false);
  };

  return (
    <Modal title="Editar rutina" onClose={onClose} wide>
      {loading && <Spinner />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {data_missing(loading, error, r) && <ErrorBox message="No se encontró la rutina." />}

      {r && form && (
        <div className="space-y-6">
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre">
                <input className="input" required maxLength={100} value={form.nombre} onChange={set('nombre')} />
              </Field>
              <Field label="Día">
                <select className="input" value={form.dia} onChange={set('dia')}>
                  {DAYS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Descripción">
              <textarea className="input" rows={2} value={form.descripcion} onChange={set('descripcion')} />
            </Field>
            <Field label="URL de la imagen">
              <input className="input" type="url" value={form.imagen_url} onChange={set('imagen_url')} placeholder="https://" />
            </Field>
            <div className="flex justify-end">
              <button className="btn btn-primary" disabled={saving}>
                {saving && <Loader2 size={16} className="animate-spin" />}
                Guardar datos
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold">Ejercicios</h3>
            <ExerciseList
              items={items}
              onRemove={(e) => run(() => api.personal.removeEjercicio(id, e.id), 'Ejercicio quitado')}
              onMove={mover}
              moveDisabled={moviendo}
              emptyText="Esta rutina todavía no tiene ejercicios."
            />
            <AddExerciseForm
              library={library}
              usedIds={items.map((e) => e.id)}
              onAdd={(ex, data) => run(() => api.personal.addEjercicio(id, ex.id, data), 'Ejercicio agregado')}
            />
          </div>

          <div className="border-t border-rubber-3 pt-4">
            <button className="btn btn-danger" onClick={() => setConfirm(true)}>
              <Trash2 size={16} /> Eliminar rutina
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          title="Eliminar rutina"
          message={`Se va a eliminar "${r?.nombre}" del plan semanal.`}
          onCancel={() => setConfirm(false)}
          onConfirm={async () => {
            try {
              await api.personal.remove(id);
              toast('Rutina eliminada');
              onChanged();
              onClose();
            } catch (e) {
              toast(api.errMsg(e), 'error');
            }
          }}
        />
      )}
    </Modal>
  );
}

// El back responde 200 con null si el id no existe
const data_missing = (loading, error, r) => !loading && !error && !r;

const TABS = [
  { key: 'plan', label: 'Plan semanal' },
  { key: 'membresia', label: 'Membresía' },
  { key: 'asistencia', label: 'Asistencia' },
  { key: 'progreso', label: 'Progreso' },
  { key: 'medidas', label: 'Medidas' },
];

/** Historial de renovaciones de la membresía. */
function Historial({ usuarioId }) {
  const { data, loading, error, reload } = useFetch(() => api.usuarios.renovaciones(usuarioId), [usuarioId]);
  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!data.length) return <Empty title="Sin renovaciones">Todavía no se registró ninguna renovación para este usuario.</Empty>;
  return (
    <ul className="card divide-y divide-rubber-3">
      {data.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
          <div>
            <p className="font-medium">{r.dias > 0 ? `Se sumaron ${plural(r.dias, 'día', 'días')}` : 'Membresía desactivada'}</p>
            <p className="text-mute">
              {r.vence_anterior ? `Vencía el ${fmtFecha(r.vence_anterior)}.` : 'No tenía membresía.'} Ahora vence el {fmtFecha(r.vence_nuevo)}.
            </p>
          </div>
          <p className="text-xs text-mute">
            {new Date(r.createdAt).toLocaleDateString('es-AR')}
            {r.registrada_por ? `, por ${r.registrada_por}` : ''}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function UsuarioDetalle() {
  const { id } = useParams();
  const { data, loading, error, reload } = useFetch(
    () => Promise.all([api.usuarios.get(id), api.personal.byUser(id), api.ejercicios.list(), api.predef.list()]),
    [id]
  );
  const [tab, setTab] = useState('plan');
  const [creatingDay, setCreatingDay] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [renewing, setRenewing] = useState(false);
  const [version, setVersion] = useState(0); // fuerza a recargar el historial después de renovar

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  const [u, rutinas, library, predefs] = data;
  const usuarioId = Number(id);
  const sinVencimiento = u.membresia?.exento;

  return (
    <>
      <Link to="/admin/usuarios" className="mb-5 inline-flex items-center gap-1.5 text-sm text-mute hover:text-chalk">
        <ArrowLeft size={16} /> Volver a usuarios
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-5xl font-semibold leading-none">{u.nombre}</h1>
          <RoleBadge u={u} />
        </div>
        <p className="mt-2 text-sm text-mute">
          {u.email}
          {u.edad ? ` — ${u.edad} años` : ''}
        </p>
        {!sinVencimiento && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <MembresiaBadge m={u.membresia} />
            <button className="btn btn-primary !py-1.5" onClick={() => setRenewing(true)}>
              <RefreshCw size={16} /> Renovar
            </button>
          </div>
        )}
        {(u.objetivos || u.detalle_medico) && (
          <dl className="card mt-4 grid gap-3 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium">Objetivos</dt>
              <dd className="text-mute">{u.objetivos || 'Sin completar'}</dd>
            </div>
            <div>
              <dt className="font-medium">Detalle médico</dt>
              <dd className="text-mute">{u.detalle_medico || 'Sin completar'}</dd>
            </div>
          </dl>
        )}
      </div>

      <Tabs tabs={sinVencimiento ? TABS.filter((t) => t.key !== 'membresia') : TABS} value={tab} onChange={setTab} />

      {tab === 'plan' && <WeekGrid routines={rutinas} onAdd={setCreatingDay} onOpen={(r) => setEditingId(r.id)} />}
      {tab === 'membresia' && <Historial key={version} usuarioId={usuarioId} />}
      {tab === 'asistencia' && <AsistenciaView usuarioId={usuarioId} />}
      {tab === 'progreso' && <ProgresoView usuarioId={usuarioId} />}
      {tab === 'medidas' && <MedidasView usuarioId={usuarioId} />}

      {creatingDay && (
        <CreateModal
          usuarioId={usuarioId}
          dia={creatingDay}
          predefs={predefs}
          onClose={() => setCreatingDay(null)}
          onCreated={() => {
            setCreatingDay(null);
            reload();
          }}
        />
      )}
      {editingId && <EditModal id={editingId} library={library} onClose={() => setEditingId(null)} onChanged={reload} />}
      {renewing && (
        <RenewModal
          usuario={u}
          onClose={() => setRenewing(false)}
          onDone={() => {
            setRenewing(false);
            setVersion((v) => v + 1);
            reload();
          }}
        />
      )}
    </>
  );
}
