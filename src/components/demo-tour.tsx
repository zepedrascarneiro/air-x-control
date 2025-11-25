'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Plane, BarChart3, DollarSign, Users, Settings, Sparkles } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string; // CSS selector to highlight
  position: 'center' | 'top' | 'bottom';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Air X Control! ✈️',
    description: 'Este é o seu painel de gestão para aviação compartilhada. Vamos fazer um tour rápido para você conhecer todas as funcionalidades.',
    icon: <Sparkles className="w-8 h-8 text-blue-500" />,
    position: 'center',
  },
  {
    id: 'summary',
    title: 'Resumo Operacional',
    description: 'Aqui você vê os principais indicadores: aeronaves ativas, horas voadas, total de voos e custos do período selecionado.',
    icon: <BarChart3 className="w-8 h-8 text-green-500" />,
    highlight: '[data-tour="summary"]',
    position: 'bottom',
  },
  {
    id: 'flights',
    title: 'Registro de Voos',
    description: 'Visualize todos os voos realizados com detalhes de origem, destino, duração, combustível e custos associados.',
    icon: <Plane className="w-8 h-8 text-blue-500" />,
    highlight: '[data-tour="flights"]',
    position: 'top',
  },
  {
    id: 'expenses',
    title: 'Controle de Despesas',
    description: 'Acompanhe todas as despesas categorizadas: combustível, manutenção, hangar, seguro e taxas aeroportuárias.',
    icon: <DollarSign className="w-8 h-8 text-yellow-500" />,
    highlight: '[data-tour="expenses"]',
    position: 'top',
  },
  {
    id: 'owners',
    title: 'Divisão entre Coproprietários',
    description: 'O sistema calcula automaticamente quanto cada coproprietário deve pagar, baseado em uso e participação.',
    icon: <Users className="w-8 h-8 text-purple-500" />,
    highlight: '[data-tour="owners"]',
    position: 'top',
  },
  {
    id: 'actions',
    title: 'Ações Rápidas',
    description: 'Crie novos voos, despesas e aeronaves com facilidade. Tudo integrado e sincronizado em tempo real.',
    icon: <Settings className="w-8 h-8 text-gray-500" />,
    highlight: '[data-tour="actions"]',
    position: 'top',
  },
  {
    id: 'finish',
    title: 'Pronto para Começar!',
    description: 'Você está vendo dados de demonstração. Faça login ou registre-se para começar a gerenciar suas aeronaves de verdade!',
    icon: <Sparkles className="w-8 h-8 text-blue-500" />,
    position: 'center',
  },
];

// Map step index to Tailwind width class for progress bar
const progressWidthClasses = [
  'w-[14%]',   // step 0: 1/7
  'w-[28%]',   // step 1: 2/7
  'w-[43%]',   // step 2: 3/7
  'w-[57%]',   // step 3: 4/7
  'w-[71%]',   // step 4: 5/7
  'w-[86%]',   // step 5: 6/7
  'w-full',    // step 6: 7/7
];

interface DemoTourProps {
  onComplete: () => void;
  isDemo?: boolean;
}

export function DemoTour({ onComplete, isDemo = true }: DemoTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const step = tourSteps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tourSteps.length - 1;

  useEffect(() => {
    // Highlight current element
    if (step.highlight) {
      const el = document.querySelector(step.highlight);
      if (el) {
        el.classList.add('tour-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return () => {
      // Remove highlight when step changes
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
    };
  }, [currentStep, step.highlight]);

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('airx-tour-completed', 'true');
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" />

      {/* Tour Card */}
      <div
        className={`fixed z-50 transition-all duration-300 ${
          step.position === 'center'
            ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            : step.position === 'top'
            ? 'top-24 left-1/2 -translate-x-1/2'
            : 'bottom-24 left-1/2 -translate-x-1/2'
        }`}
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                {step.icon}
              </div>
              <div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {currentStep + 1} de {tourSteps.length}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Fechar tour"
              title="Fechar tour"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {step.description}
          </p>

          {/* Demo Badge */}
          {isDemo && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <span className="text-lg">📊</span>
                <span>Você está visualizando <strong>dados de demonstração</strong></span>
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
            <div
              className={`h-full bg-blue-500 rounded-full transition-all duration-300 ${progressWidthClasses[currentStep]}`}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Pular tour
            </button>

            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {isLast ? 'Começar' : 'Próximo'}
                {!isLast && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
