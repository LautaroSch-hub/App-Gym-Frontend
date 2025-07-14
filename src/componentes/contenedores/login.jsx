import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions";
import {  Navigate  } from "react-router-dom";
import "./css/login.css"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const autenticado = useSelector((state) => state.Autenticado);
    const dispatch = useDispatch();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(login(email, password));
    };
  
    // Si ya está autenticado, redirige al usuario a la ruta protegida
    if (autenticado) {
      return <Navigate to="/" />;
    }
    //cambié el div por un fieldset, le agregue un legend en lugar de un h2 y abajo el h3 para no dejar tanto espacio vacio
    return (
      <fieldset className= "fieldset-login"> 
        <legend className="legend-login">Iniciar Sesion</legend>
        <h3 className= "h3-login">Ingresa Tus Datos</h3>
        <form className= "login__form" onSubmit={handleSubmit}>
          <input
            className="input-login"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input-login"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className= "login__button btn btn-primary input-login">Ingresar</button>
        </form>
      </fieldset>
    );
  }
  
  export default Login;
