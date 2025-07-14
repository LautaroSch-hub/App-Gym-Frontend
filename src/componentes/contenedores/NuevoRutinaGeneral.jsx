import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { postRutinaPredefinida } from "../../redux/actions"; // Asegúrate de la ruta correcta

import "./css/nueva-rutina-general.css"

const NuevoRutinaGeneral = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estados controlados para el formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivelDificultad, setNivelDificultad] = useState("principiante");

  // Estados para la imagen
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Manejar la selección del archivo y generar previsualización
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para eliminar la imagen seleccionada
  const handleDeleteImage = (e) => {
    e.preventDefault();
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedImageUrl = "";

    // Si se seleccionó un archivo, se sube a Cloudinary
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "App.gym"); // Reemplaza por tu preset de Cloudinary

      try {
        const response = await Axios.post(
          "https://api.cloudinary.com/v1_1/dj8byz5uz/image/upload",
          formData
        );
        uploadedImageUrl = response.data.secure_url;
      } catch (error) {
        console.error("Error al subir imagen a Cloudinary:", error);
        return; // Puedes mostrar un mensaje de error y detener el envío
      }
    }

    // Crear la nueva rutina incluyendo la URL devuelta por Cloudinary
    const newRutina = { 
      nombre, 
      descripcion, 
      imagen_url: uploadedImageUrl, 
      nivel_dificultad: nivelDificultad 
    };

    try {
      const actionResult = await dispatch(postRutinaPredefinida(newRutina));
      // Se asume que la acción retorna un objeto con payload que contiene el id de la rutina creada
      const newRutinaId = actionResult.id;
      navigate(`/admin/rutinas-generales/editar/${newRutinaId}`);
    } catch (error) {
      console.error("Error al crear la rutina:", error);
      // Opcional: mostrar mensaje de error al usuario
    }
  };

  return (
    <div className="contenedor-form_newRutine_general">
      <form onSubmit={handleSubmit}>
        <fieldset className="field-newRutine_general">
          <legend className="legend-field_general">Crear Nueva Rutina General</legend>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label form-label_general">
            </label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              placeholder="Nombre de la rutina"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label form-label_general">
            </label>
            <textarea
              id="descripcion"
              className="form-control"
              placeholder="Descripcion de la rutina..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="nivel_dificultad" className="form-label form-label_general">
              Nivel de Dificultad
            </label>
            <select
              id="nivel_dificultad"
              className="form-select"
              value={nivelDificultad}
              onChange={(e) => setNivelDificultad(e.target.value)}
              required
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label form-label_general">Imagen:</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />
            {previewImage && (
              <div className="mt-2 position-relative">
                <img
                  src={previewImage}
                  alt="Previsualización"
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
                <button
                  className="btn btn-danger position-absolute"
                  style={{ top: "5px", right: "5px" }}
                  onClick={handleDeleteImage}
                >
                  X
                </button>
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Crear Rutina
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default NuevoRutinaGeneral;
