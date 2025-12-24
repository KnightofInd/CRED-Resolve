import { requireAuth } from '@/lib/auth-server';
import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GroupHeader from '@/components/GroupHeader';
import ExpensesList from '@/components/ExpensesList';
import BalancesSummary from '@/components/BalancesSummary';
import TopNav from '@/components/TopNav';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch group details
  const { data: group, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !group) {
    notFound();
  }

  // Fetch members
  const { data: members } = await supabase
    .from('group_members')
    .select('id, user_id, role, joined_at')
    .eq('group_id', id)
    .order('joined_at', { ascending: true });

  return (
    <>
      <TopNav />
      <div style={{ minHeight: '100vh', background: '#f8fafb', padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <Link href="/dashboard" style={{ color: '#10b981', textDecoration: 'none', fontSize: '15px', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ← Back to Dashboard
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1f36', marginBottom: '4px' }}>{group.name}</h1>
              {group.description && (
                <p style={{ color: '#6b7280', fontSize: '16px' }}>{group.description}</p>
              )}
            </div>
            <Link
              href={`/groups/${id}/expenses/create`}
              style={{
                padding: '12px 24px',
                background: '#10b981',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              }}
            >
              + Add Expense
            </Link>
          </div>

          <GroupHeader group={group} members={members || []} currentUserId={user.id} groupId={id} />

          <div style={{ marginTop: '32px' }}>
            <ExpensesList groupId={id} />
          </div>
        </div>
      </div>
    </>
  );
}
