import axios from 'axios'
export const GET_USER ="GET_USER"
export const DELETE_USER ="DELETE_USER"
export const GET_EJERCICIO ="GET_EJERCICIO"
export const DELETE_EJERCICIO ="DELETE_EJERCICIO"
export const GET_RUTINAPER ="GET_RUTINAPER"
export const GET_RUTINAPERUSERID ="GET_RUTINAPERUSERID"
export const GET_RUTINAPERID ="GET_RUTINAPERID"
export const DELETE_RUTINAPER ="DELETE_RUTINAPER"
export const DELETE_EJER_RUTINAPER ="DELETE_EJER_RUTINAPER"
export const GET_RUTINAPREDEFINIDA ="GET_RUTINAPREDEFINIDA"
export const GET_RUTINAPREDEFINIDAID ="GET_RUTINAPREDEFINIDAID"
export const DELETE_RUTINAPREDEFINIDA ="DELETE_RUTINAPREDEFINIDA"
export const DELETE_EJERCICIO_RUTINAPREDEFINIDA ="DELETE_EJERCICIO_RUTINAPREDEFINIDA"

export const LOGOUT = "LOGOUT";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const GET_MUSCULOS = "GET_MUSCULOS";
export const DELETE_MUSCULOS_RUTINAPER = "DELETE_MUSCULOS_RUTINAPER";

//ACTIONS CREATORS
const link="https://backgon.onrender.com"
export const login = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${link}/login`, { email, password });

    const { token, usuario } = response.data;

    // Guardar token en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    dispatch({ type: LOGIN_SUCCESS, payload: usuario });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    alert("Usuario o Contraseña incorrectos")
  }
};

// Acción de logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  return { type: LOGOUT };
};
export function getUser() {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${link}/Usuario`); 
      dispatch({ type: GET_USER, payload: response.data });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };
}
export function postUser(user) {
  return async function (dispatch) {
    try {
      const {data} =  await axios.post(`${link}/Usuario`,user); 
      return data;
    } catch (error) {
      console.error("Error al subir usuario:", error);
      return false;
    }
  };
}
export function deleteUser(id) {
  return async function (dispatch) {
    try {
      await axios.delete(`${link}/Usuario/${id}`); 
      dispatch({ type: DELETE_USER, payload: id });
    } catch (error) {
      console.error("Error al eliminar usuarios:", error);
    }
  };
}
export function getEjercicio() {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${link}/Ejercicio`); 
      dispatch({ type: GET_EJERCICIO, payload: response.data });
    } catch (error) {
      console.error("Error al obtener ejercicio:", error);
    }
  };
}
export function postEjercicio(ejercicio) {
  return async function (dispatch) {
    try {
      const {data} =  await axios.post(`${link}/Ejercicio`,ejercicio); 
      return data;
    } catch (error) {
      console.error("Error al subir ejercicio:", error);
    }
  };
}
export function updateEjercicio(id,ejercicio) {
  return async function (dispatch) {
    try {
      const {data} =  await axios.put(`${link}/Ejercicio/${id}`,ejercicio); 
      return data;
    } catch (error) {
      console.error("Error al subir ejercicio:", error);
    }
  };
}
export function deleteEjericio(id) {
  return async function (dispatch) {
    try {
      await axios.delete(`${link}/Ejercicio/${id}`); 
      dispatch({ type: DELETE_EJERCICIO, payload: id });
    } catch (error) {
      console.error("Error al eliminar ejercicio:", error);
    }
  };
}
export function getRutinaper() {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${link}/RutinaPersonalizada`); 
      dispatch({ type: GET_RUTINAPER, payload: response.data });
    } catch (error) {
      console.error("Error al obtener rutina:", error);
    }
  };
}
export function getRutinaperUser(usuarioId) {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${link}/RutinaPersonalizada/${usuarioId}`); 
      dispatch({ type: GET_RUTINAPERUSERID, payload: response.data });
    } catch (error) {
      console.error("Error al obtener rutina de usuario:", error);
    }
  };
}
export function getRutinaPersonalizadaById(id) {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${link}/RutinaPersonalizada/rutina/${id}`); 
      dispatch({ type: GET_RUTINAPERID, payload: response.data });
    } catch (error) {
      console.error("Error al obtener rutina de usuario:", error);
    }
  };
}
export function postRutinaper(rutinaper) {
  return async function (dispatch) {
    try {
      console.log(rutinaper)
      const {data} =  await axios.post(`${link}/RutinaPersonalizada`,rutinaper); 
      console.log(data)
      return data;
    } catch (error) {
      console.error("Error al subir rutina personalizada:", error);
    }
  };
}
export function agregarEjercicioARutinaPersonalizada(rutinaId,ejercicioId,body) {
  return async function (dispatch) {
    try {
      const {data} =  await axios.put(`${link}/RutinaPersonalizada/${rutinaId}/ejercicios/${ejercicioId}`,body); 
      return data;
    } catch (error) {
      console.error("Error al subir rutina:", error);
    }
  };
}

export function deleteRutinaper(id) {
  return async function (dispatch) {
    try {
      let response = await axios.delete(`${link}/RutinaPersonalizada/${id}`); 
      dispatch({ type: DELETE_RUTINAPER, payload: response.data });
    } catch (error) {
      console.error("Error al eliminar rutina:", error);
    }
  };
}
export function deleteEjercicioRutinaper(rutinaId,ejercicioId) {
  return async function (dispatch) {
    try {
      let response = await axios.delete(`${link}/RutinaPersonalizada/${rutinaId}/ejercicios/${ejercicioId}`); 
      dispatch({ type: DELETE_EJER_RUTINAPER, payload: response.data });
    } catch (error) {
      console.error("Error al eliminar rutina:", error);
    }
  };
}
export function getRutinaPredefinida() {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${link}/RutinaPredefinida`); 
      dispatch({ type: GET_RUTINAPREDEFINIDA, payload: response.data });
    } catch (error) {
      console.error("Error al obtener rutina:", error);
    }
  };
}
export function getRutinaPredefinidaById(id) {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${link}/RutinaPredefinida/${id}`); 
      dispatch({ type: GET_RUTINAPREDEFINIDAID, payload: response.data });
    } catch (error) {
      console.error("Error al obtener rutina:", error);
    }
  };
}
export function postRutinaPredefinida(rutina) {
  return async function (dispatch) {
    try {
      const {data} =  await axios.post(`${link}/RutinaPredefinida`,rutina); 
      return data;
    } catch (error) {
      console.error("Error al subir rutina personalizada:", error);
    }
  };
}
export function agregarEjercicioARutinaPredefinida(rutinaId,ejercicioId,series) {
  return async function (dispatch) {
    try {
      const {data} =  await axios.put(`${link}/RutinaPredefinida/${rutinaId}/ejercicios/${ejercicioId}`,series); 
      return data;
    } catch (error) {
      console.error("Error al subir rutina:", error);
    }
  };
}
export function deleteRutinaPredefinida(id) {
  return async function (dispatch) {
    try {
      let response = await axios.delete(`${link}/RutinaPredefinida/${id}`); 
      dispatch({ type: DELETE_RUTINAPREDEFINIDA, payload: response.data });
    } catch (error) {
      console.error("Error al eliminar rutina:", error);
    }
  };
}
export function deleteEjercicioRutinaPredefinida(rutinaId,ejercicioId) {
  return async function (dispatch) {
    try {
      let response = await axios.delete(`${link}/RutinaPredefinida/${rutinaId}/ejercicios/${ejercicioId}`); 
      dispatch({ type: DELETE_EJERCICIO_RUTINAPREDEFINIDA, payload: response.data });
    } catch (error) {
      console.error("Error al eliminar rutina:", error);
    }
  };
}export function deleteMusculoRutinaPredefinida(rutinaId,musculoId) {
  return async function (dispatch) {
    try {
      let response = await axios.delete(`${link}/RutinaPredefinida/${rutinaId}/musculo/${musculoId}`); 
      dispatch({ type: DELETE_MUSCULOS_RUTINAPER, payload: response.data });
    } catch (error) {
      console.error("Error al eliminar rutina:", error);
    }
  };
}
export function agregarMusculoARutinaPredefinida(rutinaId,musculoId) {
  return async function (dispatch) {
    try {
      const {data} =  await axios.put(`${link}/RutinaPredefinida/${rutinaId}/musculo/${musculoId}`); 
      return data;
    } catch (error) {
      console.error("Error al subir rutina:", error);
    }
  };
}
export function ModificarRutinaPredefinida(rutinaId,rutina) {
  return async function (dispatch) {
    try {
      const {data} =  await axios.put(`${link}/RutinaPredefinida/${rutinaId}/musculo/`,rutina); 
      return data;
    } catch (error) {
      console.error("Error al subir rutina:", error);
    }
  };
}
export function ModificarRutinaPersonalizada(rutinaId,rutina) {
  return async function (dispatch) {
    try {
      const {data} =  await axios.put(`${link}/RutinaPersonalizada/${rutinaId}/musculo/`,rutina); 
      return data;
    } catch (error) {
      console.error("Error al subir rutina:", error);
    }
  };
}
export function getMusculo() {
  return async function (dispatch) {
    try {
      let response = await axios.get(`${link}/Musculos`); 
      dispatch({ type: GET_MUSCULOS, payload: response.data });
    } catch (error) {
      console.error("Error al obtener ejercicio:", error);
    }
  };
}
