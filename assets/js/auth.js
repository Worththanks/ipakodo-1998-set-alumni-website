import { supabase } from './supabase-client.js';

/* -------------------------------------------------
   INTERNAL: Normalize Member ID
------------------------------------------------- */
function normalizeMemberId(input) {
  const cleaned = input
    .toUpperCase()
    .replace(/[\s-]/g, '');

  if (!cleaned.startsWith('IPK98')) {
    throw new Error('Invalid Member ID format');
  }

  const body = cleaned.replace('IPK98', '');

  // Extract first 4 digits = DDMM
  const dateMatch = body.match(/^(\d{4})([A-Z]+)$/);
  if (!dateMatch) {
    throw new Error('Invalid Member ID format');
  }

  const [, ddmm, initials] = dateMatch;

  return `IPK98-${ddmm}-${initials}`;
}

/* -------------------------------------------------
   LOGIN (Email OR Member ID)
------------------------------------------------- */
export async function login(identifier, password) {
  let email = identifier.trim();

  // If NOT email → treat as Member ID
  if (!email.includes('@')) {
    const memberId = normalizeMemberId(email);

    const { data, error } = await supabase
      .from('auth.users')
      .select('email')
      .eq('raw_user_meta_data->>member_id_no', memberId)
      .single();

    if (error || !data?.email) {
      throw new Error('Invalid email or Member ID');
    }

    email = data.email;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data.user;
}

/* -------------------------------------------------
   REGISTER
------------------------------------------------- */
export async function register({ email, password, fullName, memberId }) {
  const normalizedId = normalizeMemberId(memberId);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        member_id_no: normalizedId,
        role: 'member',
        email_verified: false
      },
      emailRedirectTo: `${window.location.origin}/auth/confirm.html`
    }
  });

  if (error) throw error;
  return data.user;
}

/* -------------------------------------------------
   RESET PASSWORD
------------------------------------------------- */
export async function sendReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password.html`
  });
  if (error) throw error;
}

/* -------------------------------------------------
   UPDATE PASSWORD
------------------------------------------------- */
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
}

/* -------------------------------------------------
   MAGIC LINK
------------------------------------------------- */
export async function sendMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/login.html`
    }
  });
  if (error) throw error;
}

/* -------------------------------------------------
   INVITE USER
------------------------------------------------- */
export async function inviteUser(email, fullName, invitedBy) {
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      full_name: fullName,
      invited_by: invitedBy
    },
    redirectTo: `${window.location.origin}/auth/login.html`
  });
  if (error) throw error;
  return data;
}

/* -------------------------------------------------
   ROLE-BASED ACCESS CONTROL HELPERS
------------------------------------------------- */

/**
 * Get current user's role from metadata
 * @returns {string} role - 'member' | 'exec' | 'admin' | 'super_admin'
 */
export async function getRole() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata?.role || 'member';
}

/**
 * Check if current user has at least the required role
 * Role hierarchy: member < exec < admin < super_admin
 * @param {string} requiredRole - minimum role needed
 * @returns {boolean}
 */
export async function hasRole(requiredRole) {
  const role = await getRole();

  const hierarchy = {
    member: 1,
    exec: 2,
    admin: 3,
    super_admin: 4
  };

  return hierarchy[role] >= hierarchy[requiredRole];
}

/**
 * Require authentication and minimum role for protected pages
 * Redirects to login or fallback dashboard if not authorized
 * @param {string[]} allowedRoles - e.g. ['admin'], ['exec', 'admin']
 * @param {string} fallbackUrl - optional redirect (default: member dashboard)
 */
export async function requireAuth(allowedRoles = [], fallbackUrl = '/pages/dashboard/member-dashboard.html') {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.replace('/auth/login.html');
    return false;
  }

  if (allowedRoles.length === 0) return true; // Auth only, no role restriction

  const role = await getRole();

  const hierarchy = {
    member: 1,
    exec: 2,
    admin: 3,
    super_admin: 4
  };

  if (hierarchy[role] < (hierarchy[allowedRoles[0]] || 1)) {
    window.location.replace(fallbackUrl);
    return false;
  }

  // If multiple roles allowed, check explicitly
  if (allowedRoles.length > 1 && !allowedRoles.includes(role)) {
    window.location.replace(fallbackUrl);
    return false;
  }

  return true;
}

/**
 * Admin-only: Update user role
 * @param {string} userId - UUID of the user
 * @param {string} newRole - 'member' | 'exec' | 'admin' | 'super_admin'
 */
export async function updateUserRole(userId, newRole) {
  const currentRole = await getRole();
  if (!['admin', 'super_admin'].includes(currentRole)) {
    throw new Error('Insufficient permissions');
  }

  const validRoles = ['member', 'exec', 'admin', 'super_admin'];
  if (!validRoles.includes(newRole)) {
    throw new Error('Invalid role');
  }

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role: newRole }
  });

  if (error) throw error;
}

/* -------------------------------------------------
   SESSION / LOGOUT
------------------------------------------------- */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function logout() {
  await supabase.auth.signOut();
}