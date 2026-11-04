import { PageHeader } from '../components/ui';
import AsistenciaView from '../components/seguimiento/AsistenciaView';

export default function Asistencia() {
  return (
    <>
      <PageHeader title="Asistencia" subtitle="Marcá los días que entrenás y mirá cuánto venís yendo." />
      <AsistenciaView />
    </>
  );
}
