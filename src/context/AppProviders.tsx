import React from 'react';
import { ClienteProvider } from './ClienteContext';
import { AgendamentoProvider } from './AgendamentoContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClienteProvider>
      <AgendamentoProvider>
        {children}
      </AgendamentoProvider>
    </ClienteProvider>
  );
}
