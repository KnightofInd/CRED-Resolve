import { createClient } from '@/lib/supabase-server';
import {
  successResponse,
  errorResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';
import { isValidEmail } from '@/lib/validation';
import { NextRequest } from 'next/server';

/**
 * POST /api/auth/login
 * Sign in an existing user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !isValidEmail(email)) {
      return validationErrorResponse('Valid email is required');
    }

    if (!password) {
      return validationErrorResponse('Password is required');
    }

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return errorResponse(error.message, 401);
    }

    return successResponse(
      {
        user: data.user,
        session: data.session,
      },
      'Signed in successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
