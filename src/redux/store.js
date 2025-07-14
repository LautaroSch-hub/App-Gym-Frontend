import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import reducer from "./reducer"; // Asegúrate de que el path es correcto

// Verifica si las DevTools están disponibles
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;