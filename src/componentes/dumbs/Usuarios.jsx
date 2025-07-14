import React from "react";
import c from "./css/Countrys.module.css"
export default function Usuarios(props) {


  while (!props.Usuarios.length) {
    return(
      <div className={c.container} >
        <div className={c.spinner}  />
      </div>
    ) 
  }
  return (
    <div className={c.container} >

        <div className={c.cards}>
        {props.Usuarios.map((element) => (

          <div key={element.id}>
              nombre={element.nombre}
              email={element.email}
              id={element.id}
          </div>
        ))}
      </div>
    </div>
  );
}