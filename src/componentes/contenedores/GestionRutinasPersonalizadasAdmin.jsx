import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {getUser, getRutinaperUser, deleteRutinaper } from "../../redux/actions"; // Acciones para rutinas personalizadas
import "./css/gestion-rutina-pers.css";

const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const GestionRutinasPersonalizadasAdmin = () => {
  const dispatch = useDispatch();
  // Estado de usuarios y de rutinas personalizadas
  const  Usuarios  = useSelector((state) => state.Usuarios);
  const  RutinasPersonalizadas  = useSelector((state) => state.RutinasPersonalizadas);

  // Estado local para el usuario seleccionado
  const [selectedUserId, setSelectedUserId] = useState("");

  // Al montar, obtener la lista de usuarios
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Cada vez que se seleccione un usuario, obtener sus rutinas personalizadas
  useEffect(() => {
    if (selectedUserId) {
      dispatch(getRutinaperUser(selectedUserId));
    }
  }, [dispatch, selectedUserId]);

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleDeleteRoutine = (rutinaId) => {
    if (window.confirm("¿Estás seguro de eliminar esta rutina personalizada?")) {
      dispatch(deleteRutinaper(rutinaId));
    }
  };

  return (
    <div className="container contain-all-prs">
      <h2 className="h2-gestion_rutinas_pers">Administrar Rutinas Personalizadas</h2>
      {/* Selección de usuario */}
      <div className="mb-3">
        <label htmlFor="userSelect" className="form-label label-gestion_rutinas_pers">
          Seleccione un usuario:
        </label>
        {!Usuarios ? (
          <p>Cargando usuarios...</p>
        ): (
          <select
            id="userSelect"
            className="form-select"
            value={selectedUserId}
            onChange={handleUserChange}
          >
            <option value="">-- Seleccione un usuario --</option>
            {Usuarios.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nombre} ({user.email})
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedUserId && (
        <>
          <div className="mb-3">
            <Link
              to={`/admin/rutinas-personalizadas/nueva?userId=${selectedUserId}`}
              className="btn btn-success"
            >
              Crear Nueva Rutina Personalizada
            </Link>
          </div>
          {!RutinasPersonalizadas ? (
            <p>Cargando rutinas...</p>
          ) : (
            daysOfWeek.map((day) => {
              const routinesForDay = RutinasPersonalizadas.filter(
                (rutina) => rutina.dia === day
              );
              return (
                <div key={day} className="mb-4">
                  <h3 className="h3-dia_gestion_pers">{day}</h3>
                  {routinesForDay.length > 0 ? (
                    <div className="row contenedor-gestion_pers">
                      {routinesForDay.map((rutina) => (
                        <div key={rutina.id} className="col-md-4 mb-3">
                          <div className="card carta-gestion_pers">
                            <div className="card-body">
                              <h5 className="card-title h5-carta_gestion_pers">{rutina.nombre}</h5>
                              <p className="card-text">{rutina.descripcion}</p>
                              <img src={rutina.imagen_url} alt="Previsualización" style={{ width: "100%", height: "200px", marginTop: "9px" }}/>
                              <div className="contenedor-botones_gestion_pers">
                                <button
                                  className="btn btn-danger me-2"
                                  onClick={() => handleDeleteRoutine(rutina.id)}
                                >
                                  X
                                </button>
                                <Link
                                  to={`/admin/rutinas-personalizadas/editar/${rutina.id}`}
                                  className="btn btn-warning"
                                >
                                  Modificar
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No hay rutinas para este día.</p>
                  )}
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
};

export default GestionRutinasPersonalizadasAdmin;
