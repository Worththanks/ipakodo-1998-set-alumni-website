import { getSession, getRole } from './auth.js';

/**
 * Protects pages by authentication and role
 * @param {string[]} allowedRoles - e.g. ['admin'], ['exec','admin']
 */
export async function requireAuth(allowedRoles = []) {
  const session = await getSession();

  // Not logged in → go to login
  if (!session) {
    window.location.replace('/auth/login.html');
    return;
  }

  // No role restriction → allow access
  if (!allowedRoles.length) return;

  const role = await getRole();

  // Safety fallback
  if (!role) {
    window.location.replace('/pages/dashboard/profile.html');
    return;
  }

  // Role not allowed → fallback dashboard
  if (!allowedRoles.includes(role)) {
    window.location.replace('/pages/dashboard/profile.html');
  }
}
