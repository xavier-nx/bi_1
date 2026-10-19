"use strict";

const teamData = [
  { name: "Independiente del Valle", short: "IDV", crest: "crest-idv", played: 10, wins: 7, draws: 1, losses: 2, gf: 22, ga: 10, points: 22, possession: 58 },
  { name: "Barcelona SC", short: "BSC", crest: "crest-bar", played: 10, wins: 6, draws: 2, losses: 2, gf: 20, ga: 12, points: 20, possession: 55 },
  { name: "LDU Quito", short: "LDU", crest: "crest-ldu", played: 10, wins: 5, draws: 3, losses: 2, gf: 18, ga: 12, points: 18, possession: 57 },
  { name: "Emelec", short: "EME", crest: "crest-eme", played: 10, wins: 5, draws: 1, losses: 4, gf: 17, ga: 14, points: 16, possession: 51 },
  { name: "Aucas", short: "AUC", crest: "crest-auc", played: 10, wins: 4, draws: 3, losses: 3, gf: 15, ga: 15, points: 15, possession: 49 },
  { name: "El Nacional", short: "NAC", crest: "crest-eln", played: 10, wins: 3, draws: 3, losses: 4, gf: 13, ga: 17, points: 12, possession: 46 },
  { name: "Delfín", short: "DEL", crest: "crest-del", played: 10, wins: 3, draws: 1, losses: 6, gf: 11, ga: 17, points: 10, possession: 44 },
  { name: "Macará", short: "MAC", crest: "crest-mac", played: 10, wins: 2, draws: 2, losses: 6, gf: 9, ga: 28, points: 8, possession: 43 }
];

const scorerData = [
  { name: "J. Medina", team: "IDV", goals: 9 }, { name: "A. Obando", team: "BSC", goals: 8 },
  { name: "L. Arce", team: "LDU", goals: 7 }, { name: "M. Mieles", team: "AUC", goals: 6 },
  { name: "E. Valencia", team: "EME", goals: 6 }
];
const resultData = [22, 10, 8];
const resultLabels = ["Victorias locales", "Victorias visitantes", "Empates"];
const timeLabels = ["0–15'", "16–30'", "31–45'", "46–60'", "61–75'", "76–90'"];
const timeData = [15, 19, 23, 18, 25, 25];
const chartColors = { blue: "#2457a7", green: "#188b82", yellow: "#e4b644", red: "#d95d68", gray: "#73869b" };
const resultColors = [chartColors.blue, chartColors.green, chartColors.yellow];
const timeColors = ["#315f9f", "#188b82", "#e4b644", "#d95d68", "#73869b", "#8fa9c5"];
const pointSeries = [[3, 4, 7, 7, 10, 13, 16, 16, 19, 22], [1, 4, 7, 10, 10, 13, 16, 17, 17, 20], [3, 3, 4, 7, 10, 11, 14, 14, 17, 18]];
const chartInstances = {};
let variation = 0;

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("scorersChart") || typeof Chart === "undefined") return;
  configureChartDefaults();
  document.getElementById("roundFilter").addEventListener("change", updateDashboard);
  document.getElementById("compareRound").addEventListener("change", updateDashboard);
  document.getElementById("refreshDashboard").addEventListener("click", refreshDashboard);
  document.getElementById("exportCsv").addEventListener("click", exportStandingsCsv);
  document.getElementById("exportDashboardPdf").addEventListener("click", exportDashboardPdf);
  renderLegends();
  createCharts();
  updateDashboard();
});

function configureChartDefaults() {
  Chart.defaults.font.family = "DM Sans, sans-serif";
  Chart.defaults.font.size = 10;
  Chart.defaults.color = "#758078";
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.backgroundColor = "#102b46";
  Chart.defaults.plugins.tooltip.padding = 10;
}

function createCharts() {
  chartInstances.scorers = new Chart(document.getElementById("scorersChart"), {
    type: "bar", data: { labels: scorerData.map((scorer) => [`${scorer.name}`, scorer.team]), datasets: [{ data: scorerData.map((scorer) => scorer.goals), backgroundColor: [chartColors.green, chartColors.blue, "#5c9d78", "#8cb99b", "#a8cbb2"], borderRadius: 4, maxBarThickness: 37 }] },
    options: { maintainAspectRatio: false, plugins: { tooltip: { callbacks: { title: (items) => `${scorerData[items[0].dataIndex].name} · ${scorerData[items[0].dataIndex].team}`, label: (item) => `${item.raw} goles` } } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 9 } } }, y: { beginAtZero: true, suggestedMax: 12, ticks: { stepSize: 3, precision: 0 }, grid: { color: "rgba(108, 117, 125, .12)" }, border: { display: false } } } }
  });
  chartInstances.results = new Chart(document.getElementById("resultsChart"), {
    type: "doughnut", data: { labels: resultLabels, datasets: [{ data: resultData, backgroundColor: resultColors, borderColor: "#fff", borderWidth: 3, hoverOffset: 5 }] },
    options: { maintainAspectRatio: false, cutout: "70%", plugins: { tooltip: { callbacks: { label: (item) => `${item.label}: ${item.raw}` } } } }
  });
  chartInstances.points = new Chart(document.getElementById("pointsChart"), {
    type: "line", data: { labels: Array.from({ length: 10 }, (_, index) => `J${index + 1}`), datasets: [
      { label: "Independiente del Valle", data: pointSeries[0], borderColor: chartColors.green, backgroundColor: chartColors.green, tension: .32, pointRadius: 2.5, borderWidth: 2 },
      { label: "Barcelona SC", data: pointSeries[1], borderColor: chartColors.blue, backgroundColor: chartColors.blue, tension: .32, pointRadius: 2.5, borderWidth: 2 },
      { label: "LDU Quito", data: pointSeries[2], borderColor: "#e2a900", backgroundColor: "#e2a900", tension: .32, pointRadius: 2.5, borderWidth: 2 }
    ] },
    options: { maintainAspectRatio: false, plugins: { legend: { display: true, position: "bottom", labels: { usePointStyle: true, pointStyle: "circle", boxWidth: 7, boxHeight: 7, padding: 13, font: { size: 9 } } } }, scales: { x: { grid: { display: false }, border: { display: false } }, y: { beginAtZero: true, suggestedMax: 24, ticks: { stepSize: 6, precision: 0 }, grid: { color: "rgba(108, 117, 125, .12)" }, border: { display: false } } } }
  });
  chartInstances.possession = new Chart(document.getElementById("possessionChart"), {
    type: "bar", data: { labels: teamData.map((team) => team.short), datasets: [{ data: teamData.map((team) => team.possession), backgroundColor: teamData.map((_, index) => index === 0 ? chartColors.green : "#9bbda5"), borderRadius: 3, barThickness: 13 }] },
    options: { indexAxis: "y", maintainAspectRatio: false, plugins: { tooltip: { callbacks: { label: (item) => `${item.raw}% de posesión` } } }, scales: { x: { min: 0, max: 70, ticks: { callback: (value) => `${value}%`, stepSize: 20 }, grid: { color: "rgba(108, 117, 125, .12)" }, border: { display: false } }, y: { grid: { display: false }, border: { display: false } } } }
  });
  chartInstances.time = new Chart(document.getElementById("timeChart"), {
    type: "doughnut", data: { labels: timeLabels, datasets: [{ data: timeData, backgroundColor: timeColors, borderColor: "#fff", borderWidth: 2, hoverOffset: 4 }] },
    options: { maintainAspectRatio: false, cutout: "66%", plugins: { tooltip: { callbacks: { label: (item) => `${item.label}: ${item.raw} goles` } } } }
  });
}

function scaleTeam(team, round) {
  const scale = round / team.played;
  const wins = Math.round(team.wins * scale);
  const draws = Math.max(0, Math.min(round - wins, Math.round(team.draws * scale)));
  const losses = round - wins - draws;
  const gf = Math.round(team.gf * scale);
  const ga = Math.round(team.ga * scale);
  return { ...team, played: round, wins, draws, losses, gf, ga, points: wins * 3 + draws, goalDifference: gf - ga };
}

function updateDashboard() {
  const round = Number(document.getElementById("roundFilter").value);
  const progress = round / 10;
  const scaledTeams = teamData.map((team) => scaleTeam(team, round));
  const sortedTeams = [...scaledTeams].sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
  const leader = sortedTeams[0];
  const totalGoals = scaledTeams.reduce((total, team) => total + team.gf, 0);
  const totalMatches = round * 4;

  document.getElementById("totalGoals").textContent = String(totalGoals);
  document.getElementById("totalMatches").textContent = String(totalMatches);
  document.querySelector(".kpi-card:nth-child(2) small").textContent = `De ${totalMatches} programados`;
  document.getElementById("leaderName").textContent = leader.short;
  document.getElementById("leaderPoints").innerHTML = `<span class="team-crest ${leader.crest}" aria-hidden="true">${leader.short}</span> ${leader.points} puntos`;
  document.getElementById("goalAverage").textContent = totalMatches ? (totalGoals / totalMatches).toFixed(2).replace(".", ",") : "0,00";
  document.getElementById("totalYellows").textContent = String(Math.round(142 * progress) + variation * 2);
  document.getElementById("tableRound").textContent = String(round);
  renderStandings(sortedTeams);
  renderComparison(round, Number(document.getElementById("compareRound").value));
  renderInsights(sortedTeams, round);
  updateCharts(round, progress);
}

function renderStandings(teams) {
  const body = document.getElementById("standingsBody");
  body.replaceChildren(...teams.map((team, index) => {
    const row = document.createElement("tr");
    if (index === 0) row.classList.add("leader-row");
    const values = [index + 1, team.name, team.played, team.wins, team.draws, team.losses, team.gf, team.ga, team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference, team.points];
    values.forEach((value, cellIndex) => {
      const cell = document.createElement("td");
      if (cellIndex === 1) {
        const crest = document.createElement("span");
        crest.className = `team-crest ${team.crest}`;
        crest.textContent = team.short;
        crest.setAttribute("aria-hidden", "true");
        const name = document.createElement("span");
        name.textContent = team.name;
        const wrapper = document.createElement("span");
        wrapper.className = "team-cell";
        wrapper.append(crest, name);
        cell.append(wrapper);
      } else cell.textContent = String(value);
      row.append(cell);
    });
    return row;
  }));
}

function updateCharts(round, progress) {
  chartInstances.scorers.data.datasets[0].data = scorerData.map((scorer) => Math.max(1, Math.round(scorer.goals * progress) + randomOffset()));
  chartInstances.scorers.update();
  chartInstances.results.data.datasets[0].data = resultData.map((value) => Math.max(1, Math.round(value * progress)));
  chartInstances.results.update();
  chartInstances.points.data.datasets.forEach((dataset, index) => {
    dataset.data = pointSeries[index].map((value, dateIndex) => dateIndex < round ? value + (variation > 0 && index === 0 ? 1 : 0) : null);
  });
  chartInstances.points.update();
  chartInstances.possession.data.datasets[0].data = teamData.map((team) => Math.min(69, Math.max(32, team.possession + randomOffset())));
  chartInstances.possession.update();
  chartInstances.time.data.datasets[0].data = timeData.map((value) => Math.max(1, Math.round(value * progress)));
  chartInstances.time.update();
  document.getElementById("updateStatus").textContent = `Mostrando jornada ${round} de 10`;
}

function renderLegends() {
  document.getElementById("resultsLegend").replaceChildren(...resultLabels.map((label, index) => createLegendItem(label, resultColors[index])));
  document.getElementById("timeLegend").replaceChildren(...timeLabels.map((label, index) => createLegendItem(label, timeColors[index])));
}

function createLegendItem(label, color) {
  const item = document.createElement("span");
  const swatch = document.createElement("i");
  swatch.style.backgroundColor = color;
  swatch.setAttribute("aria-hidden", "true");
  item.append(swatch, document.createTextNode(label));
  return item;
}

function refreshDashboard() {
  variation = variation === 0 ? 1 : variation * -1;
  updateDashboard();
  const status = document.getElementById("updateStatus");
  status.textContent = "Datos actualizados";
  window.setTimeout(() => {
    if (status.textContent === "Datos actualizados") status.textContent = `Mostrando jornada ${document.getElementById("roundFilter").value} de 10`;
  }, 2200);
}

function randomOffset() {
  return Math.random() < 0.5 ? -variation : variation;
}

function getStandings(round) {
  return teamData.map((team) => scaleTeam(team, round))
    .sort((first, second) => second.points - first.points || second.goalDifference - first.goalDifference);
}

function renderComparison(currentRound, comparisonRound) {
  const currentTeams = getStandings(currentRound);
  const earlierTeams = getStandings(comparisonRound);
  const currentGoals = currentTeams.reduce((total, team) => total + team.gf, 0);
  const earlierGoals = earlierTeams.reduce((total, team) => total + team.gf, 0);
  const currentLeader = currentTeams[0];
  const earlierLeader = earlierTeams[0];
  const currentPosition = new Map(currentTeams.map((team, index) => [team.short, index + 1]));
  const earlierPosition = new Map(earlierTeams.map((team, index) => [team.short, index + 1]));
  const metrics = [
    { label: "Goles anotados", value: signedDifference(currentGoals - earlierGoals), detail: `${currentGoals} vs. ${earlierGoals}` },
    { label: "Líder actual", value: currentLeader.short, detail: currentLeader.short === earlierLeader.short ? `Se mantiene desde J${comparisonRound}` : `En J${comparisonRound}: ${earlierLeader.short}` },
    { label: "Puntos del líder", value: signedDifference(currentLeader.points - earlierLeader.points), detail: `${currentLeader.points} vs. ${earlierLeader.points} pts` }
  ];
  const container = document.getElementById("roundComparison");
  const metricGrid = document.createElement("div");
  metricGrid.className = "comparison-metrics";
  metrics.forEach((metric) => {
    const item = document.createElement("div");
    item.className = "comparison-metric";
    const label = document.createElement("span");
    label.textContent = metric.label;
    const value = document.createElement("strong");
    value.textContent = metric.value;
    const detail = document.createElement("small");
    detail.textContent = metric.detail;
    item.append(label, value, detail);
    metricGrid.append(item);
  });

  const changedTeams = currentTeams.filter((team) => currentPosition.get(team.short) !== earlierPosition.get(team.short));
  const movement = document.createElement("p");
  movement.className = "comparison-movement";
  movement.textContent = changedTeams.length
    ? `${changedTeams.length} equipos cambiaron de posición entre jornadas.`
    : "Ningún equipo cambió de posición entre jornadas.";
  const changes = document.createElement("ul");
  changes.className = "comparison-rank-changes";
  changedTeams.forEach((team) => {
    const item = document.createElement("li");
    item.textContent = `${team.short}: #${earlierPosition.get(team.short)} → #${currentPosition.get(team.short)}`;
    changes.append(item);
  });
  container.replaceChildren(metricGrid, movement, changes);
  document.getElementById("comparisonCaption").textContent = `Jornada ${currentRound} frente a jornada ${comparisonRound}`;
}

function signedDifference(value) {
  return value > 0 ? `+${value}` : String(value);
}

function renderInsights(teams, round) {
  const leader = teams[0];
  const runnerUp = teams[1];
  const pointsGap = leader.points - runnerUp.points;
  const topScorer = [...scorerData].sort((first, second) => second.goals - first.goals)[0];
  const resultCount = resultData.map((value) => Math.round(value * round / 10));
  const localShare = Math.round((resultCount[0] / resultCount.reduce((sum, count) => sum + count, 0)) * 100);
  const observations = [
    `${leader.name} lidera con ${leader.points} puntos${pointsGap ? `, ${pointsGap} por encima de ${runnerUp.short}` : ", igualado con el segundo"}.`,
    `${topScorer.name} (${topScorer.team}) encabeza la tabla de goleadores ficticia con ${Math.max(1, Math.round(topScorer.goals * round / 10))} goles estimados a esta jornada.`,
    `Las victorias locales representan aproximadamente el ${localShare}% de los resultados simulados acumulados.`
  ];
  const list = document.getElementById("insightsList");
  list.replaceChildren(...observations.map((observation) => {
    const item = document.createElement("li");
    const icon = document.createElement("i");
    icon.className = "bi bi-arrow-up-right";
    icon.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.textContent = observation;
    item.append(icon, text);
    return item;
  }));
}

function exportStandingsCsv() {
  const round = Number(document.getElementById("roundFilter").value);
  const columns = ["Posición", "Equipo", "PJ", "PG", "PE", "PP", "GF", "GC", "DG", "PTS"];
  const rows = getStandings(round).map((team, index) => [
    index + 1, team.name, team.played, team.wins, team.draws, team.losses,
    team.gf, team.ga, team.goalDifference, team.points
  ]);
  const csv = [columns, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
  downloadBlob(`\uFEFF${csv}`, `liga-pro-2026-jornada-${round}.csv`, "text/csv;charset=utf-8");
}

function escapeCsvValue(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportDashboardPdf() {
  const JsPDF = window.jspdf?.jsPDF;
  if (!JsPDF) {
    window.alert("No se pudo cargar el generador PDF. Comprueba tu conexión a internet e inténtalo de nuevo.");
    return;
  }

  const round = Number(document.getElementById("roundFilter").value);
  const comparisonRound = Number(document.getElementById("compareRound").value);
  const teams = getStandings(round);
  const doc = new JsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const navy = [16, 43, 70];
  const muted = [93, 108, 123];
  doc.setTextColor(...navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("Liga Pro 2026 | Informe de jornada", 14, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(`Jornada ${round} · Comparación con jornada ${comparisonRound} · Datos simulados · ${new Date().toLocaleDateString("es-EC")}`, 14, 22);

  const metrics = [
    ["Goles", document.getElementById("totalGoals").textContent],
    ["Partidos", document.getElementById("totalMatches").textContent],
    ["Líder", document.getElementById("leaderName").textContent],
    ["Goles / partido", document.getElementById("goalAverage").textContent],
    ["Tarjetas amarillas", document.getElementById("totalYellows").textContent]
  ];
  const metricWidth = (pageWidth - 28 - 16) / metrics.length;
  metrics.forEach(([label, value], index) => {
    const x = 14 + index * (metricWidth + 4);
    doc.setDrawColor(220, 229, 239);
    doc.setFillColor(245, 248, 252);
    doc.roundedRect(x, 28, metricWidth, 19, 2, 2, "FD");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(label, x + 3, 34);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...navy);
    doc.text(String(value), x + 3, 42);
    doc.setFont("helvetica", "normal");
  });

  const chartCards = [
    ["Goleadores", "scorers", 14, 53, 105, 55],
    ["Resultados", "results", 123, 53, 68, 55],
    ["Puntos por jornada", "points", 195, 53, 88, 55],
    ["Posesión por equipo", "possession", 46, 116, 105, 55],
    ["Goles por franja", "time", 160, 116, 68, 55]
  ];
  chartCards.forEach(([title, chartKey, x, y, width, height]) => {
    const chart = chartInstances[chartKey];
    if (!chart) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...navy);
    doc.text(title, x, y - 2);
    doc.addImage(chart.toBase64Image(), "PNG", x, y, width, height, undefined, "FAST");
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...navy);
  doc.text("Comparación e insights", 14, 181);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  const reportNotes = [
    document.getElementById("comparisonCaption").textContent,
    ...[...document.querySelectorAll("#insightsList li")].map((item) => item.textContent)
  ];
  let noteY = 186;
  reportNotes.forEach((note) => {
    const lines = doc.splitTextToSize(`- ${note}`, pageWidth - 28);
    doc.text(lines, 14, noteY);
    noteY += lines.length * 3.5;
  });

  doc.addPage("a4", "landscape");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...navy);
  doc.text(`Tabla de posiciones · Jornada ${round}`, 14, 18);
  const headers = ["#", "Equipo", "PJ", "PG", "PE", "PP", "GF", "GC", "DG", "PTS"];
  const widths = [12, 86, 18, 18, 18, 18, 20, 20, 20, 22];
  let x = 14;
  let y = 31;
  doc.setFillColor(...navy);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  headers.forEach((header, index) => {
    doc.rect(x, y, widths[index], 9, "F");
    doc.text(header, x + 2, y + 6);
    x += widths[index];
  });
  teams.forEach((team, index) => {
    y += 9;
    x = 14;
    const values = [index + 1, team.name, team.played, team.wins, team.draws, team.losses, team.gf, team.ga, team.goalDifference, team.points];
    doc.setFillColor(index === 0 ? 232 : index % 2 ? 255 : 246, index === 0 ? 243 : index % 2 ? 255 : 249, index === 0 ? 238 : index % 2 ? 255 : 252);
    values.forEach((value, cellIndex) => {
      doc.rect(x, y, widths[cellIndex], 9, "F");
      doc.setTextColor(...navy);
      doc.setFont("helvetica", cellIndex === 9 ? "bold" : "normal");
      doc.text(String(value), x + 2, y + 6);
      x += widths[cellIndex];
    });
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("Elaborado automáticamente a partir de datos ficticios con fines educativos.", 14, y + 16);
  doc.save(`liga-pro-2026-jornada-${round}.pdf`);
}