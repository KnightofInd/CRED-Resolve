import Link from 'next/link';

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)',
        }}
      />
      
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '20px', fontSize: '64px' }}>💰</div>
        <h1 style={{ fontSize: '56px', marginBottom: '20px', color: 'white', fontWeight: '800', letterSpacing: '-1px' }}>
          SplitWise Pro
        </h1>
        <p
          style={{
            fontSize: '22px',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '50px',
            maxWidth: '600px',
            lineHeight: '1.7',
          }}
        >
          Smart expense sharing with intelligent debt simplification.
          Track balances and settle up effortlessly.
        </p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            href="/auth/login"
            style={{
              padding: '16px 40px',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1a1f36',
              backgroundColor: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.2s',
            }}
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            style={{
              padding: '16px 40px',
              fontSize: '18px',
              fontWeight: '600',
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              textDecoration: 'none',
              borderRadius: '12px',
              border: '2px solid white',
              backdropFilter: 'blur(10px)',
            }}
          >
            Get Started
          </Link>
        </div>

        <div style={{ marginTop: '80px', maxWidth: '1000px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
            }}
          >
            <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>📊</div>
              <h3 style={{ marginBottom: '10px', color: 'white', fontWeight: '600', fontSize: '20px' }}>Smart Splits</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', lineHeight: '1.6' }}>
                Equal, exact, or percentage-based expense splitting
              </p>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>💳</div>
              <h3 style={{ marginBottom: '10px', color: 'white', fontWeight: '600', fontSize: '20px' }}>Live Balances</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', lineHeight: '1.6' }}>
                Real-time balance tracking with visual indicators
              </p>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔄</div>
              <h3 style={{ marginBottom: '10px', color: 'white', fontWeight: '600', fontSize: '20px' }}>Debt Simplification</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', lineHeight: '1.6' }}>
                Minimize transactions with intelligent algorithms
              </p>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔒</div>
              <h3 style={{ marginBottom: '10px', color: 'white', fontWeight: '600', fontSize: '20px' }}>Secure & Private</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', lineHeight: '1.6' }}>
                Bank-grade security with row-level data protection
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
