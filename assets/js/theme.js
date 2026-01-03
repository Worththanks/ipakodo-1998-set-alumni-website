// assets/js/theme.js — Theme toggle logic with local storage persistence

(function () {
  const STORAGE_KEY = "ipakodo-theme";
  const body = document.body;

  // Load saved theme or default to 'light'
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const theme = savedTheme === "blue" ? "blue" : "light";
  body.setAttribute("data-theme", theme);

  // Toggle function
  window.toggleTheme = function () {
    const current = body.getAttribute("data-theme");
    const next = current === "light" ? "blue" : "light";

    body.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  };
})();