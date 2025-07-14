import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getRutinaPredefinida, getMusculo } from "../../redux/actions"; // Asegúrate de la ruta correcta
import "./css/rutina-general.css";


const GeneralRoutines = () => {
  const rutinas = useSelector((state) => state.Rutinasgenerales || []);
  const musculos = useSelector((state) => state.Musculos || []);
  const dispatch = useDispatch();
  const [filtroDificultad, setFiltroDificultad] = useState("Todas");
  const [filtroMusculo, setFiltroMusculo] = useState("Todos");

  useEffect(() => {
    dispatch(getRutinaPredefinida());
    dispatch(getMusculo());
  }, [dispatch]);

  const handleFiltroDificultadChange = (e) => {
    setFiltroDificultad(e.target.value);
  };

  const handleFiltroMusculoChange = (e) => {
    setFiltroMusculo(e.target.value);
  };

  const rutinasFiltradas = rutinas.filter((rutina) => {
    const coincideDificultad = filtroDificultad === "Todas" || rutina.nivel_dificultad === filtroDificultad;
    const coincideMusculo =
      filtroMusculo === "Todos" || (rutina.Musculos && rutina.Musculos.some((musculo) => musculo.nombre === filtroMusculo));
    return coincideDificultad && coincideMusculo;
  });

  return (
    <div className="container contain-all-general">
      <h2 className="text-center h2-rutina_general">Rutinas Generales</h2>
      
      {/* Contenedor de filtros */}
      <div className="d-flex justify-content-center mb-3 contenedor-label">

          <label className="me-2 label-filtro">Dificultad:</label>
          <select value={filtroDificultad} onChange={handleFiltroDificultadChange} className="form-select d-inline">
            <option value="Todas">Todas</option>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>

          <label className="me-2 label-filtro" >Músculo:</label>
          <select value={filtroMusculo} onChange={handleFiltroMusculoChange} className="form-select d-inline">
            <option value="Todos">Todos</option>
            {musculos.map((musculo) => (
              <option key={musculo.id} value={musculo.nombre}>{musculo.nombre}</option>
            ))}
          </select>

      </div>
      
      
      <div id="rutinas-container">
        {rutinasFiltradas.map((rutina, index) => (
          <div key={index}> 
            <Link className= " link-carta_general" to={`/detalle/${rutina.id}`} >
              <div className="carta-general">
                <img
                  src={rutina.imagen_url}
                  alt="Imagen de entrenamiento"
                  className="card-img-top"
                  style={{ width: "100%", height: "200px", marginTop: "9px" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title h5-carta_general">{rutina.nombre}</h5>
                  <p className="card-text">{rutina.descripcion}</p>
                  <p className="card-text"><strong>Dificultad:</strong> {rutina.nivel_dificultad}</p>
                  Ver Detalles
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralRoutines;