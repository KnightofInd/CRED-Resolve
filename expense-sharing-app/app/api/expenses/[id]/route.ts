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
 * GET /api/expenses/[id]
 * Get expense details with splits
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

    // Fetch expense
    const { data: expense, error: expenseError } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (expenseError) {
      return notFoundResponse('Expense not found');
    }

    // Verify user is a member of the group
    const { data: membership } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', expense.group_id)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return unauthorizedResponse('You are not a member of this group');
    }

    // Fetch splits
    const { data: splits } = await supabase
      .from('expense_splits')
      .select('*')
      .eq('expense_id', id);

    return successResponse({
      ...expense,
      splits: splits || [],
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/expenses/[id]
 * Delete an expense (only by creator)
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

    // Fetch expense
    const { data: expense, error: expenseError } = await supabase
      .from('expenses')
      .select('paid_by')
      .eq('id', id)
      .single();

    if (expenseError) {
      return notFoundResponse('Expense not found');
    }

    // Verify user is the creator
    if (expense.paid_by !== user.id) {
      return unauthorizedResponse('Only the expense creator can delete it');
    }

    // Delete expense (cascade will handle splits)
    const { error: deleteError } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return errorResponse(deleteError.message);
    }

    return successResponse(null, 'Expense deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
