# Gym Manager (front)

React + Vite + Tailwind + React Router + Axios. Se conecta al back de `https://backgon.onrender.com`.

## Cómo correrlo

```bash
npm install
cp .env.example .env     # opcional: cambiá VITE_API_URL si usás el back en tu computadora
npm run dev
```

Para publicarlo: `npm run build` y subí la carpeta `dist`. Funciona en Vercel o Netlify sin configurar nada más (ya incluye las reglas para que las rutas internas no den error 404).

> Antes de usar esta versión, actualizá el back (ver `ACTUALIZACION.md` en la carpeta del back). Hay que definir `JWT_SECRET` en Render.

## Qué incluye

**Usuario**
- Mi semana: su rutina de cada día (lunes a sábado) y botón para marcar la asistencia de hoy.
- Rutinas generales con filtros por dificultad y músculo.
- Ejercicios con video de YouTube (se ve desde el celular).
- Asistencia: calendario del mes y cuántas veces fue.
- Progreso: anota peso y repeticiones por ejercicio y ve su evolución en un gráfico.
- Medidas: peso, grasa y medidas corporales con gráfico.
- Mi cuenta: cambiar su contraseña e instalar la app en el celular.
- Aviso dentro de la app cuando faltan 5 días o menos para que venza la membresía.
- Con la membresía vencida solo ve una pantalla de bloqueo hasta que el administrador la renueve.

**Administrador y super admin** (mismas funciones; solo el super admin no se puede eliminar)
- Panel con vencimientos: quién está vencido o por vencer, con botón para renovar.
- Usuarios: crear (con días de membresía), renovar, cambiarles la contraseña, darles o quitarles el rol de administrador y eliminar. Filtros por membresía.
- Ficha de cada usuario: plan semanal, historial de renovaciones, asistencia, progreso y medidas.
- Rutinas generales: dificultad, músculos y ejercicios.
- Ejercicios: biblioteca reutilizable en rutinas generales y personalizadas.

## Sesión y membresía

- La sesión dura 3 días; después hay que volver a ingresar.
- Renovar suma días: si la membresía sigue vigente se suman al vencimiento actual; si ya venció, cuentan desde hoy. El último día es inclusive.
- El servidor gratuito de Render se duerme: la primera vez que alguien entra puede tardar hasta un minuto y la pantalla de ingreso lo avisa.

## App instalable (PWA)

En Android (Chrome) aparece el botón "Instalar Gym Manager" en Mi cuenta. En iPhone hay que abrir la app en Safari, tocar Compartir y elegir "Agregar a pantalla de inicio". La app solo se puede instalar desde la versión publicada (con https), no desde `npm run dev`.

## Estructura

```
public/                  # manifest, service worker e íconos de la app
src/
  services/api.js        # todos los endpoints del back
  context/AuthContext    # sesión, expiración a los 3 días y estado de la membresía
  components/            # Layout, WeekGrid, ExerciseList, LineChart, Membresia, ui, Toast
  components/seguimiento # asistencia, progreso y medidas (las usan el usuario y el admin)
  pages/                 # Login, MiSemana, Rutinas, Asistencia, Progreso, Medidas, Cuenta
  pages/admin/           # Dashboard, Usuarios, UsuarioDetalle, RutinasAdmin, RutinaEditor, Ejercicios
```
