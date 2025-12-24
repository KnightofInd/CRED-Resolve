import { createClient } from '@/lib/supabase-server';
import {
  successResponse,
  errorResponse,
  handleApiError,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/api-response';
import {
  calculateGroupBalances,
  simplifyDebts,
  getBalanceSummaries,
  calculateUserBalance,
} from '@/lib/balance-engine';
import { NextRequest } from 'next/server';

/**
 * GET /api/balances?group_id=xxx
 * Calculate and return balances for a group
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('group_id');
    const userId = searchParams.get('user_id'); // Optional: get balance for specific user

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

    // Fetch all expenses for the group
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id, paid_by, amount')
      .eq('group_id', groupId);

    if (expensesError) {
      return errorResponse(expensesError.message);
    }

    // Fetch splits for all expenses
    const expensesWithSplits = await Promise.all(
      expenses.map(async (expense) => {
        const { data: splits } = await supabase
          .from('expense_splits')
          .select('user_id, amount')
          .eq('expense_id', expense.id);

        return {
          ...expense,
          splits: splits || [],
        };
      })
    );

    // If specific user requested
    if (userId) {
      const userBalance = calculateUserBalance(userId, expensesWithSplits);
      return successResponse(userBalance);
    }

    // Calculate balances for all users
    const balances = calculateGroupBalances(expensesWithSplits);
    const balanceSummaries = getBalanceSummaries(balances);
    const simplifiedDebts = simplifyDebts(balances);

    return successResponse({
      balances: balanceSummaries,
      simplified_debts: simplifiedDebts,
      total_expenses: expenses.length,
      total_amount: expenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
