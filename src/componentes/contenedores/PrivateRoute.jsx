import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const autenticado = useSelector((state) => state.Autenticado);

  // Si el usuario no está autenticado, redirige a /login
  return autenticado ? <Outlet /> : <Navigate to="/login" />;
}
