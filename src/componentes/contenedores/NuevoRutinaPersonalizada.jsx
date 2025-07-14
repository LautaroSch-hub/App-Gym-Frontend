import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Axios from "axios";
import { postRutinaper } from "../../redux/actions"; // Ajusta la ruta correcta

import "./css/nueva-rutina-pers.css"

const NuevoRutinaPersonalizada = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Obtener el usuarioId del query string (por ejemplo: ?userId=123)
  const [searchParams] = useSearchParams();
  const usuarioId = searchParams.get("userId");

  // Estados controlados para el formulario
  const [nombre, setNombre] = useState("");
  const [dia, setDia] = useState("Lunes"); // Valor por defecto
  const [descripcion, setDescripcion] = useState("");

  // Estados para la imagen
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Opciones para el select del día
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Manejar selección de archivo y previsualización
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

  // Permite eliminar la imagen seleccionada
  const handleDeleteImage = (e) => {
    e.preventDefault();
    setSelectedFile(null);
    setPreviewImage(null);
  };

  // Al enviar el formulario, sube la imagen (si se seleccionó) y crea la rutina
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuarioId) {
      alert("No se encontró el ID de usuario. No se puede crear la rutina.");
      return;
    }

    let uploadedImageUrl = "";
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
        return;
      }
    }

    const nuevaRutina = {
      nombre,
      dia,
      descripcion,
      imagen_url: uploadedImageUrl,
      usuarioId, // Asigna la rutina al usuario seleccionado
    };

    try {
      const actionResult = await dispatch(postRutinaper(nuevaRutina));
      console.log("Resultado de la acción:", actionResult);
      // Verifica que el payload y el id existan
      if (actionResult  && actionResult.id) {
        const nuevaRutinaId = actionResult.id;
        // Redirige a la página de edición de la rutina creada
        navigate(`/admin/rutinas-personalizadas/editar/${nuevaRutinaId}`);
      } else {
        console.error("No se recibió el id de la nueva rutina.");
      }
    } catch (error) {
      console.error("Error al crear la rutina personalizada:", error);
    }
  };

  return (
    <div className="contenedor-form_newRutine_pers">
      <form onSubmit={handleSubmit}>
        <fieldset className="field-newRutine_pers">
          <legend className="legend-field_pers">Crear Nueva Rutina Personalizada</legend>
          <div className="mb-3">
          <label htmlFor="nombre" className="form-label_pers"></label>
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
          <label htmlFor="descripcion" className="form-label_pers"></label>
          <textarea
            id="descripcion"
            className="form-control"
            placeholder="Descripción de la rutina..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="dia" className="form-label_pers">Día</label>
          <select
            id="dia"
            className="form-select"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            required
          >
            {diasSemana.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        {/* Se elimina el input de texto para la URL */}
        <div className="mb-3">
          <label className="form-label_pers">Imagen</label>
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
                  marginTop: "9px",
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
          Crear Rutina Personalizada
        </button>
        </fieldset>
      </form>
    </div>
  );
};

export default NuevoRutinaPersonalizada;
