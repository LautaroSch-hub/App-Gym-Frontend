import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Bloqueado from '../pages/Bloqueado';

export function RequireAuth() {
  const { user, bloqueado } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (bloqueado) return <Bloqueado />; // membresía vencida: solo se ve esta pantalla
  return <Outlet />;
}

export function RequireAdmin() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to="/mi-semana" replace />;
}
