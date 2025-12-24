import { requireAuth } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/lib/auth';
import LogoutButton from '@/components/LogoutButton';
import GroupsList from '@/components/GroupsList';

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: '#666' }}>
            Welcome, {user.email}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <Link
          href="/groups/create"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}
        >
          + Create Group
        </Link>
      </div>

      <GroupsList />
    </div>
  );
}
