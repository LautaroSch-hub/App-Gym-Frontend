import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import * as api from '../../services/api';
import { useToast } from '../../components/Toast';
import { ErrorBox, Field, Plates, Spinner } from '../../components/ui';
import { AddExerciseForm, ExerciseList } from '../../components/ExerciseList';
import { LEVELS, normEx } from '../../utils/helpers';

const blank = { nombre: '', descripcion: '', imagen_url: '', nivel_dificultad: 'principiante' };

export default function RutinaEditor() {
  const { id } = useParams(); // undefined cuando es una rutina nueva
  const isNew = !id;
  const nav = useNavigate();
  const toast = useToast();

  const { data, loading, error, reload } = useFetch(
    () => Promise.all([isNew ? Promise.resolve(null) : api.predef.get(id), api.musculos.list(), api.ejercicios.list()]),
    [id]
  );

  const [form, setForm] = useState(blank);
  const [muscles, setMuscles] = useState([]); // ids
  const [exercises, setExercises] = useState([]); // normalizados
  const [saving, setSaving] = useState(false);

  const [rutina, musculos, library] = data || [null, [], []];

  // Carga el formulario una sola vez cuando llegan los datos
  useEffect(() => {
    if (!data) return;
    if (rutina) {
      setForm({
        nombre: rutina.nombre,
        descripcion: rutina.descripcion || '',
        imagen_url: rutina.imagen_url || '',
        nivel_dificultad: rutina.nivel_dificultad,
      });
      setMuscles((rutina.Musculos || []).map((m) => m.id));
      setExercises((rutina.Ejercicios || []).map(normEx));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggleMuscle = (mid) => setMuscles((l) => (l.includes(mid) ? l.filter((x) => x !== mid) : [...l, mid]));

  // Sube (-1) o baja (+1) un ejercicio; se guarda al tocar el botón de guardar
  const moveExercise = (i, dir) =>
    setExercises((l) => {
      const j = i + dir;
      if (j < 0 || j >= l.length) return l;
      const next = [...l];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const addExercise = (ex, { series, repeticiones }) =>
    setExercises((l) => [...l, { id: ex.id, nombre: ex.nombre, imagen_url: ex.imagen_url, series, repeticiones, notas: '' }]);

  const save = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    const problems = [];
    const attempt = async (fn, label) => {
      try {
        await fn();
      } catch (e) {
        const notRouted = e.response?.status === 404 && /Cannot (DELETE|PUT)/.test(String(e.response?.data));
        problems.push(notRouted ? `${label}: el back todavía no tiene esa ruta (ver BACKEND_CAMBIOS.md)` : `${label}: ${api.errMsg(e)}`);
      }
    };

    try {
      let rid = id;
      if (isNew) {
        const created = await api.predef.create({
          nombre: form.nombre.trim(),
          descripcion: form.descripcion,
          imagen_url: form.imagen_url,
          nivel_dificultad: form.nivel_dificultad,
        });
        rid = created.id;
      } else {
        await api.predef.update(rid, {
          Nombre: form.nombre.trim(),
          Descripcion: form.descripcion,
          imagen: form.imagen_url,
          nivel_dificultad: form.nivel_dificultad, // el back lo ignora hasta aplicar BACKEND_CAMBIOS.md
        });
      }

      // Músculos: se agregan los nuevos y se quitan los que ya no están
      const oldMuscles = (rutina?.Musculos || []).map((m) => m.id);
      for (const mid of muscles.filter((m) => !oldMuscles.includes(m))) {
        await attempt(() => api.predef.addMusculo(rid, mid), 'Músculo');
      }
      for (const mid of oldMuscles.filter((m) => !muscles.includes(m))) {
        await attempt(() => api.predef.removeMusculo(rid, mid), 'Músculo');
      }

      // Ejercicios: se quitan los eliminados y se guardan los nuevos o modificados
      const oldEx = (rutina?.Ejercicios || []).map(normEx);
      for (const o of oldEx.filter((o) => !exercises.some((e) => e.id === o.id))) {
        await attempt(() => api.predef.removeEjercicio(rid, o.id), `Quitar ${o.nombre}`);
      }
      for (const e of exercises) {
        const o = oldEx.find((x) => x.id === e.id);
        if (o && o.series === e.series && o.repeticiones === e.repeticiones) continue;
        await attempt(() => api.predef.addEjercicio(rid, e.id, { series: e.series, repeticiones: e.repeticiones }), `Agregar ${e.nombre}`);
      }

      // Orden: los nuevos quedan al final en el back, así que se manda el orden final completo
      const mismoOrden = oldEx.length === exercises.length && oldEx.every((o, i) => o.id === exercises[i].id);
      if (exercises.length > 1 && !mismoOrden) {
        await attempt(() => api.predef.reorder(rid, exercises.map((e) => e.id)), 'Orden de los ejercicios');
      }

      if (problems.length) {
        toast(`La rutina se guardó, pero hubo problemas. ${problems.join(' | ')}`, 'error');
        if (isNew) nav(`/admin/rutinas/${rid}`, { replace: true });
        else reload();
      } else {
        toast(isNew ? 'Rutina creada' : 'Rutina guardada');
        nav('/admin/rutinas');
      }
    } catch (e) {
      toast(api.errMsg(e), 'error');
    }
    setSaving(false);
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!isNew && !rutina) return <ErrorBox message="No se encontró la rutina." />;

  return (
    <form onSubmit={save}>
      <Link to="/admin/rutinas" className="mb-5 inline-flex items-center gap-1.5 text-sm text-mute hover:text-chalk">
        <ArrowLeft size={16} /> Volver a rutinas generales
      </Link>
      <h1 className="mb-6 text-5xl font-semibold leading-none">{isNew ? 'Nueva rutina general' : 'Editar rutina'}</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card space-y-4 p-5">
          <Field label="Nombre">
            <input className="input" required maxLength={100} value={form.nombre} onChange={set('nombre')} />
          </Field>
          <Field label="Descripción">
            <textarea className="input" rows={3} value={form.descripcion} onChange={set('descripcion')} />
          </Field>
          <Field label="URL de la imagen" hint="Opcional.">
            <input className="input" type="url" maxLength={255} value={form.imagen_url} onChange={set('imagen_url')} placeholder="https://" />
          </Field>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Dificultad</legend>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(LEVELS).map(([k, v]) => (
                <label
                  key={k}
                  className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-md border px-2 py-3 text-sm transition-colors ${
                    form.nivel_dificultad === k ? 'border-plate-bluelight bg-rubber-3' : 'border-rubber-4 hover:bg-rubber-3'
                  }`}
                >
                  <input type="radio" name="nivel" className="sr-only" checked={form.nivel_dificultad === k} onChange={() => setForm({ ...form, nivel_dificultad: k })} />
                  <Plates level={k} size={1.2} />
                  {v.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Músculos que trabaja</legend>
            <div className="flex flex-wrap gap-2">
              {musculos.map((m) => {
                const on = muscles.includes(m.id);
                return (
                  <button
                    type="button"
                    key={m.id}
                    aria-pressed={on}
                    onClick={() => toggleMuscle(m.id)}
                    className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      on ? 'border-plate-bluelight bg-plate-blue/20 text-plate-bluelight' : 'border-rubber-4 text-mute hover:text-chalk'
                    }`}
                  >
                    {m.nombre}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="text-3xl font-semibold">Ejercicios</h2>
          <ExerciseList
            items={exercises}
            onRemove={(e) => setExercises((l) => l.filter((x) => x.id !== e.id))}
            onMove={moveExercise}
            emptyText="Agregá ejercicios desde tu biblioteca."
          />
          <AddExerciseForm library={library} usedIds={exercises.map((e) => e.id)} onAdd={addExercise} />
          <p className="text-xs text-mute">Los ejercicios que agregues, quites o reordenes se guardan al tocar {isNew ? 'Crear rutina' : 'Guardar cambios'}.</p>
        </section>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Link to="/admin/rutinas" className="btn btn-ghost">
          Cancelar
        </Link>
        <button className="btn btn-primary" disabled={saving}>
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isNew ? 'Crear rutina' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}
