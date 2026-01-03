// report.js

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.report-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.report-tabs button')
        .forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.report-section')
        .forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
});