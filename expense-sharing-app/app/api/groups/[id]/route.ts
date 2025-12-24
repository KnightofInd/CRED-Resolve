import { createClient } from '@/lib/supabase-server';
import {
  successResponse,
  errorResponse,
  handleApiError,
  unauthorizedResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { NextRequest } from 'next/server';

/**
 * GET /api/groups/[id]
 * Get group details including members
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return unauthorizedResponse();
    }

    // Fetch group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single();

    if (groupError) {
      return notFoundResponse('Group not found');
    }

    // Fetch members with user details (using raw SQL to join with auth.users)
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select('id, user_id, role, joined_at')
      .eq('group_id', id)
      .order('joined_at', { ascending: true });

    if (membersError) {
      return errorResponse(membersError.message);
    }

    return successResponse({
      ...group,
      members: members || [],
      member_count: members?.length || 0,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/groups/[id]
 * Update group details (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      .eq('group_id', id)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.role !== 'admin') {
      return unauthorizedResponse('Only group admins can update group details');
    }

    // Parse request body
    const body = await request.json();
    const { name, description } = body;

    // Update group
    const { data: group, error: updateError } = await supabase
      .from('groups')
      .update({
        name: name?.trim(),
        description: description?.trim() || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return errorResponse(updateError.message);
    }

    return successResponse(group, 'Group updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/groups/[id]
 * Delete a group (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      .eq('group_id', id)
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.role !== 'admin') {
      return unauthorizedResponse('Only group admins can delete groups');
    }

    // Delete group (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return errorResponse(deleteError.message);
    }

    return successResponse(null, 'Group deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
