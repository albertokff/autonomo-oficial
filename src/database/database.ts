import * as SQLite from 'expo-sqlite';
import { Agendamento } from '../context/AgendamentoContext';

let dbPromise;

export async function openDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('autonomoapp.db');
  }
  return dbPromise;
}

export async function createTableServices() {
  const db = await openDb();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT
    );`
  );
}

export async function insert(table: string, campos: any) {
  const db = await openDb();
  
  const columns = campos.map(c => c.name).join(', ');
  const values = campos.map(c => c.value);

  const placeholders = campos.map(() => '?').join(', ');

  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

  return await db.runAsync(query, values);
}

export async function getAllServices() {
  const db = await openDb();
  const result = await db.getAllAsync('SELECT * FROM services');
  return result;
}

export async function createTableAgendamentos() {
  const db = await openDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT NOT NULL,
      servico TEXT NOT NULL,
      data TEXT NOT NULL,
      horario TEXT NOT NULL
    );
  `);
}

export async function addFeitoColumnIfNotExists() {
  const db = await openDb();
  try {
    await db.execAsync('ALTER TABLE agendamentos ADD COLUMN feito INTEGER DEFAULT 0;');
  } catch (error: any) {
    if (
      error.message.includes('duplicate column') ||
      error.message.includes('already exists') ||
      error.message.includes('column "feito" already exists')
    ) {
      // Coluna já existe, ok
    } else {
      throw error;
    }
  }
}

export async function addValorColumnIfNotExists() {
  const db = await openDb();
  try {
    await db.execAsync('ALTER TABLE agendamentos ADD COLUMN valor REAL DEFAULT 0;');
  } catch (error: any) {
    if (
      error.message.includes('duplicate column') ||
      error.message.includes('already exists') ||
      error.message.includes('column "valor" already exists')
    ) {
      // Coluna já existe, beleza
    } else {
      throw error;
    }
  }
}


export async function initDatabase() {
  await createTableAgendamentos();
  await addFeitoColumnIfNotExists();
  await addValorColumnIfNotExists();
}

export const getAllAgendamentos = async () => {
  const db = await openDb();
  try {
    const result = await db.getAllAsync('SELECT * FROM agendamentos');
    console.log('Resultado bruto do banco:', result);

    return result.map((item: any) => ({
      ...item,
      feito: item.feito === 1 || item.feito === '1', // força booleano
    }));
  } catch (error) {
    console.log('Erro ao buscar agendamentos:', error);
    return [];
  }
};



export const deleteAgendamento = async (id: string) => {
  try {
    const db = await openDb();
    await db.runAsync('DELETE FROM agendamentos WHERE id = ?', [id]);
    console.log('Agendamento excluído com sucesso');
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
  }
};

export const marcarAgendamentoComoFeito = async (id: string) => {
  try {
    const db = await openDb();
    await db.runAsync('UPDATE agendamentos SET feito = 1 WHERE id = ?', [id]);
    console.log('Agendamento marcado como feito');
  } catch (error) {
    console.error('Erro ao marcar como feito:', error);
  }
};

export const getResumoMensal = async () => {
  const db = await openDb();
  const agora = new Date();
  const mes = agora.getMonth() + 1;
  const ano = agora.getFullYear();
  const mesFormatado = mes < 10 ? `0${mes}` : mes.toString();
  const inicio = `${ano}-${mesFormatado}-01`;
  const fim = `${ano}-${mesFormatado}-31`;

  try {
    const result = await db.getAllAsync(
      `SELECT * FROM agendamentos WHERE data BETWEEN ? AND ?`,
      [inicio, fim]
    );

    const totalMes = result.length;
    const feitosMes = result.filter((item) => item.feito === 1 || item.feito === '1').length;

    console.log(totalMes)

    const faturamentoTotal = result.reduce((soma, item) => soma + (item.valor || 0), 0);
    const faturado = result
      .filter((item) => item.feito === 1 || item.feito === '1')
      .reduce((soma, item) => soma + (item.valor || 0), 0);

    return { totalMes, feitosMes, faturamentoTotal, faturado };
  } catch (error) {
    console.error('Erro ao obter resumo mensal:', error);
    return { totalMes: 0, feitosMes: 0, faturamentoTotal: 0, faturado: 0 };
  }
};

