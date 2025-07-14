import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateEjercicio } from "../../redux/actions";

import "./css/editar-ejercicio.css"

const EditarEjercicio = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Extraer el ejercicio del store
  const ejercicios = useSelector((state) => state.Ejercicios);
  const exerciseFromStore = ejercicios.find((ex) => ex.id === parseInt(id));

  // Estados locales para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen_url, setImagenUrl] = useState("");
  const [videoID, setVideoID] = useState(null);

  // Precargar los datos existentes al montar el componente
  useEffect(() => {
    if (exerciseFromStore) {
      setNombre(exerciseFromStore.nombre);
      setDescripcion(exerciseFromStore.descripcion);
      setImagenUrl(exerciseFromStore.imagen_url);
      extractYouTubeID(exerciseFromStore.imagen_url);
    }
  }, [exerciseFromStore]);

  // Función para extraer el ID del video de YouTube
  const extractYouTubeID = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.+\?v=)|youtu\.be\/)([^"&?/s]{11})/;
    const match = url.match(regex);
    setVideoID(match ? match[1] : null);
  };

  // Manejar cambios en la URL del video
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setImagenUrl(newUrl);
    extractYouTubeID(newUrl);
  };

  // Al enviar el formulario, se actualiza el ejercicio con la nueva URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedExercise = { nombre, descripcion, imagen_url };
    dispatch(updateEjercicio(id, updatedExercise));
    navigate("/admin/ejercicios");
  };

  return (
    <div className="container contain-all-prs">
      <h2 className="text-editar-ejercicio">Editar Ejercicio</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label text-editar-ejercicio">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label text-editar-ejercicio">
            Descripción
          </label>
          <textarea
            id="descripcion"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Campo para ingresar la URL del video */}
        <div className="mb-3">
          <label htmlFor="videoUrl" className="form-label text-editar-ejercicio">
            URL del Video
          </label>
          <input
            type="text"
            id="videoUrl"
            className="form-control"
            value={imagen_url}
            onChange={handleUrlChange}
            placeholder="Pega aquí la URL del video de YouTube"
            required
          />
        </div>

        {/* Previsualización del video */}
        {videoID ? (
          <div className="mb-3">
            <label className="form-label text-editar-ejercicio">Previsualización del Video:</label>
            <iframe
              width="100%"
              height="300px"
              src={`https://www.youtube.com/embed/${videoID}`}
              title="Previsualización del video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          imagen_url && (
            <p style={{ color: "red" }}>⚠️ URL inválida. Ingresa un enlace de YouTube válido.</p>
          )
        )}

        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditarEjercicio;
