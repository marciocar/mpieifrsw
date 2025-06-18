import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoNext: boolean;
  isSubmitting?: boolean;
  isAutoAdvancing?: boolean;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  canGoNext,
  isSubmitting = false,
  isAutoAdvancing = false
}) => {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
      <button
        onClick={onPrevious}
        disabled={isFirstStep || isAutoAdvancing}
        className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Anterior
      </button>

      {isAutoAdvancing && !isLastStep && (
        <div className="flex items-center text-red-600 font-medium">
          <div className="animate-spin w-4 h-4 mr-2 border-2 border-red-600 border-t-transparent rounded-full" />
          Avançando...
        </div>
      )}

      {isLastStep ? (
        <button
          onClick={onSubmit}
          disabled={!canGoNext || isSubmitting || isAutoAdvancing}
          className="flex items-center px-8 py-3 text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Enviando...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Enviar Pesquisa
            </>
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canGoNext || isAutoAdvancing}
          className="flex items-center px-6 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
        >
          {isAutoAdvancing ? 'Avançando...' : 'Próximo'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      )}
    </div>
  );
};