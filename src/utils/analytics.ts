import { SurveyResponse } from '../types/survey';

export const getResponseDistribution = (responses: SurveyResponse[]) => {
  // Validar entrada
  if (!Array.isArray(responses)) {
    return { positive: 0, neutral: 0, negative: 0 };
  }
  
  const counts = {
    positive: 0,
    neutral: 0,
    negative: 0
  };

  responses.forEach(response => {
    // Validar se a resposta tem a estrutura esperada
    if (!response || typeof response !== 'object' || !response.clarityImpact) {
      return;
    }
    
    if (response.clarityImpact === 'positive') counts.positive++;
    else if (response.clarityImpact === 'neutral') counts.neutral++;
    else if (response.clarityImpact === 'negative') counts.negative++;
  });

  return counts;
};

export const getAgeGroupDistribution = (responses: SurveyResponse[]) => {
  // Validar entrada
  if (!Array.isArray(responses)) {
    return { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0 };
  }
  
  const ageGroups = {
    '18-25': 0,
    '26-35': 0,
    '36-45': 0,
    '46-55': 0,
    '56+': 0
  };

  responses.forEach(response => {
    // Validar se a resposta tem a estrutura esperada
    if (!response || typeof response !== 'object' || typeof response.age !== 'number') {
      return;
    }
    
    const age = response.age;
    if (age >= 18 && age <= 25) ageGroups['18-25']++;
    else if (age >= 26 && age <= 35) ageGroups['26-35']++;
    else if (age >= 36 && age <= 45) ageGroups['36-45']++;
    else if (age >= 46 && age <= 55) ageGroups['46-55']++;
    else if (age >= 56) ageGroups['56+']++;
  });

  return ageGroups;
};

export const getGenderDistribution = (responses: SurveyResponse[]) => {
  // Validar entrada
  if (!Array.isArray(responses)) {
    return { male: 0, female: 0, 'non-binary': 0, 'prefer-not-to-say': 0, other: 0 };
  }
  
  const genderCounts = {
    male: 0,
    female: 0,
    'non-binary': 0,
    'prefer-not-to-say': 0,
    other: 0
  };

  responses.forEach(response => {
    // Validar se a resposta tem a estrutura esperada
    if (!response || typeof response !== 'object' || !response.gender) {
      return;
    }
    
    if (genderCounts.hasOwnProperty(response.gender)) {
      genderCounts[response.gender]++;
    }
  });

  return genderCounts;
};

export const getTemporalTrends = (responses: SurveyResponse[]) => {
  // Validar entrada
  if (!Array.isArray(responses)) {
    return {};
  }
  
  const dailyResponses: { [date: string]: number } = {};
  
  responses.forEach(response => {
    // Validar se a resposta tem a estrutura esperada
    if (!response || typeof response !== 'object' || !response.timestamp) {
      return;
    }
    
    try {
      const date = response.timestamp.split('T')[0];
      if (date && date.length === 10) { // Validar formato YYYY-MM-DD
        dailyResponses[date] = (dailyResponses[date] || 0) + 1;
      }
    } catch (error) {
      console.warn('Timestamp inválido:', response.timestamp);
    }
  });

  return dailyResponses;
};