import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllClientes, saveCliente } from '../database/database';

export type Cliente = {
  nome: string;
  telefone: string;
  email: string;
};

type ClienteContextType = {
  clientes: Cliente[];
  carregarClientes: () => void;
  addCliente: (cliente: Cliente) => void;
};

const ClienteContext = createContext<ClienteContextType>({} as ClienteContextType);

export const ClienteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const carregarClientes = async () => {
    try {
      const lista = await getAllClientes();
      console.log(lista)
      setClientes(lista);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const addCliente = async (novoCliente: Cliente) => {
    await saveCliente(novoCliente); // salva no banco ou no asyncStorage
    const atualizados = await getAllClientes(); // busca lista atualizada
    setClientes(atualizados); // atualiza o estado
  };


  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <ClienteContext.Provider value={{ clientes, carregarClientes, addCliente }}>
      {children}
    </ClienteContext.Provider>
  );
};

export function useCliente() {
  return useContext(ClienteContext);
}
