import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postEjercicio } from "../../redux/actions";
import "./css/nuevo-ejercicio.css";

const NuevoEjercicio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [previewVideo, setPreviewVideo] = useState(null);

  // Función para extraer el ID del video de YouTube
  const extractYouTubeID = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.+\?v=)|youtu\.be\/)([^"&?/s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  
  // Manejo del cambio de input de YouTube
  const handleYouTubeChange = (e) => {
    const url = e.target.value;
    setYoutubeLink(url);
    
    // Extraer el ID del video y actualizar la previsualización
    const videoID = extractYouTubeID(url);
    if (videoID) {
      setPreviewVideo(`https://www.youtube.com/embed/${videoID}`);
    } else {
      setPreviewVideo(null);
    }
  };

  // Función para eliminar la previsualización del video
  const handleDeleteVideo = (e) => {
    e.preventDefault();
    setYoutubeLink("");
    setPreviewVideo(null);
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el link sea correcto
    const videoID = extractYouTubeID(youtubeLink);
    if (!videoID) {
      alert("Por favor, ingrese un enlace válido de YouTube.");
      return;
    }

    // Crear objeto con los datos
    const newExercise = {
      nombre,
      descripcion,
      imagen_url: youtubeLink, // Guardamos la URL completa del video
    };

    // Dispatch de la acción
    dispatch(postEjercicio(newExercise));
    for (let index = 0; index < 10; index++) {
      index=index+1;
      
    }
    navigate("/admin/ejercicios");
  };

  return (
    <div className="contenedor-form_newEjercicio">
      <form onSubmit={handleSubmit}>
        <fieldset className="field-newEjercicio">
          <legend className="legend-field_ejercicio">Crear Nuevo Ejercicio</legend>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label form-label_ejercicio">
            </label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              placeholder="Nombre de el ejercicio"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label form-label_ejercicio">
            </label>
            <textarea
              id="descripcion"
              className="form-control"
              placeholder="Descripcion del ejercicio..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Campo para el enlace de YouTube */}
          <div className="mb-3">
            <label htmlFor="youtube" className="form-label form-label_ejercicio">Enlace de YouTube:</label>
            <input
              type="text"
              id="youtube"
              className="form-control"
              value={youtubeLink}
              onChange={handleYouTubeChange}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>

          {/* Previsualización del video */}
          {previewVideo && (
            <div className="mt-3 position-relative">
              <iframe
                width="100%"
                height="400px"
                src={previewVideo}
                title="Vista previa del ejercicio"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button
                className="btn btn-danger position-absolute"
                style={{ top: "5px", right: "5px" }}
                onClick={handleDeleteVideo}
              >
                X
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            Crear Ejercicio
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default NuevoEjercicio;
