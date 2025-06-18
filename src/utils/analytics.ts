import { SurveyResponse } from '../types/survey';

export const getResponseDistribution = (responses: SurveyResponse[]) => {
  const counts = {
    positive: 0,
    neutral: 0,
    negative: 0
  };

  responses.forEach(response => {
    if (response.clarityImpact === 'positive') counts.positive++;
    else if (response.clarityImpact === 'neutral') counts.neutral++;
    else counts.negative++;
  });

  return counts;
};

export const getAgeGroupDistribution = (responses: SurveyResponse[]) => {
  const ageGroups = {
    '18-25': 0,
    '26-35': 0,
    '36-45': 0,
    '46-55': 0,
    '56+': 0
  };

  responses.forEach(response => {
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
  const genderCounts = {
    male: 0,
    female: 0,
    'non-binary': 0,
    'prefer-not-to-say': 0,
    other: 0
  };

  responses.forEach(response => {
    genderCounts[response.gender]++;
  });

  return genderCounts;
};

export const getTemporalTrends = (responses: SurveyResponse[]) => {
  const dailyResponses: { [date: string]: number } = {};
  
  responses.forEach(response => {
    const date = response.timestamp.split('T')[0];
    dailyResponses[date] = (dailyResponses[date] || 0) + 1;
  });

  return dailyResponses;
};