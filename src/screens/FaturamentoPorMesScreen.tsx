import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';
import { getAllAgendamentos, Agendamento } from '../database/agendamentosFIrebase';

const meses = [
  '01','02','03','04','05','06','07','08','09','10','11','12'
];

const nomesMeses = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

export default function FaturaPorMesScreen() {
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

  const agendamentosAgrupados = agendamentosFiltrados.reduce((acc: Record<string, Agendamento[]>, ag) => {
    if (!acc[ag.data]) acc[ag.data] = [];
    acc[ag.data].push(ag);
    return acc;
  }, {});

  const totalPorDia = Object.entries(agendamentosAgrupados).map(([data, ags]) => ({
    data,
    total: ags.reduce((sum, ag) => sum + parseFloat(ag.valor || '0'), 0),
  }));

  const totalGeral = totalPorDia.reduce((acc, dia) => acc + dia.total, 0);

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
        Faturamento de {nomesMeses[parseInt(mesSelecionado) - 1]} de {anoSelecionado}
      </Text>

      <Text style={styles.totalGeral}>Total: R$ {totalGeral.toFixed(2)}</Text>

      {totalPorDia.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum faturamento registrado neste mês.</Text>
      ) : (
        <FlatList
          data={totalPorDia}
          keyExtractor={(item) => item.data}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.dataTexto}>{item.data.split('-').reverse().join('/')}</Text>
              <Text style={styles.valorTexto}>R$ {item.total.toFixed(2)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9f5e9', paddingBottom: 20 },
  filtros: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  picker: { height: 50, width: '45%' },
  title: { fontSize: 18, fontWeight: '600', marginHorizontal: 10, marginBottom: 5, color: '#2e7d32' },
  totalGeral: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, marginBottom: 10, color: '#1b5e20' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#2e7d32' },
  item: { backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 5, borderRadius: 8, padding: 15, flexDirection: 'row', justifyContent: 'space-between', borderLeftWidth: 5, borderLeftColor: '#2e7d32' },
  dataTexto: { fontSize: 16, color: '#2e7d32' },
  valorTexto: { fontSize: 16, fontWeight: 'bold', color: '#1b5e20' },
});
