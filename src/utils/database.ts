import { SurveyResponse, SurveyFormData } from '../types/survey';

// Simulação de SQLite com persistência local
// Em produção, isso seria substituído por uma API que conecta ao SQLite real
class SQLiteDatabase {
  private dbName = 'emoji_survey.db';
  private initialized = false;

  constructor() {
    this.initializeDatabase();
  }

  // Inicializar banco de dados (simula criação do arquivo SQLite)
  private async initializeDatabase(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🗄️ Inicializando banco de dados SQLite:', this.dbName);
      
      // Verificar se o banco já existe
      const existingData = localStorage.getItem('sqlite_survey_responses');
      if (!existingData) {
        console.log('📁 Criando arquivo de banco de dados...');
        await this.createTables();
        console.log('✅ Banco de dados criado com sucesso!');
      } else {
        console.log('📂 Conectando ao banco existente');
        await this.validateDatabase();
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('❌ Erro ao inicializar banco:', error);
      await this.resetDatabase();
    }
  }

  // Criar tabelas (simula DDL do SQLite)
  private async createTables(): Promise<void> {
    const schema = {
      version: '1.0.0',
      created_at: new Date().toISOString(),
      tables: {
        survey_responses: {
          columns: {
            id: { type: 'TEXT', primary: true, nullable: false },
            timestamp: { type: 'TEXT', nullable: false },
            frequency: { type: 'TEXT', nullable: false },
            clarity_impact: { type: 'TEXT', nullable: false },
            tone_influence: { type: 'TEXT', nullable: false },
            professional_context: { type: 'TEXT', nullable: false },
            age: { type: 'INTEGER', nullable: false },
            gender: { type: 'TEXT', nullable: false },
            created_at: { type: 'TEXT', default: 'CURRENT_TIMESTAMP' },
            updated_at: { type: 'TEXT', default: 'CURRENT_TIMESTAMP' }
          },
          indexes: ['timestamp', 'age', 'gender'],
          data: []
        },
        survey_drafts: {
          columns: {
            id: { type: 'TEXT', primary: true, nullable: false },
            data: { type: 'TEXT', nullable: false },
            created_at: { type: 'TEXT', default: 'CURRENT_TIMESTAMP' },
            updated_at: { type: 'TEXT', default: 'CURRENT_TIMESTAMP' }
          },
          data: []
        }
      }
    };

    // Simular criação de arquivo SQLite
    localStorage.setItem('sqlite_database_schema', JSON.stringify(schema));
    localStorage.setItem('sqlite_survey_responses', JSON.stringify([]));
    localStorage.setItem('sqlite_survey_drafts', JSON.stringify([]));
    
    console.log('📋 Tabelas criadas:', Object.keys(schema.tables));
  }

  // Validar integridade do banco
  private async validateDatabase(): Promise<void> {
    try {
      const responses = this.getStoredResponses();
      const schema = this.getSchema();
      
      if (!schema || !Array.isArray(responses)) {
        throw new Error('Estrutura de dados corrompida');
      }
      
      console.log('✅ Validação do banco concluída');
    } catch (error) {
      console.warn('⚠️ Dados corrompidos, reinicializando banco...');
      await this.resetDatabase();
    }
  }

  // Reset completo do banco (simula DROP DATABASE)
  private async resetDatabase(): Promise<void> {
    localStorage.removeItem('sqlite_database_schema');
    localStorage.removeItem('sqlite_survey_responses');
    localStorage.removeItem('sqlite_survey_drafts');
    this.initialized = false;
    await this.createTables();
  }

  // Obter schema do banco
  private getSchema(): any {
    const schema = localStorage.getItem('sqlite_database_schema');
    return schema ? JSON.parse(schema) : null;
  }

  // Obter respostas armazenadas
  private getStoredResponses(): SurveyResponse[] {
    const data = localStorage.getItem('sqlite_survey_responses');
    return data ? JSON.parse(data) : [];
  }

  // Salvar respostas
  private saveStoredResponses(responses: SurveyResponse[]): void {
    localStorage.setItem('sqlite_survey_responses', JSON.stringify(responses));
  }

  // INSERT - Inserir nova resposta (simula SQL INSERT)
  async insertResponse(response: SurveyResponse): Promise<void> {
    await this.initializeDatabase();
    
    try {
      const responses = this.getStoredResponses();
      
      // Verificar se já existe (simula UNIQUE constraint)
      const existingIndex = responses.findIndex(r => r.id === response.id);
      if (existingIndex !== -1) {
        throw new Error(`Registro com ID ${response.id} já existe`);
      }
      
      // Adicionar timestamps de auditoria
      const dbRecord: SurveyResponse = {
        ...response,
        timestamp: response.timestamp || new Date().toISOString()
      };
      
      responses.push(dbRecord);
      this.saveStoredResponses(responses);
      
      console.log('✅ Registro inserido:', response.id);
    } catch (error) {
      console.error('❌ Erro ao inserir registro:', error);
      throw error;
    }
  }

  // SELECT - Buscar todas as respostas (simula SQL SELECT)
  async selectAllResponses(): Promise<SurveyResponse[]> {
    await this.initializeDatabase();
    
    try {
      const responses = this.getStoredResponses();
      
      // Filtrar registros válidos (simula WHERE clause)
      return responses.filter(response => 
        response && 
        typeof response === 'object' &&
        response.id &&
        response.timestamp &&
        response.clarityImpact &&
        typeof response.age === 'number'
      );
    } catch (error) {
      console.error('❌ Erro ao buscar registros:', error);
      return [];
    }
  }

  // SELECT com filtros (simula SQL WHERE)
  async selectResponsesWhere(filters: Partial<SurveyResponse>): Promise<SurveyResponse[]> {
    const allResponses = await this.selectAllResponses();
    
    return allResponses.filter(response => {
      return Object.entries(filters).every(([key, value]) => {
        return response[key as keyof SurveyResponse] === value;
      });
    });
  }

  // UPDATE - Atualizar resposta (simula SQL UPDATE)
  async updateResponse(id: string, updates: Partial<SurveyResponse>): Promise<boolean> {
    await this.initializeDatabase();
    
    try {
      const responses = this.getStoredResponses();
      const index = responses.findIndex(r => r.id === id);
      
      if (index === -1) {
        return false;
      }
      
      responses[index] = {
        ...responses[index],
        ...updates,
        // Manter campos de auditoria
        id: responses[index].id,
        timestamp: responses[index].timestamp
      };
      
      this.saveStoredResponses(responses);
      console.log('✅ Registro atualizado:', id);
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar registro:', error);
      return false;
    }
  }

  // DELETE - Remover resposta (simula SQL DELETE)
  async deleteResponse(id: string): Promise<boolean> {
    await this.initializeDatabase();
    
    try {
      const responses = this.getStoredResponses();
      const initialLength = responses.length;
      const filteredResponses = responses.filter(r => r.id !== id);
      
      if (filteredResponses.length === initialLength) {
        return false; // Nenhum registro removido
      }
      
      this.saveStoredResponses(filteredResponses);
      console.log('✅ Registro removido:', id);
      return true;
    } catch (error) {
      console.error('❌ Erro ao remover registro:', error);
      return false;
    }
  }

  // COUNT - Contar registros (simula SQL COUNT)
  async countResponses(filters?: Partial<SurveyResponse>): Promise<number> {
    if (filters) {
      const filteredResponses = await this.selectResponsesWhere(filters);
      return filteredResponses.length;
    }
    
    const allResponses = await this.selectAllResponses();
    return allResponses.length;
  }

  // Operações para rascunhos
  async saveDraft(draft: SurveyFormData): Promise<void> {
    await this.initializeDatabase();
    
    try {
      const draftRecord = {
        id: 'current_draft',
        data: JSON.stringify(draft),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('sqlite_current_draft', JSON.stringify(draftRecord));
      console.log('✅ Rascunho salvo');
    } catch (error) {
      console.error('❌ Erro ao salvar rascunho:', error);
      throw error;
    }
  }

  async getDraft(): Promise<SurveyFormData | null> {
    await this.initializeDatabase();
    
    try {
      const stored = localStorage.getItem('sqlite_current_draft');
      if (!stored) return null;
      
      const draftRecord = JSON.parse(stored);
      return JSON.parse(draftRecord.data);
    } catch (error) {
      console.error('❌ Erro ao carregar rascunho:', error);
      return null;
    }
  }

  async clearDraft(): Promise<void> {
    localStorage.removeItem('sqlite_current_draft');
    console.log('✅ Rascunho removido');
  }

  // Exportar dados para CSV
  async exportToCSV(): Promise<number> {
    const responses = await this.selectAllResponses();
    
    if (responses.length === 0) {
      throw new Error('Nenhum dado disponível para exportar');
    }

    const headers = [
      'ID',
      'Data/Hora',
      'Frequência',
      'Impacto na Clareza',
      'Influência no Tom',
      'Contexto Profissional',
      'Idade',
      'Gênero'
    ];

    const csvContent = [
      headers.join(','),
      ...responses.map(response => [
        response.id,
        response.timestamp,
        response.frequency,
        response.clarityImpact,
        response.toneInfluence,
        response.professionalContext,
        response.age,
        response.gender
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `emoji_survey_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Dados exportados:', responses.length, 'registros');
    return responses.length;
  }

  // Estatísticas do banco
  async getDatabaseStats(): Promise<any> {
    await this.initializeDatabase();
    
    const totalResponses = await this.countResponses();
    const schema = this.getSchema();
    
    return {
      database: this.dbName,
      version: schema?.version || '1.0.0',
      created_at: schema?.created_at,
      tables: Object.keys(schema?.tables || {}),
      total_responses: totalResponses,
      last_backup: new Date().toISOString()
    };
  }
}

// Instância singleton do banco
const database = new SQLiteDatabase();

// Funções de conveniência para manter compatibilidade
export const saveResponse = async (response: SurveyResponse): Promise<void> => {
  await database.insertResponse(response);
  await database.clearDraft();
};

export const getResponses = async (): Promise<SurveyResponse[]> => {
  return await database.selectAllResponses();
};

export const getResponsesSync = (): SurveyResponse[] => {
  // Para compatibilidade com código existente que espera função síncrona
  const stored = localStorage.getItem('sqlite_survey_responses');
  return stored ? JSON.parse(stored) : [];
};

export const saveDraft = async (draft: SurveyFormData): Promise<void> => {
  await database.saveDraft(draft);
};

export const getDraft = async (): Promise<SurveyFormData | null> => {
  return await database.getDraft();
};

export const clearDraft = async (): Promise<void> => {
  await database.clearDraft();
};

export const exportToCSV = async (): Promise<number> => {
  return await database.exportToCSV();
};

export const getDatabaseStats = async () => {
  return await database.getDatabaseStats();
};

// Exportar instância do banco para uso avançado
export { database as sqliteDatabase };