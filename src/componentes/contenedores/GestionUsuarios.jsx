import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUser, deleteUser } from '../../redux/actions'; // Ajusta la ruta según tu estructura
import "./css/gestion-usuarios.css"

const GestionUsuarios = () => {
  const dispatch = useDispatch();
  
  // Suponemos que el estado de usuarios está en state.user, con propiedades: Usuarios, loading, error
  const  usuariosAndAdmin = useSelector((state) => state.Usuarios);
  const usuarios=usuariosAndAdmin.filter((prop)=>
    prop.super_admin===false
  )
  useEffect(() => {
      dispatch(getUser());
    }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      dispatch(deleteUser(id));
    }
  };
  return (
    <div className="container contain-all-guser">
      <h2 className="mb-4 h2-gestion_usuarios">Gestión de Usuarios</h2>
      <div className="mb-3">
        <Link to="/admin/usuarios/nuevo" className="btn btn-success">
          Crear Nuevo Usuario
        </Link>
      </div>
      
      {!usuarios ? (
        <p>Cargando usuarios...</p>
      
      ) : (
        <div className="row">
          {usuarios && usuarios.map((usuario) => (
            <div key={usuario.id} className="mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{usuario.nombre}</h5>
                  <p className="card-text">{usuario.email}</p>
                  {/* Puedes agregar más datos, por ejemplo, si es admin */}
                  {usuario.admin && <p className="text-info">Administrador</p>}
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(usuario.id)}
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;
