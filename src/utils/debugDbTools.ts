import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';

export async function limparDadosDoBancoFirebase() {
  const colecoes = ['agendamentos', 'clientes', 'services'];

  try {
    for (const nomeColecao of colecoes) {
      const snap = await getDocs(collection(db, nomeColecao));
      const promises = snap.docs.map((documento) =>
        deleteDoc(doc(db, nomeColecao, documento.id))
      );
      await Promise.all(promises);
    }
    console.log('Todas as coleções foram limpas com sucesso.');
  } catch (error) {
    console.error('Erro ao limpar dados do Firebase:', error);
  }
}