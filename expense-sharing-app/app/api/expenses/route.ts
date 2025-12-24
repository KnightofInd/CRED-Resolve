import { createClient } from '@/lib/supabase-server';
import {
  successResponse,
  errorResponse,
  handleApiError,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/api-response';
import {
  isValidAmount,
  isValidSplitType,
  validateExpenseSplits,
  calculateEqualSplits,
  convertPercentageToAmount,
  roundToTwo,
} from '@/lib/validation';
import { NextRequest } from 'next/server';

/**
 * GET /api/expenses?group_id=xxx
 * Fetch expenses for a group
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

    // Fetch expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (expensesError) {
      return errorResponse(expensesError.message);
    }

    // Fetch splits for each expense
    const expensesWithSplits = await Promise.all(
      expenses.map(async (expense) => {
        const { data: splits } = await supabase
          .from('expense_splits')
          .select('*')
          .eq('expense_id', expense.id);

        return {
          ...expense,
          splits: splits || [],
        };
      })
    );

    return successResponse(expensesWithSplits);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/expenses
 * Create a new expense with splits
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
    const { group_id, description, amount, split_type, splits } = body;

    // Validate input
    if (!group_id) {
      return validationErrorResponse('group_id is required');
    }

    if (!description || description.trim().length === 0) {
      return validationErrorResponse('description is required');
    }

    if (!isValidAmount(amount)) {
      return validationErrorResponse('Invalid amount');
    }

    if (!isValidSplitType(split_type)) {
      return validationErrorResponse(
        'split_type must be equal, exact, or percentage'
      );
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

    // Calculate splits based on type
    let finalSplits = splits;

    if (split_type === 'equal') {
      // Auto-calculate equal splits if not provided
      if (!splits || splits.length === 0) {
        return validationErrorResponse('User IDs required for equal split');
      }

      const userIds = splits.map((s: any) => s.user_id);
      finalSplits = calculateEqualSplits(amount, userIds);
    } else if (split_type === 'percentage') {
      // Convert percentages to amounts
      finalSplits = convertPercentageToAmount(amount, splits);
    }

    // Validate splits
    const validation = validateExpenseSplits(finalSplits, amount, split_type);
    if (!validation.valid) {
      return validationErrorResponse(validation.error!);
    }

    // Create expense in a transaction-like manner
    const { data: expense, error: expenseError } = await supabase
      .from('expenses')
      .insert({
        group_id,
        description: description.trim(),
        amount: roundToTwo(amount),
        paid_by: user.id,
        split_type,
      })
      .select()
      .single();

    if (expenseError) {
      return errorResponse(expenseError.message);
    }

    // Insert splits
    const splitsToInsert = finalSplits.map((split: any) => ({
      expense_id: expense.id,
      user_id: split.user_id,
      amount: roundToTwo(split.amount),
    }));

    const { data: insertedSplits, error: splitsError } = await supabase
      .from('expense_splits')
      .insert(splitsToInsert)
      .select();

    if (splitsError) {
      // Rollback: delete the expense
      await supabase.from('expenses').delete().eq('id', expense.id);
      return errorResponse('Failed to create expense splits: ' + splitsError.message);
    }

    // Return expense with splits
    return successResponse(
      {
        ...expense,
        splits: insertedSplits,
      },
      'Expense created successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
