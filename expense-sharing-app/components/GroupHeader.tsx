'use client';

interface Group {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

interface GroupHeaderProps {
  group: Group;
  members: Member[];
  currentUserId: string;
}

export default function GroupHeader({ group, members, currentUserId }: GroupHeaderProps) {
  const currentUserMember = members.find((m) => m.user_id === currentUserId);
  const isAdmin = currentUserMember?.role === 'admin';

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ marginBottom: '10px' }}>{group.name}</h1>
          {group.description && (
            <p style={{ color: '#666', marginBottom: '10px' }}>{group.description}</p>
          )}
          <div style={{ fontSize: '14px', color: '#999' }}>
            {members.length} {members.length === 1 ? 'member' : 'members'}
            {isAdmin && ' • You are an admin'}
          </div>
        </div>
      </div>
    </div>
  );
}
