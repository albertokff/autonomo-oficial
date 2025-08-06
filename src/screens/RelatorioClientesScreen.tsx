import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';
import { getAllAgendamentos, Agendamento } from '../database/agendamentosFIrebase';

const meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
const nomesMeses = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

export default function RelatorioClientesScreen() {
  const isFocused = useIsFocused();

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');

  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual.toString());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    if (isFocused) {
      getAllAgendamentos()
        .then(setAgendamentos)
        .catch(e => console.error('Erro ao buscar agendamentos:', e));
    }
  }, [isFocused]);

  const agendamentosFiltrados = agendamentos.filter(ag =>
    ag.data.startsWith(`${anoSelecionado}-${mesSelecionado}`) && ag.feito
  );

  const clientesAgrupados = agendamentosFiltrados.reduce((acc: Record<string, { quantidade: number, total: number }>, ag) => {
    const nome = ag.nome || 'Indefinido';
    if (!acc[nome]) acc[nome] = { quantidade: 0, total: 0 };
    acc[nome].quantidade += 1;
    acc[nome].total += parseFloat(ag.valor || '0');
    return acc;
  }, {});

  const clientesOrdenados = Object.entries(clientesAgrupados)
    .map(([cliente, dados]) => ({ cliente, ...dados }))
    .sort((a, b) => b.quantidade - a.quantidade);

  const totalGeral = clientesOrdenados.reduce((acc, c) => acc + c.total, 0);

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
        Clientes mais frequentes - {nomesMeses[parseInt(mesSelecionado) - 1]} {anoSelecionado}
      </Text>

      <Text style={styles.totalGeral}>Faturamento Total: R$ {totalGeral.toFixed(2)}</Text>

      {clientesOrdenados.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum atendimento registrado neste mês.</Text>
      ) : (
        <FlatList
          data={clientesOrdenados}
          keyExtractor={(item) => item.cliente}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.clienteTexto}>{item.cliente}</Text>
              <View style={styles.detalhes}>
                <Text style={styles.quantidade}>Atendimentos: {item.quantidade}</Text>
                <Text style={styles.valor}>R$ {item.total.toFixed(2)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f5e9', paddingBottom: 20 },
  filtros: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  picker: { height: 50, width: '45%' },
  title: { fontSize: 18, fontWeight: '600', marginHorizontal: 10, marginBottom: 5, color: '#388e3c' },
  totalGeral: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, marginBottom: 10, color: '#1b5e20' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#4caf50' },
  item: { backgroundColor: '#c8e6c9', marginHorizontal: 10, marginVertical: 5, borderRadius: 8, padding: 15, borderLeftWidth: 5, borderLeftColor: '#66bb6a' },
  clienteTexto: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  detalhes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  quantidade: { fontSize: 14, color: '#4e342e' },
  valor: { fontSize: 14, fontWeight: 'bold', color: '#2e7d32' },
});
