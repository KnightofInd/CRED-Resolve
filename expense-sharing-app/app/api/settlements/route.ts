import { createClient } from '@/lib/supabase-server';
import {
  successResponse,
  errorResponse,
  handleApiError,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/api-response';
import { isValidAmount, roundToTwo } from '@/lib/validation';
import { NextRequest } from 'next/server';

/**
 * GET /api/settlements?group_id=xxx
 * Fetch settlement history for a group
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('group_id');

    if (!groupId) {
      return validationErrorResponse('group_id is required');
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

    // Verify user is a member of the group
    const { data: membership } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return unauthorizedResponse('You are not a member of this group');
    }

    // Fetch settlements
    const { data: settlements, error: settlementsError } = await supabase
      .from('settlements')
      .select('*')
      .eq('group_id', groupId)
      .order('settled_at', { ascending: false });

    if (settlementsError) {
      return errorResponse(settlementsError.message);
    }

    return successResponse(settlements || []);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/settlements
 * Record a settlement between two users
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return unauthorizedResponse();
    }

    // Parse request body
    const body = await request.json();
    const { group_id, from_user_id, to_user_id, amount } = body;

    // Validate input
    if (!group_id) {
      return validationErrorResponse('group_id is required');
    }

    if (!from_user_id) {
      return validationErrorResponse('from_user_id is required');
    }

    if (!to_user_id) {
      return validationErrorResponse('to_user_id is required');
    }

    if (from_user_id === to_user_id) {
      return validationErrorResponse('Cannot settle with yourself');
    }

    if (!isValidAmount(amount)) {
      return validationErrorResponse('Invalid amount');
    }

    // Verify user is a member of the group
    const { data: membership } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group_id)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return unauthorizedResponse('You are not a member of this group');
    }

    // Verify both users are members of the group
    const { data: fromMember } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group_id)
      .eq('user_id', from_user_id)
      .single();

    const { data: toMember } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group_id)
      .eq('user_id', to_user_id)
      .single();

    if (!fromMember || !toMember) {
      return validationErrorResponse('Both users must be members of the group');
    }

    // Create settlement record
    const { data: settlement, error: settlementError } = await supabase
      .from('settlements')
      .insert({
        group_id,
        from_user_id,
        to_user_id,
        amount: roundToTwo(amount),
      })
      .select()
      .single();

    if (settlementError) {
      return errorResponse(settlementError.message);
    }

    // Note: We're tracking settlements dynamically by recalculating balances
    // We could also update a balances table here, but that adds complexity
    // For this implementation, we calculate balances on-the-fly

    return successResponse(settlement, 'Settlement recorded successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
