# 📊 Pesquisa de Impacto dos Emojis

Uma plataforma interativa de pesquisa desenvolvida para analisar o impacto dos emojis na comunicação digital. Este projeto oferece uma interface moderna e intuitiva para coleta de dados e visualização de resultados em tempo real.

## 🚀 Demonstração

**Site em produção:** [https://regal-manatee-89073b.netlify.app](https://regal-manatee-89073b.netlify.app)

## ✨ Funcionalidades

### 📝 Wizard de Pesquisa
- **Interface step-by-step** com barra de progresso visual
- **Validação em tempo real** dos campos obrigatórios
- **Salvamento automático** de rascunhos no localStorage
- **Design responsivo** otimizado para desktop e mobile
- **Feedback visual** com animações e transições suaves

### 📈 Dashboard Analítico
- **Visualizações interativas** usando Chart.js
- **Métricas em tempo real** com cards informativos
- **Múltiplos tipos de gráficos:**
  - Gráfico de barras para distribuição geral
  - Gráfico de pizza para distribuição por gênero
  - Gráfico de linha para tendências temporais
  - Análise por faixa etária
- **Exportação de dados** em formato CSV
- **Atualização automática** dos dados

### 🎨 Design System
- **Paleta Ferrari** (vermelho, amarelo, preto)
- **Componentes modulares** e reutilizáveis
- **Animações fluidas** e micro-interações
- **Tipografia hierárquica** para melhor legibilidade
- **Sistema de espaçamento** consistente (8px grid)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilização
- **Vite** - Build tool e dev server

### Visualização de Dados
- **Chart.js** - Biblioteca de gráficos
- **react-chartjs-2** - Wrapper React para Chart.js

### Ícones e UI
- **Lucide React** - Biblioteca de ícones
- **date-fns** - Manipulação de datas

### Armazenamento
- **localStorage** - Persistência local dos dados
- **JSON** - Formato de armazenamento

## 📋 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── Dashboard.tsx    # Painel principal com gráficos
│   ├── SurveyWizard.tsx # Wizard da pesquisa
│   ├── QuestionCard.tsx # Card individual de pergunta
│   ├── ProgressBar.tsx  # Barra de progresso
│   └── WizardNavigation.tsx # Navegação do wizard
├── types/               # Definições TypeScript
│   └── survey.ts       # Tipos da pesquisa
├── utils/              # Utilitários
│   ├── storage.ts      # Gerenciamento localStorage
│   └── analytics.ts    # Processamento de dados
├── App.tsx             # Componente raiz
└── main.tsx           # Entry point
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório
cd emoji-survey-wizard

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

### Build para Produção
```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

## 📊 Estrutura dos Dados

### Resposta da Pesquisa
```typescript
interface SurveyResponse {
  id: string;
  timestamp: string;
  frequency: 'daily' | 'weekly' | 'rarely';
  clarityImpact: 'positive' | 'neutral' | 'negative';
  toneInfluence: 'positive' | 'neutral' | 'negative';
  professionalContext: 'positive' | 'neutral' | 'negative';
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';
}
```

### Perguntas da Pesquisa
1. **Frequência de uso** - Como o usuário utiliza emojis
2. **Impacto na clareza** - Percepção sobre clareza das mensagens
3. **Influência no tom** - Como emojis afetam interpretação
4. **Contexto profissional** - Adequação em ambientes de trabalho
5. **Dados demográficos** - Idade e gênero para segmentação

## 📈 Métricas e Analytics

### Distribuições Calculadas
- **Impacto geral** (positivo/neutro/negativo)
- **Faixas etárias** (18-25, 26-35, 36-45, 46-55, 56+)
- **Distribuição por gênero**
- **Tendências temporais** (respostas por dia)

### Exportação de Dados
- Formato CSV com todas as respostas
- Headers em português para facilitar análise
- Nome do arquivo com timestamp automático

## 🎯 Casos de Uso

### Para Pesquisadores
- Coleta estruturada de dados sobre comunicação digital
- Análise estatística em tempo real
- Exportação para ferramentas de análise avançada (Excel, SPSS, R)

### Para Profissionais de UX/UI
- Insights sobre percepção de emojis em interfaces
- Dados demográficos para personas
- Tendências de uso por faixa etária

### Para Linguistas Digitais
- Padrões de uso de emojis
- Impacto na interpretação textual
- Evolução temporal do uso

## 🔧 Configurações

### Personalização de Cores
As cores podem ser ajustadas no arquivo `tailwind.config.js` ou diretamente nos componentes usando classes Tailwind.

### Adição de Perguntas
Novas perguntas podem ser adicionadas no array `questions` em `SurveyWizard.tsx`:

```typescript
{
  id: 'newQuestion',
  title: 'Sua nova pergunta?',
  type: 'radio', // 'radio' | 'number' | 'select'
  options: [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' }
  ],
  validation: (value) => !value ? 'Campo obrigatório' : null
}
```

## 🚀 Deploy

### Netlify (Recomendado)
```bash
npm run build
# Upload da pasta dist/ para Netlify
```

### Outras Plataformas
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Configure GitHub Actions
- **Firebase Hosting**: `firebase deploy`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para pesquisa em comunicação digital.

---

## 📞 Suporte

Para dúvidas ou sugestões:
- Abra uma [issue](../../issues)
- Entre em contato através do [site](https://regal-manatee-89073b.netlify.app)

---

**Nota:** Este projeto foi desenvolvido com foco em usabilidade e acessibilidade, seguindo as melhores práticas de desenvolvimento web moderno.