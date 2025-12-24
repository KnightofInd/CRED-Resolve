import { createClient } from '@/lib/supabase-server';
import {
  successResponse,
  handleApiError,
  unauthorizedResponse,
} from '@/lib/api-response';
import { NextRequest } from 'next/server';

/**
 * GET /api/auth/me
 * Get current user information
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return unauthorizedResponse();
    }

    return successResponse({
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
      created_at: user.created_at,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
