import { requireAuth } from '@/lib/auth-server';
import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GroupHeader from '@/components/GroupHeader';
import ExpensesList from '@/components/ExpensesList';
import BalancesSummary from '@/components/BalancesSummary';

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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/dashboard" style={{ color: '#0070f3', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <GroupHeader group={group} members={members || []} currentUserId={user.id} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h2>Expenses</h2>
            <Link
              href={`/groups/${id}/expenses/create`}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              + Add Expense
            </Link>
          </div>
          <ExpensesList groupId={id} />
        </div>

        <div>
          <h2 style={{ marginBottom: '20px' }}>Balances</h2>
          <BalancesSummary groupId={id} />
        </div>
      </div>
    </div>
  );
}
