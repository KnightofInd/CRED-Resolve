import Link from 'next/link';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        Expense Sharing App
      </h1>
      <p
        style={{
          fontSize: '20px',
          color: '#666',
          marginBottom: '40px',
          maxWidth: '600px',
        }}
      >
        Split expenses with friends, roommates, and groups. Track who owes what
        and settle up easily.
      </p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link
          href="/auth/login"
          style={{
            padding: '12px 32px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#0070f3',
            textDecoration: 'none',
            borderRadius: '8px',
          }}
        >
          Sign In
        </Link>
        <Link
          href="/auth/register"
          style={{
            padding: '12px 32px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#0070f3',
            backgroundColor: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            border: '2px solid #0070f3',
          }}
        >
          Register
        </Link>
      </div>

      <div style={{ marginTop: '60px', maxWidth: '800px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Features</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            textAlign: 'left',
          }}
        >
          <div>
            <h3 style={{ marginBottom: '10px' }}>📊 Split Expenses</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Equal, exact, or percentage splits
            </p>
          </div>
          <div>
            <h3 style={{ marginBottom: '10px' }}>👥 Group Management</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Create groups for different occasions
            </p>
          </div>
          <div>
            <h3 style={{ marginBottom: '10px' }}>💰 Balance Tracking</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
              See who owes what at a glance
            </p>
          </div>
          <div>
            <h3 style={{ marginBottom: '10px' }}>✅ Settle Up</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Record payments and simplify debts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
