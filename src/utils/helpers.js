export const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const LEVELS = {
  principiante: { n: 1, color: '#3FB26B', label: 'Principiante' },
  intermedio: { n: 2, color: '#E8C23A', label: 'Intermedio' },
  avanzado: { n: 3, color: '#E5484D', label: 'Avanzado' },
};

/** Pasa un ejercicio del back (con tabla intermedia) a un objeto plano. */
export function normEx(e) {
  const t = e.RutinaPersonalizadaEjercicios || e.RutinaPredefinidaEjercicios || {};
  return {
    id: e.id,
    nombre: e.nombre,
    descripcion: e.descripcion,
    imagen_url: e.imagen_url,
    series: t.series ?? 3,
    repeticiones: t.repeticiones ?? '10',
    notas: t.notas || '',
  };
}

export function roleOf(u) {
  if (u?.super_admin) return 'Super admin';
  if (u?.admin) return 'Administrador';
  return 'Usuario';
}
