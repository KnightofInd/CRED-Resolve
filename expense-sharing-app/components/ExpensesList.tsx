'use client';

import { useEffect, useState } from 'react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  paid_by: string;
  split_type: string;
  created_at: string;
  splits: Array<{
    user_id: string;
    amount: number;
  }>;
}

interface ExpensesListProps {
  groupId: string;
}

export default function ExpensesList({ groupId }: ExpensesListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`/api/expenses?group_id=${groupId}`);
      const result = await res.json();

      if (result.success) {
        setExpenses(result.data);
      } else {
        setError(result.error || 'Failed to load expenses');
      }
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const res = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (result.success) {
        setExpenses(expenses.filter((e) => e.id !== expenseId));
      } else {
        alert(result.error || 'Failed to delete expense');
      }
    } catch (err) {
      alert('Failed to delete expense');
    }
  };

  if (loading) {
    return <div>Loading expenses...</div>;
  }

  if (error) {
    return <div style={{ color: '#c00' }}>{error}</div>;
  }

  if (expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No expenses yet. Add your first expense to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {expenses.map((expense) => (
        <div
          key={expense.id}
          style={{
            padding: '15px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {expense.description}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              ${Number(expense.amount).toFixed(2)} • {expense.split_type} split •{' '}
              {new Date(expense.created_at).toLocaleDateString()}
            </div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
              {expense.splits.length} {expense.splits.length === 1 ? 'person' : 'people'} involved
            </div>
          </div>
          <button
            onClick={() => handleDelete(expense.id)}
            style={{
              padding: '6px 12px',
              fontSize: '14px',
              color: '#c00',
              backgroundColor: 'white',
              border: '1px solid #fcc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
