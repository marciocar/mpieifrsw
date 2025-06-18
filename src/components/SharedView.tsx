import React from 'react';
import { BarChart3, Users, TrendingUp, ExternalLink, FileText, AlertCircle } from 'lucide-react';
import { generateShareableReport } from '../utils/shareUtils';
import { getResponses } from '../utils/storage';
import { getResponseDistribution } from '../utils/analytics';

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
  
  try {
    currentResponses = getResponses() || [];
    currentDistribution = getResponseDistribution(currentResponses);
  } catch (error) {
    console.error('Erro ao carregar dados atuais:', error);
  }

  // Calcular métricas de crescimento
  const hasNewData = currentResponses.length !== shareData.totalResponses;
  const newResponses = currentResponses.length - shareData.totalResponses;
  const growthPercentage = shareData.totalResponses > 0 
    ? Math.round((Math.abs(newResponses) / shareData.totalResponses) * 100) 
    : 0;

  // Calcular percentuais atuais (com proteção contra divisão por zero)
  const currentPositivePercentage = currentResponses.length > 0 
    ? Math.round((currentDistribution.positive / currentResponses.length) * 100)
    : shareData.totalResponses > 0 
      ? Math.round((shareData.positiveImpact / shareData.totalResponses) * 100)
      : 0;

  // Calcular diferenças específicas
  const positiveChange = currentDistribution.positive - shareData.positiveImpact;
  const neutralChange = currentDistribution.neutral - shareData.neutralImpact;
  const negativeChange = currentDistribution.negative - shareData.negativeImpact;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">
              {report.title}
            </h1>
          </div>
          <p className="text-gray-600 mb-2">{report.summary}</p>
          <p className="text-sm text-gray-500">Gerado em: {report.generatedAt}</p>
        </div>

        {/* Dados Compartilhados */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Dados Compartilhados</h2>
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
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <BarChart3 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-gray-600">{shareData.neutralImpact}</p>
              <p className="text-gray-600 text-sm">Impacto Neutro</p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-3 transform rotate-180" />
              <p className="text-2xl font-bold text-red-600">{shareData.negativeImpact}</p>
              <p className="text-gray-600 text-sm">Impacto Negativo</p>
            </div>
          </div>

          {shareData.totalResponses > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Distribuição Percentual (Dados Compartilhados):</h3>
              {report.metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{metric.label}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.label.includes('Positivo') ? 'bg-yellow-500' :
                          metric.label.includes('Neutro') ? 'bg-gray-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, metric.percentage))}%` }}
                      />
                    </div>
                    <span className="font-bold text-gray-800 w-12 text-right">
                      {metric.percentage}%
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
              <h2 className="text-xl font-semibold text-gray-800">Dados Atuais (Comparativo)</h2>
              <span className="ml-auto text-sm text-gray-500 bg-green-50 px-3 py-1 rounded-full">
                Atual: {currentResponses.length} {currentResponses.length === 1 ? 'resposta' : 'respostas'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Users className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-800">{currentResponses.length}</p>
                <p className="text-gray-600 text-sm">Total de Respostas</p>
                <p className={`text-xs mt-1 ${newResponses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {newResponses >= 0 ? '+' : ''}{newResponses} {Math.abs(newResponses) === 1 ? 'resposta' : 'respostas'}
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-6 text-center">
                <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-yellow-600">{currentDistribution.positive}</p>
                <p className="text-gray-600 text-sm">Impacto Positivo</p>
                <p className={`text-xs mt-1 ${positiveChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {positiveChange >= 0 ? '+' : ''}{positiveChange}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <BarChart3 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-600">{currentDistribution.neutral}</p>
                <p className="text-gray-600 text-sm">Impacto Neutro</p>
                <p className={`text-xs mt-1 ${neutralChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {neutralChange >= 0 ? '+' : ''}{neutralChange}
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6 text-center">
                <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-3 transform rotate-180" />
                <p className="text-2xl font-bold text-red-600">{currentDistribution.negative}</p>
                <p className="text-gray-600 text-sm">Impacto Negativo</p>
                <p className={`text-xs mt-1 ${negativeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {negativeChange >= 0 ? '+' : ''}{negativeChange}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Evolução desde o compartilhamento */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-blue-800 mb-4">📈 Evolução desde o compartilhamento:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center bg-white rounded-lg p-4">
              <div className={`text-2xl font-bold ${newResponses >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {newResponses >= 0 ? '+' : ''}{newResponses}
              </div>
              <div className="text-blue-700">
                {newResponses === 0 ? 'Sem Mudanças' : 
                 Math.abs(newResponses) === 1 ? 
                   (newResponses > 0 ? 'Nova Resposta' : 'Resposta Removida') : 
                   (newResponses > 0 ? 'Novas Respostas' : 'Respostas Removidas')}
              </div>
            </div>
            <div className="text-center bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {currentPositivePercentage}%
              </div>
              <div className="text-green-700">Impacto Positivo Atual</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4">
              <div className={`text-2xl font-bold ${newResponses >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>
                {newResponses >= 0 ? '+' : '-'}{growthPercentage}%
              </div>
              <div className="text-purple-700">{newResponses >= 0 ? 'Crescimento' : 'Redução'}</div>
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
              Fazer Pesquisa
            </button>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Esta é uma visualização compartilhada dos resultados da pesquisa.</p>
          <p>Para ver análises detalhadas e gráficos interativos, acesse o painel completo.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 max-w-2xl mx-auto mt-4">
            <p className="font-medium text-gray-700 mb-2">📊 Sobre esta visualização:</p>
            <ul className="text-left space-y-1">
              <li>• <strong>Dados Compartilhados:</strong> Snapshot dos resultados no momento do compartilhamento</li>
              {hasNewData && (
                <li>• <strong>Dados Atuais:</strong> Resultados atualizados em tempo real</li>
              )}
              <li>• <strong>Painel Completo:</strong> Gráficos interativos, análises detalhadas e exportação</li>
              <li>• <strong>Participar:</strong> Contribua com sua resposta para enriquecer a pesquisa</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};