import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postUser } from "../../redux/actions"; // Asegúrate de ajustar la ruta
import "./css/nuevo-usuario.css";

const NuevoUsuario = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estado controlado para cada campo
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);

  const  handleSubmit =async  (e) => {
    e.preventDefault();
    // Preparar los datos del nuevo usuario
    const newUser = {
        "nombre":nombre,
        "email": email,
        "contraseña_hash": password,
        "admin":admin
    }
    var a =await dispatch(postUser(newUser,(response)=>{

      return response
      
    }));
    if(a)
      navigate("/admin/usuarios");
    else{
      alert("Error al subir el usuario, verificar que no tengas campos duplicados")
    }

    // Despachar la acción para crear el usuario
    // Redirigir a la gestión de usuarios después de crear el usuario
  };

  return (
    <div className="contenedor-form_newUser">
      <form onSubmit={handleSubmit}>
        <fieldset className="field-newUser">
          <legend className="legend-field_newUser">Crear Nuevo Usuario</legend>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label_newUser">
            </label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              placeholder="Nombre de usuario"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label_newUser">
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label_newUser">
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-check mb-3 form-admin_check contain-all">
            <label htmlFor="admin" className="form-check-label form-label_newUser">
              Administrador
            </label>
            <input
              type="checkbox"
              id="admin"
              className="form-check-input boton-admin"
              checked={admin}
              onChange={(e) => setAdmin(e.target.checked)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Crear Usuario
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default NuevoUsuario;
