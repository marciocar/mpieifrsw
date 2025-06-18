import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getResponses, exportToCSV } from '../utils/storage';
import { getResponseDistribution, getAgeGroupDistribution, getGenderDistribution, getTemporalTrends } from '../utils/analytics';
import { SurveyResponse } from '../types/survey';
import { BarChart3, Download, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { Share2 } from 'lucide-react';
import { Toast } from './Toast';
import { useToast } from '../hooks/useToast';
import { ShareModal } from './ShareModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DashboardProps {
  onStartSurvey: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartSurvey }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const loadData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setResponses(getResponses());
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCSV = () => {
    try {
      const exportedCount = exportToCSV();
      showToast(
        `✅ Dados exportados com sucesso! ${exportedCount} respostas foram salvas em CSV.`,
        'success'
      );
    } catch (error) {
      showToast(
        '❌ Erro ao exportar: Nenhum dado disponível para exportar.',
        'error'
      );
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const getShareData = () => ({
    totalResponses: responses.length,
    positiveImpact: responseDistribution.positive,
    neutralImpact: responseDistribution.neutral,
    negativeImpact: responseDistribution.negative
  });

  const responseDistribution = getResponseDistribution(responses);
  const ageGroupDistribution = getAgeGroupDistribution(responses);
  const genderDistribution = getGenderDistribution(responses);
  const temporalTrends = getTemporalTrends(responses);

  const distributionData = {
    labels: ['Impacto Positivo', 'Impacto Neutro', 'Impacto Negativo'],
    datasets: [
      {
        label: 'Quantidade de Respostas',
        data: [responseDistribution.positive, responseDistribution.neutral, responseDistribution.negative],
        backgroundColor: ['#eab308', '#6b7280', '#dc2626'],
        borderColor: ['#ca8a04', '#4b5563', '#b91c1c'],
        borderWidth: 2,
      },
    ],
  };

  const ageGroupData = {
    labels: Object.keys(ageGroupDistribution),
    datasets: [
      {
        label: 'Respostas por Faixa Etária',
        data: Object.values(ageGroupDistribution),
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 2,
      },
    ],
  };

  const genderData = {
    labels: Object.keys(genderDistribution).map(key => 
      {
        const translations = {
          'male': 'Masculino',
          'female': 'Feminino',
          'non-binary': 'Não-binário',
          'prefer-not-to-say': 'Prefiro não informar',
          'other': 'Outro'
        };
        return translations[key] || key;
      }
    ),
    datasets: [
      {
        data: Object.values(genderDistribution),
        backgroundColor: [
          '#dc2626',
          '#eab308',
          '#f97316',  // Não-binário - Laranja
          '#6b7280',
          '#3b82f6'   // Outro - Azul
        ],
        borderColor: [
          '#b91c1c',
          '#ca8a04',
          '#ea580c',  // Não-binário
          '#4b5563',
          '#2563eb'   // Outro
        ],
        borderWidth: 2,
      },
    ],
  };

  const temporalData = {
    labels: Object.keys(temporalTrends).sort(),
    datasets: [
      {
        label: 'Respostas Diárias',
        data: Object.keys(temporalTrends).sort().map(date => temporalTrends[date]),
        backgroundColor: [
          '#10b981',  // 18-25 - Verde claro
          '#059669',  // 26-35 - Verde médio
          '#047857',  // 36-45 - Verde
          '#065f46',  // 46-55 - Verde escuro
          '#064e3b'   // 56+ - Verde muito escuro
        ],
        borderColor: [
          '#059669',  // 18-25
          '#047857',  // 26-35
          '#065f46',  // 36-45
          '#064e3b',  // 46-55
          '#052e16'   // 56+
        ],
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center mb-2">
              <BarChart3 className="w-8 h-8 text-red-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">
                Painel de Análise da Pesquisa
              </h1>
            </div>
            <p className="text-gray-600">
              Insights em tempo real sobre uso e percepção de emojis na comunicação digital
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadData}
              className="flex items-center px-4 py-2 text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </button>
            <button
              onClick={handleExportCSV}
              disabled={responses.length === 0}
              className="flex items-center px-4 py-2 text-yellow-600 bg-yellow-50 border border-yellow-300 rounded-lg hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </button>
            <button
              onClick={handleShare}
              disabled={responses.length === 0}
              className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </button>
            <button
              onClick={onStartSurvey}
              className="flex items-center px-6 py-2 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
            >
              <Users className="w-4 h-4 mr-2" />
              Fazer Pesquisa
            </button>
          </div>
        </div>

        {responses.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum Dado Disponível</h3>
            <p className="text-gray-500 mb-6">
              Seja o primeiro a participar da nossa pesquisa sobre impacto dos emojis!
            </p>
            <button
              onClick={onStartSurvey}
              className="px-8 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
            >
              Iniciar Pesquisa
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total de Respostas</p>
                    <p className="text-3xl font-bold text-gray-800">{responses.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-red-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Impacto Positivo</p>
                    <p className="text-3xl font-bold text-yellow-600">{responseDistribution.positive}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Impacto Neutro</p>
                    <p className="text-3xl font-bold text-gray-600">{responseDistribution.neutral}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-gray-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Impacto Negativo</p>
                    <p className="text-3xl font-bold text-red-600">{responseDistribution.negative}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-red-500 transform rotate-180" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Distribuição Geral das Respostas
                </h3>
                <Bar data={distributionData} options={chartOptions} />
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Respostas por Faixa Etária
                </h3>
                <Bar data={ageGroupData} options={chartOptions} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Distribuição por Gênero
                </h3>
                <div className="max-w-md mx-auto">
                  <Pie data={genderData} options={pieOptions} />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Tendências de Respostas ao Longo do Tempo
                </h3>
                {Object.keys(temporalTrends).length > 0 ? (
                  <Line data={temporalData} options={chartOptions} />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Dados insuficientes para análise temporal
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareData={getShareData()}
      />
    </div>
  );
};