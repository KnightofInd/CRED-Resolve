import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

/**
 * Get the current user on the server side
 * Throws an error if not authenticated
 */
export async function getServerUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized');
  }

  return user;
}

/**
 * Get the current user or redirect to login
 */
export async function requireAuth() {
  try {
    const user = await getServerUser();
    return user;
  } catch (error) {
    redirect('/auth/login');
  }
}

/**
 * Get the current session on the server side
 */
export async function getServerSession() {
  const supabase = await createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return session;
}

/**
 * Check if user is authenticated (returns boolean)
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}
