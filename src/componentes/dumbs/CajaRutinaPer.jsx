import React from "react";
import "./css/caja-rutina.css";

export default function CajaRutinaPer({ id, nombre, descripcion, imagen_url, dia }) {
  return (
    <div className="card mb-4 caja-rutina">
      <img
        src={imagen_url}
        alt={`Imagen de ${nombre}`}
        className="card-img-top"
        style={{
          width: "100%",
          height: "200px",
          marginTop: "9px",
        }}
      />
      <div className="card-body text-center">
        <h5 className="card-title">{nombre}</h5>
      </div>
    </div>
  );
}
