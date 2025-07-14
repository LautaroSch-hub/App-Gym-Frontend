// src/componentes/contenedores/GestionRutinasGenerales.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getRutinaPredefinida, deleteRutinaPredefinida } from "../../redux/actions";

import "./css/gestion-rutina-general.css";

const GestionRutinasGenerales = () => {
  const dispatch = useDispatch();
  const rutinasgenerales  = useSelector((state) => state.Rutinasgenerales);

  useEffect(() => {
    dispatch(getRutinaPredefinida());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta rutina general?")) {
      dispatch(deleteRutinaPredefinida(id));
    }
  };

  return (
    <div className="container contain-all-ggeneral">
      <h2 className="mb-4 h2-gestion_rutina_gen">
        Administrar Rutinas Generales</h2>
      <div className="mb-3">
        {/* Podrías agregar un botón para crear una nueva rutina general */}
        <Link to="/admin/rutinas-generales/nueva" className="btn btn-success">
          Crear Nueva Rutina General
        </Link>
      </div>
      {!rutinasgenerales ? (
        <p>Cargando rutinas...</p>
      ) :(
        <div className="row">
          {rutinasgenerales.map((rutina) => (
            <div key={rutina.id} className="col-md-4 mb-3">
              <div className="card carta-gestion_general">
              <img
                src={rutina.imagen_url}
                alt="Previsualización"
                style={{ width: "100%", height: "200px", marginTop: "9px" }}
              />
                <div className="card-body">
                  <h5 className="card-title">{rutina.nombre}</h5>
                  <p className="card-text">{rutina.descripcion}</p>
                  <div>
                    <button className="btn btn-danger me-2" onClick={() => handleDelete(rutina.id)}>
                      X
                    </button>
                    <Link to={`/admin/rutinas-generales/editar/${rutina.id}`} className="btn btn-warning">
                      Modificar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestionRutinasGenerales;
