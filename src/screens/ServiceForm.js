import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { createTableServices, insert } from '../database/database';

export default function ServiceForm({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    createTableServices().catch(error => {
      console.error('Erro ao criar tabela:', error);
    });
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Informe o nome do serviço');
      return;
    }
    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Erro', 'Informe um preço válido');
      return;
    }

    newService();
  };

  async function newService() {
    try {
      await insert('services', [
        {name: 'name', value: name},
        {name: 'price', value: parseFloat(price)},
        {name: 'description', value: description}]);

      Alert.alert('Sucesso', 'Serviço salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      Alert.alert('Erro', 'Não foi possível salvar o serviço!');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Serviço</Text>

      <Text style={styles.label}>Nome do Serviço</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do serviço"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Preço (R$)</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o preço"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Digite uma descrição (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholderTextColor="#999"
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

