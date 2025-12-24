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
 * POST /api/groups/[id]/members
 * Add a member to a group (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return unauthorizedResponse();
    }

    // Check if user is admin
    const { data: membership } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.role !== 'admin') {
      return unauthorizedResponse('Only group admins can add members');
    }

    // Parse request body
    const body = await request.json();
    const { user_id, email, role } = body;

    let targetUserId = user_id;

    // If email is provided instead of user_id, look up the user
    if (!targetUserId && email) {
      if (!isValidEmail(email)) {
        return validationErrorResponse('Invalid email address');
      }

      // Note: In production, you'd need to query auth.users
      // For now, we'll require user_id
      return validationErrorResponse(
        'User lookup by email not implemented. Please provide user_id'
      );
    }

    if (!targetUserId) {
      return validationErrorResponse('user_id is required');
    }

    // Validate role
    const memberRole = role === 'admin' ? 'admin' : 'member';

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', targetUserId)
      .single();

    if (existingMember) {
      return validationErrorResponse('User is already a member of this group');
    }

    // Add member
    const { data: newMember, error: insertError } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: targetUserId,
        role: memberRole,
      })
      .select()
      .single();

    if (insertError) {
      return errorResponse(insertError.message);
    }

    return successResponse(newMember, 'Member added successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/groups/[id]/members/[memberId]
 * Remove a member from a group (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params;
    const supabase = await createClient();

    // Get member_id from query params
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('member_id');

    if (!memberId) {
      return validationErrorResponse('member_id is required');
    }

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return unauthorizedResponse();
    }

    // Check if user is admin
    const { data: membership } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.role !== 'admin') {
      return unauthorizedResponse('Only group admins can remove members');
    }

    // Remove member
    const { error: deleteError } = await supabase
      .from('group_members')
      .delete()
      .eq('id', memberId)
      .eq('group_id', groupId);

    if (deleteError) {
      return errorResponse(deleteError.message);
    }

    return successResponse(null, 'Member removed successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
