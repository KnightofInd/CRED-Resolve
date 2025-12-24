import { createClient } from '@/lib/supabase-server';
import {
  successResponse,
  errorResponse,
  handleApiError,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/api-response';
import { NextRequest } from 'next/server';

/**
 * GET /api/users/profile?user_id=xxx
 * Get user profile information by user_id
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return validationErrorResponse('user_id is required');
    }

    const supabase = await createClient();

    // Get current user for authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return unauthorizedResponse();
    }

    // Fetch user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return errorResponse('User profile not found');
    }

    return successResponse({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
    });

  } catch (error) {
    return handleApiError(error);
  }
}
