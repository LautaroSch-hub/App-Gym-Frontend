import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEjercicio } from "../../redux/actions"; // Asegúrate de la ruta correcta
function Index() {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.Usuario); // Accede a la lista de usuarios
  
  useEffect(() => {
    dispatch(getEjercicio()); // Llama a la acción al montar el componente
  }, [dispatch]);

  return (
    <div>
      <h2>Usuario:</h2>
      {usuario ? (
        <h3 id={usuario.id}> {usuario.nombre} 
        <br></br>Email: {usuario.email}</h3>
      ) : (
        <p>Cargando usuario...</p>

      )}
    </div>
  );
}

export default Index;
