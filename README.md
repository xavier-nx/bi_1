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
