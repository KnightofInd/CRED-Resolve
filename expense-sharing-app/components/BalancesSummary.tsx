'use client';

import { useEffect, useState } from 'react';

interface BalanceSummary {
  user_id: string;
  balance: number;
  status: 'owed' | 'owes' | 'settled';
  amount: number;
}

interface SimplifiedDebt {
  from_user_id: string;
  to_user_id: string;
  amount: number;
}

interface BalancesData {
  balances: BalanceSummary[];
  simplified_debts: SimplifiedDebt[];
  total_expenses: number;
  total_amount: number;
}

interface BalancesSummaryProps {
  groupId: string;
}

export default function BalancesSummary({ groupId }: BalancesSummaryProps) {
  const [data, setData] = useState<BalancesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBalances();
  }, [groupId]);

  const fetchBalances = async () => {
    try {
      const res = await fetch(`/api/balances?group_id=${groupId}`);
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load balances');
      }
    } catch (err) {
      setError('Failed to load balances');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading balances...</div>;
  }

  if (error) {
    return <div style={{ color: '#c00' }}>{error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <div
        style={{
          padding: '15px',
          backgroundColor: '#f0f8ff',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
          Total Expenses
        </div>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          ${data.total_amount.toFixed(2)}
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
          {data.total_expenses} {data.total_expenses === 1 ? 'expense' : 'expenses'}
        </div>
      </div>

      {data.simplified_debts.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Suggested Payments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.simplified_debts.map((debt, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                <div style={{ marginBottom: '5px' }}>
                  <strong>From:</strong> {debt.from_user_id.substring(0, 8)}...
                </div>
                <div style={{ marginBottom: '5px' }}>
                  <strong>To:</strong> {debt.to_user_id.substring(0, 8)}...
                </div>
                <div style={{ fontWeight: 'bold', color: '#856404' }}>
                  Amount: ${debt.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.simplified_debts.length === 0 && (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            color: '#28a745',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
          }}
        >
          <strong>All settled up!</strong>
          <div style={{ fontSize: '14px', marginTop: '5px' }}>
            No outstanding balances in this group.
          </div>
        </div>
      )}
    </div>
  );
}
