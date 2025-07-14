import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getEjercicio, deleteEjericio } from "../../redux/actions";
import "./css/gestion-ejercicios.css"

const GestionEjercicios = () => {
  const dispatch = useDispatch();
  const ejercicio = useSelector((state) => state.Ejercicios);

  useEffect(() => {
    dispatch(getEjercicio());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este ejercicio?")) {
      dispatch(deleteEjericio(id));
    }
  };

  // Función para extraer el ID del video de YouTube
  const extractYouTubeID = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.+\?v=)|youtu\.be\/)([^"&?/s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="container contain-all-ejercicio">
      <h2 className="mb-4 h2-gestion_ejer">Gestión de Ejercicios</h2>
      <div className="mb-3">
        <Link to="/admin/ejercicios/nuevo" className="btn btn-success">
          Crear Nuevo Ejercicio
        </Link>
      </div>

      {!ejercicio ? (
        <p>Cargando ejercicios...</p>
      ) : (
        <div className="row">
          {ejercicio.map((ejercicio) => {
            const videoID = extractYouTubeID(ejercicio.imagen_url);

            return (
              <div key={ejercicio.id} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{ejercicio.nombre}</h5>
                    <p className="card-text">{ejercicio.descripcion}</p>

                    {/* Mostrar video si la URL es válida */}
                    {videoID ? (
                      <iframe
                        width="100%"
                        height="200px"
                        src={`https://www.youtube.com/embed/${videoID}`}
                        title={ejercicio.nombre}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <p>No hay video disponible</p>
                    )}

                    <div className="mt-2">
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleDelete(ejercicio.id)}
                      >
                        X
                      </button>
                      <Link
                        to={`/admin/ejercicios/editar/${ejercicio.id}`}
                        className="btn btn-warning"
                      >
                        Modificar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GestionEjercicios;
