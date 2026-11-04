import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, KeyRound, Loader2, Lock, Plus, RefreshCw, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { ConfirmDialog, Empty, ErrorBox, Field, Modal, PageHeader, RoleBadge, Spinner } from '../../components/ui';
import { MembresiaBadge, PasswordModal, RenewModal } from '../../components/Membresia';
import { AVISO_DIAS, plural } from '../../utils/fechas';

const emptyForm = { nombre: '', email: '', password: '', edad: '', objetivos: '', detalle_medico: '', admin: false, dias: '30' };

function NewUserModal({ onClose, onCreated }) {
  const toast = useToast();
  const [f, setF] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = {
        nombre: f.nombre.trim(),
        email: f.email.trim(),
        contraseña_hash: f.password, // el back la guarda hasheada
        edad: Number(f.edad),
        objetivos: f.objetivos,
        detalle_medico: f.detalle_medico,
        admin: f.admin,
      };
      if (!f.admin) body.dias_membresia = Number(f.dias) || 0;
      await api.usuarios.create(body);
      toast('Usuario creado');
      onCreated();
    } catch (err) {
      toast(api.errMsg(err), 'error');
      setBusy(false);
    }
  };

  return (
    <Modal title="Nuevo usuario" onClose={onClose} wide>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" hint="Tiene que ser único.">
            <input className="input" required maxLength={50} value={f.nombre} onChange={set('nombre')} />
          </Field>
          <Field label="Email">
            <input className="input" type="email" required value={f.email} onChange={set('email')} />
          </Field>
          <Field label="Contraseña" hint="Mínimo 6 caracteres. El usuario puede cambiarla desde Mi cuenta.">
            <input className="input" type="text" required minLength={6} value={f.password} onChange={set('password')} autoComplete="off" />
          </Field>
          <Field label="Edad">
            <input className="input" type="number" min="1" max="120" required value={f.edad} onChange={set('edad')} />
          </Field>
        </div>
        <Field label="Objetivos">
          <textarea className="input" rows={2} value={f.objetivos} onChange={set('objetivos')} placeholder="Ej. ganar masa muscular" />
        </Field>
        <Field label="Detalle médico">
          <textarea className="input" rows={2} value={f.detalle_medico} onChange={set('detalle_medico')} placeholder="Lesiones, restricciones o nada para informar" />
        </Field>

        <label className="flex items-center gap-3 rounded-md bg-rubber px-3 py-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-[#2F6BF0]" checked={f.admin} onChange={set('admin')} />
          <span>
            <span className="block font-medium">Darle rol de administrador</span>
            <span className="text-xs text-mute">Puede entrar al panel y gestionar usuarios, rutinas y ejercicios. No tiene vencimiento.</span>
          </span>
        </label>

        {!f.admin && (
          <Field label="Días de membresía" hint="Cuántos días de acceso tiene desde hoy. Poné 0 si todavía no pagó: queda sin acceso hasta que lo renueves.">
            <input className="input max-w-[160px]" type="number" min="0" max="3650" required value={f.dias} onChange={set('dias')} />
          </Field>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            Crear usuario
          </button>
        </div>
      </form>
    </Modal>
  );
}

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'porvencer', label: 'Por vencer' },
  { key: 'vencidos', label: 'Vencidos' },
];

const esVencido = (u) => !u.membresia?.exento && !u.membresia?.vigente;
const esPorVencer = (u) => !u.membresia?.exento && u.membresia?.vigente && u.membresia.diasRestantes <= AVISO_DIAS;

export default function Usuarios() {
  const { user: me } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => api.usuarios.list());
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [renewing, setRenewing] = useState(null);
  const [resetting, setResetting] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [busy, setBusy] = useState(false);

  const usuarios = data || [];
  const conteo = useMemo(
    () => ({
      todos: usuarios.length,
      porvencer: usuarios.filter(esPorVencer).length,
      vencidos: usuarios.filter(esVencido).length,
    }),
    [usuarios]
  );
  const visibles = usuarios.filter((u) => (filtro === 'porvencer' ? esPorVencer(u) : filtro === 'vencidos' ? esVencido(u) : true));

  const remove = async () => {
    setBusy(true);
    try {
      await api.usuarios.remove(toDelete.id);
      toast('Usuario eliminado');
      setToDelete(null);
      reload();
    } catch (e) {
      toast(api.errMsg(e), 'error');
    }
    setBusy(false);
  };

  const toggleAdmin = async (u) => {
    try {
      await api.usuarios.update(u.id, { admin: !u.admin });
      toast(u.admin ? 'Se quitó el rol de administrador' : 'Ahora es administrador');
      reload();
    } catch (e) {
      toast(api.errMsg(e), 'error');
    }
  };

  return (
    <>
      <PageHeader
        title="Usuarios"
        subtitle="Creá usuarios, renová su membresía, dales rol de administrador y armá su plan semanal."
        actions={
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <Plus size={16} /> Nuevo usuario
          </button>
        }
      />

      {loading && <Spinner />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {data && data.length === 0 && <Empty title="Todavía no hay usuarios">Creá el primero con el botón Nuevo usuario.</Empty>}

      {data && data.length > 0 && (
        <>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por membresía">
            {FILTROS.map((f) => (
              <button
                key={f.key}
                aria-pressed={filtro === f.key}
                onClick={() => setFiltro(f.key)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  filtro === f.key ? 'border-plate-bluelight bg-plate-blue/20 text-plate-bluelight' : 'border-rubber-4 text-mute hover:text-chalk'
                }`}
              >
                {f.label} <span className="ml-1 text-xs opacity-80">{conteo[f.key]}</span>
              </button>
            ))}
          </div>

          {visibles.length === 0 ? (
            <Empty title="No hay usuarios en esta lista">
              {filtro === 'vencidos' ? 'Nadie tiene la membresía vencida.' : 'Nadie está por vencer en los próximos días.'}
            </Empty>
          ) : (
            <ul className="card divide-y divide-rubber-3">
              {visibles.map((u) => {
                const isSuper = u.super_admin;
                const isMe = u.id === me.id;
                const n = u.RutinaPersonalizadas?.length || 0;
                return (
                  <li key={u.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1 basis-56">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{u.nombre}</p>
                        <RoleBadge u={u} />
                        {isMe && <span className="text-xs text-mute">(vos)</span>}
                      </div>
                      <p className="truncate text-sm text-mute">
                        {u.email} — {plural(n, 'rutina', 'rutinas')}
                      </p>
                      {!u.membresia?.exento && (
                        <div className="mt-1">
                          <MembresiaBadge m={u.membresia} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {!u.membresia?.exento && (
                        <button className="btn btn-primary !py-1.5" onClick={() => setRenewing(u)}>
                          <RefreshCw size={16} /> Renovar
                        </button>
                      )}
                      <Link to={`/admin/usuarios/${u.id}`} className="btn btn-ghost !py-1.5">
                        <CalendarDays size={16} /> Ver
                      </Link>
                      {(!isSuper || isMe) && (
                        <button className="btn btn-ghost !py-1.5" onClick={() => setResetting(u)} aria-label={`Cambiar la contraseña de ${u.nombre}`} title="Cambiar contraseña">
                          <KeyRound size={16} />
                        </button>
                      )}
                      {!isSuper && (
                        <button className="btn btn-ghost !py-1.5" onClick={() => toggleAdmin(u)} disabled={isMe && u.admin} title={isMe && u.admin ? 'No podés quitarte tu propio rol' : undefined}>
                          {u.admin ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                          {u.admin ? 'Quitar admin' : 'Hacer admin'}
                        </button>
                      )}
                      {isSuper ? (
                        <span className="inline-flex items-center gap-1.5 px-2 text-xs text-mute" title="El super admin no se puede eliminar">
                          <Lock size={14} /> Protegido
                        </span>
                      ) : (
                        <button
                          className="btn btn-danger !py-1.5"
                          disabled={isMe}
                          title={isMe ? 'No podés eliminar tu propia cuenta' : undefined}
                          onClick={() => setToDelete(u)}
                          aria-label={`Eliminar a ${u.nombre}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {creating && (
        <NewUserModal
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            reload();
          }}
        />
      )}
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
      {resetting && <PasswordModal usuario={resetting} onClose={() => setResetting(null)} />}
      {toDelete && (
        <ConfirmDialog
          title="Eliminar usuario"
          message={`Se va a eliminar a ${toDelete.nombre} con sus rutinas, asistencia, progreso y medidas. Esta acción no se puede deshacer.`}
          busy={busy}
          onConfirm={remove}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
