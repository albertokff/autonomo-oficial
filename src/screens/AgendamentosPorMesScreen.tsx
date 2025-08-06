import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused, NavigationProp } from '@react-navigation/native';
import { getAllAgendamentos, deleteAgendamento, marcarAgendamentoComoFeito, Agendamento } from '../database/agendamentosFIrebase';

type RootStackParamList = {
  AgendamentoForm: undefined;
};

const meses = [
  '01','02','03','04','05','06','07','08','09','10','11','12'
];

const nomesMeses = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

export default function AgendaPorMesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');

  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual.toString());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null);

  useEffect(() => {
    if (isFocused) {
      getAllAgendamentos()
        .then(setAgendamentos)
        .catch(e => console.error('Erro ao buscar agendamentos:', e));
    }
  }, [isFocused]);

  const agendamentosFiltrados = agendamentos.filter(ag => {
    return ag.data.startsWith(`${anoSelecionado}-${mesSelecionado}`);
  });

  const agendamentosAgrupados = agendamentosFiltrados.reduce((acc: Record<string, Agendamento[]>, ag) => {
    if (!acc[ag.data]) acc[ag.data] = [];
    acc[ag.data].push(ag);
    return acc;
  }, {});

  const abrirModal = (agendamento: Agendamento) => {
    if (agendamento.feito) return;
    setAgendamentoSelecionado(agendamento);
    setModalVisible(true);
  };

  const excluirAgendamento = async () => {
    if (!agendamentoSelecionado) return;
    try {
      await deleteAgendamento(agendamentoSelecionado.id);
      setModalVisible(false);
      const atualizados = await getAllAgendamentos();
      setAgendamentos(atualizados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o agendamento.');
    }
  };

  const marcarComoFeito = async () => {
    if (!agendamentoSelecionado) return;
    try {
      await marcarAgendamentoComoFeito(agendamentoSelecionado.id);
      setModalVisible(false);
      const atualizados = await getAllAgendamentos();
      setAgendamentos(atualizados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível marcar como feito.');
    }
  };

  const renderAgendamento = (item: Agendamento) => (
    <TouchableOpacity key={item.id} onPress={() => abrirModal(item)} disabled={item.feito}>
      <View style={[styles.agendamentoItem, item.feito && styles.agendamentoFeito]}>
        <Text style={[styles.agendamentoText, item.feito && styles.textoFeito]}>
          {item.horario} - {item.clienteSelecionado} ({item.servico}) {item.feito ? '✓' : ''} | R$ {item.valor}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filtros}>
        <Picker
          selectedValue={mesSelecionado}
          style={styles.picker}
          onValueChange={(value) => setMesSelecionado(value)}
        >
          {meses.map((mes, i) => (
            <Picker.Item key={mes} label={nomesMeses[i]} value={mes} />
          ))}
        </Picker>

        <Picker
          selectedValue={anoSelecionado}
          style={styles.picker}
          onValueChange={(value) => setAnoSelecionado(value)}
        >
          {[anoAtual - 1, anoAtual, anoAtual + 1].map((ano) => (
            <Picker.Item key={ano} label={ano.toString()} value={ano.toString()} />
          ))}
        </Picker>
      </View>

      <Text style={styles.title}>
        Agendamentos de {nomesMeses[parseInt(mesSelecionado) - 1]} de {anoSelecionado}
      </Text>

      {Object.keys(agendamentosAgrupados).length === 0 ? (
        <Text style={styles.emptyText}>Nenhum agendamento para esse período.</Text>
      ) : (
        <FlatList
          data={Object.entries(agendamentosAgrupados)}
          keyExtractor={([data]) => data}
          renderItem={({ item: [data, ags] }) => (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.dateHeader}>{data.split('-').reverse().join('/')}</Text>
              {ags.map(renderAgendamento)}
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

      {/* Modal de ação */}
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
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#d32f2f' }]}
              onPress={excluirAgendamento}
            >
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
  filtros: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  picker: { height: 50, width: '45%' },
  title: { fontSize: 18, fontWeight: '600', margin: 10, color: '#2e7d32' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#2e7d32' },
  dateHeader: { fontSize: 16, fontWeight: 'bold', marginLeft: 10, marginTop: 10, color: '#2e7d32' },
  agendamentoItem: { backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 5, borderRadius: 10, padding: 15, borderLeftWidth: 5, borderLeftColor: '#2e7d32' },
  agendamentoText: { fontSize: 16, color: '#2e7d32' },
  agendamentoFeito: { opacity: 0.5 },
  textoFeito: { textDecorationLine: 'line-through' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#2e7d32', borderRadius: 30, width: 60, height: 60, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  modalButton: { backgroundColor: '#2e7d32', padding: 10, borderRadius: 5, marginTop: 10, width: '100%', alignItems: 'center' },
  modalButtonText: { color: '#fff', fontSize: 16 }
});
