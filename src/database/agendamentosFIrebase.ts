// agendamentosFirebase.ts
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';

export type Agendamento = {
  id?: string;
  clienteSelecionado: string;
  servico: string;
  data: string;      // formato: YYYY-MM-DD
  horario: string;   // formato: HH:mm
  valor: number;
  feito: boolean;
};

// 🔸 Criar novo agendamento
export async function saveAgendamento(agendamento: Omit<Agendamento, 'id'>): Promise<void> {
  await addDoc(collection(db, 'agendamentos'), agendamento);
}

// 🔸 Buscar todos os agendamentos
export async function getAllAgendamentos(): Promise<Agendamento[]> {
  const snapshot = await getDocs(collection(db, 'agendamentos'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Agendamento[];
}

// 🔸 Deletar um agendamento por ID
export async function deleteAgendamento(id: string): Promise<void> {
  await deleteDoc(doc(db, 'agendamentos', id));
}

// 🔸 Marcar como feito
export async function marcarAgendamentoComoFeito(id: string): Promise<void> {
  await updateDoc(doc(db, 'agendamentos', id), {
    feito: true,
  });
}

// 🔸 Obter resumo mensal
export async function getResumoMensal(): Promise<{
  totalMes: number;
  feitosMes: number;
  faturamentoTotal: number;
  faturado: number;
}> {
  const snapshot = await getDocs(collection(db, 'agendamentos'));
  const agora = new Date();
  const mes = agora.getMonth() + 1;
  const ano = agora.getFullYear();

  const agendamentos = snapshot.docs.map(doc => doc.data()) as Agendamento[];

  const agendamentosDoMes = agendamentos.filter((item) => {
    const data = new Date(item.data);
    return data.getFullYear() === ano && data.getMonth() + 1 === mes;
  });

  const totalMes = agendamentosDoMes.length;
  const feitosMes = agendamentosDoMes.filter((item) => item.feito).length;
  const faturamentoTotal = agendamentosDoMes.reduce((acc, item) => acc + (item.valor || 0), 0);
  const faturado = agendamentosDoMes
    .filter((item) => item.feito)
    .reduce((acc, item) => acc + (item.valor || 0), 0);

  return { totalMes, feitosMes, faturamentoTotal, faturado };
}
