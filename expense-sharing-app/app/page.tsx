import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafb' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: '#10b981', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            💰
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1f36' }}>SplitWise Pro</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Expense Sharing Made Simple</div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          {/* Left Side - Content */}
          <div>
            <div style={{ display: 'inline-block', background: '#dcfce7', color: '#065f46', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', marginBottom: '24px' }}>
              ✨ Smart Financial Management
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#1a1f36', marginBottom: '24px', lineHeight: '1.2' }}>
              Split Expenses.<br/>Track Balances.<br/>
              <span style={{ color: '#10b981' }}>Settle Debts.</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '40px', lineHeight: '1.7' }}>
              The smartest way to share expenses with friends, roommates, and groups. 
              Automatic balance tracking and intelligent debt simplification.
            </p>
            
            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
              <Link
                href="/auth/register"
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  background: '#10b981',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  display: 'inline-block',
                }}
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1f36',
                  background: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  display: 'inline-block',
                }}
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>100%</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Free to Use</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>🔒</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Bank-Grade Security</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>⚡</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Real-Time Updates</div>
              </div>
            </div>
          </div>

          {/* Right Side - Feature Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
              <div style={{ width: '48px', height: '48px', background: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                📊
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1f36', marginBottom: '8px' }}>Smart Expense Splitting</h3>
              <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>
                Split expenses equally, by exact amounts, or custom percentages. Flexible options for any situation.
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
              <div style={{ width: '48px', height: '48px', background: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                💳
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1f36', marginBottom: '8px' }}>Automatic Balance Tracking</h3>
              <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>
                See who owes what at a glance. Real-time balance updates with every expense added.
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
              <div style={{ width: '48px', height: '48px', background: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                🔄
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1f36', marginBottom: '8px' }}>Intelligent Debt Simplification</h3>
              <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>
                Minimize transactions needed to settle all debts using smart algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '24px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
          © 2025 SplitWise Pro. Built with ❤️ for hassle-free expense sharing.
        </div>
      </div>
    </div>
  );
}
