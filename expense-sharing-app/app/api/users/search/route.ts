import { createClient } from '@/lib/supabase-server';
import {
  successResponse,
  errorResponse,
  handleApiError,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/api-response';
import { NextRequest } from 'next/server';
import { isValidEmail } from '@/lib/validation';

/**
 * GET /api/users/search?email=xxx
 * Search for a user by email
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return validationErrorResponse('Email is required');
    }

    if (!isValidEmail(email)) {
      return validationErrorResponse('Invalid email format');
    }

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return unauthorizedResponse();
    }

    // Search for user by email in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email.toLowerCase())
      .single();

    if (profileError || !profile) {
      return errorResponse('No user found with that email address');
    }

    return successResponse({
      id: profile.id,
      email: profile.email,
      name: profile.full_name,
    });

  } catch (error) {
    return handleApiError(error);
  }
}
