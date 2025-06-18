import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  isCurrentAnswered?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, isCurrentAnswered = false }) => {
  // Calcular progresso baseado em perguntas respondidas
  const answeredQuestions = isCurrentAnswered ? current : current - 1;
  const percentage = Math.round((answeredQuestions / total) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          Pergunta {current} de {total} {isCurrentAnswered ? '✓' : ''}
        </span>
        <span className="text-sm font-medium text-red-600">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-red-600 to-yellow-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {answeredQuestions} de {total} perguntas respondidas
      </div>
    </div>
  );
};