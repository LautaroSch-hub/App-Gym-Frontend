import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getRutinaPersonalizadaById } from "../../redux/actions";

import "./css/detalle-rutina-personalizada.css"

const DetallePersonalizado = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const rutina = useSelector((state) => state.RutinasPersonalizadasid);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getRutinaPersonalizadaById(id));
    }
  }, [dispatch, id]);

  if (!rutina) {
    return <p>Rutina no encontrada.</p>;
  }

  // Función para extraer el ID del video de YouTube
  const extractYouTubeID = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.+\?v=)|youtu\.be\/)([^"&?/s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="container contenedor-detail-pr">
      <div className="card">
        <div id="imgContainer">
          <img
            src={rutina.imagen_url}
            alt={rutina.nombre}
            className="card-img-top imagen-rutina"
            style={{ width: "100%", height: "500px", objectFit: "contain", backgroundColor: "#000" }}
          />
        </div>
        <div className="card-body">
          <h2 className="card-title text-center" id="titulo-rutina">
            {rutina.nombre}
          </h2>
          <p id="descripcion-rutina" className="text-center mb-4">
            {rutina.descripcion}
          </p>
          <ul id="ejercicios-lista" className="list-group ul-detailsPrs">
            {rutina.Ejercicios && rutina.Ejercicios.length > 0 ? (
              rutina.Ejercicios.map((ej, index) => (
                <li
                  key={index}
                  className="list-group-item li-btn-style-prs"
                  style={{ cursor: "pointer" }}
                  onClick={() => setVideoUrl(ej.imagen_url)}
                >
                  <strong>{ej.nombre}</strong> — Series: {ej.RutinaPersonalizadaEjercicios.series}, Repeticiones: {ej.RutinaPersonalizadaEjercicios.repeticiones}
                </li>
              ))
            ) : (
              <li className="list-group-item">No hay ejercicios asignados</li>
            )}
          </ul>
        </div>
      </div>
      
      {/* Modal para el video */}
      {videoUrl && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setVideoUrl(null)}
        >
          <div
            style={{
              position: "relative",
              width: "80%",
              maxWidth: "800px",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
            onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic en el video
          >
            <button
              onClick={() => setVideoUrl(null)}
              style={{ position: "absolute", top: 10, right: 10, fontSize: "16px", cursor: "pointer" }}
            >
              ❌
            </button>
            {extractYouTubeID(videoUrl) ? (
              <iframe
                width="100%"
                height="400px"
                src={`https://www.youtube.com/embed/${extractYouTubeID(videoUrl)}`}
                title="Ejercicio"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <p>⚠️ URL inválida. No se puede mostrar el video.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetallePersonalizado;