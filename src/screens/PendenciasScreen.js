import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function PendenciasScreen({ navigation }) {
  const [pendencias, setPendencias] = useState([
    {
      id: '1',
      cliente: 'João Silva',
      servico: 'Corte de cabelo',
      data: '05/07/2025',
      horario: '14:00',
    },
    {
      id: '2',
      cliente: 'Maria Souza',
      servico: 'Manicure',
      data: '06/07/2025',
      horario: '10:30',
    },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.cliente}>{item.cliente}</Text>
      <Text style={styles.info}>Serviço: {item.servico}</Text>
      <Text style={styles.info}>Data: {item.data} às {item.horario}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pendências</Text>

      <FlatList
        data={pendencias}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma pendência encontrada.</Text>
        }
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AgendamentoForm')}
      >
        <Text style={styles.buttonText}>Novo Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f5e9',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2e7d32',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: '#81c784',
    borderWidth: 1,
  },
  cliente: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: '#4caf50',
  },
  emptyText: {
    textAlign: 'center',
    color: '#2e7d32',
    fontSize: 16,
    marginTop: 50,
  },
  button: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 'auto',
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
