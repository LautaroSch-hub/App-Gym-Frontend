import React from "react";
import { Link } from "react-router-dom";

import "./css/admin-dashboard.css";

const AdminDashboard = () => {
  return (
    <div className="container contain-all-admin ">
      <h1 className="text-center mb-4 h1-panel_admin">Panel de Administrador</h1>
      <div className="row">
        {/* Gestión de Usuarios */}
        <div className="contenedor-link_admin">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Gestión de Usuarios</h5>
              <Link to="/admin/usuarios" className="btn btn-primary link-boton_admin">
                Administrar Usuarios
              </Link>
            </div>
          </div>
        </div>
        {/* Gestión de Ejercicios */}
        <div className="contenedor-link_admin">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Gestión de Ejercicios</h5>
              <Link to="/admin/ejercicios" className="btn btn-primary link-boton_admin">
                Administrar Ejercicios
              </Link>
            </div>
          </div>
        </div>
        {/* Gestión de Rutinas Personalizadas */}
        <div className="contenedor-link_admin">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Rutinas Personalizadas</h5>
              <Link to="/admin/rutinas-personalizadas" className="btn btn-primary link-boton_admin">
                Administrar Rutinas Personalizadas
              </Link>
            </div>
          </div>
        </div>
        {/* Gestión de Rutinas Generales */}
        <div className="contenedor-link_admin">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Rutinas Generales</h5>
              <Link to="/admin/rutinas-generales" className="btn btn-primary link-boton_admin">
                Administrar Rutinas Generales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
