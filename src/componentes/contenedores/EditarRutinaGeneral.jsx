// src/componentes/contenedores/EditarRutinaGeneral.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { useParams } from "react-router-dom";
import {
    getEjercicio,
    getMusculo,
    getRutinaPredefinidaById,
  deleteEjercicioRutinaPredefinida,
  deleteMusculoRutinaPredefinida,
  agregarEjercicioARutinaPredefinida,
  agregarMusculoARutinaPredefinida,
  ModificarRutinaPredefinida,
} from "../../redux/actions";

import "./css/editar-rutina-general.css"

const EditarRutinaGeneral = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [editando, setEditando] = useState(false);
  const [nombreEditado, setNombreEditado] = useState("");
  const [descripcionEditada, setDescripcionEditada] = useState("");
  const [imagenEditada, setImagenEditada] = useState("");
  const [hayCambios, setHayCambios] = useState(false);
  // Supongamos que el reducer de rutinas generales guarda la rutina seleccionada en 'rutina'
  const  rutina= useSelector((state) => state.Rutinasgeneralesid);
  const  musculo= useSelector((state) => state.Musculos);
  // Lista de todos los ejercicios disponibles (ya cargados, por ejemplo, en el reducer de ejercicios)
  const availableExercises = useSelector((state) => state.Ejercicios);
  // Estados para el formulario de agregar un nuevo ejercicio
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [selectedMusculoId, setSelectedMusculoId] = useState("");
  const [series, setSeries] = useState("");
  const [repeticiones, setRepeticiones] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getEjercicio());
      dispatch(getRutinaPredefinidaById(id));
      dispatch(getMusculo());
      
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (id) {
      dispatch(getEjercicio());
      dispatch(getRutinaPredefinidaById(id));
      dispatch(getMusculo());
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (rutina) {
      setNombreEditado(rutina.nombre || "");
      setDescripcionEditada(rutina.descripcion || "");
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

  const handleGuardarCambios = async () => {
    await dispatch(ModificarRutinaPredefinida(id, {
      Nombre: nombreEditado,
      Descripcion: descripcionEditada,
      imagen: imagenEditada,
    }));
    dispatch(getRutinaPredefinidaById(id));
    setEditando(false);
    setHayCambios(false);
  };
  const handleRemoveExercise = async (exerciseId) => {
    if (window.confirm("¿Eliminar este ejercicio de la rutina?")) {
      await dispatch(deleteEjercicioRutinaPredefinida(id, exerciseId));
      dispatch(getRutinaPredefinidaById(id));
    }
  };
  
  const handleRemoveMusculo = async (MusculoId) => {
    if (window.confirm("¿Eliminar este Musculo de la rutina?")) {
      await dispatch(deleteMusculoRutinaPredefinida(id, MusculoId));
      dispatch(getRutinaPredefinidaById(id));
    }
  };
/*
"rutinaId":
        "ejercicioId":
        "series":
        "repeticiones":
*/
const handleAddExercise = async (e) => {
  e.preventDefault();
  if (selectedExerciseId && series && repeticiones) {
    await dispatch(
      agregarEjercicioARutinaPredefinida(id, selectedExerciseId, {
        series,
        repeticiones,
      })
    );
    // Limpia los campos del formulario
    setSelectedExerciseId("");
    setSeries("");
    setRepeticiones("");
    // Volvés a cargar la rutina sin recargar toda la página
    dispatch(getRutinaPredefinidaById(id));
  }
};

const handleAddMusculo = async (e) => {
  e.preventDefault();
  if (selectedMusculoId) {
    await dispatch(agregarMusculoARutinaPredefinida(id, selectedMusculoId));
    setSelectedMusculoId("");
    dispatch(getRutinaPredefinidaById(id));
  }
};


  return (
    <div className="container contain-all-edit">
      <h2 className="d-flex align-items-center gap-2 text-editar-rutGener">
  Modificar Rutina General
  {hayCambios && (
    <button className="btn btn-success btn-sm" onClick={handleGuardarCambios}>
      Guardar cambios
    </button>
  )}
      </h2>
      {!rutina ? (
        <p>Cargando rutina...</p>
      ) : rutina ? (
        <>
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
    <input
      className="form-control mb-2"
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("upload_preset", "App.gym");

          try {
            const response = await Axios.post(
              "https://api.cloudinary.com/v1_1/dj8byz5uz/image/upload",
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
      }}
    />
    <img
      src={imagenEditada}
      alt="Previsualización"
      style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
    />
  </>
) : (
  <>
    <div className="d-flex justify-content-between align-items-center cont-h3-btnEdit">
      <h3 className="text-editar-rutGener">{rutina.nombre}</h3>
      <button className="btn btn-outline-secondary btn-sm btn-edit-rutGener" onClick={() => setEditando(true)}>
        ✏️ Editar
      </button>
    </div>
    <p className="text-editar-rutGener">{rutina.descripcion}</p>
    <img
      src={rutina.imagen_url}
      alt="Previsualización"
      style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
    />
  </>
)}

          <h4 className="text-editar-rutGener">Ejercicios de la rutina</h4>
          {rutina.Ejercicios && rutina.Ejercicios.length > 0 ? (
            <ul className="list-group mb-3 ul-edit">
              {rutina.Ejercicios.map((ex) => (
                <li key={ex.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{ex.nombre}</strong> — Series: {ex.RutinaPredefinidaEjercicios.series}, Repeticiones: {ex.RutinaPredefinidaEjercicios.repeticiones}
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveExercise(ex.id)}>
                    X
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay ejercicios en esta rutina.</p>
          )}
          <h4 className="text-editar-rutGener">Musuclos de la rutina</h4>
          {rutina.Musculos && rutina.Musculos.length > 0 ? (
            <ul className="list-group mb-3 ul-edit">
              {rutina.Musculos.map((ex) => (
                <li key={ex.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{ex.nombre}</strong>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveMusculo(ex.id)}>
                    X
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay Musculos vinculaods en esta rutina.</p>
          )}
          <h4 className="text-editar-rutGener">Agregar o Modificar un  ejercicio</h4>
          <form className="form-edit" onSubmit={handleAddExercise}>
            <div className="mb-3">
              <label htmlFor="exerciseSelect" className="form-label text-editar-rutGener">
                Ejercicio
              </label>
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
              <label htmlFor="series" className="form-label text-editar-rutGener">
                Series
              </label>
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
              <label htmlFor="repeticiones" className="form-label text-editar-rutGener">
                Repeticiones
              </label>
              <input
                type="text"
                id="repeticiones"
                className="form-control"
                value={repeticiones}
                onChange={(e) => setRepeticiones(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Agregar Ejercicio
            </button>
          </form>
          <h4 className="text-editar-rutGener">Agregar Grupo Muscular</h4>
          <form onSubmit={handleAddMusculo}>
            <div className="mb-">
              <label htmlFor="exerciseSelect" className="form-label text-editar-rutGener">
                Musculo
              </label>
              <select
                id="exerciseSelect"
                className="form-select "
                value={selectedMusculoId}
                onChange={(e) => setSelectedMusculoId(e.target.value)}
                required
              >
                <option value="">Seleccione un Grupo Muscular</option>
                {musculo.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Agregar Grupo Muscular a la rutina
            </button>
          </form>
        </>
      ) : (
        <p>No se encontró la rutina.</p>
      )}
    </div>
  );
};
export default EditarRutinaGeneral;
