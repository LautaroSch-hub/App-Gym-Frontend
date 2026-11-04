import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import * as api from '../services/api';
import { Empty, ErrorBox, Modal, PageHeader, Spinner } from '../components/ui';
import { ExerciseList } from '../components/ExerciseList';
import WeekGrid from '../components/WeekGrid';
import CheckInButton from '../components/CheckInButton';
import { normEx } from '../utils/helpers';

export default function MiSemana() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { data, loading, error, reload } = useFetch(() => api.personal.byUser(user.id), [user.id]);
  const [open, setOpen] = useState(null);

  return (
    <>
      <PageHeader title="Mi semana" subtitle="Tu rutina para cada día, de lunes a sábado." actions={<CheckInButton />} />

      {loading && <Spinner />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {data && data.length === 0 && (
        <div className="mb-4">
          <Empty title="Todavía no tenés rutinas">
            Tu entrenador va a cargar tu plan semanal. Mientras tanto, mirá las rutinas generales.
          </Empty>
        </div>
      )}
      {data && <WeekGrid routines={data} onOpen={setOpen} />}

      {open && (
        <Modal title={open.nombre} onClose={() => setOpen(null)} wide>
          <p className="mb-4 text-sm text-mute">{open.dia}</p>
          {open.descripcion && <p className="mb-4 text-sm">{open.descripcion}</p>}
          <ExerciseList
            items={(open.Ejercicios || []).map(normEx)}
            onLog={(e) => {
              setOpen(null);
              nav(`/progreso?ejercicio=${e.id}`);
            }}
          />
        </Modal>
      )}
    </>
  );
}
