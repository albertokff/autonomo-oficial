import { openDb, initDatabase } from '../database/database';
import * as FileSystem from 'expo-file-system';

export async function limparDadosDoBanco() {
  const db = await openDb();
  try {
    await db.execAsync('DELETE FROM agendamentos;');
    await db.execAsync('DELETE FROM clientes;');
    await db.execAsync('DELETE FROM services;');

    console.log('Dados apagados com sucesso.');
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
  }
}

export async function resetarBanco() {
  const db = await openDb();
  try {
    await db.execAsync('DROP TABLE IF EXISTS agendamentos;');
    console.log('Tabelas removidas.');
    await initDatabase();
    console.log('Banco recriado.');
  } catch (error) {
    console.error('Erro ao resetar banco:', error);
  }
}

export async function excluirArquivoDoBanco() {
  const dbPath = `${FileSystem.documentDirectory}SQLite/autonomoapp.db`;
  const info = await FileSystem.getInfoAsync(dbPath);
  if (info.exists) {
    await FileSystem.deleteAsync(dbPath);
    console.log('Arquivo do banco deletado.');
  } else {
    console.log('Banco não encontrado.');
  }
}
