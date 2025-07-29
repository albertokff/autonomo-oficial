import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import { AppProviders } from '@/src/context/AppProviders';
import { initDatabase } from '../src/database/database';

initDatabase();

export default function App() {
  return (
    <AppProviders>
        <StackNavigator />
    </AppProviders>
  );
}
