import { requireAuth } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/lib/auth';
import LogoutButton from '@/components/LogoutButton';
import GroupsList from '@/components/GroupsList';

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f8fafb 0%, #e7ecef 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1f36', marginBottom: '8px' }}>
                Financial Dashboard
              </h1>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>
                Welcome back, <span style={{ fontWeight: '600', color: '#10b981' }}>{user.email}</span>
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <Link
            href="/groups/create"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'transform 0.2s',
            }}
          >
            <span style={{ fontSize: '20px' }}>+</span> Create New Group
          </Link>
        </div>

        <GroupsList />
      </div>
    </div>
  );
}
