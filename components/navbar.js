import { supabase } from '/assets/js/supabase-client.js';

/* =========================================================
   ACTIVE LINK HIGHLIGHT (desktop + mobile)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  // Desktop links
  document.querySelectorAll('.nav-links.desktop a').forEach(link => {
    const linkPath = link.getAttribute('href')?.replace(/\/$/, '');
    if (linkPath === currentPath) link.classList.add('active');
  });

  // Mobile links
  document.querySelectorAll('.sidebar .menu a').forEach(link => {
    const linkPath = link.getAttribute('href')?.replace(/\/$/, '');
    if (linkPath === currentPath) link.classList.add('active');
  });
});

/* =========================================================
   SUPABASE AUTH UI
   ========================================================= */

async function initNavbarAuth() {
  const { data: { user } } = await supabase.auth.getUser();

  const loginDesktop = document.getElementById('auth-login-desktop');
  const joinDesktop = document.getElementById('auth-join-desktop');
  const userBadgeDesktop = document.getElementById('user-badge-desktop');
  const userNameDesktop = document.getElementById('user-name-desktop');
  const avatarDesktop = document.getElementById('user-avatar');
  const roleBadgeDesktop = document.getElementById('role-badge');

  const loginMobile = document.getElementById('auth-login-mobile');
  const joinMobile = document.getElementById('auth-join-mobile');
  const userBadgeMobile = document.getElementById('user-badge-mobile');
  const userNameMobile = document.getElementById('user-name-mobile');
  const avatarMobile = document.getElementById('user-avatar-mobile');
  const roleBadgeMobile = document.getElementById('role-badge-mobile');

  const PLACEHOLDER_AVATAR = '/assets/images/logo/icon-128x128.png';

  if (!user) {
    // Logged out
    if (loginDesktop) loginDesktop.style.display = 'block';
    if (joinDesktop) joinDesktop.style.display = 'block';
    if (userBadgeDesktop) userBadgeDesktop.style.display = 'none';

    if (loginMobile) loginMobile.style.display = 'block';
    if (joinMobile) joinMobile.style.display = 'block';
    if (userBadgeMobile) userBadgeMobile.style.display = 'none';

    if (avatarDesktop) avatarDesktop.src = PLACEHOLDER_AVATAR;
    if (avatarMobile) avatarMobile.src = PLACEHOLDER_AVATAR;
    return;
  }

  // Logged in
  const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'Member';

  if (userNameDesktop) userNameDesktop.textContent = firstName;
  if (userNameMobile) userNameMobile.textContent = firstName;

  let avatarUrl = PLACEHOLDER_AVATAR;
  if (user.user_metadata?.avatar_url?.trim()) {
    avatarUrl = user.user_metadata.avatar_url;
  }
  if (avatarDesktop) avatarDesktop.src = avatarUrl;
  if (avatarMobile) avatarMobile.src = avatarUrl;

  const role = (user.user_metadata?.role || user.app_metadata?.role || 'member').toLowerCase();

  if (roleBadgeDesktop) {
    roleBadgeDesktop.textContent = role.toUpperCase();
    roleBadgeDesktop.className = `role-badge role-${role}`;
  }
  if (roleBadgeMobile) {
    roleBadgeMobile.textContent = role.toUpperCase();
    roleBadgeMobile.className = `role-badge role-${role}`;
  }

  if (loginDesktop) loginDesktop.style.display = 'none';
  if (joinDesktop) joinDesktop.style.display = 'none';
  if (userBadgeDesktop) userBadgeDesktop.style.display = 'block';

  if (loginMobile) loginMobile.style.display = 'none';
  if (joinMobile) joinMobile.style.display = 'none';
  if (userBadgeMobile) userBadgeMobile.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', initNavbarAuth);

/* =========================================================
   USER DROPDOWN (DESKTOP)
   ========================================================= */

(() => {
  const menu = document.getElementById('user-badge-desktop');
  const trigger = document.getElementById('user-menu-trigger');
  if (!menu || !trigger) return;

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', () => menu.classList.remove('open'));
})();

/* =========================================================
   LOGOUT
   ========================================================= */

window.logout = async () => {
  await supabase.auth.signOut();
  window.location.href = '/index.html';
};

/* =========================================================
   HOVER SOUND (extended to mobile links)
   ========================================================= */

(() => {
  const SOUND_SRC = '/assets/sounds/hover.wav';
  const hoverSound = new Audio(SOUND_SRC);
  hoverSound.volume = 0.25;
  hoverSound.preload = 'auto';

  let lastPlayed = 0;
  const COOLDOWN = 120;

  function playHoverSound() {
    const now = Date.now();
    if (now - lastPlayed < COOLDOWN) return;
    lastPlayed = now;
    hoverSound.currentTime = 0;
    hoverSound.play().catch(() => {});
  }

  function bindHoverSounds() {
    document.querySelectorAll('.navbar a, .sidebar a, .nav-toggle, .submenu-toggle').forEach(el => {
      el.addEventListener('mouseenter', playHoverSound);
      el.addEventListener('focus', playHoverSound);
    });
  }

  const wait = setInterval(() => {
    if (document.querySelector('.navbar')) {
      clearInterval(wait);
      bindHoverSounds();
    }
  }, 50);
})();