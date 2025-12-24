import { createClient } from '@/lib/supabase-server';
import {
  successResponse,
  errorResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';
import { isValidEmail, isValidPassword } from '@/lib/validation';
import { NextRequest } from 'next/server';

/**
 * POST /api/auth/signup
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Parse request body
    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !isValidEmail(email)) {
      return validationErrorResponse('Valid email is required');
    }

    if (!password || !isValidPassword(password)) {
      return validationErrorResponse(
        'Password must be at least 8 characters long'
      );
    }

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    });

    if (error) {
      return errorResponse(error.message);
    }

    return successResponse(
      {
        user: data.user,
        session: data.session,
      },
      'User registered successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
