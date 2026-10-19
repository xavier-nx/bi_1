"use strict";

const questStorageKey = "silabo_progreso_v1";
// El estado versionado permite conservar el avance sin servidor.
const bossOrder = ["eval1", "eval2", "eval3"];
const bossNames = {
  eval1: "Señor de los Fundamentos",
  eval2: "Guardián del Data Warehouse",
  eval3: "Titán de los Dashboards"
};
const skillDescriptions = {
  digital: {
    title: "Competencia digital",
    description: "El análisis de BI, las bases multidimensionales y las herramientas de visualización fortalecen el uso crítico de tecnologías de información. Las prácticas de ETL y dashboards conectan herramientas con necesidades reales."
  },
  creative: {
    title: "Creatividad",
    description: "Diseñar reportes, KPIs y tableros exige encontrar formas claras de representar información compleja. El proyecto integrador invita a proponer soluciones visuales para monitorear ecosistemas insulares."
  },
  ethics: {
    title: "Ética",
    description: "La selección, transformación e interpretación de datos requiere reconocer su origen, calidad y límites. El uso de información para decisiones organizacionales y ambientales demanda comunicar resultados con responsabilidad."
  },
  leadership: {
    title: "Liderazgo",
    description: "El aprendizaje cooperativo fortalece la coordinación y la comunicación en equipo. Los proyectos de BI requieren organizar tareas, compartir criterios y presentar resultados útiles para distintos actores."
  },
  critical: {
    title: "Pensamiento crítico",
    description: "La evaluación e interpretación de patrones ayuda a cuestionar resultados y distinguir evidencia de suposiciones. El análisis de KPIs aporta contexto antes de recomendar una decisión."
  },
  problem: {
    title: "Resolución de problemas",
    description: "El aprendizaje basado en problemas y proyectos lleva a integrar fuentes, modelar información y construir soluciones de BI. Las alertas y dashboards permiten responder a necesidades concretas."
  }
};

let questState = loadQuestState();

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".silabo-page")) return;

  initializeHeroName();
  initializeMissionTasks();
  initializeBossFights();
  initializeSkillModal();
  initializeTimeline();
  initializeScrollReveals();
  initializeThemeSync();
  document.getElementById("resetQuest").addEventListener("click", resetQuestProgress);
  renderAllMissions();
  renderBosses();
});

function loadQuestState() {
  try {
    const storedState = JSON.parse(localStorage.getItem(questStorageKey));
    return {
      heroName: typeof storedState?.heroName === "string" ? storedState.heroName : "Aventurero del Semestre",
      tasks: storedState?.tasks && typeof storedState.tasks === "object" ? storedState.tasks : {},
      defeatedBosses: Array.isArray(storedState?.defeatedBosses) ? storedState.defeatedBosses.filter((id) => bossOrder.includes(id)) : []
    };
  } catch {
    return { heroName: "Aventurero del Semestre", tasks: {}, defeatedBosses: [] };
  }
}

function saveQuestState() {
  localStorage.setItem(questStorageKey, JSON.stringify(questState));
}

function initializeHeroName() {
  const nameInput = document.getElementById("heroName");
  nameInput.value = questState.heroName;
  nameInput.addEventListener("input", () => {
    questState.heroName = nameInput.value.trim() || "Aventurero del Semestre";
    saveQuestState();
  });
}

function initializeMissionTasks() {
  document.querySelectorAll("[data-task]").forEach((checkbox) => {
    checkbox.checked = Boolean(questState.tasks[checkbox.dataset.task]);
    checkbox.addEventListener("change", () => {
      const missionCard = checkbox.closest("[data-mission]");
      const missionTasks = [...missionCard.querySelectorAll("[data-task]")];
      const wasComplete = missionTasks.every((task) => task.dataset.task === checkbox.dataset.task
        ? !checkbox.checked
        : task.checked);
      questState.tasks[checkbox.dataset.task] = checkbox.checked;
      saveQuestState();
      renderMission(missionCard);
      if (!wasComplete && isMissionComplete(missionCard)) showMissionReward(missionCard);
    });
  });
}

function renderAllMissions() {
  document.querySelectorAll("[data-mission]").forEach(renderMission);
}

function renderMission(missionCard) {
  const checkboxes = [...missionCard.querySelectorAll("[data-task]")];
  const completedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
  const progress = checkboxes.length ? Math.round((completedCount / checkboxes.length) * 100) : 0;
  const progressBar = missionCard.querySelector("[data-mission-bar]");
  const progressTrack = progressBar.closest("[role='progressbar']");
  const progressLabel = missionCard.querySelector("[data-mission-percent]");
  const status = missionCard.querySelector("[data-mission-status]");
  const isComplete = progress === 100;

  progressBar.style.width = `${progress}%`;
  progressTrack.setAttribute("aria-valuenow", String(progress));
  progressLabel.textContent = `${progress}%`;
  status.textContent = isComplete ? "COMPLETADA" : "EN CURSO";
  missionCard.classList.toggle("mission-complete", isComplete);
  missionCard.querySelector("[data-reward-lock]").hidden = isComplete;
  missionCard.querySelector("[data-reward-unlocked]").hidden = !isComplete;
}

function isMissionComplete(missionCard) {
  const checkboxes = [...missionCard.querySelectorAll("[data-task]")];
  return checkboxes.length > 0 && checkboxes.every((checkbox) => checkbox.checked);
}

function showMissionReward(missionCard) {
  const rewardName = missionCard.querySelector("[data-reward-unlocked]").parentElement.querySelector("strong").textContent;
  document.getElementById("toastTitle").textContent = "Insignia desbloqueada";
  document.getElementById("toastMessage").textContent = `${rewardName}: misión completada. ¡Buen trabajo, ${questState.heroName}!`;
  bootstrap.Toast.getOrCreateInstance(document.getElementById("questToast")).show();
}

function initializeBossFights() {
  document.querySelectorAll("[data-defeat-boss]").forEach((button) => {
    button.addEventListener("click", () => defeatBoss(button.dataset.defeatBoss));
  });
}

function renderBosses() {
  bossOrder.forEach((bossId, index) => {
    const bossCard = document.querySelector(`[data-boss="${bossId}"]`);
    const button = bossCard.querySelector(`[data-defeat-boss="${bossId}"]`);
    bossCard.querySelector("h3").textContent = bossNames[bossId];
    const stateLabel = bossCard.querySelector("[data-boss-state]");
    const healthLabel = bossCard.querySelector("[data-boss-health-label]");
    const healthTrack = bossCard.querySelector("[role='progressbar']");
    const healthBar = bossCard.querySelector("[data-boss-health]");
    healthTrack.setAttribute("aria-label", `Integridad del jefe ${bossNames[bossId]}`);
    const isDefeated = questState.defeatedBosses.includes(bossId);
    const isUnlocked = index === 0 || questState.defeatedBosses.includes(bossOrder[index - 1]);

    bossCard.classList.toggle("is-defeated", isDefeated);
    bossCard.classList.toggle("is-locked", !isDefeated && !isUnlocked);
    stateLabel.textContent = isDefeated ? "SUPERADO" : isUnlocked ? "PRÓXIMO" : "BLOQUEADO";
    button.disabled = isDefeated || !isUnlocked;
    button.innerHTML = isDefeated
      ? '<i class="bi bi-check-circle-fill" aria-hidden="true"></i> Jefe superado'
      : isUnlocked
        ? '<i class="bi bi-lightning-charge-fill" aria-hidden="true"></i> ¡Derrotado!'
        : '<i class="bi bi-lock-fill" aria-hidden="true"></i> Jefe bloqueado';
    healthLabel.textContent = isDefeated ? "0%" : "100%";
    healthBar.style.width = isDefeated ? "0%" : "100%";
    healthTrack.setAttribute("aria-valuenow", isDefeated ? "0" : "100");
  });
  updateHeroExperience();
}

function defeatBoss(bossId) {
  const bossIndex = bossOrder.indexOf(bossId);
  const canDefeat = bossIndex === 0 || questState.defeatedBosses.includes(bossOrder[bossIndex - 1]);
  if (!canDefeat || questState.defeatedBosses.includes(bossId)) return;

  questState.defeatedBosses.push(bossId);
  saveQuestState();
  renderBosses();
  document.getElementById("toastTitle").textContent = "Jefe superado";
  document.getElementById("toastMessage").textContent = `${bossNames[bossId]} derrotado. Has ganado 48 XP de campaña.`;
  bootstrap.Toast.getOrCreateInstance(document.getElementById("questToast")).show();
}

function updateHeroExperience() {
  // El XP de campaña depende solo de evaluaciones superadas; las tareas avanzan su misión.
  const earnedXp = questState.defeatedBosses.length * 48;
  const progress = Math.round((earnedXp / 144) * 100);
  const heroXpBar = document.getElementById("heroXpBar");
  const progressTrack = heroXpBar.closest("[role='progressbar']");
  document.getElementById("xpReadout").textContent = `${earnedXp} / 144 XP`;
  document.getElementById("heroXpHint").textContent = earnedXp === 144
    ? "Campaña completada: alcanzaste el máximo de XP."
    : `${3 - questState.defeatedBosses.length} jefe(s) pendiente(s) para completar la campaña.`;
  heroXpBar.style.width = `${progress}%`;
  progressTrack.setAttribute("aria-valuenow", String(earnedXp));
}

function initializeSkillModal() {
  document.querySelectorAll("[data-skill]").forEach((button) => {
    button.addEventListener("click", () => {
      const skill = skillDescriptions[button.dataset.skill];
      if (!skill) return;
      document.getElementById("skillModalTitle").textContent = skill.title;
      document.getElementById("skillModalDescription").textContent = skill.description;
    });
  });
}

function initializeTimeline() {
  // Los nodos se ubican proporcionalmente a las fechas reales del PAO.
  const startDate = new Date("2026-10-12T00:00:00-05:00");
  const endDate = new Date("2027-02-21T23:59:59-05:00");
  const now = new Date();
  const rawProgress = ((now - startDate) / (endDate - startDate)) * 100;
  const progress = Math.min(100, Math.max(0, rawProgress));
  const marker = document.getElementById("timelineToday");
  marker.style.left = `calc(${progress}% - 8px)`;

  document.querySelectorAll(".timeline-milestone").forEach((milestone, index, milestones) => {
    const milestoneDate = new Date(`${milestone.dataset.date}T23:59:59-05:00`);
    const milestoneProgress = ((milestoneDate - startDate) / (endDate - startDate)) * 100;
    milestone.style.left = `${Math.min(100, Math.max(0, milestoneProgress))}%`;
    milestone.classList.toggle("is-start", index === 0);
    milestone.classList.toggle("is-end", index === milestones.length - 1);
    if (milestoneDate < now) milestone.classList.add("is-past");
    if (milestone.dataset.date === localDateString(now)) milestone.classList.add("is-today");
  });

  const dateText = new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(now);
  document.getElementById("todayLabel").setAttribute("aria-label", `Fecha actual: ${dateText}`);
  document.getElementById("timelineStatus").textContent = rawProgress < 0
    ? `La campaña inicia el 12/10/2026. Hoy: ${dateText}.`
    : rawProgress > 100
      ? `La campaña concluyó el 21/02/2027. Hoy: ${dateText}.`
      : `Hoy, ${dateText}, estás en el ${Math.round(progress)}% del calendario del PAO.`;
}

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function initializeScrollReveals() {
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
}

function initializeThemeSync() {
  const themeButton = document.querySelector("[data-theme-toggle]");
  if (!themeButton) return;
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("adventure-light", !document.body.classList.contains("dark-theme"));
  });
  document.body.classList.toggle("adventure-light", localStorage.getItem("bi-theme") !== "dark");
}

function resetQuestProgress() {
  const shouldReset = window.confirm("¿Quieres borrar el nombre, las misiones y las evaluaciones guardadas en este navegador?");
  if (!shouldReset) return;
  localStorage.removeItem(questStorageKey);
  questState = { heroName: "Aventurero del Semestre", tasks: {}, defeatedBosses: [] };
  document.getElementById("heroName").value = questState.heroName;
  document.querySelectorAll("[data-task]").forEach((checkbox) => { checkbox.checked = false; });
  renderAllMissions();
  renderBosses();
}