import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import * as api from '../../services/api';
import { ErrorBox, PageHeader, Spinner } from '../../components/ui';
import { LEVELS } from '../../utils/helpers';
import { MembresiaBadge, RenewModal } from '../../components/Membresia';
import { AVISO_DIAS } from '../../utils/fechas';
import { useAuth } from '../../context/AuthContext';

function Tile({ to, value, label, note }) {
  return (
    <Link to={to} className="card block p-5 transition-colors hover:border-rubber-4">
      <p className="font-display text-6xl font-semibold leading-none">{value}</p>
      <p className="mt-2 text-sm font-medium">{label}</p>
      {note && <p className="text-xs text-mute">{note}</p>}
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [renewing, setRenewing] = useState(null);
  const { data, loading, error, reload } = useFetch(() =>
    Promise.all([api.usuarios.list(), api.predef.list(), api.ejercicios.list(), api.personal.all()])
  );

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  const [usuarios, rutinas, ejercicios, personales] = data;

  const admins = usuarios.filter((u) => u.admin || u.super_admin).length;
  const socios = usuarios.filter((u) => !u.membresia?.exento);
  const vencidos = socios.filter((u) => !u.membresia.vigente);
  const porVencer = socios.filter((u) => u.membresia.vigente && u.membresia.diasRestantes <= AVISO_DIAS);
  const vigentes = socios.length - vencidos.length - porVencer.length;
  const pendientes = [...vencidos, ...porVencer.sort((a, b) => a.membresia.diasRestantes - b.membresia.diasRestantes)];
  const sinPlan = usuarios.filter((u) => !u.RutinaPersonalizadas?.length);
  const byLevel = Object.keys(LEVELS).map((k) => ({ k, n: rutinas.filter((r) => r.nivel_dificultad === k).length }));
  const totalR = rutinas.length || 1;

  return (
    <>
      <PageHeader title={`Hola, ${user.nombre}`} subtitle="Resumen de lo que hay cargado en el gimnasio." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile to="/admin/usuarios" value={usuarios.length} label="Usuarios" note={`${admins} ${admins === 1 ? 'administrador' : 'administradores'}`} />
        <Tile to="/admin/rutinas" value={rutinas.length} label="Rutinas generales" />
        <Tile to="/admin/ejercicios" value={ejercicios.length} label="Ejercicios" />
        <Tile to="/admin/usuarios" value={personales.length} label="Rutinas personalizadas" />
      </div>


      <section className="card mt-6 p-5">
        <h2 className="mb-4 text-3xl font-semibold">Membresías</h2>
        <dl className="grid grid-cols-3 gap-3">
          {[
            [vigentes, 'Vigentes', 'bg-plate-green'],
            [porVencer.length, `Vencen en ${AVISO_DIAS} días o menos`, 'bg-plate-yellow'],
            [vencidos.length, 'Vencidas', 'bg-plate-red'],
          ].map(([n, label, color]) => (
            <div key={label} className="rounded-md bg-rubber px-4 py-3">
              <dd className="flex items-center gap-2 font-display text-5xl font-semibold leading-none">
                <span className={`h-3 w-3 rounded-full ${color}`} aria-hidden="true" />
                {n}
              </dd>
              <dt className="mt-1 text-xs text-mute sm:text-sm">{label}</dt>
            </div>
          ))}
        </dl>

        {pendientes.length === 0 ? (
          <p className="mt-4 text-sm text-mute">No hay membresías vencidas ni por vencer.</p>
        ) : (
          <ul className="mt-4 divide-y divide-rubber-3">
            {pendientes.slice(0, 8).map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <div className="min-w-0">
                  <Link to={`/admin/usuarios/${u.id}`} className="block truncate text-sm font-medium hover:text-plate-bluelight">
                    {u.nombre}
                  </Link>
                  <MembresiaBadge m={u.membresia} />
                </div>
                <button className="btn btn-ghost !py-1.5" onClick={() => setRenewing(u)}>
                  <RefreshCw size={16} /> Renovar
                </button>
              </li>
            ))}
          </ul>
        )}
        {pendientes.length > 8 && (
          <p className="mt-2 text-xs text-mute">
            y {pendientes.length - 8} más en <Link to="/admin/usuarios" className="text-plate-bluelight underline">Usuarios</Link>
          </p>
        )}
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 text-3xl font-semibold">Rutinas generales por dificultad</h2>
          {rutinas.length === 0 ? (
            <p className="text-sm text-mute">Todavía no hay rutinas generales.</p>
          ) : (
            <>
              <div className="flex h-3 overflow-hidden rounded-full bg-rubber-3" role="img" aria-label="Distribución por dificultad">
                {byLevel.map(({ k, n }) => (
                  <div key={k} style={{ width: `${(n / totalR) * 100}%`, background: LEVELS[k].color }} />
                ))}
              </div>
              <ul className="mt-4 space-y-2">
                {byLevel.map(({ k, n }) => (
                  <li key={k} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm" style={{ background: LEVELS[k].color }} />
                      {LEVELS[k].label}
                    </span>
                    <span className="font-medium">{n}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="card p-5">
          <h2 className="mb-4 text-3xl font-semibold">Usuarios sin plan semanal</h2>
          {sinPlan.length === 0 ? (
            <p className="text-sm text-mute">Todos los usuarios tienen al menos una rutina asignada.</p>
          ) : (
            <ul className="divide-y divide-rubber-3">
              {sinPlan.slice(0, 6).map((u) => (
                <li key={u.id}>
                  <Link to={`/admin/usuarios/${u.id}`} className="flex items-center justify-between py-2.5 text-sm hover:text-plate-bluelight">
                    <span>{u.nombre}</span>
                    <span className="text-mute">Armar plan</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {sinPlan.length > 6 && <p className="mt-2 text-xs text-mute">y {sinPlan.length - 6} más</p>}
        </section>
      </div>
      {renewing && (
        <RenewModal
          usuario={renewing}
          onClose={() => setRenewing(null)}
          onDone={() => {
            setRenewing(null);
            reload();
          }}
        />
      )}
    </>
  );
}
