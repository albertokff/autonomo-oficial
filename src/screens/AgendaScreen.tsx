import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ListRenderItem, Modal, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useIsFocused } from '@react-navigation/native';
import { getAllAgendamentos, deleteAgendamento, marcarAgendamentoComoFeito } from '../database/database';

type RootStackParamList = {
  AgendamentoForm: undefined;
};

type Agendamento = {
  id: string;
  cliente: string;
  servico: string;
  horario: string;
  data: string;
  feito?: boolean;
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

  const [modalVisible, setModalVisible] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null)

  const abrirModal = (agendamento: Agendamento) => {
    if (agendamento.feito) return;
    setAgendamentoSelecionado(agendamento);
    setModalVisible(true);
  }

  const excluirAgendamento = async () => {
    if (!agendamentoSelecionado) return;

    try {
      console.log('Excluindo agendamento:', agendamentoSelecionado.id);
      await deleteAgendamento(agendamentoSelecionado.id);
      setModalVisible(false);

      const atualizados = await getAllAgendamentos();
      console.log('Agendamentos após exclusão:', atualizados);
      setAgendamentos(atualizados);
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      Alert.alert('Erro', 'Não foi possível excluir o agendamento.');
    }
  };

  const marcarComoFeito = async () => {
    if (!agendamentoSelecionado) return;

    try {
      console.log('Marcando como feito:', agendamentoSelecionado.id);
      await marcarAgendamentoComoFeito(agendamentoSelecionado.id);
      setModalVisible(false);

      const atualizados = await getAllAgendamentos();
      console.log('Agendamentos após marcar como feito:', atualizados);
      setAgendamentos(atualizados);
    } catch (error) {
      console.error('Erro ao marcar como feito:', error);
      Alert.alert('Erro', 'Não foi possível marcar o agendamento como feito.');
    }
  };

  useEffect(() => {
    if (isFocused) {
      getAllAgendamentos()
        .then((data) => {
          console.log('Agendamentos ao focar tela:', data);
          setAgendamentos(data);
        })
        .catch(e => console.log('Erro ao buscar agendamentos:', e));
    }
  }, [isFocused]);

  const agendamentosFiltrados = agendamentos.filter(a => a.data === selectedDate);

  const markedDates = agendamentos.reduce((acc, ag) => {
    acc[ag.data] = acc[ag.data] || { marked: true, dotColor: '#2e7d32' };
    return acc;
  }, { [selectedDate]: { selected: true, selectedColor: '#2e7d32' } } as Record<string, any>);

  const renderItem: ListRenderItem<Agendamento> = ({ item }) => {
    const agendamentoView = (
      <View style={[styles.agendamentoItem, item.feito && styles.agendamentoFeito]}>
        <Text style={[styles.agendamentoText, item.feito && styles.textoFeito]}>
          {item.horario} - {item.cliente} ({item.servico}) {item.feito ? '✓' : ''}
        </Text>
      </View>
    );

    return item.feito ? (
      agendamentoView
    ) : (
      <TouchableOpacity onPress={() => abrirModal(item)}>
        {agendamentoView}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
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

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>O que deseja fazer?</Text>
            <TouchableOpacity style={styles.modalButton} onPress={marcarComoFeito}>
              <Text style={styles.modalButtonText}>Marcar como feito</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#d32f2f' }]} onPress={excluirAgendamento}>
              <Text style={styles.modalButtonText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#2e7d32', marginTop: 10 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9f5e9' },
  title: { fontSize: 18, fontWeight: '600', margin: 10, color: '#2e7d32' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#2e7d32' },
  agendamentoItem: { backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 5, borderRadius: 10, padding: 15, borderLeftWidth: 5, borderLeftColor: '#2e7d32' },
  agendamentoText: { fontSize: 16, color: '#2e7d32' },
  agendamentoFeito: { opacity: 0.5 },
  textoFeito: { textDecorationLine: 'line-through' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#2e7d32', borderRadius: 30, width: 60, height: 60, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20
  },
  modalButton: {
    backgroundColor: '#2e7d32',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center'
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16
  }
});
