'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Group {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  created_at: string;
}

export default function GroupsList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/groups');
      const result = await res.json();

      if (result.success) {
        setGroups(result.data);
      } else {
        setError(result.error || 'Failed to load groups');
      }
    } catch (err) {
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
        <div style={{ color: '#6b7280', fontSize: '16px' }}>Loading your groups...</div>
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

  if (groups.length === 0) {
    return (
      <div style={{ background: 'white', borderRadius: '16px', padding: '60px 40px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>👥</div>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1f36', marginBottom: '12px' }}>No groups yet</h3>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Create your first group to start managing shared expenses!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1f36', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>👥</span> Your Groups
      </h2>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {groups.map((group) => (
          <Link
            key={group.id}
            href={`/groups/${group.id}`}
            style={{
              display: 'block',
              padding: '24px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '16px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1f36', flex: 1 }}>{group.name}</h3>
              <div style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
              </div>
            </div>
            {group.description && (
              <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '15px', lineHeight: '1.5' }}>
                {group.description}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
              View Details →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
