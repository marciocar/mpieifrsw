# 🎓 Oficina de DesEnvolvimento com IA - MPIE IFERS

![Oficina de DesEnvolvimento com IA](./assets/oficina-de-des-envolvimento-com-IA.png)

## 📚 Sobre o Workshop

Este projeto foi desenvolvido durante a **Oficina de DesEnvolvimento com IA** ministrada por **Marcio Carvalho** para os mestrandos do **MPIE - Mestrado Profissional em Informática na Educação** do **IFERS**.

### 🎯 Objetivo da Oficina
Demonstrar como criar **protótipos funcionais** de produtos educacionais em **3 horas** utilizando **Inteligência Artificial** como ferramenta de desenvolvimento.

### 📖 Material da Apresentação
📄 **[Download da Apresentação (PDF)](./assets/oficina-de-des-envolvimento-com-IA.pdf)**

---

## 📊 Pesquisa de Impacto dos Emojis

Uma plataforma interativa de pesquisa desenvolvida para analisar o impacto dos emojis na comunicação digital. Este projeto oferece uma interface moderna e intuitiva para coleta de dados e visualização de resultados em tempo real.

## 🚀 Demonstração

**Site em produção:** [https://regal-manatee-89073b.netlify.app](https://regal-manatee-89073b.netlify.app)

## ✨ Funcionalidades

### 📝 Wizard de Pesquisa
- **Interface step-by-step** com barra de progresso visual
- **Avanço automático** ao selecionar respostas (radio/select)
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
- **Compartilhamento de resultados** via link ou email
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
│   ├── WizardNavigation.tsx # Navegação do wizard
│   ├── SharedView.tsx   # Visualização compartilhada
│   ├── ShareModal.tsx   # Modal de compartilhamento
│   └── Toast.tsx        # Notificações
├── types/               # Definições TypeScript
│   └── survey.ts       # Tipos da pesquisa
├── utils/              # Utilitários
│   ├── storage.ts      # Gerenciamento localStorage
│   ├── analytics.ts    # Processamento de dados
│   └── shareUtils.ts   # Utilitários de compartilhamento
├── hooks/              # Custom Hooks
│   └── useToast.ts     # Hook para notificações
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

### Exportação e Compartilhamento
- Formato CSV com todas as respostas
- Headers em português para facilitar análise
- Nome do arquivo com timestamp automático
- Links compartilháveis com resumo dos dados
- Envio por email (integração com clientes nativos)

## 🎯 Casos de Uso Educacionais

### Para Pesquisadores em Educação
- Coleta estruturada de dados sobre comunicação digital
- Análise estatística em tempo real
- Exportação para ferramentas de análise avançada (Excel, SPSS, R)

### Para Profissionais de Tecnologia Educacional
- Insights sobre percepção de emojis em interfaces educacionais
- Dados demográficos para personas de estudantes
- Tendências de uso por faixa etária

### Para Linguistas Digitais
- Padrões de uso de emojis em contextos educacionais
- Impacto na interpretação textual
- Evolução temporal do uso

## 🎓 Aprendizados do Workshop

### Conceitos Abordados
- **Prompts Eficazes**: Como escrever instruções claras para IA
- **Agentes de IA**: Sistemas autônomos para desenvolvimento
- **Prototipagem Rápida**: Do conceito ao produto em horas
- **Ferramentas Modernas**: Bolt.new, Cursor, e outras

### Tipos de Prompts Demonstrados
1. **Prompt Direto** - Instruções simples e objetivas
2. **Prompt com Persona** - Definindo papéis e público-alvo
3. **Prompt de Formato** - Estruturando respostas
4. **Prompt com Contexto** - Fornecendo exemplos
5. **Prompt Iterativo** - Refinamento em etapas
6. **Prompt Multitarefa** - Múltiplas solicitações

## 👨‍🏫 Sobre o Instrutor

**Marcio Carvalho** - Mestre em Gamificação
- 🎮 Apaixonado por Gamificação e IA
- 💻 Analista de Sistemas e Especialista em Docência
- 🎓 Mestre em Informática na Educação
- 🚀 Co-fundador e CTO de startups (Grana.Ai, Ticui, Betahauss, Tecredi)
- 📚 Autor dos livros "Livro Mágico da Gamificação" e "O Jogo dos Negócios"
- 🏆 Criador do modelo MAAGICA
- 🌐 Membro do Tech Changers e Comitê AI Accelerators da IFTL

**Contatos:**
- 📱 Instagram: [@marciotics](https://instagram.com/marciotics)
- 💼 LinkedIn: [/marciocar](https://linkedin.com/in/marciocar)
- 🌐 Site: [ojogodosnegocios.com](https://ojogodosnegocios.com)

## 🔧 Configurações Avançadas

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

## 🎯 Objetivos Pedagógicos

Este projeto demonstra:
- ✅ **Prototipagem rápida** com IA
- ✅ **Desenvolvimento moderno** com React/TypeScript
- ✅ **UX/UI responsivo** e acessível
- ✅ **Análise de dados** em tempo real
- ✅ **Compartilhamento** e colaboração
- ✅ **Boas práticas** de desenvolvimento

---

## 📞 Suporte

Para dúvidas sobre o projeto ou workshop:
- 📧 Entre em contato através do [site](https://ojogodosnegocios.com)
- 💬 Abra uma [issue](../../issues) no repositório
- 📱 Siga [@marciotics](https://instagram.com/marciotics) no Instagram

---

**Desenvolvido com ❤️ durante a Oficina de DesEnvolvimento com IA - MPIE IFERS**

*"Faço o protótipo do seu produto de mestrado em 3 horas"* - Marcio Carvalho