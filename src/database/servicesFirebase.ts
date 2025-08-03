import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';  // ajuste o caminho conforme seu projeto

export type Service = {
  id?: string;
  name: string;
  price: number;
  description: string;
};

// Salvar um novo serviço
export async function saveService(service: Omit<Service, 'id'>): Promise<void> {
  await addDoc(collection(db, 'services'), service);
}

// Buscar todos os serviços
export async function getAllServices(): Promise<Service[]> {
  const snapshot = await getDocs(collection(db, 'services'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
}

// Deletar serviço (opcional)
export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, 'services', id));
}
