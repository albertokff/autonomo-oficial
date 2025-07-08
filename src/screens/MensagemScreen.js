import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

export default function CentralComunicacoes() {
  const [cliente, setCliente] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [dica, setDica] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Central de Comunicações</Text>

        {/* Seção de Lembretes */}
        <Text style={styles.sectionTitle}>📌 Lembretes e Notificações</Text>
        <View style={styles.card}>
          <Text style={styles.lembreteText}>• Pedido da cliente Ana fica pronto amanhã.</Text>
          <Text style={styles.lembreteText}>• Agendamento de costura com Carla às 14h.</Text>
          <Text style={styles.lembreteText}>• Revisar estoque de tecidos.</Text>
        </View>

        {/* Seção de Enviar mensagem no WhatsApp */}
        <Text style={styles.sectionTitle}>📱 Enviar Mensagem no WhatsApp</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da cliente"
          value={cliente}
          onChangeText={setCliente}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Digite a mensagem personalizada"
          value={mensagem}
          onChangeText={setMensagem}
          multiline
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Enviar Agora</Text>
        </TouchableOpacity>

        {/* Seção de Disparar dicas de costura */}
        <Text style={styles.sectionTitle}>💡 Disparar Dicas de Costura</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Escreva uma dica para enviar"
          value={dica}
          onChangeText={setDica}
          multiline
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Enviar para todas as clientes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9f4',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#388e3c',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderColor: '#c8e6c9',
    borderWidth: 1,
  },
  lembreteText: {
    fontSize: 16,
    color: '#2e7d32',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#a5d6a7',
    borderWidth: 1,
    color: '#2e7d32',
  },
  button: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});
