import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  Activity,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Ruler,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { roleOf } from '../utils/helpers';
import MembresiaBanner from './MembresiaBanner';

const userNav = [
  { to: '/mi-semana', label: 'Mi semana', icon: CalendarDays },
  { to: '/rutinas', label: 'Rutinas', icon: Dumbbell },
  { to: '/asistencia', label: 'Asistencia', icon: CalendarCheck },
  { to: '/progreso', label: 'Progreso', icon: TrendingUp },
  { to: '/medidas', label: 'Medidas', icon: Ruler },
];

const adminNav = [
  { to: '/admin', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/rutinas', label: 'Rutinas generales', short: 'Generales', icon: ClipboardList },
  { to: '/admin/ejercicios', label: 'Ejercicios', icon: Activity },
];

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <svg width="30" height="20" viewBox="0 0 28 18" aria-hidden="true">
        <rect x="0" y="8" width="28" height="2" rx="1" fill="#93A09B" />
        <rect x="4" y="1" width="4.5" height="16" rx="1" fill="#E5484D" />
        <rect x="10" y="3" width="4.5" height="12" rx="1" fill="#E8C23A" />
        <rect x="16" y="5" width="4.5" height="8" rx="1" fill="#3FB26B" />
      </svg>
      <span className="font-display text-2xl font-bold leading-none">Gym Manager</span>
    </div>
  );
}

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  // En el celular, un administrador ve su panel y el acceso a "Mi semana"
  const mobileItems = isAdmin ? [...adminNav, userNav[0]] : userNav;

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-rubber-3 text-chalk' : 'text-mute hover:bg-rubber-2 hover:text-chalk'
    }`;

  return (
    <div className="min-h-screen">
      {/* Barra lateral (escritorio) */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-rubber-3 bg-rubber-2 p-4 md:flex">
        <div className="mb-8 mt-1 px-1">
          <Brand />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Principal">
          {isAdmin && <p className="px-3 pb-1 text-xs text-mute">Administración</p>}
          {isAdmin &&
            adminNav.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkCls}>
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          {isAdmin && <p className="px-3 pb-1 pt-4 text-xs text-mute">Entrenamiento</p>}
          {userNav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkCls}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-rubber-3 pt-4">
          <NavLink to="/cuenta" className={linkCls}>
            <UserRound size={18} />
            <span className="min-w-0">
              <span className="block truncate">{user?.nombre}</span>
              <span className="block text-xs font-normal text-mute">{roleOf(user)}</span>
            </span>
          </NavLink>
          <button className="btn btn-ghost mt-3 w-full" onClick={logout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Barra superior (móvil) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-rubber-3 bg-rubber-2 px-4 py-3 md:hidden">
        <Brand />
        <div className="flex items-center">
          <Link to="/cuenta" className="rounded p-2 text-mute hover:text-chalk" aria-label="Mi cuenta">
            <UserRound size={20} />
          </Link>
          <button className="rounded p-2 text-mute hover:text-chalk" onClick={logout} aria-label="Cerrar sesión">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:ml-60 md:max-w-none md:px-8 md:pb-10 md:pt-8">
        <div className="mx-auto max-w-6xl">
          <MembresiaBanner />
          <Outlet />
        </div>
      </main>

      {/* Navegación inferior (móvil) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-rubber-3 bg-rubber-2 pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Principal">
        {mobileItems.map(({ to, label, short, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 px-1 py-2 text-[11px] ${isActive ? 'text-plate-bluelight' : 'text-mute'}`
            }
          >
            <Icon size={20} />
            <span className="max-w-full truncate">{short || label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
