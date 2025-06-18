export const decodeShareData = (encodedData: string) => {
  try {
    return JSON.parse(atob(encodedData));
  } catch (error) {
    console.error('Erro ao decodificar dados compartilhados:', error);
    return null;
  }
};

export const getShareDataFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const shareParam = urlParams.get('share');
  
  if (shareParam) {
    return decodeShareData(shareParam);
  }
  
  return null;
};

export const generateShareableReport = (shareData: any) => {
  const { totalResponses, positiveImpact, neutralImpact, negativeImpact } = shareData;
  
  return {
    title: 'Relatório de Pesquisa - Impacto dos Emojis',
    summary: `Análise baseada em ${totalResponses} respostas coletadas`,
    metrics: [
      { label: 'Impacto Positivo', value: positiveImpact, percentage: Math.round((positiveImpact / totalResponses) * 100) },
      { label: 'Impacto Neutro', value: neutralImpact, percentage: Math.round((neutralImpact / totalResponses) * 100) },
      { label: 'Impacto Negativo', value: negativeImpact, percentage: Math.round((negativeImpact / totalResponses) * 100) }
    ],
    generatedAt: new Date().toLocaleString('pt-BR')
  };
};