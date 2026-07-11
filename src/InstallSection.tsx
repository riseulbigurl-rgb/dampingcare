import { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Apple,
  Plus,
} from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function InstallSection() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [pwaInstalled, setPwaInstalled] = useState(isStandalone());

  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    if (pwaInstalled) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };

    const installedHandler = () => {
      setPwaInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, [pwaInstalled]);

  async function handlePwaInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  const androidSteps = [
    'Buka menu browser (titik tiga di pojok kanan atas).',
    'Pilih Tambahkan ke Layar Utama.',
    'Tekan Install Aplikasi.',
    'Aplikasi Dampingcare akan muncul di layar utama.',
  ];

  const iosSteps = [
    'Buka website menggunakan Safari.',
    'Ketuk tombol Bagikan (Share).',
    'Pilih Add to Home Screen (Tambahkan ke Layar Utama).',
    'Ketuk Add (Tambah).',
    'Aplikasi Dampingcare akan muncul di layar utama seperti aplikasi biasa.',
  ];

  return (
    <div
      className="w-full rounded-3xl bg-white p-5 sm:p-6"
      style={{ boxShadow: '0 8px 30px rgba(251, 94, 168, 0.12)' }}
    >
      {/* Card header */}
      <div className="flex flex-col items-center text-center gap-1 mb-5">
        <h2
          className="text-lg font-bold"
          style={{ color: '#2D2D2D', fontFamily: 'Poppins, sans-serif' }}
        >
          Install Dampingcare
        </h2>
        <p
          className="text-xs"
          style={{ color: '#9CA3AF', fontFamily: 'Poppins, sans-serif' }}
        >
          Pilih salah satu metode instalasi di bawah ini.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* METODE 1 — Install Instan */}
        <div className="rounded-2xl border border-gray-100 p-4 transition-colors hover:border-pink-100">
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FCE7F3' }}
            >
              <Download size={20} style={{ color: '#FB5EA8' }} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-semibold"
                style={{ color: '#2D2D2D', fontFamily: 'Poppins, sans-serif' }}
              >
                Install Instan
              </h3>
              <p
                className="text-xs mt-0.5"
                style={{ color: '#6B7280', fontFamily: 'Poppins, sans-serif' }}
              >
                Pasang aplikasi langsung tanpa perlu mengunduh APK (jika perangkat mendukung).
              </p>
            </div>
          </div>
          {pwaInstalled ? (
            <p
              className="w-full mt-3 text-center py-2.5 rounded-full font-semibold text-sm"
              style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#FCE7F3', color: '#FB5EA8' }}
            >
              Aplikasi sudah terpasang
            </p>
          ) : (
            <button
              onClick={handlePwaInstall}
              disabled={!installEvent}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-full text-white font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-60"
              style={{
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#FB5EA8',
                boxShadow: '0 3px 10px rgba(251, 94, 168, 0.3)',
              }}
            >
              <Download size={16} strokeWidth={2.5} />
              Install Dampingcare
            </button>
          )}
        </div>

        {/* METODE 2 — Install untuk Android */}
        <div className="rounded-2xl border border-gray-100 p-4 transition-colors hover:border-pink-100">
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FCE7F3' }}
            >
              <Smartphone size={20} style={{ color: '#FB5EA8' }} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-semibold"
                style={{ color: '#2D2D2D', fontFamily: 'Poppins, sans-serif' }}
              >
                Install untuk Android
              </h3>
              <p
                className="text-xs mt-0.5"
                style={{ color: '#6B7280', fontFamily: 'Poppins, sans-serif' }}
              >
                Tambahkan aplikasi ke layar utama secara manual.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAndroidInstructions((v) => !v)}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95"
            style={{
              fontFamily: 'Poppins, sans-serif',
              backgroundColor: '#FCE7F3',
              color: '#FB5EA8',
            }}
          >
            {showAndroidInstructions ? 'Sembunyikan Panduan' : 'Cara Install di Android'}
            {showAndroidInstructions ? <ChevronUp size={16} strokeWidth={2.5} /> : <ChevronDown size={16} strokeWidth={2.5} />}
          </button>
          {showAndroidInstructions && (
            <div
              className="mt-3 rounded-xl p-4 flex flex-col gap-2"
              style={{ backgroundColor: '#FDF2F8' }}
            >
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: '#FB5EA8', fontFamily: 'Poppins, sans-serif' }}
              >
                Cara Install di Android
              </p>
              {androidSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#FB5EA8', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {i + 1}
                  </span>
                  <p
                    className="text-xs pt-0.5"
                    style={{ color: '#2D2D2D', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* METODE 3 — Install untuk iOS */}
        <div className="rounded-2xl border border-gray-100 p-4 transition-colors hover:border-pink-100">
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FCE7F3' }}
            >
              <Apple size={20} style={{ color: '#FB5EA8' }} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-semibold"
                style={{ color: '#2D2D2D', fontFamily: 'Poppins, sans-serif' }}
              >
                Install untuk iOS
              </h3>
              <p
                className="text-xs mt-0.5"
                style={{ color: '#6B7280', fontFamily: 'Poppins, sans-serif' }}
              >
                Tambahkan aplikasi ke layar utama di iPhone / iPad.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowIosInstructions((v) => !v)}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95"
            style={{
              fontFamily: 'Poppins, sans-serif',
              backgroundColor: '#FCE7F3',
              color: '#FB5EA8',
            }}
          >
            {showIosInstructions ? 'Sembunyikan Panduan' : 'Cara Install di iPhone'}
            {showIosInstructions ? <ChevronUp size={16} strokeWidth={2.5} /> : <ChevronDown size={16} strokeWidth={2.5} />}
          </button>
          {showIosInstructions && (
            <div
              className="mt-3 rounded-xl p-4 flex flex-col gap-2"
              style={{ backgroundColor: '#FDF2F8' }}
            >
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: '#FB5EA8', fontFamily: 'Poppins, sans-serif' }}
              >
                Cara Install di iPhone / iPad
              </p>
              {iosSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#FB5EA8', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {i + 1}
                  </span>
                  <p
                    className="text-xs pt-0.5"
                    style={{ color: '#2D2D2D', fontFamily: 'Poppins, sans-serif' }}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
