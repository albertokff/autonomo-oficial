import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function FeedbackScreen() {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');

  const handleSend = () => {
    if (!feedback.trim()) {
      Alert.alert('Atenção', 'Por favor, escreva seu feedback antes de enviar.');
      return;
    }

    // Aqui você pode enviar o feedback para seu backend ou serviço de suporte
    // Exemplo: fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ feedback, email }) })

    Alert.alert('Obrigado!', 'Seu feedback foi enviado com sucesso.');

    // Limpa campos após envio
    setFeedback('');
    setEmail('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Envie seu Feedback</Text>
        <Text style={styles.label}>Conte-nos seu problema, sugestão ou ideia *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Digite aqui seu feedback..."
          multiline={true}
          numberOfLines={6}
          value={feedback}
          onChangeText={setFeedback}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Seu email (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="exemplo@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Enviar Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f5e9',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 25,
    color: '#2e7d32',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2e7d32',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#81c784',
    borderWidth: 1,
    color: '#2e7d32',
  },
  textArea: {
    height: 140,
  },
  button: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
