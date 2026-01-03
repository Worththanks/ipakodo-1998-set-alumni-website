// assets/js/loader.js — Component loader for navbar and footer with loading spinner

document.addEventListener("DOMContentLoaded", function () {

  // Loading Spinner Element (add to body or specific sections if needed)
  const spinner = document.createElement('div');
  spinner.classList.add('loading-spinner');
  document.body.appendChild(spinner);

  function loadComponent(targetId, filePath, scriptPath = null) {
    const target = document.getElementById(targetId);
    if (!target) return;

    // Show spinner while loading
    target.appendChild(spinner.cloneNode());

    fetch(filePath)
      .then(res => res.text())
      .then(html => {
        target.innerHTML = html;

        // Remove spinner after load
        target.querySelector('.loading-spinner').remove();

        if (scriptPath) {
          const s = document.createElement("script");
          s.src = scriptPath;
          document.body.appendChild(s);
        }
      })
      .catch(err => {
        console.error(err);
        target.querySelector('.loading-spinner').remove();
      });
  }

  loadComponent("navbar", "/components/navbar.html", "/components/navbar.js");
  loadComponent("footer", "/components/footer.html");
});

  document.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

