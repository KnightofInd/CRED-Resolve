/**
 * Validation utilities for expense sharing app
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters
  return password.length >= 8;
}

export function isValidAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}

export function isValidSplitType(
  splitType: string
): splitType is 'equal' | 'exact' | 'percentage' {
  return ['equal', 'exact', 'percentage'].includes(splitType);
}

/**
 * Validate expense splits
 */
export interface ExpenseSplit {
  user_id: string;
  amount: number;
}

export function validateExpenseSplits(
  splits: ExpenseSplit[],
  totalAmount: number,
  splitType: 'equal' | 'exact' | 'percentage'
): { valid: boolean; error?: string } {
  if (!splits || splits.length === 0) {
    return { valid: false, error: 'At least one split is required' };
  }

  // Check for duplicate users
  const userIds = splits.map((s) => s.user_id);
  const uniqueUserIds = new Set(userIds);
  if (userIds.length !== uniqueUserIds.size) {
    return { valid: false, error: 'Duplicate users in splits' };
  }

  // Validate amounts
  for (const split of splits) {
    if (!isValidAmount(split.amount)) {
      return { valid: false, error: 'Invalid split amount' };
    }
  }

  // Validate split totals based on type
  const totalSplitAmount = splits.reduce((sum, split) => sum + split.amount, 0);

  if (splitType === 'equal') {
    // For equal splits, each user should have equal amount
    const expectedAmount = totalAmount / splits.length;
    const tolerance = 0.01; // Allow 1 cent tolerance for rounding

    for (const split of splits) {
      if (Math.abs(split.amount - expectedAmount) > tolerance) {
        return { valid: false, error: 'Equal splits must have equal amounts' };
      }
    }
  } else if (splitType === 'exact') {
    // For exact splits, total should match expense amount
    const tolerance = 0.01; // Allow 1 cent tolerance for rounding

    if (Math.abs(totalSplitAmount - totalAmount) > tolerance) {
      return {
        valid: false,
        error: `Split amounts (${totalSplitAmount}) must equal total amount (${totalAmount})`,
      };
    }
  } else if (splitType === 'percentage') {
    // For percentage splits, total should be 100%
    const tolerance = 0.01; // Allow small tolerance for rounding

    if (Math.abs(totalSplitAmount - 100) > tolerance) {
      return {
        valid: false,
        error: 'Percentage splits must total 100%',
      };
    }
  }

  return { valid: true };
}

/**
 * Round to 2 decimal places for currency
 */
export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate equal splits
 */
export function calculateEqualSplits(
  totalAmount: number,
  userIds: string[]
): ExpenseSplit[] {
  const perPerson = roundToTwo(totalAmount / userIds.length);
  let remaining = roundToTwo(totalAmount);

  const splits: ExpenseSplit[] = userIds.map((userId, index) => {
    if (index === userIds.length - 1) {
      // Last person gets the remaining amount to handle rounding
      return {
        user_id: userId,
        amount: remaining,
      };
    } else {
      remaining = roundToTwo(remaining - perPerson);
      return {
        user_id: userId,
        amount: perPerson,
      };
    }
  });

  return splits;
}

/**
 * Convert percentage splits to amounts
 */
export function convertPercentageToAmount(
  totalAmount: number,
  percentageSplits: ExpenseSplit[]
): ExpenseSplit[] {
  let remaining = roundToTwo(totalAmount);

  const splits = percentageSplits.map((split, index) => {
    if (index === percentageSplits.length - 1) {
      // Last person gets the remaining amount to handle rounding
      return {
        user_id: split.user_id,
        amount: remaining,
      };
    } else {
      const amount = roundToTwo((totalAmount * split.amount) / 100);
      remaining = roundToTwo(remaining - amount);
      return {
        user_id: split.user_id,
        amount,
      };
    }
  });

  return splits;
}
