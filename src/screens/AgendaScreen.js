// screens/AgendaScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AgendaScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock de agendamentos
  const agendamentos = [
    { id: '1', cliente: 'Maria', servico: 'Corte', horario: '14:00', data: '2025-07-07' },
    { id: '2', cliente: 'João', servico: 'Barba', horario: '15:00', data: '2025-07-07' },
  ];

  const agendamentosFiltrados = agendamentos.filter(a => a.data === selectedDate);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#2e7d32' }
        }}
      />
      <Text style={styles.title}>Agendamentos para {selectedDate.split('-').reverse().join('/')}</Text>
      {agendamentosFiltrados.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum agendamento para este dia.</Text>
      ) : (
        <FlatList
          data={agendamentosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.agendamentoItem}>
              <Text style={styles.agendamentoText}>{item.horario} - {item.cliente} ({item.servico})</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AgendamentoForm')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9f5e9' },
  title: { fontSize: 18, fontWeight: '600', margin: 10, color: '#2e7d32' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#2e7d32' },
  agendamentoItem: { backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 5, borderRadius: 10, padding: 15, borderLeftWidth: 5, borderLeftColor: '#2e7d32' },
  agendamentoText: { fontSize: 16, color: '#2e7d32' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#2e7d32', borderRadius: 30, width: 60, height: 60, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});
