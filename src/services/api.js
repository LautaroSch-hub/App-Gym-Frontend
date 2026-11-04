import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'https://backgon.onrender.com';

const api = axios.create({ baseURL: API_URL });

// Manda el token en cada pedido.
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('gym_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export function limpiarSesion() {
  localStorage.removeItem('gym_token');
  localStorage.removeItem('gym_session');
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const code = err.response?.data?.code;
    const isLogin = err.config?.url === '/login';

    // Sesión vencida o token inválido: se cierra la sesión y se vuelve al login.
    if (status === 401 && !isLogin) {
      limpiarSesion();
      try {
        sessionStorage.setItem('gym_flash', err.response?.data?.error || 'Tu sesión venció. Volvé a ingresar.');
      } catch {
        /* sin sessionStorage */
      }
      window.location.assign('/login');
    }

    // Membresía vencida: la app muestra la pantalla de bloqueo.
    if (status === 403 && code === 'MEMBERSHIP_EXPIRED') {
      window.dispatchEvent(new Event('gym:membership-expired'));
    }
    return Promise.reject(err);
  }
);

export function errMsg(e) {
  const d = e?.response?.data;
  if (d?.error) return d.error;
  if (d?.message) return d.message;
  if (typeof d === 'string' && d.length < 200) return d;
  if (e?.code === 'ERR_NETWORK') return 'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.';
  return e?.message || 'Algo salió mal';
}

const get = (url) => api.get(url).then((r) => r.data);
const withUser = (base, usuarioId) => (usuarioId ? `${base}/usuario/${usuarioId}` : base);

export const auth = {
  me: () => get('/me'),
  changePassword: (actual, nueva) => api.put('/me/password', { actual, nueva }).then((r) => r.data),
};

export const usuarios = {
  list: () => get('/Usuario'),
  get: (id) => get(`/Usuario/${id}`),
  create: (data) => api.post('/Usuario', data).then((r) => r.data),
  update: (id, data) => api.put(`/Usuario/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/Usuario/${id}`),
  resetPassword: (id, nueva) => api.put(`/Usuario/${id}/password`, { nueva }).then((r) => r.data),
  renovar: (id, dias) => api.post(`/Usuario/${id}/renovar`, { dias }).then((r) => r.data),
  desactivar: (id) => api.post(`/Usuario/${id}/desactivar`).then((r) => r.data),
  renovaciones: (id) => get(`/Usuario/${id}/renovaciones`),
};

export const ejercicios = {
  list: () => get('/Ejercicio'),
  create: (data) => api.post('/Ejercicio', data).then((r) => r.data),
  update: (id, data) => api.put(`/Ejercicio/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/Ejercicio/${id}`),
};

export const musculos = {
  list: () => get('/Musculos'),
};

export const predef = {
  list: () => get('/RutinaPredefinida'),
  get: (id) => get(`/RutinaPredefinida/${id}`),
  create: (data) => api.post('/RutinaPredefinida', data).then((r) => r.data),
  // El back usa PUT /:id/musculo para editar los datos básicos de la rutina
  update: (id, data) => api.put(`/RutinaPredefinida/${id}/musculo`, data),
  remove: (id) => api.delete(`/RutinaPredefinida/${id}`),
  addEjercicio: (rid, eid, data) => api.put(`/RutinaPredefinida/${rid}/ejercicios/${eid}`, data),
  removeEjercicio: (rid, eid) => api.delete(`/RutinaPredefinida/${rid}/ejercicios/${eid}`),
  addMusculo: (rid, mid) => api.put(`/RutinaPredefinida/${rid}/musculo/${mid}`),
  removeMusculo: (rid, mid) => api.delete(`/RutinaPredefinida/${rid}/musculo/${mid}`),
  // ids: todos los ejercicios de la rutina, en el orden que se quiere
  reorder: (rid, ids) => api.put(`/RutinaPredefinida/${rid}/orden`, { ejercicios: ids }),
};

export const personal = {
  all: () => get('/RutinaPersonalizada'),
  byUser: (usuarioId) => get(`/RutinaPersonalizada/${usuarioId}`),
  get: (id) => get(`/RutinaPersonalizada/rutina/${id}`),
  create: (data) => api.post('/RutinaPersonalizada', data).then((r) => r.data),
  update: (id, data) => api.put(`/RutinaPersonalizada/${id}/musculo`, data),
  remove: (id) => api.delete(`/RutinaPersonalizada/${id}`),
  addEjercicio: (rid, eid, data) => api.put(`/RutinaPersonalizada/${rid}/ejercicios/${eid}`, data),
  removeEjercicio: (rid, eid) => api.delete(`/RutinaPersonalizada/${rid}/ejercicios/${eid}`),
  reorder: (rid, ids) => api.put(`/RutinaPersonalizada/${rid}/orden`, { ejercicios: ids }),
};

// Seguimiento. Sin usuarioId es el usuario logueado; con usuarioId es la vista del administrador.
export const asistencia = {
  list: (usuarioId) => get(withUser('/Asistencia', usuarioId)),
  mark: () => api.post('/Asistencia').then((r) => r.data),
  undoToday: () => api.delete('/Asistencia/hoy'),
};

export const progreso = {
  list: (usuarioId) => get(withUser('/Progreso', usuarioId)),
  create: (data) => api.post('/Progreso', data).then((r) => r.data),
  remove: (id) => api.delete(`/Progreso/${id}`),
};

export const medidas = {
  list: (usuarioId) => get(withUser('/Medidas', usuarioId)),
  create: (data) => api.post('/Medidas', data).then((r) => r.data),
  remove: (id) => api.delete(`/Medidas/${id}`),
};

export default api;
