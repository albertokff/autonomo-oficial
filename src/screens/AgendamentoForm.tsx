import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAgendamento } from '../context/AgendamentoContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AgendamentoForm() {
  const navigation = useNavigation();
  const { addAgendamento } = useAgendamento();

  const [cliente, setCliente] = useState('');
  const [servico, setServico] = useState('');
  const [valor, setValor] = useState('');
  const [horario, setHorario] = useState('');
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  function handleSalvar() {
    if (!cliente || !servico || !valor || !data || !horario) {
      alert('Preencha todos os campos');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico)) {
      alert('Valor inválido');
      return;
    }

    const dataFormatada = data.toISOString().split('T')[0]; // YYYY-MM-DD

    addAgendamento({
      cliente,
      servico,
      valor: valorNumerico,
      data: dataFormatada,
      horario,
    });

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text>Cliente:</Text>
      <TextInput style={styles.input} value={cliente} onChangeText={setCliente} />

      <Text>Serviço:</Text>
      <TextInput style={styles.input} value={servico} onChangeText={setServico} />

      <Text>Valor (R$):</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        placeholder="Ex: 100.00"
      />

      <Text>Data:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{data.toLocaleDateString('pt-BR').split('T')[0]}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setData(selectedDate);
          }}
        />
      )}

      <Text>Horário (HH:mm):</Text>
      <TextInput
        style={styles.input}
        value={horario}
        onChangeText={setHorario}
        placeholder="Ex: 14:30"
      />

      <Button title="Salvar Agendamento" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
  },
});
