import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { AgendamentoProvider } from '../src/context/AgendamentoContext';
import { initDatabase } from '../src/database/database';

initDatabase();

export default function App() {
    return (
    <AgendamentoProvider>
      <StackNavigator />
    </AgendamentoProvider>
  );
}
