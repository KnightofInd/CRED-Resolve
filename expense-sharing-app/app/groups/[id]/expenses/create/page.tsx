'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
}

export default function CreateExpensePage({ params }: PageProps) {
  const { id: groupId } = use(params);
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'exact' | 'percentage'>('equal');
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [splits, setSplits] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      const result = await res.json();

      if (result.success && result.data.members) {
        setMembers(result.data.members);
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

  const toggleMember = (userId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedMembers(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        setError('Invalid amount');
        setLoading(false);
        return;
      }

      if (selectedMembers.size === 0) {
        setError('Select at least one member for the split');
        setLoading(false);
        return;
      }

      // Build splits array based on split type
      let splitsArray: Array<{ user_id: string; amount: number }> = [];

      if (splitType === 'equal') {
        // For equal splits, just send user IDs
        splitsArray = Array.from(selectedMembers).map((userId) => ({
          user_id: userId,
          amount: 0, // Will be calculated on server
        }));
      } else if (splitType === 'exact' || splitType === 'percentage') {
        // For exact/percentage, use specified amounts
        splitsArray = Array.from(selectedMembers).map((userId) => {
          const splitAmount = parseFloat(splits[userId] || '0');
          if (isNaN(splitAmount) || splitAmount < 0) {
            throw new Error(`Invalid split amount for user ${userId}`);
          }
          return {
            user_id: userId,
            amount: splitAmount,
          };
        });
      }

      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_id: groupId,
          description,
          amount: amountNum,
          split_type: splitType,
          splits: splitsArray,
        }),
      });

      const result = await res.json();

      if (result.success) {
        router.push(`/groups/${groupId}`);
        router.refresh();
      } else {
        setError(result.error || 'Failed to create expense');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <Link
          href={`/groups/${groupId}`}
          style={{ color: '#0070f3', textDecoration: 'none' }}
        >
          ← Back to Group
        </Link>
      </div>

      <h1 style={{ marginBottom: '30px' }}>Add Expense</h1>

      {error && (
        <div
          style={{
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c00',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="description"
            style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
          >
            Description *
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={loading}
            placeholder="e.g., Dinner at Italian restaurant"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="amount"
            style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
          >
            Amount *
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            disabled={loading}
            placeholder="0.00"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
          >
            Split Type *
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {(['equal', 'exact', 'percentage'] as const).map((type) => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="splitType"
                  value={type}
                  checked={splitType === type}
                  onChange={(e) => setSplitType(e.target.value as any)}
                  disabled={loading}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}
          >
            Split Between *
          </label>
          {members.length === 0 ? (
            <div style={{ color: '#666' }}>Loading members...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {members.map((member) => (
                <div
                  key={member.user_id}
                  style={{
                    padding: '10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.has(member.user_id)}
                    onChange={() => toggleMember(member.user_id)}
                    disabled={loading}
                  />
                  <div style={{ flex: 1 }}>
                    {member.user_id.substring(0, 8)}...
                  </div>
                  {selectedMembers.has(member.user_id) &&
                    (splitType === 'exact' || splitType === 'percentage') && (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={splitType === 'percentage' ? '%' : '$'}
                        value={splits[member.user_id] || ''}
                        onChange={(e) =>
                          setSplits({ ...splits, [member.user_id]: e.target.value })
                        }
                        disabled={loading}
                        style={{
                          width: '100px',
                          padding: '5px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: loading ? '#999' : '#0070f3',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Creating...' : 'Create Expense'}
        </button>
      </form>
    </div>
  );
}
