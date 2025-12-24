'use client';

import { useEffect, useState } from 'react';

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
  email?: string;
  full_name?: string;
}

interface GroupHeaderProps {
  group: Group;
  members: Member[];
  currentUserId: string;
  groupId: string;
}

interface Balance {
  user_id: string;
  balance: number;
}

export default function GroupHeader({ group, members, currentUserId, groupId }: GroupHeaderProps) {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [youOwe, setYouOwe] = useState(0);
  const [youAreOwed, setYouAreOwed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [memberProfiles, setMemberProfiles] = useState<Record<string, { name: string; email: string }>>({});

  useEffect(() => {
    fetchStats();
    fetchMemberProfiles();
  }, [groupId]);

  const fetchMemberProfiles = async () => {
    try {
      const profilesMap: Record<string, { name: string; email: string }> = {};
      
      for (const member of members) {
        try {
          const res = await fetch(`/api/users/profile?user_id=${member.user_id}`);
          const data = await res.json();
          if (data.success) {
            profilesMap[member.user_id] = {
              name: data.data.full_name || data.data.email.split('@')[0],
              email: data.data.email,
            };
          }
        } catch (err) {
          // If fetch fails, use fallback
          profilesMap[member.user_id] = {
            name: 'User',
            email: '',
          };
        }
      }
      
      setMemberProfiles(profilesMap);
    } catch (err) {
      console.error('Failed to fetch member profiles', err);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch expenses
      const expensesRes = await fetch(`/api/expenses?group_id=${groupId}`);
      const expensesData = await expensesRes.json();
      if (expensesData.success) {
        const total = expensesData.data.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0);
        setTotalExpenses(total);
      }

      // Fetch balances
      const balancesRes = await fetch(`/api/groups/${groupId}/balances`);
      const balancesData = await balancesRes.json();
      if (balancesData.success) {
        const myBalance = balancesData.data.find((b: Balance) => b.user_id === currentUserId);
        if (myBalance) {
          const balance = Number(myBalance.balance);
          if (balance > 0) {
            setYouAreOwed(balance);
            setYouOwe(0);
          } else {
            setYouOwe(Math.abs(balance));
            setYouAreOwed(0);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (userId: string) => {
    const profile = memberProfiles[userId];
    if (profile && profile.name) {
      const names = profile.name.split(' ');
      if (names.length >= 2) {
        return names[0][0] + names[1][0];
      }
      return profile.name.substring(0, 2);
    }
    return 'U' + userId.substring(0, 1);
  };

  const getMemberName = (userId: string) => {
    const profile = memberProfiles[userId];
    if (profile && profile.name) {
      return profile.name;
    }
    return userId.substring(0, 8);
  };

  const getColorForUser = (index: number) => {
    const colors = ['#d1fae5', '#dbeafe', '#fce7f3', '#fef3c7', '#e0e7ff'];
    return colors[index % colors.length];
  };

  return (
    <>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#dcfce7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📄</div>
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Total Expenses</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1f36' }}>${loading ? '...' : totalExpenses.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#dbeafe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👥</div>
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Members</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1f36' }}>{members.length}</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#dcfce7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📈</div>
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>You're Owed</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>${loading ? '...' : youAreOwed.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#fee2e2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📉</div>
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>You Owe</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>${loading ? '...' : youOwe.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Members */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: '15px', color: '#6b7280', marginBottom: '16px', fontWeight: '600' }}>Group Members</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {members.map((member, index) => (
            <div
              key={member.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: getColorForUser(index),
                padding: '8px 16px',
                borderRadius: '20px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#065f46' }}>
                {getInitials(member.user_id)}
              </div>
              <div style={{ fontSize: '14px', color: '#065f46' }}>
                {getMemberName(member.user_id)}
                {member.user_id === currentUserId && ' (you)'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
