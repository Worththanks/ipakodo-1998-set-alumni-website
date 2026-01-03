import { supabase } from '/assets/js/supabase-client.js';

/* =========================================================
   WAIT FOR NAVBAR ELEMENTS (CRITICAL ADDITION)
   ========================================================= */

function waitForNavbarElements(callback) {
  const interval = setInterval(() => {
    const toggleBtn = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('nav-links');

    if (toggleBtn && mobileMenu) {
      clearInterval(interval);
      callback(toggleBtn, mobileMenu);
    }
  }, 50);
}

/* =========================================================
   MOBILE MENU TOGGLE (SAFE + WORKING)
   ========================================================= */

waitForNavbarElements((toggleBtn, mobileMenu) => {

  // Overlay (added, not structural)
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);

  const openMenu = () => {
    mobileMenu.classList.add('nav-open');
    overlay.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('nav-open');
    overlay.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('nav-open')
      ? closeMenu()
      : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  console.log('✅ Mobile toggle bound successfully');
});

/* =========================================================
   ACTIVE LINK HIGHLIGHT (UNCHANGED)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.replace(/\/$/, '');

  links.forEach(link => {
    const linkPath = link.getAttribute('href')?.replace(/\/$/, '');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
});

/* =========================================================
   SUPABASE AUTH UI (UNCHANGED)
   ========================================================= */

async function initNavbarAuth() {
  const { data: { user } } = await supabase.auth.getUser();

  const loginDesktop = document.getElementById('auth-login-desktop');
  const userBadgeDesktop = document.getElementById('user-badge-desktop');
  const userNameDesktop = document.getElementById('user-name-desktop');
  const avatar = document.getElementById('user-avatar');
  const roleBadge = document.getElementById('role-badge');

  const loginMobile = document.getElementById('auth-login-mobile');
  const userBadgeMobile = document.getElementById('user-badge-mobile');
  const userNameMobile = document.getElementById('user-name-mobile');
  const logoutMobile = document.getElementById('logout-mobile');

  const PLACEHOLDER_AVATAR = '/assets/images/logo/icon-128x128.png';

  if (!user) {
    if (loginDesktop) loginDesktop.style.display = 'block';
    if (userBadgeDesktop) userBadgeDesktop.style.display = 'none';

    if (loginMobile) loginMobile.style.display = 'block';
    if (userBadgeMobile) userBadgeMobile.style.display = 'none';
    if (logoutMobile) logoutMobile.style.display = 'none';

    if (avatar) avatar.src = PLACEHOLDER_AVATAR;
    return;
  }

  const firstName =
    user.user_metadata?.full_name?.split(' ')[0] || 'Member';

  if (userNameDesktop) userNameDesktop.textContent = firstName;
  if (userNameMobile) userNameMobile.textContent = firstName;

  let avatarUrl = PLACEHOLDER_AVATAR;
  if (
    user.user_metadata?.avatar_url &&
    user.user_metadata.avatar_url.trim() !== ''
  ) {
    avatarUrl = user.user_metadata.avatar_url;
  }

  if (avatar) avatar.src = avatarUrl;

  const role =
    (user.user_metadata?.role ||
     user.app_metadata?.role ||
     'member').toLowerCase();

  if (roleBadge) {
    roleBadge.textContent = role;
    roleBadge.className = `role-badge role-${role}`;
  }

  if (loginDesktop) loginDesktop.style.display = 'none';
  if (userBadgeDesktop) userBadgeDesktop.style.display = 'block';

  if (loginMobile) loginMobile.style.display = 'none';
  if (userBadgeMobile) userBadgeMobile.style.display = 'block';
  if (logoutMobile) logoutMobile.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', initNavbarAuth);

/* =========================================================
   USER DROPDOWN (DESKTOP — UNCHANGED)
   ========================================================= */

(() => {
  const menu = document.getElementById('user-badge-desktop');
  const trigger = document.getElementById('user-menu-trigger');

  if (!menu || !trigger) return;

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    menu.classList.remove('open');
  });
})();

/* =========================================================
   LOGOUT (UNCHANGED)
   ========================================================= */

window.logout = async () => {
  await supabase.auth.signOut();
  window.location.href = '/index.html';
};


/* =========================================================
   NAVBAR HOVER SOUND (SUBTLE, PREMIUM)
   ========================================================= */

(() => {
  const SOUND_SRC = '/assets/sounds/hover.wav';

  // Create audio once
  const hoverSound = new Audio(SOUND_SRC);
  hoverSound.volume = 0.25; // subtle, premium
  hoverSound.preload = 'auto';

  let lastPlayed = 0;
  const COOLDOWN = 120; // ms — prevents rapid spam

  function playHoverSound() {
    const now = Date.now();
    if (now - lastPlayed < COOLDOWN) return;
    lastPlayed = now;

    // Restart sound cleanly
    hoverSound.currentTime = 0;
    hoverSound.play().catch(() => {
      /* silently fail if browser blocks */
    });
  }

  // Bind AFTER user interaction (browser safe)
  function bindHoverSounds() {
    const targets = document.querySelectorAll(
      '.navbar a, .nav-toggle, .user-greeting'
    );

    targets.forEach(el => {
      el.addEventListener('mouseenter', playHoverSound);
      el.addEventListener('focus', playHoverSound);
    });
  }

  // Wait until navbar exists
  const wait = setInterval(() => {
    if (document.querySelector('.navbar')) {
      clearInterval(wait);
      bindHoverSounds();
    }
  }, 50);
})();

/* =========================================================
   MOBILE MENU — HARD GUARANTEED BINDING (FINAL)
   ========================================================= */

(function hardBindMobileMenu() {

  function init() {
    const toggleBtn = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('nav-links');

    if (!toggleBtn || !mobileMenu) {
      return false;
    }

    // Prevent duplicate bindings
    if (toggleBtn.dataset.bound === 'true') {
      return true;
    }
    toggleBtn.dataset.bound = 'true';

    // Create overlay if missing
    let overlay = document.querySelector('.mobile-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-overlay';
      document.body.appendChild(overlay);
    }

    function openMenu() {
      mobileMenu.classList.add('nav-open');
      overlay.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      mobileMenu.classList.remove('nav-open');
      overlay.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      mobileMenu.classList.contains('nav-open')
        ? closeMenu()
        : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    console.log('✅ MOBILE MENU: HARD BOUND & ACTIVE');
    return true;
  }

  // Retry aggressively until navbar is injected
  const interval = setInterval(() => {
    if (init()) clearInterval(interval);
  }, 50);

})();
