"use strict";

const quizQuestions = [
  { question: "¿Cuál describe mejor Business Intelligence?", options: ["Un programa para guardar archivos", "Procesos y tecnologías que convierten datos en información útil para decidir", "Una técnica exclusiva de publicidad", "Una base de datos sin análisis"], answer: 1, explanation: "BI integra datos, análisis y comunicación para dar soporte a decisiones." },
  { question: "¿Qué elemento convierte un dato aislado en información?", options: ["El contexto", "El color del gráfico", "El tamaño del archivo", "La cantidad de columnas"], answer: 0, explanation: "El contexto permite interpretar un valor y entender qué representa." },
  { question: "¿Qué caracteriza una decisión estratégica?", options: ["Resuelve una tarea rutinaria del día", "Define una orientación de largo plazo", "Corrige un registro duplicado", "Actualiza una tabla cada hora"], answer: 1, explanation: "Las decisiones estratégicas orientan a la organización en el largo plazo." },
  { question: "¿Cuál es el orden correcto del ciclo de decisión visto en la guía?", options: ["Análisis, acción, identificación, evaluación, decisión", "Identificación, análisis, decisión, acción, evaluación", "Decisión, identificación, acción, análisis, evaluación", "Identificación, decisión, evaluación, análisis, acción"], answer: 1, explanation: "Primero se define el problema, luego se analiza, decide, actúa y evalúa." },
  { question: "En ETL, ¿qué sucede durante Extract?", options: ["Se dibujan los indicadores", "Se obtienen datos desde sus fuentes", "Se borran los datos históricos", "Se publican conclusiones"], answer: 1, explanation: "Extract conecta con los sistemas fuente y obtiene los registros requeridos." },
  { question: "¿Cuál es un ejemplo de Transform?", options: ["Conectar con el CRM", "Normalizar fechas y eliminar duplicados", "Guardar el resultado en el almacén", "Enviar un correo de alerta"], answer: 1, explanation: "Transform limpia, armoniza y valida datos antes de cargarlos." },
  { question: "¿Cuál es el objetivo de Load en un flujo ETL?", options: ["Cargar datos validados en un destino analítico", "Crear los datos originales", "Elegir la estrategia comercial", "Diseñar un logotipo"], answer: 0, explanation: "Load publica el resultado transformado en el destino definido." },
  { question: "¿Qué combinación ayuda a una tienda a reducir quiebres de stock?", options: ["Ventas, inventario y estacionalidad", "Solo colores de marca", "Resultados de encuestas sin fechas", "Tamaño de la pantalla del POS"], answer: 0, explanation: "Cruzar ventas, existencias y estacionalidad permite anticipar la demanda." },
  { question: "¿Qué aporta BI a un equipo de finanzas que estudia liquidez?", options: ["Integra facturas, pagos y compromisos para proyectar caja", "Sustituye la política contable", "Evita validar los datos", "Garantiza que nunca habrá gastos inesperados"], answer: 0, explanation: "La integración de vencimientos y pagos facilita escenarios de flujo de caja." },
  { question: "¿Cuál es una buena práctica para un pipeline ETL?", options: ["No registrar los errores", "Cambiar reglas sin documentarlas", "Validar calidad y mantener trazabilidad", "Reprocesar todo aunque no sea necesario"], answer: 2, explanation: "Las validaciones y la trazabilidad hacen el flujo auditable y confiable." }
];

const motivationMessages = ["Buena lectura de los datos.", "Cada respuesta afina tu criterio.", "Sigue el hilo: fuente, contexto, decisión.", "Un paso más hacia decisiones informadas."];
let currentQuestion = 0;
let score = 0;
let lives = 3;
let answered = false;

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("quizApp")) return;
  document.getElementById("nextQuestion").addEventListener("click", advanceQuiz);
  document.getElementById("retryQuiz").addEventListener("click", resetQuiz);
  renderQuestion();
});

function renderQuestion() {
  const question = quizQuestions[currentQuestion];
  const optionsContainer = document.getElementById("answerOptions");
  const progress = document.getElementById("quizProgress");
  const progressTrack = progress.closest(".progress");

  answered = false;
  document.getElementById("questionCounter").textContent = `Pregunta ${currentQuestion + 1} de ${quizQuestions.length}`;
  document.getElementById("scoreDisplay").textContent = `${score} pts`;
  document.getElementById("questionText").textContent = question.question;
  document.getElementById("motivationMessage").textContent = currentQuestion === 0 ? "" : motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
  document.getElementById("quizFeedback").textContent = "";
  document.getElementById("quizFeedback").className = "quiz-feedback";
  document.getElementById("nextQuestion").disabled = true;
  document.getElementById("nextQuestion").innerHTML = currentQuestion === quizQuestions.length - 1 ? "Ver resultado <i class=\"bi bi-arrow-right\" aria-hidden=\"true\"></i>" : "Siguiente <i class=\"bi bi-arrow-right\" aria-hidden=\"true\"></i>";
  progress.style.width = `${(currentQuestion / quizQuestions.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(currentQuestion));
  renderLives();

  optionsContainer.replaceChildren(...question.options.map((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = option;
    button.addEventListener("click", () => selectAnswer(index));
    return button;
  }));
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  const question = quizQuestions[currentQuestion];
  const options = [...document.querySelectorAll(".quiz-option")];
  const feedback = document.getElementById("quizFeedback");
  options.forEach((option, index) => {
    option.disabled = true;
    if (index === question.answer) option.classList.add("correct");
    if (index === selectedIndex && selectedIndex !== question.answer) option.classList.add("incorrect");
  });

  if (selectedIndex === question.answer) {
    score += 10;
    feedback.textContent = `Correcto. ${question.explanation}`;
    feedback.classList.add("feedback-correct");
  } else {
    lives -= 1;
    feedback.textContent = `No es esa. ${question.explanation}`;
    feedback.classList.add("feedback-incorrect");
  }
  document.getElementById("scoreDisplay").textContent = `${score} pts`;
  renderLives();
  document.getElementById("nextQuestion").disabled = false;
  if (lives === 0) document.getElementById("nextQuestion").innerHTML = "Ver resultado <i class=\"bi bi-arrow-right\" aria-hidden=\"true\"></i>";
}

function advanceQuiz() {
  if (!answered) return;
  if (lives === 0 || currentQuestion === quizQuestions.length - 1) {
    showResults();
    return;
  }
  currentQuestion += 1;
  renderQuestion();
}

function renderLives() {
  const livesContainer = document.getElementById("quizLives");
  livesContainer.replaceChildren(...Array.from({ length: 3 }, (_, index) => {
    const icon = document.createElement("i");
    icon.className = `bi ${index < lives ? "bi-heart-fill" : "bi-heart"}${index >= lives ? " life-lost" : ""}`;
    icon.setAttribute("aria-hidden", "true");
    return icon;
  }));
  livesContainer.setAttribute("aria-label", `${lives} ${lives === 1 ? "intento restante" : "intentos restantes"}`);
}

function showResults() {
  const percentage = Math.round((score / (quizQuestions.length * 10)) * 100);
  const title = percentage >= 80 ? "Excelente" : percentage >= 50 ? "Bueno" : "Necesitas repasar";
  const summary = percentage >= 80 ? "Tienes una base sólida para leer y comunicar indicadores." : percentage >= 50 ? "Vas construyendo criterio. Repasa los módulos que te resultaron más difíciles." : "Volver a los conceptos y al flujo ETL te ayudará a conectar las ideas.";
  document.getElementById("questionView").classList.add("d-none");
  document.querySelector(".quiz-status").classList.add("d-none");
  document.getElementById("quizResults").classList.remove("d-none");
  document.getElementById("resultTitle").textContent = title;
  document.getElementById("resultSummary").textContent = summary;
  document.getElementById("finalScore").textContent = String(score);
  document.getElementById("finalPercentage").textContent = `${percentage}%`;
  document.getElementById("resultSymbol").innerHTML = `<i class="bi ${percentage >= 80 ? "bi-trophy" : "bi-award"}" aria-hidden="true"></i>`;
  if (percentage >= 80) createConfetti();
}

function createConfetti() {
  const confetti = document.getElementById("confetti");
  const colors = ["#198754", "#0d6efd", "#ffc107", "#dc3545"];
  confetti.replaceChildren(...Array.from({ length: 28 }, (_, index) => {
    const piece = document.createElement("i");
    piece.style.left = `${(index * 37) % 100}%`;
    piece.style.animationDelay = `${(index % 8) * 0.08}s`;
    piece.style.setProperty("--confetti-color", colors[index % colors.length]);
    return piece;
  }));
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  lives = 3;
  document.getElementById("questionView").classList.remove("d-none");
  document.querySelector(".quiz-status").classList.remove("d-none");
  document.getElementById("quizResults").classList.add("d-none");
  document.getElementById("confetti").replaceChildren();
  renderQuestion();
}