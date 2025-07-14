import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/actions";
import "./css/nav.css"
//para el lau>rodri
const NavBar = () => {
  const dispatch = useDispatch();
  const usuario= useSelector((state) => state.Usuario);
  const autenticado = useSelector((state) => state.Autenticado);

  return (
    <nav>
        {autenticado ? (
          <>
            <button className="nav__button initial">
              <Link to="/">Pagina Principal</Link>
              </button> 
            <button className="nav__button rutine">
              <Link to="/mirutina">Mi Rutina</Link>
              </button>
              {usuario.admin ?(<button className="nav__button admin"><Link to="/admin">Admin Dashboard</Link></button>):null }
            <button className="nav__button log-out" onClick={() => {dispatch(logout());window.location.reload();}}>Cerrar Sesión</button>
          </>
        ) : (<></>
        )}
      
    </nav>
  );
};

export default NavBar;
