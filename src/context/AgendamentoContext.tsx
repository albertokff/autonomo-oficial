import React, { createContext, useContext, useEffect, useState } from 'react';
import { createTableAgendamentos, insert, getAllAgendamentos } from '../database/database';

export type Agendamento = {
  id: string;
  cliente: string;
  servico: string;
  data: string;
  horario: string;
};

type AgendamentoContextType = {
  agendamentos: Agendamento[];
  addAgendamento: (novo: Omit<Agendamento, 'id'>) => void;
};

const AgendamentoContext = createContext<AgendamentoContextType>({} as AgendamentoContextType);

export const AgendamentoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    createTableAgendamentos();
    carregarAgendamentos();
  }, []);

  function carregarAgendamentos() {
    getAllAgendamentos()
      .then((data: any) => {
        console.log('Agendamentos do banco:', data);
        setAgendamentos(data)})
      .catch(err => console.error(err));
  }

  function addAgendamento(novo: Omit<Agendamento, 'id'>) {
    insert('agendamentos', [{name: 'cliente', value: novo.cliente},
                            {name: 'servico', value: novo.servico},
                            {name: 'data', value: novo.data},
                            {name: 'horario', value: novo.horario},]);
  }

  return (
    <AgendamentoContext.Provider value={{ agendamentos, addAgendamento }}>
      {children}
    </AgendamentoContext.Provider>
  );
};

export function useAgendamento() {
  return useContext(AgendamentoContext);
}
