import { useEffect, useState } from 'react';

const DISMISS_KEY = 'dampingcare_install_dismissed_at';
const INSTALLED_KEY = 'dampingcare_installed';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SHOW_DELAY_MS = 4000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      localStorage.setItem(INSTALLED_KEY, 'true');
      return;
    }

    if (localStorage.getItem(INSTALLED_KEY) === 'true') return;

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < DISMISS_DURATION_MS) return;
    }

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    }

    window.addEventListener('beforeinstallprompt', handler);

    function installedHandler() {
      localStorage.setItem(INSTALLED_KEY, 'true');
      setVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      localStorage.setItem(INSTALLED_KEY, 'true');
      setVisible(false);
      setDeferredPrompt(null);
    } else {
      handleDismiss();
    }
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setVisible(false);
    setDeferredPrompt(null);
  }

  if (!visible || !deferredPrompt) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"
        style={{ animation: 'fadeIn 0.3s ease' }}
        onClick={handleDismiss}
      />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div
          className="w-full max-w-md mx-4 mb-4 rounded-3xl bg-white shadow-2xl overflow-hidden"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Content */}
          <div className="px-6 pt-3 pb-6 flex flex-col items-center gap-4">
            {/* Icon */}
            <img
              src="/icon-96.png"
              alt="Dampingcare"
              className="w-16 h-16 rounded-2xl shadow-md"
              draggable={false}
            />

            {/* Title */}
            <h2
              className="text-lg font-bold text-center"
              style={{ color: '#2D2D2D' }}
            >
              Install Dampingcare
            </h2>

            {/* Description */}
            <p
              className="text-sm text-center leading-relaxed"
              style={{ color: '#6B7280', maxWidth: '300px' }}
            >
              Install Dampingcare for faster access, a full-screen experience,
              and quick access to patient assistance services.
            </p>

            {/* Buttons */}
            <div className="w-full flex flex-col gap-3 mt-2">
              <button
                onClick={handleInstall}
                className="w-full py-3.5 rounded-full font-semibold text-base text-white shadow-lg transition-all duration-200 active:scale-95 focus:outline-none"
                style={{
                  background: '#FB5EA8',
                  boxShadow: '0 4px 20px rgba(251,94,168,0.4)',
                }}
              >
                Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="w-full py-3.5 rounded-full font-semibold text-base transition-all duration-200 active:scale-95 focus:outline-none"
                style={{
                  background: '#FDEAF2',
                  color: '#2D2D2D',
                }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
