// clientesFirebase.ts
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export type Cliente = {
  id?: string;
  nome: string;
  telefone?: string;
  email?: string;
};

// Salvar um novo cliente
export async function saveCliente(cliente: Omit<Cliente, 'id'>): Promise<void> {
  await addDoc(collection(db, 'clientes'), cliente);
}

// Buscar todos os clientes
export async function getAllClientes(): Promise<Cliente[]> {
  const snapshot = await getDocs(collection(db, 'clientes'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cliente));
}

// Deletar cliente (opcional)
export async function deleteCliente(id: string): Promise<void> {
  await deleteDoc(doc(db, 'clientes', id));
}
