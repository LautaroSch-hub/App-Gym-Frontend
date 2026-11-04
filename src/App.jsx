import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import { RequireAdmin, RequireAuth } from './components/ProtectedRoute';
import Login from './pages/Login';
import MiSemana from './pages/MiSemana';
import Rutinas from './pages/Rutinas';
import RutinaDetalle from './pages/RutinaDetalle';
import Asistencia from './pages/Asistencia';
import Progreso from './pages/Progreso';
import Medidas from './pages/Medidas';
import Cuenta from './pages/Cuenta';
import MembresiaVencida from './pages/MembresiaVencida';
import Dashboard from './pages/admin/Dashboard';
import Usuarios from './pages/admin/Usuarios';
import UsuarioDetalle from './pages/admin/UsuarioDetalle';
import RutinasAdmin from './pages/admin/RutinasAdmin';
import RutinaEditor from './pages/admin/RutinaEditor';
import Ejercicios from './pages/admin/Ejercicios';

function Home() {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? '/admin' : '/mi-semana'} replace />;
}

export default function App() {
  const { user, expired } = useAuth();

  // Con la membresía vencida solo se ve la pantalla de bloqueo
  if (user && expired) return <MembresiaVencida />;

  return (
    <Routes>
      <Route path="/login" element={user ? <Home /> : <Login />} />

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/mi-semana" element={<MiSemana />} />
          <Route path="/rutinas" element={<Rutinas />} />
          <Route path="/rutinas/:id" element={<RutinaDetalle />} />
          <Route path="/asistencia" element={<Asistencia />} />
          <Route path="/progreso" element={<Progreso />} />
          <Route path="/medidas" element={<Medidas />} />
          <Route path="/cuenta" element={<Cuenta />} />

          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/usuarios" element={<Usuarios />} />
            <Route path="/admin/usuarios/:id" element={<UsuarioDetalle />} />
            <Route path="/admin/rutinas" element={<RutinasAdmin />} />
            <Route path="/admin/rutinas/nueva" element={<RutinaEditor />} />
            <Route path="/admin/rutinas/:id" element={<RutinaEditor />} />
            <Route path="/admin/ejercicios" element={<Ejercicios />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
