import React, { useState, useEffect } from 'react';
import { X, Copy, Mail, Link, CheckCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: {
    totalResponses: number;
    positiveImpact: number;
    neutralImpact: number;
    negativeImpact: number;
  };
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareData }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Gerar URL compartilhável com dados codificados
      const encodedData = btoa(JSON.stringify(shareData));
      const baseUrl = window.location.origin + window.location.pathname;
      const url = `${baseUrl}?share=${encodedData}`;
      setShareUrl(url);
    }
  }, [isOpen, shareData]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const handleSendEmail = () => {
    if (!email.trim()) {
      alert('Por favor, digite um email válido.');
      return;
    }

    try {
      const subject = encodeURIComponent('Resultados da Pesquisa de Impacto dos Emojis');
      const body = encodeURIComponent(
        `Olá!\n\nGostaria de compartilhar os resultados da nossa pesquisa sobre o impacto dos emojis na comunicação digital:\n\n` +
        `📊 Total de Respostas: ${shareData.totalResponses}\n` +
        `✅ Impacto Positivo: ${shareData.positiveImpact}\n` +
        `⚪ Impacto Neutro: ${shareData.neutralImpact}\n` +
        `❌ Impacto Negativo: ${shareData.negativeImpact}\n\n` +
        `Veja os resultados completos em: ${shareUrl}\n\n` +
        `Atenciosamente,\nEquipe de Pesquisa`
      );

      const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
      
      // Tentar abrir o cliente de email
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Mostrar feedback de sucesso
      alert('Cliente de email aberto! Se não abriu automaticamente, copie o link compartilhável e envie manualmente.');
      
    } catch (error) {
      console.error('Erro ao abrir cliente de email:', error);
      alert('Não foi possível abrir o cliente de email. Por favor, copie o link compartilhável e envie manualmente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Link className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Compartilhar Resultados</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Resumo dos Dados */}
          <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Resumo dos Resultados:</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-600 rounded-full mr-2"></div>
                <span>Total: {shareData.totalResponses}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>Positivo: {shareData.positiveImpact}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span>Neutro: {shareData.neutralImpact}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Negativo: {shareData.negativeImpact}</span>
              </div>
            </div>
          </div>

          {/* Link Compartilhável */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Compartilhável:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-1">✅ Link copiado para a área de transferência!</p>
            )}
          </div>

          {/* Envio por Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compartilhar por Email:
            </label>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-amber-700">
                💡 <strong>Como funciona:</strong> Ao clicar em "Abrir Email", seu cliente de email padrão será aberto com uma mensagem pré-formatada. Se não funcionar, copie o link acima e envie manualmente.
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o email do destinatário"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <button
                onClick={handleSendEmail}
                disabled={!email}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Mail className="w-4 h-4 mr-2" />
                Abrir Cliente de Email
              </button>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">💡 Como funciona:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• O link contém um resumo dos resultados atuais</li>
              <li>• Qualquer pessoa pode visualizar os dados compartilhados</li>
              <li>• Os dados são atualizados em tempo real no painel</li>
              <li>• Ideal para compartilhar com colegas e supervisores</li>
              <li>• Para email: funciona melhor com Outlook, Gmail ou Apple Mail instalados</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};