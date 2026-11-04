import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import * as api from '../../services/api';
import { useToast } from '../../components/Toast';
import { ConfirmDialog, DifficultyBadge, Empty, ErrorBox, PageHeader, Spinner, Thumb } from '../../components/ui';

export default function RutinasAdmin() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => api.predef.list());
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    try {
      await api.predef.remove(toDelete.id);
      toast('Rutina eliminada');
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
        title="Rutinas generales"
        subtitle="Definí la dificultad, los músculos que trabaja y los ejercicios de cada rutina."
        actions={
          <Link to="/admin/rutinas/nueva" className="btn btn-primary">
            <Plus size={16} /> Nueva rutina
          </Link>
        }
      />

      {loading && <Spinner />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {data && data.length === 0 && <Empty title="Todavía no hay rutinas generales">Creá la primera con el botón Nueva rutina.</Empty>}

      {data && data.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((r) => (
            <li key={r.id} className="card flex flex-col overflow-hidden">
              <Thumb src={r.imagen_url} className="h-32 w-full" />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="text-2xl font-semibold leading-tight">{r.nombre}</h3>
                <DifficultyBadge level={r.nivel_dificultad} />
                <p className="text-sm text-mute">{r.Musculos?.length ? r.Musculos.map((m) => m.nombre).join(', ') : 'Sin músculos asignados'}</p>
                <p className="text-xs text-mute">
                  {r.Ejercicios?.length || 0} {r.Ejercicios?.length === 1 ? 'ejercicio' : 'ejercicios'}
                </p>
                <div className="mt-auto flex gap-2 pt-3">
                  <Link to={`/admin/rutinas/${r.id}`} className="btn btn-ghost flex-1 !py-1.5">
                    <Pencil size={16} /> Editar
                  </Link>
                  <button className="btn btn-danger !py-1.5" onClick={() => setToDelete(r)} aria-label={`Eliminar ${r.nombre}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar rutina"
          message={`Se va a eliminar "${toDelete.nombre}". Los ejercicios de la biblioteca no se borran.`}
          busy={busy}
          onConfirm={remove}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
