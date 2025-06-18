import React, { useState, useEffect } from 'react';
import { QuestionConfig, SurveyFormData, SurveyResponse } from '../types/survey';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { WizardNavigation } from './WizardNavigation';
import { saveResponse, saveDraft, getDraft } from '../utils/database';
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
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  useEffect(() => {
    getDraft().then(draft => {
      if (draft) {
        setFormData(draft);
      }
    }).catch(error => {
      console.error('Erro ao carregar rascunho:', error);
    });
  }, []);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveDraft(formData).catch(error => {
        console.error('Erro ao salvar rascunho:', error);
      });
    }
  }, [formData]);

  const currentQuestion = questions[currentStep - 1];

  const updateFormData = (field: keyof SurveyFormData, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Auto-advance para perguntas de radio e select (exceto a última pergunta)
    const currentQuestion = questions[currentStep - 1];
    const isLastStep = currentStep === questions.length;
    
    if ((currentQuestion.type === 'radio' || currentQuestion.type === 'select') && !isLastStep) {
      setIsAutoAdvancing(true);
      
      // Delay para dar feedback visual da seleção
      setTimeout(() => {
        // Validar com os novos dados
        const error = currentQuestion.validation?.(value);
        if (!error) {
          setCurrentStep(prev => prev + 1);
        } else {
          setErrors({ [field]: error });
        }
        setIsAutoAdvancing(false);
      }, 600);
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

    await saveResponse(response);
    setIsSubmitting(false);
    setIsCompleted(true);
    
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto py-8">
          {/* Barra de progresso completa */}
          <div className="w-full mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-green-700">
                Pesquisa Concluída ✓
              </span>
              <span className="text-sm font-medium text-green-600">
                100%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full w-full transition-all duration-1000 ease-out" />
            </div>
            <div className="text-xs text-green-600 mt-1 font-medium">
              6 de 6 perguntas respondidas com sucesso!
            </div>
          </div>

          {/* Card principal de sucesso */}
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto text-center mb-6">
            <div className="mb-6">
              <div className="relative">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">🎉</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Missão Cumprida! 🏆
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Suas respostas foram enviadas com <strong>sucesso</strong> e contribuirão significativamente para nossa pesquisa sobre o impacto dos emojis na comunicação digital.
              </p>
            </div>

            {/* Estatísticas da contribuição */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                🎯 Sua Contribuição para a Ciência:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">6</div>
                  <div className="text-sm text-gray-600">Perguntas Respondidas</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">📊</div>
                  <div className="text-sm text-gray-600">Dados Coletados</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">🔬</div>
                  <div className="text-sm text-gray-600">Pesquisa Avançada</div>
                </div>
              </div>
            </div>

            {/* Próximos passos */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">📈 O que acontece agora?</h4>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>✅ Seus dados foram salvos de forma segura e anônima</li>
                <li>📊 Contribuirão para análises estatísticas em tempo real</li>
                <li>🔬 Ajudarão pesquisadores a entender padrões de comunicação digital</li>
                <li>📚 Poderão ser usados em publicações científicas (anonimizados)</li>
              </ul>
            </div>

            <div className="animate-pulse text-red-600 font-medium">
              🚀 Redirecionando para o painel de resultados...
            </div>
          </div>

          {/* Agradecimento especial */}
          <div className="text-center text-gray-600 max-w-xl mx-auto">
            <p className="text-sm">
              💝 <strong>Obrigado por fazer parte desta pesquisa!</strong><br/>
              Sua participação é fundamental para o avanço do conhecimento em comunicação digital e tecnologia educacional.
            </p>
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

        <ProgressBar 
          current={currentStep} 
          total={questions.length}
          isCurrentAnswered={!!formData[currentQuestion.id]}
        />

        <QuestionCard
          question={currentQuestion}
          value={formData[currentQuestion.id]}
          onChange={(value) => updateFormData(currentQuestion.id, value)}
          error={errors[currentQuestion.id]}
          isAutoAdvancing={isAutoAdvancing}
        />

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          canGoNext={!errors[currentQuestion.id] && formData[currentQuestion.id] !== undefined}
          isSubmitting={isSubmitting}
          isAutoAdvancing={isAutoAdvancing}
        />
      </div>
    </div>
  );
};