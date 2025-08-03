import * as SQLite from 'expo-sqlite';
import { doc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';

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
  console.log(result)
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
  await createTableClientes();
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

export async function getAllClientes() {
  const db = await openDb();
  const result = await db.getAllAsync(`SELECT * FROM clientes;`);
  return result;
}

export async function createTableClientes() {
  const db = await openDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT,
      email TEXT
    );
  `);
}

export async function saveCliente(cliente: { nome: string; telefone?: string; email?: string }) {
  const db = await openDb();
  await db.runAsync(
    `INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?);`,
    [cliente.nome, cliente.telefone ?? '', cliente.email ?? '']
  );
}

export async function saveService(servico: { name: string; price: number; description: string }) {
  const db = await openDb();
  await db.runAsync(
    `INSERT INTO services (name, price, description) VALUES (?, ?, ?);`,
    [servico.name, servico.price, servico.description]
  );
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, 'services', id));
} 

export const getResumoMensalFromFirebase = async (inicio?: string, fim?: string) => {
  try {
    const snapshot = await getDocs(collection(db, 'agendamentos'));

    const dados = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(item => {
        if (!inicio || !fim) return true;
        const data = item.data; // formato 'YYYY-MM-DD'
        const dentroDoPeriodo = data >= inicio && data <= fim;
        if (!dentroDoPeriodo) {
          console.log(`[Filtro] Ignorando agendamento fora do período: id=${item.id}, data=${data}`);
        }
        return dentroDoPeriodo;
      });

    // Log dos dados para depurar o campo 'feito'
    dados.forEach(item => {
      console.log(`[Status] id=${item.id}, feito=${item.feito}`);
    });

    // Filtra agendamentos feitos
    const feitosMes = dados.filter(item => item.feito === true || item.feito === 'true');

    console.log('[Resumo] Total agendamentos feitos:', feitosMes.length);

    // Calcula faturamento total, somando o valor ou 0 caso esteja indefinido
    const faturado = feitosMes.reduce((acc, curr) => acc + (curr.valor || 0), 0);

    console.log('[Resumo] Faturamento total: R$', faturado.toFixed(2));

    // Conta quantas vezes cada serviço foi realizado
    const servicos: Record<string, number> = {};
    feitosMes.forEach((item) => {
      const nomeServico = item.servico || 'Serviço desconhecido';
      if (!servicos[nomeServico]) servicos[nomeServico] = 0;
      servicos[nomeServico]++;
    });

    console.log('[Resumo] Contagem de serviços realizados:', servicos);

    // Pega o serviço mais realizado, ordenando pelo número de ocorrências
    const servicoMaisRealizado = Object.entries(servicos)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    console.log('[Resumo] Serviço mais realizado:', servicoMaisRealizado);

    return {
      totalMes: dados.length,
      feitosMes: feitosMes.length,
      faturado,
      faturamentoTotal: faturado,
      servicoMaisRealizado,
    };
  } catch (error) {
    console.error('Erro ao buscar resumo:', error);
    return {
      totalMes: 0,
      feitosMes: 0,
      faturado: 0,
      faturamentoTotal: 0,
      servicoMaisRealizado: '',
    };
  }
};

export const getAgendamentosFeitos = async (inicio: string, fim: string) => {
  try {
    const agendamentosRef = collection(db, 'agendamentos');

    // Montar query com filtros: feito === true e data entre inicio e fim
    const q = query(
      agendamentosRef,
      where('feito', '==', true),
      where('data', '>=', inicio),
      where('data', '<=', fim)
    );

    const snapshot = await getDocs(q);

    const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return dados;
  } catch (error) {
    console.error('Erro ao buscar agendamentos feitos:', error);
    return [];
  }
};