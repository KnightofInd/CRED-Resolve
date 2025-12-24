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
 * GET /api/groups
 * Fetch all groups for the current user
 */
export async function GET(request: NextRequest) {
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

    // Fetch groups where user is a member
    const { data: groupMembers, error: membersError } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', user.id);

    if (membersError) {
      return errorResponse(membersError.message);
    }

    const groupIds = groupMembers.map((gm) => gm.group_id);

    if (groupIds.length === 0) {
      return successResponse([]);
    }

    // Fetch group details
    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('*')
      .in('id', groupIds)
      .order('created_at', { ascending: false });

    if (groupsError) {
      return errorResponse(groupsError.message);
    }

    // Fetch member counts for each group
    const groupsWithMembers = await Promise.all(
      groups.map(async (group) => {
        const { count } = await supabase
          .from('group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id);

        return {
          ...group,
          member_count: count || 0,
        };
      })
    );

    return successResponse(groupsWithMembers);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/groups
 * Create a new group
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
    const { name, description } = body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return validationErrorResponse('Group name is required');
    }

    if (name.length > 255) {
      return validationErrorResponse('Group name is too long');
    }

    // Create group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (groupError) {
      return errorResponse(groupError.message);
    }

    // Add creator as admin member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'admin',
      });

    if (memberError) {
      // Clean up: delete the group if member creation fails
      await supabase.from('groups').delete().eq('id', group.id);
      return errorResponse(memberError.message);
    }

    return successResponse(group, 'Group created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
