import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { auth as authApi, limpiarSesion } from '../services/api';

const AuthCtx = createContext(null);

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem('gym_session')) || null;
  } catch {
    return null;
  }
}

function flash(msg) {
  try {
    sessionStorage.setItem('gym_flash', msg);
  } catch {
    /* sin sessionStorage */
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(leerSesion); // { user, membresia, expiraEn }

  const guardar = useCallback((s) => {
    localStorage.setItem('gym_session', JSON.stringify(s));
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    limpiarSesion();
    setSession(null);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('gym_token', data.token);
      guardar({ user: data.usuario, membresia: data.membresia, expiraEn: data.expiraEn });
      return data;
    },
    [guardar]
  );

  /** Vuelve a pedir el estado al back (por ejemplo, después de que el admin renovó la membresía). */
  const refresh = useCallback(async () => {
    const data = await authApi.me();
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user: data.usuario, membresia: data.membresia };
      localStorage.setItem('gym_session', JSON.stringify(next));
      return next;
    });
    return data.membresia;
  }, []);

  // La sesión dura 3 días: al abrir la app y cuando se cumple el plazo se cierra sola.
  const expiraEn = session?.expiraEn;
  useEffect(() => {
    if (!session) return undefined;
    const restante = (expiraEn || 0) - Date.now();
    if (!expiraEn || restante <= 0) {
      flash('Tu sesión venció. Volvé a ingresar.');
      logout();
      return undefined;
    }
    const t = setTimeout(() => {
      flash('Tu sesión venció. Volvé a ingresar.');
      logout();
    }, Math.min(restante, 2 ** 31 - 1));
    return () => clearTimeout(t);
  }, [expiraEn, session, logout]);

  // Al abrir la app se refresca el estado de la membresía en segundo plano.
  const hayUsuario = !!session?.user;
  useEffect(() => {
    if (hayUsuario) refresh().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hayUsuario]);

  // El back avisa (403) cuando la membresía venció a mitad de la sesión.
  useEffect(() => {
    const onExpired = () =>
      setSession((prev) =>
        prev ? { ...prev, membresia: { ...prev.membresia, vigente: false, diasRestantes: 0 } } : prev
      );
    window.addEventListener('gym:membership-expired', onExpired);
    return () => window.removeEventListener('gym:membership-expired', onExpired);
  }, []);

  const user = session?.user || null;
  const membresia = session?.membresia || null;

  const value = useMemo(() => {
    const isAdmin = !!(user?.admin || user?.super_admin);
    // Un usuario común con la membresía vencida ve solo la pantalla de bloqueo
    const expired = !!user && !isAdmin && !!membresia && !membresia.vigente;
    return {
      user,
      membresia,
      login,
      logout,
      refresh,
      isAdmin,
      isSuper: !!user?.super_admin,
      expired,
      bloqueado: expired, // mismo valor; lo usa ProtectedRoute
    };
  }, [user, membresia, login, logout, refresh]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
