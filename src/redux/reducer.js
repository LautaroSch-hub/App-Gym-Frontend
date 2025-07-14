import {GET_MUSCULOS,DELETE_MUSCULOS_RUTINAPER,GET_RUTINAPERID,LOGIN_SUCCESS,LOGOUT,GET_RUTINAPREDEFINIDAID, GET_USER,DELETE_USER,GET_EJERCICIO,DELETE_EJERCICIO,GET_RUTINAPERUSERID,DELETE_RUTINAPER,DELETE_EJER_RUTINAPER,GET_RUTINAPREDEFINIDA,DELETE_RUTINAPREDEFINIDA,DELETE_EJERCICIO_RUTINAPREDEFINIDA} from "./actions";
// estado inicial
let initialState = {
  Usuario: JSON.parse(localStorage.getItem("usuario")) || null,
  Autenticado: !!localStorage.getItem("token"),
  Usuarios: [],
  Ejercicios:[],
  Musculos:[],
  RutinasPersonalizadas: [],
  RutinasPersonalizadasid: [],
  Rutinasgenerales: [],
  Rutinasgeneralesid: [],
};

// export un reducer que tenga logica para las actions

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, Usuario: action.payload, Autenticado: true };
      case LOGOUT:
      return { ...state, usuario: null, autenticado: false};
    case GET_USER:
      return {
        ...state,
        Usuarios: action.payload,
      };
    case DELETE_USER:
      return {
        ...state,
        Usuarios: state.Usuarios.filter((elemento) => {
          return elemento.id !== action.payload;
        }),
      };
      case GET_EJERCICIO:
      return {
        ...state,
        Ejercicios: action.payload,
      };
      case GET_MUSCULOS:
      return {
        ...state,
        Musculos: action.payload,
      };
      case DELETE_MUSCULOS_RUTINAPER:
      return {
        ...state,
        Rutinasgenerales: state.Rutinasgenerales.map(rutina => 
          rutina.id === action.payload.rutinaId
            ? { 
                ...rutina, 
                musculo: rutina.musculos.filter(ej => ej.id !== action.payload.musculoId) 
              }
            : rutina
        ),
      };
      case DELETE_EJERCICIO:
      return {
        ...state,
        Ejercicios: state.Ejercicios.filter((elemento) => {
          return elemento.id !== action.payload;
        }),
      };
      case GET_RUTINAPERUSERID:
        return {
          ...state,
          RutinasPersonalizadas: action.payload,
        };
      case GET_RUTINAPERID:
        return{
          ...state,
          RutinasPersonalizadasid:action.payload
        }
        case DELETE_RUTINAPER:
      return {
        ...state,
        RutinasPersonalizadas: state.RutinasPersonalizadas.filter(rutina => rutina.id !== action.payload),
      };

    case DELETE_EJER_RUTINAPER:
      return {
        ...state,
        RutinasPersonalizadas: state.RutinasPersonalizadas.map(rutina => 
          rutina.id === action.payload.rutinaId
            ? { 
                ...rutina, 
                ejercicios: rutina.ejercicios.filter(ej => ej.id !== action.payload.ejercicioId) 
              }
            : rutina
        ),
      };
      case GET_RUTINAPREDEFINIDA:
        return {
          ...state,
          Rutinasgenerales: action.payload,
        };
        case GET_RUTINAPREDEFINIDAID:
          return {
            ...state,
            Rutinasgeneralesid: action.payload,
          };
        case DELETE_RUTINAPREDEFINIDA:
      return {
        ...state,
        Rutinasgenerales: state.Rutinasgenerales.filter(rutina => rutina.id !== action.payload),
      };
      
    case DELETE_EJERCICIO_RUTINAPREDEFINIDA:
      return {
        ...state,
        Rutinasgenerales: state.Rutinasgenerales.map(rutina => 
          rutina.id === action.payload.rutinaId
            ? { 
                ...rutina, 
                ejercicios: rutina.ejercicios.filter(ej => ej.id !== action.payload.ejercicioId) 
              }
            : rutina
        ),
      };
    default:
      return { ...state };
  }
}
