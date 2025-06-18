import React from 'react';
import { BarChart3, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { generateShareableReport } from '../utils/shareUtils';

interface SharedViewProps {
  shareData: {
    totalResponses: number;
    positiveImpact: number;
    neutralImpact: number;
    negativeImpact: number;
  };
  onViewFullDashboard: () => void;
}

export const SharedView: React.FC<SharedViewProps> = ({ shareData, onViewFullDashboard }) => {
  const report = generateShareableReport(shareData);

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

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Resumo dos Resultados</h2>
          
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Distribuição Percentual:</h3>
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
                      style={{ width: `${metric.percentage}%` }}
                    />
                  </div>
                  <span className="font-bold text-gray-800 w-12 text-right">
                    {metric.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onViewFullDashboard}
            className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Painel Completo
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Esta é uma visualização compartilhada dos resultados da pesquisa.</p>
          <p>Para ver análises detalhadas e gráficos interativos, acesse o painel completo.</p>
        </div>
      </div>
    </div>
  );
};