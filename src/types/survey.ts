export interface SurveyResponse {
  id: string;
  timestamp: string;
  frequency: 'daily' | 'weekly' | 'rarely';
  clarityImpact: 'positive' | 'neutral' | 'negative';
  toneInfluence: 'positive' | 'neutral' | 'negative';
  professionalContext: 'positive' | 'neutral' | 'negative';
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';
}

export interface SurveyFormData {
  frequency?: string;
  clarityImpact?: string;
  toneInfluence?: string;
  professionalContext?: string;
  age?: number;
  gender?: string;
}

export interface QuestionConfig {
  id: keyof SurveyFormData;
  title: string;
  type: 'radio' | 'number' | 'select';
  options?: Array<{ value: string; label: string }>;
  validation?: (value: any) => string | null;
}