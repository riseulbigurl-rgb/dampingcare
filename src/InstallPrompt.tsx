import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

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

export type InstallState = 'available' | 'unsupported' | 'installed';

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [state, setState] = useState<InstallState>('unsupported');

  useEffect(() => {
    if (isStandalone()) {
      setState('installed');
      return;
    }

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState('available');
    }

    window.addEventListener('beforeinstallprompt', handler);

    function installedHandler() {
      setState('installed');
      setDeferredPrompt(null);
    }

    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  async function promptInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setState('installed');
      setDeferredPrompt(null);
    }
  }

  return { state, promptInstall };
}

export function InstallButton() {
  const { state, promptInstall } = useInstallPrompt();
  if (state !== 'available') return null;

  return (
    <button
      onClick={promptInstall}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all duration-200 active:scale-95 focus:outline-none"
      style={{
        background: '#FB5EA8',
        boxShadow: '0 4px 16px rgba(251,94,168,0.35)',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <Download size={18} strokeWidth={2.5} />
      Install Dampingcare
    </button>
  );
}

export function FloatingInstallButton() {
  const { state, promptInstall } = useInstallPrompt();
  if (state !== 'available') return null;

  return (
    <button
      onClick={promptInstall}
      aria-label="Install Dampingcare"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-90 focus:outline-none"
      style={{
        background: '#FB5EA8',
        boxShadow: '0 6px 20px rgba(251,94,168,0.45)',
      }}
    >
      <Download size={24} strokeWidth={2.5} />
    </button>
  );
}

export function ManualInstallHint() {
  const { state } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);
  if (state !== 'unsupported' || dismissed) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-40 max-w-xs rounded-2xl bg-white shadow-xl border border-gray-100 p-4 pr-9"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <X size={16} />
      </button>
      <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
        Open your browser menu and choose &lsquo;Install App&rsquo; or
        &lsquo;Add to Home Screen&rsquo;.
      </p>
    </div>
  );
}
