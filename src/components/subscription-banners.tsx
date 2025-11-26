'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Sparkles, X } from 'lucide-react';

interface TrialBannerProps {
  trialEndsAt: string | Date | null;
  plan: string;
  subscriptionStatus?: string | null;
}

export function TrialBanner({ trialEndsAt, plan, subscriptionStatus }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Não mostrar se não está em trial ou se foi dispensado
  if (dismissed || subscriptionStatus !== 'trialing' || !trialEndsAt) {
    return null;
  }

  const endDate = new Date(trialEndsAt);
  const now = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Se trial expirou, não mostra banner
  if (daysRemaining <= 0) {
    return null;
  }

  // Determina urgência
  const isUrgent = daysRemaining <= 2;
  const bgColor = isUrgent 
    ? 'bg-gradient-to-r from-red-500 to-orange-500' 
    : 'bg-gradient-to-r from-blue-500 to-indigo-500';

  return (
    <div className={`${bgColor} text-white px-4 py-3 relative`}>
      <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isUrgent ? (
              <Clock className="w-5 h-5 animate-pulse" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span className="font-medium">
              {isUrgent ? '⚠️ ' : '🎉 '}
              Período de teste PRO: <strong>{daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}</strong> restantes
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/80 hidden sm:block">
            Assine agora e não perca suas funcionalidades
          </span>
          <Link
            href="/pricing"
            className="px-4 py-1.5 bg-white text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Assinar PRO
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Dispensar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Banner de limite atingido
 */
interface LimitBannerProps {
  feature: 'aircraft' | 'users';
  currentCount: number;
  limit: number;
  plan: string;
}

export function LimitBanner({ feature, currentCount, limit, plan }: LimitBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || currentCount < limit) {
    return null;
  }

  const featureText = {
    aircraft: 'aeronaves',
    users: 'usuários',
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3">
      <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="font-medium">
            ⚠️ Você atingiu o limite de {limit} {featureText[feature]} do plano {plan}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="px-4 py-1.5 bg-white text-orange-600 text-sm font-semibold rounded-lg hover:bg-orange-50 transition-colors"
          >
            Fazer Upgrade
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Dispensar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
