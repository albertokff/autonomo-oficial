import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { getAllClientes } from '../database/clientesFIrebase';
import { saveAgendamento } from '../database/agendamentosFIrebase'; // 🔸 Importação nova
import { getAllServices } from '../database/servicesFirebase';
import React, { useState, useEffect } from 'react';
import { Cliente } from '../database/clientesFIrebase';

export default function AgendamentoForm() {
  type Service = {
    name: string;
    price: number;
    // outras propriedades, se houver
  };

  const navigation = useNavigation();

  const [cliente, setCliente] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>('');
  const [servicos, setServicos] = useState<Service[]>([]);
  const [servico, setServico] = useState('');
  const [valor, setValor] = useState('');
  const [horario, setHorario] = useState('');
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    async function fetchServicos() {
      const listaServicos = await getAllServices();
      setServicos(listaServicos);
    }

    async function fetchClientes() {
      const listaClientes = await getAllClientes();
      setCliente(listaClientes);
    }

    fetchServicos();
    fetchClientes();
  }, []);

  function handleSelecionaServico(nomeSelecionado: string) {
    setServico(nomeSelecionado);

    const servicoSelecionado = servicos.find((s) => s.name === nomeSelecionado);
    if (servicoSelecionado) {
      setValor(servicoSelecionado.price.toString());
    }
  }

  async function handleSalvar() {
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

    try {
      await saveAgendamento({
        clienteSelecionado,
        servico,
        valor: valorNumerico,
        data: dataFormatada,
        horario,
        feito: false,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      alert('Erro ao salvar. Tente novamente.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo Agendamento</Text>

      <Text style={styles.label}>Cliente:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={clienteSelecionado}
          onValueChange={setClienteSelecionado}
          style={styles.picker}
        >
          <Picker.Item label="Selecione um cliente" value="" color="#000" />
          {cliente.map((c) => (
            <Picker.Item key={c.id} label={c.nome} value={c.nome} />
          ))}
        </Picker>

      </View>

      <Text style={styles.label}>Serviço:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={servico}
          onValueChange={handleSelecionaServico}
          style={styles.picker}
        >
          <Picker.Item label="Selecione um serviço" value="" color="#000" />
          {servicos.map((s, index) => (
            <Picker.Item key={index} label={s.name} value={s.name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Valor (R$):</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        placeholder="Ex: 100.00"
      />

      <Text style={styles.label}>Data:</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        <Text>{data.toLocaleDateString('pt-BR')}</Text>
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

      <Text style={styles.label}>Horário (HH:mm):</Text>
      <TextInput
        style={styles.input}
        value={horario}
        onChangeText={setHorario}
        placeholder="Ex: 14:30"
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar Agendamento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontWeight: '500',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
