import { roundToTwo } from './validation';

export interface Balance {
  user_id: string;
  balance: number; // Positive = owed to user, Negative = user owes
}

export interface SimplifiedDebt {
  from_user_id: string;
  to_user_id: string;
  amount: number;
}

/**
 * Calculate balances for a group based on expenses and splits
 * Returns map of user_id -> net balance
 */
export function calculateGroupBalances(
  expenses: Array<{
    id: string;
    paid_by: string;
    amount: number;
    splits: Array<{
      user_id: string;
      amount: number;
    }>;
  }>
): Map<string, number> {
  const balances = new Map<string, number>();

  for (const expense of expenses) {
    // Person who paid gets credited
    const currentPaidByBalance = balances.get(expense.paid_by) || 0;
    balances.set(
      expense.paid_by,
      roundToTwo(currentPaidByBalance + expense.amount)
    );

    // Each person in the split gets debited their share
    for (const split of expense.splits) {
      const currentBalance = balances.get(split.user_id) || 0;
      balances.set(split.user_id, roundToTwo(currentBalance - split.amount));
    }
  }

  return balances;
}

/**
 * Simplify debts using a greedy algorithm
 * Minimizes the number of transactions needed to settle all balances
 */
export function simplifyDebts(balances: Map<string, number>): SimplifiedDebt[] {
  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors: Balance[] = [];
  const debtors: Balance[] = [];

  for (const [userId, balance] of balances.entries()) {
    const roundedBalance = roundToTwo(balance);

    if (roundedBalance > 0) {
      creditors.push({ user_id: userId, balance: roundedBalance });
    } else if (roundedBalance < 0) {
      debtors.push({ user_id: userId, balance: Math.abs(roundedBalance) });
    }
    // Skip if balance is 0
  }

  // Sort creditors and debtors by balance (descending)
  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => b.balance - a.balance);

  const transactions: SimplifiedDebt[] = [];
  let creditorIdx = 0;
  let debtorIdx = 0;

  // Greedy algorithm: match largest creditor with largest debtor
  while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
    const creditor = creditors[creditorIdx];
    const debtor = debtors[debtorIdx];

    // Amount to settle is the minimum of what's owed and what's due
    const settleAmount = roundToTwo(
      Math.min(creditor.balance, debtor.balance)
    );

    if (settleAmount > 0) {
      transactions.push({
        from_user_id: debtor.user_id,
        to_user_id: creditor.user_id,
        amount: settleAmount,
      });
    }

    // Update balances
    creditor.balance = roundToTwo(creditor.balance - settleAmount);
    debtor.balance = roundToTwo(debtor.balance - settleAmount);

    // Move to next creditor/debtor if current one is settled
    if (creditor.balance === 0) {
      creditorIdx++;
    }
    if (debtor.balance === 0) {
      debtorIdx++;
    }
  }

  return transactions;
}

/**
 * Get user-friendly balance summary
 */
export interface BalanceSummary {
  user_id: string;
  balance: number;
  status: 'owed' | 'owes' | 'settled';
  amount: number; // Absolute value
}

export function getBalanceSummaries(
  balances: Map<string, number>
): BalanceSummary[] {
  const summaries: BalanceSummary[] = [];

  for (const [userId, balance] of balances.entries()) {
    const roundedBalance = roundToTwo(balance);

    if (roundedBalance > 0) {
      summaries.push({
        user_id: userId,
        balance: roundedBalance,
        status: 'owed',
        amount: roundedBalance,
      });
    } else if (roundedBalance < 0) {
      summaries.push({
        user_id: userId,
        balance: roundedBalance,
        status: 'owes',
        amount: Math.abs(roundedBalance),
      });
    } else {
      summaries.push({
        user_id: userId,
        balance: 0,
        status: 'settled',
        amount: 0,
      });
    }
  }

  return summaries;
}

/**
 * Calculate what a specific user owes/is owed in a group
 */
export interface UserBalance {
  total_paid: number;
  total_share: number;
  net_balance: number;
  owes_to: Array<{ user_id: string; amount: number }>;
  owed_by: Array<{ user_id: string; amount: number }>;
}

export function calculateUserBalance(
  userId: string,
  expenses: Array<{
    id: string;
    paid_by: string;
    amount: number;
    splits: Array<{
      user_id: string;
      amount: number;
    }>;
  }>
): UserBalance {
  let totalPaid = 0;
  let totalShare = 0;

  // Calculate total paid by user
  for (const expense of expenses) {
    if (expense.paid_by === userId) {
      totalPaid = roundToTwo(totalPaid + expense.amount);
    }

    // Calculate user's share
    const userSplit = expense.splits.find((s) => s.user_id === userId);
    if (userSplit) {
      totalShare = roundToTwo(totalShare + userSplit.amount);
    }
  }

  const netBalance = roundToTwo(totalPaid - totalShare);

  // Calculate simplified debts
  const allBalances = calculateGroupBalances(expenses);
  const simplifiedDebts = simplifyDebts(allBalances);

  // Filter debts related to this user
  const owesTo = simplifiedDebts
    .filter((debt) => debt.from_user_id === userId)
    .map((debt) => ({
      user_id: debt.to_user_id,
      amount: debt.amount,
    }));

  const owedBy = simplifiedDebts
    .filter((debt) => debt.to_user_id === userId)
    .map((debt) => ({
      user_id: debt.from_user_id,
      amount: debt.amount,
    }));

  return {
    total_paid: totalPaid,
    total_share: totalShare,
    net_balance: netBalance,
    owes_to: owesTo,
    owed_by: owedBy,
  };
}
