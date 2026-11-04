import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import ProgresoView from '../components/seguimiento/ProgresoView';

export default function Progreso() {
  const [params] = useSearchParams();
  return (
    <>
      <PageHeader title="Progreso" subtitle="Anotá el peso y las repeticiones de cada ejercicio y mirá cómo evolucionás." />
      <ProgresoView initialEjercicio={params.get('ejercicio')} />
    </>
  );
}
