import { useMemo, useState } from 'react';
import { Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import * as api from '../../services/api';
import { useToast } from '../../components/Toast';
import { ConfirmDialog, Empty, ErrorBox, Field, Modal, PageHeader, Spinner } from '../../components/ui';
import { ExerciseThumb } from '../../components/ExerciseList';
import VideoModal from '../../components/VideoModal';
import { getYouTubeId } from '../../utils/youtube';

function ExerciseModal({ initial, onClose, onSaved }) {
  const toast = useToast();
  const [f, setF] = useState({
    nombre: initial?.nombre || '',
    descripcion: initial?.descripcion || '',
    imagen_url: initial?.imagen_url || '', // acá se guarda el link del video de YouTube
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.imagen_url.trim() && !getYouTubeId(f.imagen_url)) {
      toast('El link de video no es de YouTube. Pegá el link completo del video.', 'error');
      return;
    }
    setBusy(true);
    try {
      if (initial) await api.ejercicios.update(initial.id, f);
      else await api.ejercicios.create(f);
      toast(initial ? 'Ejercicio actualizado' : 'Ejercicio creado');
      onSaved();
    } catch (err) {
      toast(api.errMsg(err), 'error');
      setBusy(false);
    }
  };

  return (
    <Modal title={initial ? 'Editar ejercicio' : 'Nuevo ejercicio'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nombre">
          <input className="input" required maxLength={100} value={f.nombre} onChange={set('nombre')} />
        </Field>
        <Field label="Descripción">
          <textarea className="input" rows={3} value={f.descripcion} onChange={set('descripcion')} />
        </Field>
        <Field label="Video de YouTube" hint="Opcional. Pegá el link del video; los usuarios lo ven al tocar el ejercicio, también desde el celular.">
          <input className="input" type="url" maxLength={255} value={f.imagen_url} onChange={set('imagen_url')} placeholder="https://www.youtube.com/watch?v=..." />
        </Field>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            Guardar ejercicio
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function Ejercicios() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() =>
    Promise.all([api.ejercicios.list(), api.predef.list(), api.personal.all()])
  );
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | ejercicio
  const [toDelete, setToDelete] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [busy, setBusy] = useState(false);

  const [ejercicios, predefs, personales] = data || [[], [], []];

  // Cuántas rutinas usan cada ejercicio (para avisar antes de eliminar)
  const usage = useMemo(() => {
    const m = {};
    [...predefs, ...personales].forEach((r) => (r.Ejercicios || []).forEach((e) => (m[e.id] = (m[e.id] || 0) + 1)));
    return m;
  }, [predefs, personales]);

  const filtered = ejercicios.filter((e) => e.nombre.toLowerCase().includes(q.toLowerCase()));

  const remove = async () => {
    setBusy(true);
    try {
      await api.ejercicios.remove(toDelete.id);
      toast('Ejercicio eliminado');
      setToDelete(null);
      reload();
    } catch (e) {
      toast(api.errMsg(e), 'error');
    }
    setBusy(false);
  };

  return (
    <>
      <PageHeader
        title="Ejercicios"
        subtitle="Tu biblioteca de ejercicios. Cada uno se puede usar en rutinas generales y personalizadas."
        actions={
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            <Plus size={16} /> Nuevo ejercicio
          </button>
        }
      />

      {loading && <Spinner />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && (
        <>
          <div className="relative mb-5 max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
            <input className="input !pl-9" placeholder="Buscar ejercicio" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar ejercicio" />
          </div>

          {ejercicios.length === 0 ? (
            <Empty title="Todavía no hay ejercicios">Creá el primero para poder armar rutinas.</Empty>
          ) : filtered.length === 0 ? (
            <Empty title="Sin resultados">No hay ejercicios que coincidan con la búsqueda.</Empty>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((e) => (
                <li key={e.id} className="card flex gap-3 p-3">
                  <ExerciseThumb e={e} onPlay={setPlaying} className="h-20 w-20" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{e.nombre}</p>
                    <p className="line-clamp-2 text-sm text-mute">{e.descripcion || 'Sin descripción'}</p>
                    <p className="mt-1 text-xs text-mute">
                      {usage[e.id] ? `En ${usage[e.id]} ${usage[e.id] === 1 ? 'rutina' : 'rutinas'}` : 'Sin usar'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button className="rounded p-1.5 text-mute hover:bg-rubber-3 hover:text-chalk" onClick={() => setEditing(e)} aria-label={`Editar ${e.nombre}`}>
                      <Pencil size={16} />
                    </button>
                    <button className="rounded p-1.5 text-mute hover:bg-plate-red/15 hover:text-[#ff9a9d]" onClick={() => setToDelete(e)} aria-label={`Eliminar ${e.nombre}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {playing && <VideoModal ejercicio={playing} onClose={() => setPlaying(null)} />}
      {editing && (
        <ExerciseModal
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}
      {toDelete && (
        <ConfirmDialog
          title="Eliminar ejercicio"
          message={
            usage[toDelete.id]
              ? `"${toDelete.nombre}" está en ${usage[toDelete.id]} ${usage[toDelete.id] === 1 ? 'rutina' : 'rutinas'}. Si lo eliminás, desaparece de todas.`
              : `Se va a eliminar "${toDelete.nombre}". Esta acción no se puede deshacer.`
          }
          busy={busy}
          onConfirm={remove}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
