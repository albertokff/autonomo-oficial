import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllServices, saveService } from '../database/database';

// Tipo de serviço
export type Servico = {
  name: string;
  price: number;
  description: string;
};

// Tipo do contexto
type ServicoContextType = {
  servicos: Servico[];
  carregarServicos: () => void;
  addServico: (servico: Servico) => void;
};

// Criação do contexto
const ServicoContext = createContext<ServicoContextType>({} as ServicoContextType);

// Provider do contexto
export const ServicoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [servicos, setServicos] = useState<Servico[]>([]);

  const carregarServicos = async () => {
    try {
      const lista = await getAllServices();
      setServicos(lista);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  };

  const addServico = async (novoServico: Servico) => {
    await saveService(novoServico);
    const atualizados = await getAllServices();
    setServicos(atualizados);
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  return (
    <ServicoContext.Provider value={{ servicos, carregarServicos, addServico }}>
      {children}
    </ServicoContext.Provider>
  );
};

// Hook para usar o contexto
export function useServico() {
  return useContext(ServicoContext);
}
