"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if already installed
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    if (isInstalled) return;

    // Check if dismissed recently
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const dayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < dayInMs * 7) return; // Show again after 7 days
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Show iOS prompt after delay
    if (isIOSDevice && !isInstalled) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:hidden animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
          title="Fechar"
          aria-label="Fechar prompt de instalação"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg">Instalar Air X Control</h3>
            <p className="text-sm text-blue-100 mb-3">
              {isIOS 
                ? "Toque em Compartilhar e depois \"Adicionar à Tela Inicial\""
                : "Instale o app para acesso rápido e offline"
              }
            </p>
            
            {!isIOS && deferredPrompt && (
              <button
                onClick={handleInstall}
                className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Instalar Agora
              </button>
            )}
            
            {isIOS && (
              <div className="flex items-center gap-2 text-xs text-blue-100">
                <span>📤</span>
                <span>Compartilhar → Adicionar à Tela Inicial</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
