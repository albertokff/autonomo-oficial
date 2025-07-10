import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../../src/screens/LoginScreen';
import HomeScreen from '../../src/screens/HomeScreen';
import ServiceForm from '../../src/screens/ServiceForm';
import ClientForm from '../../src/screens/ClientForm';
import AgendamentoForm from '../../src/screens/AgendamentoForm';
import PendenciasScreen from '../../src/screens/PendenciasScreen';
import RelatorioScreen from '../../src/screens/RelatorioScreen';
import FinanceiroScreen from '../../src/screens/FinanceiroScreen';
import MensagemScreen from '../../src/screens/MensagemScreen';
import NotificacaoScreen from '../../src/screens/NotificacaoScreen';
import EstoqueScreen from '../../src/screens/EstoqueScreen';
import FeedbackScreen from '../../src/screens/FeedbackScreen';
import AjudaScreen from '../../src/screens/AjudaScreen';
import ServiceList from '../../src/screens/ServiceList';
import AgendaScreen from '../../src/screens/AgendaScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="AgendaScreen" component={AgendaScreen} options={{ title: 'Agenda' }} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Início' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="ServiceForm" component={ServiceForm} options={{ title: 'Novo Serviço' }} />
      <Stack.Screen name="ClientForm" component={ClientForm} options={{ title: 'Novo Cliente' }} />
      <Stack.Screen name="AgendamentoForm" component={AgendamentoForm} options={{ title: 'Novo Agendamento' }} />
      <Stack.Screen name="Pendencias" component={PendenciasScreen} options={{ title: 'Pendências' }} />
      <Stack.Screen name="Relatorio" component={RelatorioScreen} options={{ title: 'Relatório' }} />
      <Stack.Screen name="Financeiro" component={FinanceiroScreen} options={{ title: 'Financeiro' }} />
      <Stack.Screen name="Mensagem" component={MensagemScreen} options={{ title: 'Mensagens' }} />
      <Stack.Screen name="Notificacao" component={NotificacaoScreen} options={{ title: 'Notificações' }} />
      <Stack.Screen name="Estoque" component={EstoqueScreen} options={{ title: 'Estoque' }} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: 'Feedback' }} />
      <Stack.Screen name="Ajuda" component={AjudaScreen} options={{ title: 'Ajuda' }} />
      <Stack.Screen name="ServiceList" component={ServiceList} options={{ title: 'Serviços' }} />
    </Stack.Navigator>
  );
}
