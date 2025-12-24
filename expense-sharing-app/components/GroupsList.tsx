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
    return <div>Loading groups...</div>;
  }

  if (error) {
    return <div style={{ color: '#c00' }}>{error}</div>;
  }

  if (groups.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No groups yet. Create your first group to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Your Groups</h2>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {groups.map((group) => (
          <Link
            key={group.id}
            href={`/groups/${group.id}`}
            style={{
              display: 'block',
              padding: '20px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'box-shadow 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ marginBottom: '10px' }}>{group.name}</h3>
            {group.description && (
              <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>
                {group.description}
              </p>
            )}
            <div style={{ fontSize: '14px', color: '#999' }}>
              {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
