import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  getRutinaPersonalizadaById,
  getEjercicio,
  deleteEjercicioRutinaper,
  agregarEjercicioARutinaPersonalizada,
  ModificarRutinaPersonalizada,
} from "../../redux/actions";

import "./css/editar-rutina-personal.css"

const EditarRutinaPersonalizada = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const rutina = useSelector((state) => state.RutinasPersonalizadasid);
  const availableExercises = useSelector((state) => state.Ejercicios);

  const [editando, setEditando] = useState(false);
  const [nombreEditado, setNombreEditado] = useState("");
  const [descripcionEditada, setDescripcionEditada] = useState("");
  const [diaEditado, setDiaEditado] = useState("");
  const [imagenEditada, setImagenEditada] = useState("");
  const [hayCambios, setHayCambios] = useState(false);

  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [series, setSeries] = useState("");
  const [repeticiones, setRepeticiones] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getRutinaPersonalizadaById(id));
      dispatch(getEjercicio());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (rutina) {
      setNombreEditado(rutina.nombre || "");
      setDescripcionEditada(rutina.descripcion || "");
      setDiaEditado(rutina.dia || "");
      setImagenEditada(rutina.imagen_url || "");
    }
  }, [rutina]);

  const handleChangeNombre = (e) => {
    setNombreEditado(e.target.value);
    setHayCambios(true);
  };

  const handleChangeDescripcion = (e) => {
    setDescripcionEditada(e.target.value);
    setHayCambios(true);
  };

  const handleChangeDia = (e) => {
    setDiaEditado(e.target.value);
    setHayCambios(true);
  };

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "Gym-gon");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/daqwbmkfa/image/upload",
          formData
        );
        const uploadedImageUrl = response.data.secure_url;
        setImagenEditada(uploadedImageUrl);
        setHayCambios(true);
      } catch (error) {
        console.error("Error al subir imagen a Cloudinary:", error);
        alert("Error al subir imagen. Intentalo de nuevo.");
      }
    }
  };

  const handleGuardarCambios = async () => {
    const body = {
      Nombre: nombreEditado,
      Descripcion: descripcionEditada,
      imagen: imagenEditada,
      dia: diaEditado,
    };
    await dispatch(ModificarRutinaPersonalizada(id, body));
    dispatch(getRutinaPersonalizadaById(id));
    setEditando(false);
    setHayCambios(false);
  };

  const handleRemoveExercise = (exerciseId) => {
    if (window.confirm("¿Estás seguro de eliminar este ejercicio de la rutina?")) {
      dispatch(deleteEjercicioRutinaper(id, exerciseId));
    }
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (selectedExerciseId && series && repeticiones) {
      const body = {
        series,
        repeticiones,
      };
      dispatch(agregarEjercicioARutinaPersonalizada(id, selectedExerciseId, body));
      setSelectedExerciseId("");
      setSeries("");
      setRepeticiones("");
      window.location.reload();
    }
  };

  return (
    <div className="container contain-all-edit">
      {!rutina ? (
        <p>Cargando rutina...</p>
      ) : (
        <>
          <h2 className="d-flex align-items-center gap-2 text-editar-rutPers">
            Editar Ejercicios de la Rutina
            {hayCambios && (
              <button className="btn btn-success btn-sm ms-3" onClick={handleGuardarCambios}>
                Guardar cambios
              </button>
            )}
          </h2>

          {editando ? (
            <>
              <input
                className="form-control mb-2"
                value={nombreEditado}
                onChange={handleChangeNombre}
                placeholder="Nombre"
              />
              <textarea
                className="form-control mb-2"
                value={descripcionEditada}
                onChange={handleChangeDescripcion}
                placeholder="Descripción"
              />
              <select
  className="form-select mb-2"
  value={diaEditado}
  onChange={handleChangeDia}
  required
>
  <option value="">Seleccioná un día</option>
  <option value="Lunes">Lunes</option>
  <option value="Martes">Martes</option>
  <option value="Miércoles">Miércoles</option>
  <option value="Jueves">Jueves</option>
  <option value="Viernes">Viernes</option>
  <option value="Sábado">Sábado</option>
  <option value="Domingo">Domingo</option>
</select>
              <input
                className="form-control mb-2"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <img
                src={imagenEditada}
                alt="Previsualización"
                style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
              />
            </>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="text-editar-rutPers">{rutina.nombre}</h3>
                <button
                  className="btn btn-outline-secondary btn-sm btn-edit-rutPers"
                  onClick={() => setEditando(true)}
                >
                  ✏️ Editar
                </button>
              </div>
              <p className="text-editar-rutPers"><strong>Descripción:</strong> {rutina.descripcion}</p>
              <p className="text-editar-rutPers"><strong>Día:</strong> {rutina.dia}</p>
              <img
                src={rutina.imagen_url}
                alt="Previsualización"
                style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
              />
            </>
          )}

          <hr />
          <h3 className="text-editar-rutPers">Ejercicios Actuales</h3>
          {rutina.Ejercicios && rutina.Ejercicios.length > 0 ? (
            <ul className="list-group mb-3 ul-edit">
              {rutina.Ejercicios.map((ex) => (
                <li
                  key={ex.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{ex.nombre}</strong> — Series: {ex.RutinaPersonalizadaEjercicios.series}, Repeticiones: {ex.RutinaPersonalizadaEjercicios.repeticiones}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveExercise(ex.id)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay ejercicios en esta rutina.</p>
          )}

          <hr />
          <h3 className="text-editar-rutPers">Agregar Nuevo Ejercicio</h3>
          <form className="form-edit" onSubmit={handleAddExercise}>
            <div className="mb-3">
              <label htmlFor="exerciseSelect" className="form-label text-editar-rutPers">Ejercicio</label>
              <select
                id="exerciseSelect"
                className="form-select"
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                required
              >
                <option value="">Seleccione un ejercicio</option>
                {availableExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="series" className="form-label text-editar-rutPers">Series</label>
              <input
                type="number"
                id="series"
                className="form-control"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="repeticiones" className="form-label text-editar-rutPers">Repeticiones</label>
              <input
                type="text"
                id="repeticiones"
                className="form-control"
                value={repeticiones}
                onChange={(e) => setRepeticiones(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Agregar Ejercicio</button>
          </form>
        </>
      )}
    </div>
  );
};

export default EditarRutinaPersonalizada;
