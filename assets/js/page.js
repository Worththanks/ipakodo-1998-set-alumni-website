// assets/js/page.js — Main script for counters, scroll reveals, and general page interactions

// Scroll Reveal Functionality
function revealSections() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 150; // Adjust for when to trigger reveal
    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', revealSections);
revealSections(); // Initial check on load

// Animated Counters
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.animate-counter');
  const speed = 200; // Adjust speed (higher = slower)

  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target + (target > 0 ? '+' : '');
      }
    };

    updateCount();
  });
});

// Form Submission Handlers (for join, donate, contact - placeholder for now)
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Form submitted successfully!'); // Replace with actual submission logic (e.g., API call)
  });
});

// Image Hover Effects (for gallery)
document.querySelectorAll('.gallery-grid img').forEach(img => {
  img.addEventListener('mouseover', () => {
    img.style.transform = 'scale(1.05)';
    img.style.transition = 'transform 0.3s ease';
  });
  img.addEventListener('mouseout', () => {
    img.style.transform = 'scale(1)';
  });
});

// Supabase Initialization (add your Supabase URL and anon key)
const supabase = Supabase.createClient('https://ziwlrarebpqhfyurmnpa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppd2xyYXJlYnBxaGZ5dXJtbnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MzI1ODQsImV4cCI6MjA4MjEwODU4NH0.QYST23OHVQ2KwzGM2jBvjHuCB7Fs5F48CDtvsgNtfOY'
);

// Check auth state on load
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    document.getElementById('auth-link-desktop').style.display = 'none';
    document.getElementById('logout-link-desktop').style.display = 'block';
    document.getElementById('auth-link-mobile').style.display = 'none';
    document.getElementById('logout-link-mobile').style.display = 'block';
  }
});

// Logout function
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Error logging out: ' + error.message);
  } else {
    alert('Logged out successfully');
    location.reload(); // Reload to update nav
  }
}
// Add subtle shadow on scroll for better visibility
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* =========================================================
   HERO SLIDESHOW (SLOW & ELEGANT)
   ========================================================= */

(() => {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  let currentIndex = 0;
  const intervalTime = 8000; // 8 seconds per slide

  // Initialize
  slides[currentIndex].classList.add('is-active');

  setInterval(() => {
    slides[currentIndex].classList.remove('is-active');

    currentIndex = (currentIndex + 1) % slides.length;

    slides[currentIndex].classList.add('is-active');
  }, intervalTime);
})();
