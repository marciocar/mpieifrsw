import React from 'react';
import { QuestionConfig } from '../types/survey';

interface QuestionCardProps {
  question: QuestionConfig;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  error
}) => {
  const renderInput = () => {
    switch (question.type) {
      case 'radio':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-red-400 cursor-pointer transition-colors duration-200"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="ml-3 text-gray-700 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
            placeholder="Digite sua idade"
            min="13"
            max="120"
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
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