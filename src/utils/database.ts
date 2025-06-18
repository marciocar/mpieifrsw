import * as sqlJs from 'sql.js';
import { Database } from 'sql.js';
import { SurveyResponse, SurveyFormData } from '../types/survey';

// Instância do banco de dados
let db: Database | null = null;
let SQL: any = null;

// Chave para persistir no localStorage
const DB_STORAGE_KEY = 'emoji_survey_sqlite_db';

// Inicializar SQLite no navegador
const initDatabase = async (): Promise<Database> => {
  if (db && SQL) return db;
  
  try {
    // Inicializar sql.js
    SQL = await sqlJs.default({
      // Carregar o wasm do CDN
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });
    
    // Tentar carregar banco existente do localStorage
    const savedDb = localStorage.getItem(DB_STORAGE_KEY);
    
    if (savedDb) {
      // Restaurar banco existente
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      db = new SQL.Database(uint8Array);
      console.log('✅ Banco SQLite restaurado do localStorage');
    } else {
      // Criar novo banco
      db = new SQL.Database();
      console.log('✅ Novo banco SQLite criado');
    }
    
    // Criar tabelas se não existirem
    db.run(`
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
    db.run(`
      CREATE TABLE IF NOT EXISTS survey_drafts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        draft_data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar índices para melhor performance
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_responses_timestamp ON survey_responses(timestamp);
      CREATE INDEX IF NOT EXISTS idx_responses_clarity_impact ON survey_responses(clarity_impact);
      CREATE INDEX IF NOT EXISTS idx_responses_age ON survey_responses(age);
      CREATE INDEX IF NOT EXISTS idx_responses_gender ON survey_responses(gender);
    `);

    // Salvar no localStorage
    saveDatabase();
    
    console.log('✅ Banco de dados SQLite inicializado com sucesso no navegador');
    return db;
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados SQLite:', error);
    
    // Fallback para localStorage se SQLite falhar
    console.warn('⚠️ Usando fallback para localStorage');
    throw error;
  }
};

// Salvar banco no localStorage
const saveDatabase = (): void => {
  if (!db) return;
  
  try {
    const data = db.export();
    const dataArray = Array.from(data);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(dataArray));
  } catch (error) {
    console.error('❌ Erro ao salvar banco no localStorage:', error);
  }
};

// Salvar resposta da pesquisa
export const saveResponse = async (response: SurveyResponse): Promise<void> => {
  try {
    const database = await initDatabase();
    
    const stmt = database.prepare(`
      INSERT INTO survey_responses (
        id, timestamp, frequency, clarity_impact, tone_influence, 
        professional_context, age, gender
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      response.id,
      response.timestamp,
      response.frequency,
      response.clarityImpact,
      response.toneInfluence,
      response.professionalContext,
      response.age,
      response.gender
    ]);

    stmt.free();
    saveDatabase(); // Persistir no localStorage
    
    console.log('✅ Resposta salva no SQLite:', response.id);
    await clearDraft(); // Limpar rascunho após salvar
  } catch (error) {
    console.error('❌ Erro ao salvar resposta:', error);
    throw new Error('Falha ao salvar resposta no banco de dados');
  }
};

// Buscar todas as respostas
export const getResponses = async (): Promise<SurveyResponse[]> => {
  try {
    const database = await initDatabase();
    
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

    const results: SurveyResponse[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        id: row.id as string,
        timestamp: row.timestamp as string,
        frequency: row.frequency as 'daily' | 'weekly' | 'rarely',
        clarityImpact: row.clarityImpact as 'positive' | 'neutral' | 'negative',
        toneInfluence: row.toneInfluence as 'positive' | 'neutral' | 'negative',
        professionalContext: row.professionalContext as 'positive' | 'neutral' | 'negative',
        age: row.age as number,
        gender: row.gender as 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other'
      });
    }
    
    stmt.free();
    return results;
  } catch (error) {
    console.error('❌ Erro ao buscar respostas:', error);
    return [];
  }
};

// Versão síncrona para compatibilidade
export const getResponsesSync = (): SurveyResponse[] => {
  if (!db) {
    console.warn('⚠️ Banco não inicializado, retornando array vazio');
    return [];
  }
  
  try {
    const stmt = db.prepare(`
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

    const results: SurveyResponse[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        id: row.id as string,
        timestamp: row.timestamp as string,
        frequency: row.frequency as 'daily' | 'weekly' | 'rarely',
        clarityImpact: row.clarityImpact as 'positive' | 'neutral' | 'negative',
        toneInfluence: row.toneInfluence as 'positive' | 'neutral' | 'negative',
        professionalContext: row.professionalContext as 'positive' | 'neutral' | 'negative',
        age: row.age as number,
        gender: row.gender as 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other'
      });
    }
    
    stmt.free();
    return results;
  } catch (error) {
    console.error('❌ Erro ao buscar respostas:', error);
    return [];
  }
};

// Salvar rascunho
export const saveDraft = async (draft: SurveyFormData): Promise<void> => {
  try {
    const database = await initDatabase();
    
    // Remover rascunho anterior (mantemos apenas um)
    database.run('DELETE FROM survey_drafts');
    
    // Inserir novo rascunho
    const stmt = database.prepare(`
      INSERT INTO survey_drafts (draft_data) VALUES (?)
    `);
    
    stmt.run([JSON.stringify(draft)]);
    stmt.free();
    saveDatabase(); // Persistir no localStorage
    
    console.log('✅ Rascunho salvo no SQLite');
  } catch (error) {
    console.error('❌ Erro ao salvar rascunho:', error);
  }
};

// Buscar rascunho
export const getDraft = async (): Promise<SurveyFormData | null> => {
  try {
    const database = await initDatabase();
    
    const stmt = database.prepare(`
      SELECT draft_data FROM survey_drafts 
      ORDER BY updated_at DESC 
      LIMIT 1
    `);
    
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return JSON.parse(row.draft_data as string);
    }
    
    stmt.free();
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar rascunho:', error);
    return null;
  }
};

// Limpar rascunho
export const clearDraft = async (): Promise<void> => {
  try {
    const database = await initDatabase();
    database.run('DELETE FROM survey_drafts');
    saveDatabase(); // Persistir no localStorage
    console.log('✅ Rascunho removido do SQLite');
  } catch (error) {
    console.error('❌ Erro ao limpar rascunho:', error);
  }
};

// Exportar dados para CSV
export const exportToCSV = async (): Promise<number> => {
  try {
    const responses = await getResponses();
    
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
export const getDatabaseStats = async () => {
  try {
    const database = await initDatabase();
    
    const totalStmt = database.prepare('SELECT COUNT(*) as count FROM survey_responses');
    totalStmt.step();
    const totalResponses = totalStmt.getAsObject().count as number;
    totalStmt.free();
    
    const draftStmt = database.prepare('SELECT COUNT(*) as count FROM survey_drafts');
    draftStmt.step();
    const hasDraft = (draftStmt.getAsObject().count as number) > 0;
    draftStmt.free();
    
    return {
      totalResponses,
      hasDraft,
      databaseSize: db ? db.export().length : 0
    };
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    return { totalResponses: 0, hasDraft: false, databaseSize: 0 };
  }
};

// Limpar todos os dados (para desenvolvimento/testes)
export const clearAllData = async (): Promise<void> => {
  try {
    const database = await initDatabase();
    database.run('DELETE FROM survey_responses');
    database.run('DELETE FROM survey_drafts');
    saveDatabase(); // Persistir no localStorage
    console.log('✅ Todos os dados foram removidos do SQLite');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    throw error;
  }
};

// Inicializar banco automaticamente quando o módulo for carregado
initDatabase().catch(error => {
  console.error('❌ Falha na inicialização automática do banco:', error);
});

// Exportar função de inicialização para uso manual
export { initDatabase };