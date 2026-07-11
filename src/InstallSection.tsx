import { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Share,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info,
  ShieldAlert,
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
  browser: 'chrome' | 'samsung' | 'edge' | 'brave' | 'firefox' | 'safari' | 'other';
} {
  const ua = navigator.userAgent.toLowerCase();
  const os: 'android' | 'ios' | 'other' = /android/.test(ua)
    ? 'android'
    : /iphone|ipad|ipod/.test(ua)
      ? 'ios'
      : 'other';

  let browser: 'chrome' | 'samsung' | 'edge' | 'brave' | 'firefox' | 'safari' | 'other' = 'other';
  if (/samsungbrowser/.test(ua)) browser = 'samsung';
  else if (/edg\//.test(ua)) browser = 'edge';
  else if (/firefox/.test(ua)) browser = 'firefox';
  else if (/crios/.test(ua)) browser = 'chrome';
  else if (/chrome/.test(ua)) browser = 'chrome';
  else if (/safari/.test(ua)) browser = 'safari';
  if (navigator.brave !== undefined) browser = 'brave';

  return { os, browser };
}

const APK_URL = 'https://dampingcare.com/latest.apk';

export default function InstallSection() {
  const { os, browser } = detectPlatform();

  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [pwaSupported, setPwaSupported] = useState<boolean | null>(null);
  const [pwaInstalled, setPwaInstalled] = useState(isStandalone());

  const [apkState, setApkState] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [showInstructions, setShowInstructions] = useState(false);

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

  function getInstructions(): string[] {
    if (os === 'ios') {
      if (browser === 'chrome') {
        return [
          'iOS does not support native PWA installation from Chrome.',
          'Open this page in Safari to install Dampingcare.',
          'In Safari: tap the Share icon, then "Add to Home Screen", then "Add".',
        ];
      }
      return [
        'Tap the Share button at the bottom of the browser.',
        'Select "Add to Home Screen".',
        'Tap "Add" to install Dampingcare on your home screen.',
      ];
    }

    switch (browser) {
      case 'chrome':
        return ['Tap the menu icon (⋮) in the top right.', 'Select "Install App".'];
      case 'samsung':
        return ['Tap the menu icon (≡).', 'Tap "Add page to", then "Home Screen".'];
      case 'edge':
        return ['Tap the menu icon (⋯).', 'Go to "Apps", then "Install this site as an app".'];
      case 'brave':
        return ['Tap the menu icon (⋮).', 'Select "Install App".'];
      case 'firefox':
        return [
          'Tap the menu icon (⋮).',
          'Look for "Add to Home Screen" or "Install".',
          'If unavailable, use the "Add to Home Screen" option from the page menu.',
        ];
      default:
        return [
          'Open your browser menu.',
          'Look for "Install App" or "Add to Home Screen".',
        ];
    }
  }

  const instructions = getInstructions();

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
          Choose one of the installation methods below.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* METHOD 1 — Download APK */}
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
                  Download the latest Dampingcare Android application (.apk).
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
              {apkState === 'downloading' ? 'Downloading...' : 'Download APK'}
            </button>
            {apkState === 'done' && (
              <div className="mt-3 flex flex-col gap-2">
                <div
                  className="flex items-start gap-2 rounded-xl p-3"
                  style={{ backgroundColor: '#F0FDF4' }}
                >
                  <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#16A34A' }} />
                  <p
                    className="text-xs"
                    style={{ color: '#15803D', fontFamily: 'Poppins, sans-serif' }}
                  >
                    Open the downloaded APK file and complete the installation.
                  </p>
                </div>
                <div
                  className="flex items-start gap-2 rounded-xl p-3"
                  style={{ backgroundColor: '#FFF7ED' }}
                >
                  <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#EA580C' }} />
                  <p
                    className="text-xs"
                    style={{ color: '#C2410C', fontFamily: 'Poppins, sans-serif' }}
                  >
                    If Android blocks installation, go to Settings → Security → Allow installation from this source.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* METHOD 2 — Install Instantly (PWA) */}
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
                  Install Instantly
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: '#6B7280', fontFamily: 'Poppins, sans-serif' }}
                >
                  Install Dampingcare directly using Progressive Web App (PWA).
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
                className="mt-3 flex items-start gap-2 rounded-xl p-3"
                style={{ backgroundColor: '#F9FAFB' }}
              >
                <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#9CA3AF' }} />
                <p
                  className="text-xs"
                  style={{ color: '#6B7280', fontFamily: 'Poppins, sans-serif' }}
                >
                  Instant PWA installation isn't available in this browser. Use "Add to Home Screen" below instead.
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* METHOD 3 — Add to Home Screen */}
        <div className="rounded-2xl border border-gray-100 p-4 transition-colors hover:border-pink-100">
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#FCE7F3' }}
            >
              <Share size={20} style={{ color: '#FB5EA8' }} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-semibold"
                style={{ color: '#2D2D2D', fontFamily: 'Poppins, sans-serif' }}
              >
                Add to Home Screen
              </h3>
              <p
                className="text-xs mt-0.5"
                style={{ color: '#6B7280', fontFamily: 'Poppins, sans-serif' }}
              >
                Install using your browser.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInstructions((v) => !v)}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95"
            style={{
              fontFamily: 'Poppins, sans-serif',
              backgroundColor: '#FCE7F3',
              color: '#FB5EA8',
            }}
          >
            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
            {showInstructions ? <ChevronUp size={16} strokeWidth={2.5} /> : <ChevronDown size={16} strokeWidth={2.5} />}
          </button>
          {showInstructions && (
            <div
              className="mt-3 rounded-xl p-4 flex flex-col gap-2"
              style={{ backgroundColor: '#FDF2F8' }}
            >
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: '#FB5EA8', fontFamily: 'Poppins, sans-serif' }}
              >
                {os === 'ios'
                  ? browser === 'chrome'
                    ? 'Chrome on iPhone'
                    : 'Safari iPhone/iPad'
                  : browser.charAt(0).toUpperCase() + browser.slice(1) + ' on Android'}
              </p>
              {instructions.map((step, i) => (
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
