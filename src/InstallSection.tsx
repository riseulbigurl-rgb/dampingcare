import { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Share,
  ChevronDown,
  ChevronUp,
  Info,
  Apple,
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

function detectPlatform(): {
  os: 'android' | 'ios' | 'other';
} {
  const ua = navigator.userAgent.toLowerCase();
  const os: 'android' | 'ios' | 'other' = /android/.test(ua)
    ? 'android'
    : /iphone|ipad|ipod/.test(ua)
      ? 'ios'
      : 'other';
  return { os };
}

const APK_URL = 'https://dampingcare.com/latest.apk';

export default function InstallSection() {
  const { os } = detectPlatform();

  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [pwaSupported, setPwaSupported] = useState<boolean | null>(null);
  const [pwaInstalled, setPwaInstalled] = useState(isStandalone());

  const [apkState, setApkState] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    if (pwaInstalled) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setPwaSupported(true);
    };

    const installedHandler = () => {
      setPwaInstalled(true);
      setPwaSupported(false);
      setInstallEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    const timer = window.setTimeout(() => {
      if (installEvent === null) setPwaSupported(false);
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
      clearTimeout(timer);
    };
  }, [pwaInstalled, installEvent]);

  async function handlePwaInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setPwaSupported(false);
  }

  function handleDownloadApk() {
    setApkState('downloading');
    const link = document.createElement('a');
    link.href = APK_URL;
    link.download = 'Dampingcare.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => setApkState('done'), 1500);
  }

  const apkSteps = [
    'Buka file APK yang telah selesai diunduh.',
    'Jika muncul peringatan keamanan, pilih Izinkan instalasi dari sumber ini.',
    'Tekan Instal.',
    'Tunggu hingga proses selesai.',
    'Buka aplikasi Dampingcare.',
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
        {/* METODE 1 — Download APK (Android) */}
        {os === 'android' && (
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
                  Download APK
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: '#6B7280', fontFamily: 'Poppins, sans-serif' }}
                >
                  Unduh aplikasi Dampingcare (.apk) untuk perangkat Android.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadApk}
              disabled={apkState === 'downloading'}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-full text-white font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-70"
              style={{
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#FB5EA8',
                boxShadow: '0 3px 10px rgba(251, 94, 168, 0.3)',
              }}
            >
              <Download size={16} strokeWidth={2.5} />
              {apkState === 'downloading' ? 'Mengunduh...' : 'Download APK'}
            </button>
            {apkState === 'done' && (
              <div
                className="mt-3 rounded-xl p-4 flex flex-col gap-2"
                style={{ backgroundColor: '#FDF2F8' }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: '#FB5EA8', fontFamily: 'Poppins, sans-serif' }}
                >
                  Cara Instal APK
                </p>
                {apkSteps.map((step, i) => (
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
        )}

        {/* METODE 2 — Install Langsung (PWA) */}
        {pwaInstalled ? null : (
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
                  Install Dampingcare
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: '#6B7280', fontFamily: 'Poppins, sans-serif' }}
                >
                  Pasang aplikasi langsung tanpa perlu mengunduh APK (jika perangkat mendukung).
                </p>
              </div>
            </div>

            {pwaSupported ? (
              <button
                onClick={handlePwaInstall}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-full text-white font-semibold text-sm transition-all duration-200 active:scale-95"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  backgroundColor: '#FB5EA8',
                  boxShadow: '0 3px 10px rgba(251, 94, 168, 0.3)',
                }}
              >
                <Download size={16} strokeWidth={2.5} />
                Install Dampingcare
              </button>
            ) : pwaSupported === false ? (
              <div
                className="mt-3 rounded-xl p-4 flex flex-col gap-2"
                style={{ backgroundColor: '#FDF2F8' }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: '#FB5EA8', fontFamily: 'Poppins, sans-serif' }}
                >
                  Cara Instal
                </p>
                <div className="flex items-start gap-2">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#FB5EA8', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}
                  >
                    1
                  </span>
                  <p
                    className="text-xs pt-0.5"
                    style={{ color: '#2D2D2D', fontFamily: 'Poppins, sans-serif' }}
                  >
                    Tambahkan ke Layar Utama.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: '#FB5EA8', color: '#FFFFFF', fontFamily: 'Poppins, sans-serif' }}
                  >
                    2
                  </span>
                  <p
                    className="text-xs pt-0.5"
                    style={{ color: '#2D2D2D', fontFamily: 'Poppins, sans-serif' }}
                  >
                    Install Aplikasi.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* METODE 3 — iPhone / iPad */}
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
                iPhone / iPad
              </h3>
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
