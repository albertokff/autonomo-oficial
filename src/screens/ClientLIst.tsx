import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getAllClientes } from '../database/clientesFIrebase'; // ajuste o caminho se necessário

export default function ClientList({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        const data = await getAllClientes();
        setClientes(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.clientName}>{item.nome}</Text>
      {item.telefone ? <Text style={styles.clientInfo}>📞 {item.telefone}</Text> : null}
      {item.email ? <Text style={styles.clientInfo}>✉️ {item.email}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes Cadastrados</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" />
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ClientForm')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  clientInfo: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2e7d32',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 2,
  },
});
