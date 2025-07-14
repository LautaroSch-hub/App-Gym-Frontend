import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Error from "./Error"
export default function PrivateRoute() {
  const Admin = useSelector((state) => state.Usuario.admin);
  // Si el usuario no está autenticado, redirige a /login
  return Admin ? <Outlet /> : <Error/>;
}
