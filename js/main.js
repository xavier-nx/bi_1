"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const themeButton = document.querySelector("[data-theme-toggle]");
  const savedTheme = localStorage.getItem("bi-theme");

  if (savedTheme === "dark") document.body.classList.add("dark-theme");
  if (!themeButton) return;

  updateThemeButton(themeButton);
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("bi-theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
    updateThemeButton(themeButton);
  });
});

function updateThemeButton(button) {
  const isDark = document.body.classList.contains("dark-theme");
  button.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
  button.innerHTML = `<i class="bi ${isDark ? "bi-sun" : "bi-moon-stars"}" aria-hidden="true"></i>`;
}