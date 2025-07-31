import React from 'react';
import { ClienteProvider } from './ClienteContext';
import { AgendamentoProvider } from './AgendamentoContext';
import { ServicoProvider } from './ServiceContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClienteProvider>
      <ServicoProvider>
        <AgendamentoProvider>
          {children}
        </AgendamentoProvider>
      </ServicoProvider>
    </ClienteProvider>
  );
}
