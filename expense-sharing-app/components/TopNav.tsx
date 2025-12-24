'use client';

import Link from 'next/link';

export default function TopNav() {
  return (
    <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ width: '40px', height: '40px', background: '#10b981', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            💰
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1f36' }}>SplitWise Pro</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Expense Sharing Made Simple</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
