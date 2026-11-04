import { PageHeader } from '../components/ui';
import MedidasView from '../components/seguimiento/MedidasView';

export default function Medidas() {
  return (
    <>
      <PageHeader title="Medidas" subtitle="Tu peso y tus medidas corporales a lo largo del tiempo." />
      <MedidasView />
    </>
  );
}
