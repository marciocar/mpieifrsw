export const decodeShareData = (encodedData: string) => {
  try {
    const decoded = JSON.parse(atob(encodedData));
    
    // Validar estrutura dos dados
    if (!decoded || typeof decoded !== 'object') {
      throw new Error('Dados inválidos');
    }
    
    // Garantir que os campos necessários existem e são números
    const validatedData = {
      totalResponses: Number(decoded.totalResponses) || 0,
      positiveImpact: Number(decoded.positiveImpact) || 0,
      neutralImpact: Number(decoded.neutralImpact) || 0,
      negativeImpact: Number(decoded.negativeImpact) || 0
    };
    
    return validatedData;
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
  // Validar dados de entrada
  if (!shareData || typeof shareData !== 'object') {
    return {
      title: 'Relatório de Pesquisa - Impacto dos Emojis',
      summary: 'Dados não disponíveis',
      metrics: [],
      generatedAt: new Date().toLocaleString('pt-BR')
    };
  }
  
  const { totalResponses, positiveImpact, neutralImpact, negativeImpact } = shareData;
  
  // Proteger contra divisão por zero
  const total = totalResponses || 1;
  
  return {
    title: 'Relatório de Pesquisa - Impacto dos Emojis',
    summary: `Análise baseada em ${totalResponses} ${totalResponses === 1 ? 'resposta coletada' : 'respostas coletadas'}`,
    metrics: [
      { 
        label: 'Impacto Positivo', 
        value: positiveImpact || 0, 
        percentage: totalResponses > 0 ? Math.round(((positiveImpact || 0) / total) * 100) : 0
      },
      { 
        label: 'Impacto Neutro', 
        value: neutralImpact || 0, 
        percentage: totalResponses > 0 ? Math.round(((neutralImpact || 0) / total) * 100) : 0
      },
      { 
        label: 'Impacto Negativo', 
        value: negativeImpact || 0, 
        percentage: totalResponses > 0 ? Math.round(((negativeImpact || 0) / total) * 100) : 0
      }
    ],
    generatedAt: new Date().toLocaleString('pt-BR')
  };
};