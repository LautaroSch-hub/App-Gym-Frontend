import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "../src/componentes/contenedores/login";
import Nav from "../src/componentes/contenedores/nav";
import RutinasGenerales from "../src/componentes/contenedores/RutinasGenerales";
import DetallePredefinido from "../src/componentes/dumbs/DetallePredefinido";
import RutinasPersonalizadas from "../src/componentes/contenedores/RutinasPersonalizadas";
import DetallePersonalizado from "../src/componentes/dumbs/DetalleRutinaPer";
import DashboardAdmin from "../src/componentes/contenedores/DashboardAdmin";
import GestionUsuarios from "../src/componentes/contenedores/GestionUsuarios";
import NuevoUsuario from "../src/componentes/contenedores/NuevoUsuario";
import GestionEjercicios from "../src/componentes/contenedores/GestionEjercicios";
import NuevoEjercicio from "../src/componentes/contenedores/NuevoEjercicio";
import EditarEjercicio from "../src/componentes/contenedores/EditarEjercicio";
import GestionRutinasGenerales from "../src/componentes/contenedores/GestionRutinasGenerales ";
import EditarRutinaGeneral from "../src/componentes/contenedores/EditarRutinaGeneral";
import NuevoRutinaGeneral from "../src/componentes/contenedores/NuevoRutinaGeneral";
import GestionRutinasPersonalizadasAdmin from "../src/componentes/contenedores/GestionRutinasPersonalizadasAdmin";
import NuevoRutinaPersonalizada from "../src/componentes/contenedores/NuevoRutinaPersonalizada";
import EditarRutinaPersonalizada from "../src/componentes/contenedores/EditarRutinaPersonalizada";
import PrivateRoute from "../src/componentes/contenedores/PrivateRoute";
import PrivateAdmin from "../src/componentes/contenedores/PrivateAdmin";
import Error from "../src/componentes/contenedores/Error";
function App() {
  return (
    <div className="App">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous"
      />
      <Nav></Nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<RutinasGenerales />} />
          <Route path="/detalle/:id" element={<DetallePredefinido />} />
          <Route path="/mirutina" element={<RutinasPersonalizadas />} />
          <Route path="/rutina/:id" element={<DetallePersonalizado />} />
          <Route element={<PrivateAdmin />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/usuarios" element={<GestionUsuarios />} />
            <Route path="/admin/usuarios/nuevo" element={<NuevoUsuario />} />
            <Route path="/admin/ejercicios" element={<GestionEjercicios />} />
            <Route
              path="/admin/ejercicios/nuevo"
              element={<NuevoEjercicio />}
            />
            {/* Ruta para editar ejercicios, p.ej.: */}
            <Route
              path="/admin/ejercicios/editar/:id"
              element={<EditarEjercicio />}
            />
            <Route
              path="/admin/rutinas-generales"
              element={<GestionRutinasGenerales />}
            />
            <Route
              path="/admin/rutinas-generales/editar/:id"
              element={<EditarRutinaGeneral />}
            />
            <Route
              path="/admin/rutinas-generales/nueva"
              element={<NuevoRutinaGeneral />}
            />
            <Route
              path="/admin/rutinas-personalizadas"
              element={<GestionRutinasPersonalizadasAdmin />}
            />
            <Route
              path="/admin/rutinas-personalizadas/nueva"
              element={<NuevoRutinaPersonalizada />}
            />
            <Route
              path="/admin/rutinas-personalizadas/editar/:id"
              element={<EditarRutinaPersonalizada />}
            />
            <Route path="/admin3" element={<div>hola mindo3</div>} />
          </Route>
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-Piv4xVNRyMGpqkS2by6br4gNJ7DXjqk09RmUpJ8jgGtD7zP9yug3goQfGII0yAns"
        crossorigin="anonymous"
      ></script>
    </div>
  );
}

export default App;
