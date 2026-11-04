// Las fechas del back son texto "YYYY-MM-DD" (sin hora). Acá se manejan igual para evitar problemas de zona horaria.

/** Días de aviso antes del vencimiento: desde acá se muestra el banner al usuario. */
export const AVISO_DIAS = 5;

export function fmtFecha(f) {
  if (!f) return '';
  const [y, m, d] = String(f).slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

export function fmtCorta(f) {
  if (!f) return '';
  const [, m, d] = String(f).slice(0, 10).split('-');
  return `${d}/${m}`;
}

export function addDays(f, n) {
  const [y, m, d] = f.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

/** Igual que en el back: si sigue vigente se suma al vencimiento, si no cuenta desde hoy. */
export function renovarFecha(vence, dias, hoy) {
  const ayer = addDays(hoy, -1);
  const base = vence && vence > ayer ? vence : ayer;
  return addDays(base, dias);
}

/** Fecha de hoy según el dispositivo, "YYYY-MM-DD". */
export const hoyLocal = () => new Date().toLocaleDateString('en-CA');

export const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

export function mesTexto(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('es-AR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}
