import React,{useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import { getRutinaperUser } from "../../redux/actions"; // Asegúrate de la ruta correcta
import CajaRutinaPer from "../dumbs/CajaRutinaPer"

import "./css/rutina-Personal.css";
import { Link } from "react-router-dom";
const GeneralRoutines = () => {
  // Extraemos las rutinas generales desde el estado de Redux
  const rutinas = useSelector((state) => state.RutinasPersonalizadas);
  const usuario = useSelector((state) => state.Usuario);

  const dispatch = useDispatch();
  const userId = usuario?.id;

  useEffect(() => {
    if (userId) {
      dispatch(getRutinaperUser(userId)); // Llama a la acción cuando userId esté disponible
    }
  }, [dispatch, userId]);

  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  return (
    <div className="container contain-all-prs">
    <h2 className="text-center h2-rutina_personal">Rutinas Personalizadas</h2>
    <div className="contenedor-semana">

    {daysOfWeek.map((day) => {
      const routinesForDay = rutinas.filter((rutina) => rutina.dia === day);
      
      return (
        <div key={day} className="contenedor-dia">
          <h3 className="h3-dia_personal">{day}</h3>

          {routinesForDay.length > 0 ? (
            <div className="fila-horizontal">
              {routinesForDay.map((rutina) => (
                <div key={rutina.id} className="celda-rutina contenedor-rutina_personal">
                  <Link
                to={`/rutina/${rutina.id}`}
                className="btn btn-primary link-carta_personal">
                Ver Rutina Completa
                  <CajaRutinaPer
                    id={rutina.id}
                    nombre={rutina.nombre}
                    descripcion={rutina.descripcion}
                    imagen_url={rutina.imagen_url}
                    dia={rutina.dia}
                    />
                    </Link>
                </div>
                
              ))}
            </div>
          ) : (
            <p>No hay rutinas para este día.</p>
          )}
        </div>
      );
    })}
  </div>
    </div>
);
};

export default GeneralRoutines;
