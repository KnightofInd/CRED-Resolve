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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const getSplitTypeLabel = (type: string) => {
    return type === 'equal' ? '= Equal Split' : type === 'exact' ? 'Exact Amount' : '% Percentage';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
        <div style={{ color: '#6b7280', fontSize: '16px' }}>Loading expenses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px', color: '#dc2626' }}>
        <span style={{ fontSize: '24px', marginRight: '8px' }}>⚠️</span>{error}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div style={{ background: 'white', borderRadius: '16px', padding: '60px 40px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>💸</div>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1f36', marginBottom: '12px' }}>No expenses yet</h3>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Add your first expense to start tracking!</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '32px', borderBottom: '2px solid #f3f4f6', marginBottom: '24px' }}>
        <button style={{ padding: '12px 0', fontSize: '15px', fontWeight: '600', color: '#1a1f36', border: 'none', background: 'none', borderBottom: '2px solid #10b981', marginBottom: '-2px', cursor: 'pointer' }}>
          📋 Expenses
        </button>
        <button style={{ padding: '12px 0', fontSize: '15px', fontWeight: '500', color: '#6b7280', border: 'none', background: 'none', cursor: 'pointer' }}>
          ⚖️ Balances
        </button>
      </div>

      {/* Expenses List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {expenses.map((expense) => (
          <div
            key={expense.id}
            style={{
              padding: '20px',
              background: '#f8fafb',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', background: '#dcfce7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                  💵
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1f36', margin: 0 }}>{expense.description}</h4>
                    <span style={{ fontSize: '12px', background: '#e0e7ff', color: '#4338ca', padding: '3px 10px', borderRadius: '12px', fontWeight: '500' }}>
                      {getSplitTypeLabel(expense.split_type)}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    User paid • {formatDate(expense.created_at)}
                  </div>
                  
                  {/* Splits breakdown */}
                  <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {expense.splits.map((split, idx) => (
                      <div key={idx} style={{ fontSize: '13px', color: '#374151' }}>
                        <span style={{ fontWeight: '600', color: '#10b981' }}>U{split.user_id.substring(0, 2)}</span> ${Number(split.amount).toFixed(2)}
                        <span style={{ color: '#9ca3af', marginLeft: '4px' }}>({((Number(split.amount) / Number(expense.amount)) * 100).toFixed(0)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1f36', marginBottom: '4px' }}>${Number(expense.amount).toFixed(2)}</div>
                <button
                  onClick={() => handleDelete(expense.id)}
                  style={{
                    fontSize: '12px',
                    color: '#ef4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    textDecoration: 'underline',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
