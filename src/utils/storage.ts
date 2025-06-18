import { SurveyResponse, SurveyFormData } from '../types/survey';

const STORAGE_KEY = 'emoji_survey_responses';
const DRAFT_KEY = 'emoji_survey_draft';

export const saveResponse = (response: SurveyResponse): void => {
  const responses = getResponses();
  responses.push(response);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  clearDraft();
};

export const getResponses = (): SurveyResponse[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveDraft = (draft: SurveyFormData): void => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
};

export const getDraft = (): SurveyFormData | null => {
  const stored = localStorage.getItem(DRAFT_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const clearDraft = (): void => {
  localStorage.removeItem(DRAFT_KEY);
};

export const exportToCSV = (): void => {
  const responses = getResponses();
  if (responses.length === 0) {
    throw new Error('Nenhum dado disponível para exportar');
  }

  const headers = [
    'ID',
    'Data/Hora',
    'Frequência',
    'Impacto na Clareza',
    'Influência no Tom',
    'Contexto Profissional',
    'Idade',
    'Gênero'
  ];

  const csvContent = [
    headers.join(','),
    ...responses.map(response => [
      response.id,
      response.timestamp,
      response.frequency,
      response.clarityImpact,
      response.toneInfluence,
      response.professionalContext,
      response.age,
      response.gender
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `emoji_survey_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return responses.length;
};