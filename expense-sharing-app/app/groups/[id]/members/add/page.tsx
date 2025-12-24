'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AddMemberPage({ params }: PageProps) {
  const { id: groupId } = use(params);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'admin'>('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email.trim()) {
        setError('Please provide an email address');
        setLoading(false);
        return;
      }

      const body = {
        email: email.trim(),
        role,
      };

      const res = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        router.push(`/groups/${groupId}`);
        router.refresh();
      } else {
        setError(result.error || 'Failed to add member');
      }
    } catch (err) {
      setError('Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafb', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <Link 
            href={`/groups/${groupId}`} 
            style={{ color: '#10b981', textDecoration: 'none', fontSize: '15px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            ← Back to Group
          </Link>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1f36', marginBottom: '8px' }}>Add Member</h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Invite someone to join this group</p>
          </div>

          {error && (
            <div
              style={{
                padding: '14px 16px',
                marginBottom: '24px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                color: '#dc2626',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleAddMember}>
            <div style={{ 
              padding: '16px', 
              background: '#dbeafe', 
              borderRadius: '10px', 
              marginBottom: '24px',
              border: '1px solid #93c5fd'
            }}>
              <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                ℹ️ <strong>Note:</strong> Enter the email address of a registered user to add them to this group.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="email"
                style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="user@example.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              />
              <small style={{ color: '#9ca3af', fontSize: '13px', marginTop: '6px', display: 'block' }}>
                The user must have an account with this email
              </small>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label
                htmlFor="role"
                style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px' }}
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'member' | 'admin')}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <small style={{ color: '#9ca3af', fontSize: '13px', marginTop: '6px', display: 'block' }}>
                Admins can add members and edit group settings
              </small>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                background: loading || !email.trim() ? '#9ca3af' : '#10b981',
                border: 'none',
                borderRadius: '10px',
                cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
                boxShadow: loading || !email.trim() ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Adding Member...' : 'Add Member'}
            </button>
          </form>
        </div>

        <div style={{ marginTop: '24px', padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1f36', marginBottom: '12px' }}>
            💡 How to add members
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>
            <li>The user must have a registered account with the email address</li>
            <li>They will be added to the group immediately after submission</li>
            <li>New members will be able to view and add expenses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}