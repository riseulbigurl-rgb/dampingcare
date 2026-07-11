import { useState } from 'react';
import InstallSection from './InstallSection';

const REDIRECT_URL =
  'https://p.me-page.com/d6edd2a7b45865ca5c80521f04ca58ec/Dampingcareoncall';

export default function App() {
  const [pressed, setPressed] = useState(false);

  function handleRedirect() {
    setPressed(true);
    window.location.assign(REDIRECT_URL);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 font-poppins select-none">
      {/* Decorative top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, #F8C8DC 0%, #FDEAF2 100%)' }}
      />

      {/* Card */}
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-0">
          <img
            src="/cropped_circle_image_(1).webp"
            alt="Dampingcare Logo"
            className="w-48 h-48 object-contain"
            draggable={false}
          />
        </div>

        {/* Text block */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1
            className="text-2xl font-bold leading-tight"
            style={{ color: '#2D2D2D', fontFamily: 'Poppins, sans-serif' }}
          >
            Selamat Datang di Dampingcare
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: '#6B7280', fontFamily: 'Poppins, sans-serif', maxWidth: '280px' }}
          >
            Silakan masuk untuk mengakses seluruh layanan Dampingcare.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleRedirect}
          disabled={pressed}
          className="w-full py-4 rounded-full text-white font-semibold text-base tracking-wide shadow-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4"
          style={{
            fontFamily: 'Poppins, sans-serif',
            background: pressed
              ? '#e8a0bb'
              : 'linear-gradient(135deg, #F8C8DC 0%, #f4a0c8 100%)',
            boxShadow: pressed
              ? '0 2px 8px rgba(248,200,220,0.3)'
              : '0 6px 24px rgba(248,200,220,0.6)',
            focusRingColor: '#F8C8DC',
            color: '#2D2D2D',
          }}
        >
          {pressed ? 'Mengalihkan...' : 'Masuk ke Dampingcare'}
        </button>

        {/* Install section */}
        <InstallSection />

        {/* Footer note */}
        <p
          className="text-xs text-center"
          style={{ color: '#B0B0B0', fontFamily: 'Poppins, sans-serif' }}
        >
          &copy; {new Date().getFullYear()} Dampingcare. All rights reserved.
        </p>
      </div>

      {/* Decorative bottom accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, #FDEAF2 0%, #F8C8DC 100%)' }}
      />

    </div>
  );
}
