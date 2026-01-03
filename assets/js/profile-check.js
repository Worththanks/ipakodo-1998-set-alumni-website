import { supabase } from './supabase-client.js';

export async function isProfileComplete() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('profile_completed')
    .eq('id', user.id)
    .single();

  if (error) return false;
  return data.profile_completed === true;
}
