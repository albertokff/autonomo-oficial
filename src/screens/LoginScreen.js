import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.formBox}>
        <Text style={styles.title}>Bem-vindo</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#8fb99a"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#8fb99a"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f5e9', // tom de verde bem claro no fundo
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    height: 50,
    backgroundColor: '#f0f8f2',
    borderColor: '#a5d6a7',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 18,
    fontSize: 16,
    color: '#2e7d32',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4caf50',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
