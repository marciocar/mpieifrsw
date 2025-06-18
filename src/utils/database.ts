import Database from 'better-sqlite3';
import { SurveyResponse, SurveyFormData } from '../types/survey';

// Inicializar banco de dados
let db: Database.Database | null = null;

const initDatabase = (): Database.Database => {
  if (db) return db;
  
  try {
    db = new Database('emoji_survey.db');
    
    // Criar tabela de respostas se não existir
    db.exec(`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'rarely')),
        clarity_impact TEXT NOT NULL CHECK (clarity_impact IN ('positive', 'neutral', 'negative')),
        tone_influence TEXT NOT NULL CHECK (tone_influence IN ('positive', 'neutral', 'negative')),
        professional_context TEXT NOT NULL CHECK (professional_context IN ('positive', 'neutral', 'negative')),
        age INTEGER NOT NULL CHECK (age >= 13 AND age <= 120),
        gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say', 'other')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de rascunhos
    db.exec(`
      CREATE TABLE IF NOT EXISTS survey_drafts (
        id INTEGER PRIMARY KEY,
        draft_data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar índices para melhor performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_responses_timestamp ON survey_responses(timestamp);
      CREATE INDEX IF NOT EXISTS idx_responses_clarity_impact ON survey_responses(clarity_impact);
      CREATE INDEX IF NOT EXISTS idx_responses_age ON survey_responses(age);
      CREATE INDEX IF NOT EXISTS idx_responses_gender ON survey_responses(gender);
    `);

    console.log('✅ Banco de dados SQLite inicializado com sucesso');
    return db;
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

// Salvar resposta da pesquisa
export const saveResponse = (response: SurveyResponse): void => {
  try {
    const database = initDatabase();
    
    const stmt = database.prepare(`
      INSERT INTO survey_responses (
        id, timestamp, frequency, clarity_impact, tone_influence, 
        professional_context, age, gender
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      response.id,
      response.timestamp,
      response.frequency,
      response.clarityImpact,
      response.toneInfluence,
      response.professionalContext,
      response.age,
      response.gender
    );

    console.log('✅ Resposta salva no SQLite:', response.id);
    clearDraft(); // Limpar rascunho após salvar
  } catch (error) {
    console.error('❌ Erro ao salvar resposta:', error);
    throw new Error('Falha ao salvar resposta no banco de dados');
  }
};

// Buscar todas as respostas
export const getResponses = (): SurveyResponse[] => {
  try {
    const database = initDatabase();
    
    const stmt = database.prepare(`
      SELECT 
        id,
        timestamp,
        frequency,
        clarity_impact as clarityImpact,
        tone_influence as toneInfluence,
        professional_context as professionalContext,
        age,
        gender
      FROM survey_responses 
      ORDER BY timestamp DESC
    `);

    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      frequency: row.frequency as 'daily' | 'weekly' | 'rarely',
      clarityImpact: row.clarityImpact as 'positive' | 'neutral' | 'negative',
      toneInfluence: row.toneInfluence as 'positive' | 'neutral' | 'negative',
      professionalContext: row.professionalContext as 'positive' | 'neutral' | 'negative',
      age: row.age,
      gender: row.gender as 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other'
    }));
  } catch (error) {
    console.error('❌ Erro ao buscar respostas:', error);
    return [];
  }
};

// Salvar rascunho
export const saveDraft = (draft: SurveyFormData): void => {
  try {
    const database = initDatabase();
    
    // Remover rascunho anterior (mantemos apenas um)
    database.prepare('DELETE FROM survey_drafts').run();
    
    // Inserir novo rascunho
    const stmt = database.prepare(`
      INSERT INTO survey_drafts (draft_data) VALUES (?)
    `);
    
    stmt.run(JSON.stringify(draft));
    console.log('✅ Rascunho salvo no SQLite');
  } catch (error) {
    console.error('❌ Erro ao salvar rascunho:', error);
  }
};

// Buscar rascunho
export const getDraft = (): SurveyFormData | null => {
  try {
    const database = initDatabase();
    
    const stmt = database.prepare(`
      SELECT draft_data FROM survey_drafts 
      ORDER BY updated_at DESC 
      LIMIT 1
    `);
    
    const row = stmt.get() as any;
    
    if (row) {
      return JSON.parse(row.draft_data);
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar rascunho:', error);
    return null;
  }
};

// Limpar rascunho
export const clearDraft = (): void => {
  try {
    const database = initDatabase();
    database.prepare('DELETE FROM survey_drafts').run();
    console.log('✅ Rascunho removido do SQLite');
  } catch (error) {
    console.error('❌ Erro ao limpar rascunho:', error);
  }
};

// Exportar dados para CSV
export const exportToCSV = (): number => {
  try {
    const responses = getResponses();
    
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
    
    console.log(`✅ Exportados ${responses.length} registros para CSV`);
    return responses.length;
  } catch (error) {
    console.error('❌ Erro ao exportar CSV:', error);
    throw error;
  }
};

// Estatísticas do banco
export const getDatabaseStats = () => {
  try {
    const database = initDatabase();
    
    const totalResponses = database.prepare('SELECT COUNT(*) as count FROM survey_responses').get() as any;
    const hasDraft = database.prepare('SELECT COUNT(*) as count FROM survey_drafts').get() as any;
    
    return {
      totalResponses: totalResponses.count,
      hasDraft: hasDraft.count > 0,
      databaseSize: database.prepare("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()").get() as any
    };
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    return { totalResponses: 0, hasDraft: false, databaseSize: { size: 0 } };
  }
};

// Limpar todos os dados (para desenvolvimento/testes)
export const clearAllData = (): void => {
  try {
    const database = initDatabase();
    database.prepare('DELETE FROM survey_responses').run();
    database.prepare('DELETE FROM survey_drafts').run();
    console.log('✅ Todos os dados foram removidos do SQLite');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    throw error;
  }
};

// Fechar conexão com banco (para cleanup)
export const closeDatabase = (): void => {
  if (db) {
    db.close();
    db = null;
    console.log('✅ Conexão com SQLite fechada');
  }
};