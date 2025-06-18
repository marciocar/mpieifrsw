import React, { useState, useEffect } from 'react';
import { QuestionConfig, SurveyFormData, SurveyResponse } from '../types/survey';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { WizardNavigation } from './WizardNavigation';
import { saveResponse, saveDraft, getDraft } from '../utils/storage';
import { CheckCircle, Sparkles } from 'lucide-react';

const questions: QuestionConfig[] = [
  {
    id: 'frequency',
    title: 'Com que frequência você usa emojis em suas comunicações digitais?',
    type: 'radio',
    options: [
      { value: 'daily', label: 'Diariamente - Uso emojis na maioria das minhas mensagens' },
      { value: 'weekly', label: 'Semanalmente - Uso emojis ocasionalmente' },
      { value: 'rarely', label: 'Raramente - Quase nunca uso emojis' }
    ],
    validation: (value) => !value ? 'Por favor, selecione uma opção' : null
  },
  {
    id: 'clarityImpact',
    title: 'Como você avalia o impacto dos emojis na clareza da mensagem?',
    type: 'radio',
    options: [
      { value: 'positive', label: 'Positivo - Tornam as mensagens mais claras e expressivas' },
      { value: 'neutral', label: 'Neutro - Não afetam significativamente a clareza' },
      { value: 'negative', label: 'Negativo - Podem tornar as mensagens confusas ou ambíguas' }
    ],
    validation: (value) => !value ? 'Por favor, selecione uma opção' : null
  },
  {
    id: 'toneInfluence',
    title: 'Os emojis influenciam sua interpretação do tom da mensagem?',
    type: 'radio',
    options: [
      { value: 'positive', label: 'Sim, me ajudam a entender melhor o tom pretendido' },
      { value: 'neutral', label: 'Às vezes, mas nem sempre de forma significativa' },
      { value: 'negative', label: 'Não, não influenciam muito minha interpretação' }
    ],
    validation: (value) => !value ? 'Por favor, selecione uma opção' : null
  },
  {
    id: 'professionalContext',
    title: 'Como você vê o uso de emojis em contextos profissionais?',
    type: 'radio',
    options: [
      { value: 'positive', label: 'Apropriado - Podem melhorar a comunicação profissional' },
      { value: 'neutral', label: 'Depende do contexto - Aceitável em algumas situações' },
      { value: 'negative', label: 'Inapropriado - Devem ser evitados em ambientes profissionais' }
    ],
    validation: (value) => !value ? 'Por favor, selecione uma opção' : null
  },
  {
    id: 'age',
    title: 'Qual é a sua idade?',
    type: 'number',
    validation: (value) => {
      if (!value) return 'Por favor, informe sua idade';
      if (value < 13 || value > 120) return 'Por favor, informe uma idade válida entre 13 e 120 anos';
      return null;
    }
  },
  {
    id: 'gender',
    title: 'Qual é o seu gênero?',
    type: 'select',
    options: [
      { value: 'male', label: 'Masculino' },
      { value: 'female', label: 'Feminino' },
      { value: 'non-binary', label: 'Não-binário' },
      { value: 'prefer-not-to-say', label: 'Prefiro não informar' },
      { value: 'other', label: 'Outro' }
    ],
    validation: (value) => !value ? 'Por favor, selecione uma opção' : null
  }
];

interface SurveyWizardProps {
  onComplete: () => void;
}

export const SurveyWizard: React.FC<SurveyWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SurveyFormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const draft = getDraft();
    if (draft) {
      setFormData(draft);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveDraft(formData);
    }
  }, [formData]);

  const currentQuestion = questions[currentStep - 1];

  const updateFormData = (field: keyof SurveyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const question = currentQuestion;
    const value = formData[question.id];
    const error = question.validation?.(value);
    
    if (error) {
      setErrors({ [question.id]: error });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response: SurveyResponse = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      frequency: formData.frequency as any,
      clarityImpact: formData.clarityImpact as any,
      toneInfluence: formData.toneInfluence as any,
      professionalContext: formData.professionalContext as any,
      age: formData.age!,
      gender: formData.gender as any
    };

    saveResponse(response);
    setIsSubmitting(false);
    setIsCompleted(true);
    
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Obrigado! 🎉
            </h2>
            <p className="text-gray-600">
              Suas respostas foram enviadas com sucesso e nos ajudarão a entender o impacto dos emojis na comunicação digital.
            </p>
          </div>
          <div className="animate-pulse text-red-600">
            Redirecionando para o painel...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-red-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">
              Pesquisa de Impacto dos Emojis
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ajude-nos a entender como os emojis afetam a comunicação digital compartilhando suas perspectivas e experiências.
          </p>
        </div>

        <ProgressBar current={currentStep} total={questions.length} />

        <QuestionCard
          question={currentQuestion}
          value={formData[currentQuestion.id]}
          onChange={(value) => updateFormData(currentQuestion.id, value)}
          error={errors[currentQuestion.id]}
        />

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          canGoNext={!errors[currentQuestion.id] && formData[currentQuestion.id] !== undefined}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};