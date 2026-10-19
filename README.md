# Datos con criterio

Sitio educativo sobre fundamentos de Business Intelligence, decisiones basadas en datos y el proceso ETL. Incluye un cuestionario interactivo y un dashboard con datos ficticios de la Liga Pro 2026.

## Cómo abrir el sitio

- En VS Code, abre `index.html` con la extensión Live Server.
- También puedes iniciar un servidor local desde la raíz del proyecto con `python -m http.server 8000` y visitar `http://localhost:8000`.

Bootstrap, Bootstrap Icons, Chart.js y las fuentes se cargan desde CDN; se requiere conexión a internet para esos recursos.

## Funciones del dashboard

En `dashboard.html`, selecciona la jornada actual y la jornada de comparación. El sitio muestra cambios de goles, puntos, líder y posiciones, además de hallazgos calculados. Los botones `CSV` y `PDF` descargan, respectivamente, la clasificación y un informe con KPI, gráficos y tabla. El PDF utiliza jsPDF desde CDN.

Al terminar el cuestionario, `Descargar resultado` genera un informe PDF con el puntaje y la revisión de respuestas.

La interfaz combina azul marino, teal y dorado; el botón de tema claro/oscuro mantiene su preferencia local.

## Cómo editar el quiz

Edita el array `quizQuestions` en `js/quiz.js`. Cada objeto define `question`, cuatro textos en `options`, el índice de la respuesta correcta en `answer` (empieza en cero) y una `explanation`. La interfaz calcula el total de preguntas desde ese array.

## Cómo modificar los datos del dashboard

Edita `teamData`, `scorerData`, `resultData`, `timeData` y `pointSeries` en `js/dashboard.js`. Los equipos incluyen resultados y posesión; goleadores, distribución de resultados, franjas de tiempo y series por jornada tienen sus propios conjuntos de datos. Los indicadores y la tabla se recalculan al cambiar la jornada.

## Sílabo en modo aventura

- Abre `silabo.html`; las tareas, el nombre del personaje y bosses superados se guardan en el navegador bajo la clave `silabo_progreso_v1`.
- Edita la ficha, los tópicos, fechas y recursos directamente en `silabo.html`. Para cambiar descripciones de habilidades o los nombres creativos de los jefes, modifica `skillDescriptions` y `bossNames` en `js/silabo.js`; los nombres de bosses se actualizan desde ese objeto.
- Para reiniciar desde la interfaz, usa `Resetear progreso` y confirma. También puedes borrar la clave `silabo_progreso_v1` desde las herramientas de almacenamiento del navegador.
- Los “boss fights” son una metáfora visual de las evaluaciones; las fechas mostradas corresponden a las fechas indicadas en el sílabo.
- Los recursos con una URL oficial conocida enlazan directamente a ella. Los títulos sin URL proporcionada abren una búsqueda por nombre para evitar inventar direcciones de descarga.
