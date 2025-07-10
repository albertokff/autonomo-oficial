import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ListRenderItem } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useIsFocused } from '@react-navigation/native';
import { getAllAgendamentos } from '../database/database';

type RootStackParamList = {
  AgendamentoForm: undefined;
};

type Agendamento = {
  id: string;
  cliente: string;
  servico: string;
  horario: string;
  data: string;
};

LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ],
  monthNamesShort: [
    'Jan','Fev','Mar','Abr','Mai','Jun',
    'Jul','Ago','Set','Out','Nov','Dez'
  ],
  dayNames: [
    'Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'
  ],
  dayNamesShort: [
    'Dom','Seg','Ter','Qua','Qui','Sex','Sáb'
  ],
  today: 'Hoje'
};

LocaleConfig.defaultLocale = 'pt';

export default function AgendaScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    if (isFocused) {
      getAllAgendamentos().then((dados) => {
        setAgendamentos(dados);
      }).catch(e => console.log('Erro ao buscar agendamentos:', e));
    }
  }, [isFocused]);

  const agendamentosFiltrados = agendamentos.filter(a => a.data === selectedDate);

  const markedDates = agendamentos.reduce((acc, ag) => {
    acc[ag.data] = acc[ag.data] || { marked: true, dotColor: '#2e7d32' };
    return acc;
  }, { [selectedDate]: { selected: true, selectedColor: '#2e7d32' } } as Record<string, any>);

  const renderItem: ListRenderItem<Agendamento> = ({ item }) => (
    <View style={styles.agendamentoItem}>
      <Text style={styles.agendamentoText}>{item.horario} - {item.cliente} ({item.servico})</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
      />
      <Text style={styles.title}>Agendamentos para {selectedDate.split('-').reverse().join('/')}</Text>
      {agendamentosFiltrados.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum agendamento para este dia.</Text>
      ) : (
        <FlatList
          data={agendamentosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
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
