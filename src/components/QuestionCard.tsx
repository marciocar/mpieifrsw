import React from 'react';
import { QuestionConfig } from '../types/survey';

interface QuestionCardProps {
  question: QuestionConfig;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  isAutoAdvancing?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  error,
  isAutoAdvancing = false
}) => {
  const renderInput = () => {
    switch (question.type) {
      case 'radio':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  value === option.value 
                    ? 'border-red-500 bg-red-50 shadow-md transform scale-[1.02]' 
                    : 'border-gray-200 hover:border-red-400 hover:bg-gray-50'
                } ${isAutoAdvancing && value === option.value ? 'animate-pulse' : ''}`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className={`ml-3 font-medium transition-colors duration-200 ${
                  value === option.value ? 'text-red-700' : 'text-gray-700'
                }`}>
                  {option.label}
                </span>
                {value === option.value && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </label>
            ))}
          </div>
        );

      case 'number':
        return (
          <div>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Permitir campo vazio ou números
                if (inputValue === '') {
                  onChange('');
                } else {
                  const numValue = parseInt(inputValue);
                  onChange(numValue);
                }
              }}
              className={`w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-red-200 transition-all duration-200 ${
                error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-red-500'
              }`}
              placeholder="Digite sua idade (13-120 anos)"
              min="13"
              max="120"
            />
            {value && (
              <div className="mt-2 text-sm text-gray-600">
                Idade informada: {value} anos
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-4 border-2 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 ${
              value ? 'border-red-500 bg-red-50' : 'border-gray-200'
            } ${isAutoAdvancing ? 'animate-pulse' : ''}`}
          >
            <option value="">Selecione uma opção</option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {question.title}
      </h2>
      
      <div className="mb-6">
        {renderInput()}
      </div>

      {error && (
        <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};