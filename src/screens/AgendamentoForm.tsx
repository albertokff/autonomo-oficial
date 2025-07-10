import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAgendamento } from '../context/AgendamentoContext';

export default function AgendamentoForm() {
  const navigation = useNavigation();
  const { addAgendamento } = useAgendamento();

  const [cliente, setCliente] = useState('');
  const [servico, setServico] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');

  function handleSalvar() {
    if (!cliente || !servico || !data || !horario) {
      alert('Preencha todos os campos');
      return;
    }

    addAgendamento({ cliente, servico, data, horario });
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text>Cliente:</Text>
      <TextInput style={styles.input} value={cliente} onChangeText={setCliente} />

      <Text>Serviço:</Text>
      <TextInput style={styles.input} value={servico} onChangeText={setServico} />

      <Text>Data (YYYY-MM-DD):</Text>
      <TextInput style={styles.input} value={data} onChangeText={setData} placeholder="2025-07-07" />

      <Text>Horário (HH:mm):</Text>
      <TextInput style={styles.input} value={horario} onChangeText={setHorario} placeholder="14:00" />

      <Button title="Salvar Agendamento" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 8, borderRadius: 4 },
});
