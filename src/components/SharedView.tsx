import React from 'react';
import { BarChart3, Users, TrendingUp, ExternalLink, FileText, AlertCircle, Target, Award, Clock, PieChart } from 'lucide-react';
import { generateShareableReport } from '../utils/shareUtils';
import { getResponsesSync as getResponses } from '../utils/database';
import { getResponseDistribution, getAgeGroupDistribution, getGenderDistribution } from '../utils/analytics';

interface SharedViewProps {
  shareData: {
    totalResponses: number;
    positiveImpact: number;
    neutralImpact: number;
    negativeImpact: number;
  };
  onViewFullDashboard: () => void;
  onStartSurvey?: () => void;
}

export const SharedView: React.FC<SharedViewProps> = ({ shareData, onViewFullDashboard, onStartSurvey }) => {
  // Validar dados compartilhados
  const isValidShareData = shareData && 
    typeof shareData.totalResponses === 'number' && 
    shareData.totalResponses >= 0 &&
    typeof shareData.positiveImpact === 'number' &&
    typeof shareData.neutralImpact === 'number' &&
    typeof shareData.negativeImpact === 'number';

  if (!isValidShareData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">
                Dados Não Encontrados
              </h1>
            </div>
            <p className="text-gray-600 mb-4">
              Os dados compartilhados não puderam ser carregados ou estão corrompidos.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Link Inválido ou Expirado
            </h3>
            <p className="text-gray-600 mb-6">
              O link compartilhado pode estar corrompido ou os dados podem ter sido removidos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onViewFullDashboard}
                className="inline-flex items-center justify-center px-8 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Painel Completo
              </button>

              {onStartSurvey && (
                <button
                  onClick={onStartSurvey}
                  className="inline-flex items-center justify-center px-8 py-3 text-red-700 bg-red-50 border-2 border-red-300 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Fazer Pesquisa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const report = generateShareableReport(shareData);
  
  // Obter dados atuais para comparação (com tratamento de erro)
  let currentResponses = [];
  let currentDistribution = { positive: 0, neutral: 0, negative: 0 };
  let currentAgeDistribution = {};
  let currentGenderDistribution = {};
  
  try {
    currentResponses = getResponses() || [];
    currentDistribution = getResponseDistribution(currentResponses);
    currentAgeDistribution = getAgeGroupDistribution(currentResponses);
    currentGenderDistribution = getGenderDistribution(currentResponses);
  } catch (error) {
    console.error('Erro ao carregar dados atuais:', error);
  }

  // Calcular métricas avançadas
  const hasNewData = currentResponses.length > shareData.totalResponses;
  const newResponses = Math.max(0, currentResponses.length - shareData.totalResponses);
  const growthPercentage = shareData.totalResponses > 0 
    ? Math.round((newResponses / shareData.totalResponses) * 100) 
    : 0;

  // Calcular percentuais atuais e compartilhados
  const sharedPositivePercentage = shareData.totalResponses > 0 
    ? Math.round((shareData.positiveImpact / shareData.totalResponses) * 100)
    : 0;
  
  const currentPositivePercentage = currentResponses.length > 0 
    ? Math.round((currentDistribution.positive / currentResponses.length) * 100)
    : sharedPositivePercentage;

  // Calcular diferenças específicas
  const positiveChange = Math.max(0, currentDistribution.positive - shareData.positiveImpact);
  const neutralChange = Math.max(0, currentDistribution.neutral - shareData.neutralImpact);
  const negativeChange = Math.max(0, currentDistribution.negative - shareData.negativeImpact);

  // Calcular insights avançados
  const dominantImpact = shareData.positiveImpact > shareData.neutralImpact && shareData.positiveImpact > shareData.negativeImpact 
    ? 'positivo' 
    : shareData.neutralImpact > shareData.negativeImpact 
      ? 'neutro' 
      : 'negativo';

  const confidenceLevel = shareData.totalResponses >= 30 ? 'Alta' : shareData.totalResponses >= 10 ? 'Média' : 'Baixa';
  
  // Calcular tendência
  const positiveTrend = hasNewData && currentPositivePercentage > sharedPositivePercentage ? 'crescente' : 
                       hasNewData && currentPositivePercentage < sharedPositivePercentage ? 'decrescente' : 'estável';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header Profissional */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">
              {report.title}
            </h1>
          </div>
          <p className="text-gray-600 mb-2">{report.summary}</p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {report.generatedAt}
            </span>
            <span className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              Confiabilidade: {confidenceLevel}
            </span>
          </div>
        </div>

        {/* Resumo Executivo */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Award className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Resumo Executivo</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">{dominantImpact}</div>
              <div className="text-sm text-gray-600">Percepção Dominante</div>
              <div className="text-xs text-gray-500 mt-1">
                {sharedPositivePercentage}% dos respondentes
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">{confidenceLevel}</div>
              <div className="text-sm text-gray-600">Nível de Confiança</div>
              <div className="text-xs text-gray-500 mt-1">
                Base: {shareData.totalResponses} respostas
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className={`text-3xl font-bold mb-2 ${
                positiveTrend === 'crescente' ? 'text-green-600' : 
                positiveTrend === 'decrescente' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {positiveTrend}
              </div>
              <div className="text-sm text-gray-600">Tendência Atual</div>
              <div className="text-xs text-gray-500 mt-1">
                Impacto positivo {positiveTrend}
              </div>
            </div>
          </div>
        </div>

        {/* Dados Compartilhados */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Dados do Snapshot</h2>
            <span className="ml-auto text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
              Snapshot: {shareData.totalResponses} {shareData.totalResponses === 1 ? 'resposta' : 'respostas'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Users className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-gray-800">{shareData.totalResponses}</p>
              <p className="text-gray-600 text-sm">Total de Respostas</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-yellow-600">{shareData.positiveImpact}</p>
              <p className="text-gray-600 text-sm">Impacto Positivo</p>
              <p className="text-xs text-yellow-700 mt-1">{sharedPositivePercentage}%</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <BarChart3 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-gray-600">{shareData.neutralImpact}</p>
              <p className="text-gray-600 text-sm">Impacto Neutro</p>
              <p className="text-xs text-gray-700 mt-1">
                {shareData.totalResponses > 0 ? Math.round((shareData.neutralImpact / shareData.totalResponses) * 100) : 0}%
              </p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-3 transform rotate-180" />
              <p className="text-2xl font-bold text-red-600">{shareData.negativeImpact}</p>
              <p className="text-gray-600 text-sm">Impacto Negativo</p>
              <p className="text-xs text-red-700 mt-1">
                {shareData.totalResponses > 0 ? Math.round((shareData.negativeImpact / shareData.totalResponses) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Análise Visual dos Percentuais */}
          {shareData.totalResponses > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Distribuição Percentual (Snapshot):
              </h3>
              {report.metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{metric.label}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-40 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          metric.label.includes('Positivo') ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                          metric.label.includes('Neutro') ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 
                          'bg-gradient-to-r from-red-400 to-red-500'
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, metric.percentage))}%` }}
                      />
                    </div>
                    <span className="font-bold text-gray-800 w-16 text-right">
                      {metric.value} ({metric.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comparativo com Dados Atuais */}
        {hasNewData && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center mb-6">
              <BarChart3 className={`w-6 h-6 mr-3 ${newResponses >= 0 ? 'text-green-600' : 'text-orange-600'}`} />
              <h2 className="text-xl font-semibold text-gray-800">Comparativo: Snapshot vs. Atual</h2>
              <span className="ml-auto text-sm text-gray-500 bg-green-50 px-3 py-1 rounded-full">
                Atual: {currentResponses.length} {currentResponses.length === 1 ? 'resposta' : 'respostas'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Users className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-800">{currentResponses.length}</p>
                <p className="text-gray-600 text-sm">Total de Respostas</p>
                <p className="text-xs mt-1 font-medium text-green-600">
                  +{newResponses} {newResponses === 1 ? 'nova resposta' : 'novas respostas'}
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-6 text-center">
                <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-yellow-600">{currentDistribution.positive}</p>
                <p className="text-gray-600 text-sm">Impacto Positivo</p>
                <p className="text-xs mt-1 font-medium text-green-600">
                  +{positiveChange} ({currentPositivePercentage}%)
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <BarChart3 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-600">{currentDistribution.neutral}</p>
                <p className="text-gray-600 text-sm">Impacto Neutro</p>
                <p className="text-xs mt-1 font-medium text-green-600">
                  +{neutralChange}
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6 text-center">
                <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-3 transform rotate-180" />
                <p className="text-2xl font-bold text-red-600">{currentDistribution.negative}</p>
                <p className="text-gray-600 text-sm">Impacto Negativo</p>
                <p className="text-xs mt-1 font-medium text-green-600">
                  +{negativeChange}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Insights e Recomendações */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Insights e Recomendações</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3">📊 Análise dos Dados:</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• <strong>Percepção dominante:</strong> {dominantImpact} ({sharedPositivePercentage}%)</li>
                <li>• <strong>Confiabilidade:</strong> {confidenceLevel} (n={shareData.totalResponses})</li>
                <li>• <strong>Tendência:</strong> Impacto positivo {positiveTrend}</li>
                {shareData.totalResponses >= 30 && (
                  <li>• <strong>Significância:</strong> Amostra estatisticamente relevante</li>
                )}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">🎯 Recomendações:</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                {shareData.totalResponses < 30 && (
                  <li>• Aumentar amostra para maior confiabilidade</li>
                )}
                {sharedPositivePercentage > 60 && (
                  <li>• Explorar fatores que contribuem para percepção positiva</li>
                )}
                {sharedPositivePercentage < 40 && (
                  <li>• Investigar barreiras à aceitação dos emojis</li>
                )}
                <li>• Segmentar análise por faixa etária e contexto</li>
                <li>• Considerar estudos longitudinais</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Evolução desde o compartilhamento */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-blue-800 mb-4">📈 Evolução desde o compartilhamento:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                +{newResponses}
              </div>
              <div className="text-blue-700">
                {newResponses === 0 ? 'Sem Mudanças' : 
                 newResponses === 1 ? 'Nova Resposta' : 'Novas Respostas'}
              </div>
            </div>
            <div className="text-center bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {currentPositivePercentage}%
              </div>
              <div className="text-green-700">Impacto Positivo Atual</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                +{growthPercentage}%
              </div>
              <div className="text-purple-700">Crescimento</div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={onViewFullDashboard}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Painel Completo
          </button>

          {onStartSurvey && (
            <button
              onClick={onStartSurvey}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-red-700 bg-red-50 border-2 border-red-300 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200"
            >
              <Users className="w-4 h-4 mr-2" />
              Contribuir com Pesquisa
            </button>
          )}
        </div>

        {/* Metodologia e Limitações */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="bg-gray-50 rounded-lg p-6 max-w-4xl mx-auto">
            <h4 className="font-medium text-gray-700 mb-4">📋 Sobre esta Análise:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <p className="font-medium text-gray-700 mb-2">🔬 Metodologia:</p>
                <ul className="space-y-1">
                  <li>• Análise quantitativa de percepções sobre emojis</li>
                  <li>• Amostragem por conveniência</li>
                  <li>• Dados coletados via questionário estruturado</li>
                  <li>• Análise descritiva e comparativa</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">⚠️ Limitações:</p>
                <ul className="space-y-1">
                  <li>• Amostra não probabilística</li>
                  <li>• Dados auto-reportados</li>
                  <li>• Análise limitada a percepções declaradas</li>
                  <li>• Contexto temporal específico</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="font-medium text-gray-700 mb-2">🎯 Funcionalidades Disponíveis:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <strong>Snapshot:</strong> Dados no momento do compartilhamento
                </div>
                <div>
                  <strong>Comparativo:</strong> Evolução em tempo real
                </div>
                <div>
                  <strong>Painel Completo:</strong> Análises detalhadas e exportação
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};