import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { resetarBanco, limparDadosDoBanco, excluirArquivoDoBanco } from '../utils/debugDbTools';
import { useAgendamento } from '../context/AgendamentoContext';

export default function DebugScreen() {
  const { getAgendamentos } = useAgendamento();

  function popularComDadosFicticios() {
    const exemplo = [
      { cliente: 'Maria', servico: 'Costura', data: '2025-08-01', horario: '09:00', valor: 50 },
      { cliente: 'João', servico: 'Ajuste de barra', data: '2025-08-02', horario: '14:30', valor: 35 },
    ];

    exemplo.forEach(agendamento => {
      // usar o contexto ou direto no banco
    });

    Alert.alert('Dados inseridos!');
  }

  async function listarAgendamentosConsole() {
    const agendamentos = await getAgendamentos();
    console.log('Agendamentos:', agendamentos);
    Alert.alert('Veja o console para os dados');
  }

  return (
    <View style={styles.container}>
      <Button title="🔄 Resetar Banco" onPress={resetarBanco} />
      <Button title="🧹 Limpar Dados" onPress={limparDadosDoBanco} />
      <Button title="➕ Popular com Dados Fictícios" onPress={popularComDadosFicticios} />
      <Button title="👀 Listar Agendamentos no Console" onPress={listarAgendamentosConsole} />
      <Button title="❌ Excluir Arquivo do Banco" onPress={excluirArquivoDoBanco} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-around' },
});
