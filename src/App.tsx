import { useState } from 'react';

const REDIRECT_URL =
  'https://p.me-page.com/d6edd2a7b45865ca5c80521f04ca58ec/Dampingcareoncall';

export default function App() {
  const [pressed, setPressed] = useState(false);

  function handleRedirect() {
    setPressed(true);
    window.location.href = REDIRECT_URL;
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #FDEAF2 0%, #FFFFFF 60%)',
        padding: '24px',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {/* Logo */}
      <img
        src="/icon-192.png"
        alt="Dampingcare"
        style={{
          width: '96px',
          height: '96px',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(251,94,168,0.25)',
          marginBottom: '24px',
        }}
        draggable={false}
      />

      {/* Title */}
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#2D2D2D',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        Dampingcare
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: '14px',
          color: '#6B7280',
          textAlign: 'center',
          maxWidth: '280px',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}
      >
        Layanan bantuan pendampingan untuk Anda, siap membantu kapan saja.
      </p>

      {/* Button */}
      <button
        onClick={handleRedirect}
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '14px 24px',
          borderRadius: '999px',
          border: 'none',
          background: '#FB5EA8',
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(251,94,168,0.4)',
          transform: pressed ? 'scale(0.97)' : 'scale(1)',
          transition: 'transform 0.15s ease',
        }}
      >
        Mulai Sekarang
      </button>
    </div>
  );
}
