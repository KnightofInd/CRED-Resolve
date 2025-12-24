import { createClient } from '@/lib/supabase-server';
import {
  successResponse,
  handleApiError,
  unauthorizedResponse,
} from '@/lib/api-response';
import { NextRequest } from 'next/server';

/**
 * POST /api/auth/logout
 * Sign out the current user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    // Sign out
    const { error } = await supabase.auth.signOut();

    if (error) {
      return unauthorizedResponse(error.message);
    }

    return successResponse(null, 'Signed out successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
