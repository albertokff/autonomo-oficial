import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';

export default function FinanceiroScreen({ navigation }) {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('Este mês');

  const resumo = {
    faturado: 2500,
    despesas: 800,
    lucro: 1700,
    pagos: 12,
    ticketMedio: 208,
  };

  const transacoes = [
    { id: '1', tipo: 'Receita', descricao: 'Ajuste de vestido', valor: 120, data: '10/07/2025' },
    { id: '2', tipo: 'Despesa', descricao: 'Compra de linhas', valor: -40, data: '09/07/2025' },
    { id: '3', tipo: 'Receita', descricao: 'Bainha de calça', valor: 50, data: '08/07/2025' },
    // ...mais transações
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Financeiro</Text>

      {/* Filtros de período */}
      <View style={styles.filtrosContainer}>
        {['Hoje', 'Últimos 7 dias', 'Este mês', 'Personalizado'].map((periodo) => (
          <TouchableOpacity
            key={periodo}
            style={[
              styles.filtroButton,
              periodoSelecionado === periodo && styles.filtroButtonAtivo
            ]}
            onPress={() => setPeriodoSelecionado(periodo)}
          >
            <Text
              style={[
                styles.filtroText,
                periodoSelecionado === periodo && styles.filtroTextAtivo
              ]}
            >
              {periodo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cards resumo */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>💰 Faturado</Text>
          <Text style={styles.cardValor}>R$ {resumo.faturado.toFixed(2)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>💸 Despesas</Text>
          <Text style={styles.cardValor}>R$ {resumo.despesas.toFixed(2)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>✅ Lucro</Text>
          <Text style={styles.cardValor}>R$ {resumo.lucro.toFixed(2)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>📦 Pagos</Text>
          <Text style={styles.cardValor}>{resumo.pagos}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>🎟 Ticket Médio</Text>
          <Text style={styles.cardValor}>R$ {resumo.ticketMedio.toFixed(2)}</Text>
        </View>
      </View>

      {/* Gráfico fake */}
      <View style={styles.graficoContainer}>
        <Text style={styles.graficoTitulo}>Gráfico de Faturamento</Text>
        <View style={styles.graficoFake}>
          <Text style={{ color: '#999' }}>(Aqui vai o gráfico)</Text>
        </View>
      </View>

      {/* Lista de transações */}
      <Text style={styles.subtitulo}>Transações recentes</Text>
      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transacaoItem}>
            <Text style={styles.transacaoDescricao}>{item.descricao}</Text>
            <Text
              style={[
                styles.transacaoValor,
                { color: item.valor >= 0 ? '#2e7d32' : '#c62828' }
              ]}
            >
              R$ {Math.abs(item.valor).toFixed(2)}
            </Text>
            <Text style={styles.transacaoData}>{item.data}</Text>
          </View>
        )}
        scrollEnabled={false}
      />

      {/* Botão nova transação */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('NovaTransacao')}
      >
        <Text style={styles.buttonText}>+ Nova Transação</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f5e9',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2e7d32',
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filtroButton: {
    backgroundColor: '#c8e6c9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  filtroButtonAtivo: {
    backgroundColor: '#2e7d32',
  },
  filtroText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  filtroTextAtivo: {
    color: '#fff',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderColor: '#81c784',
    borderWidth: 1,
  },
  cardTitulo: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 4,
  },
  cardValor: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
  },
  graficoContainer: {
    marginBottom: 20,
  },
  graficoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  graficoFake: {
    height: 150,
    backgroundColor: '#c8e6c9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  transacaoItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderColor: '#81c784',
    borderWidth: 1,
  },
  transacaoDescricao: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  transacaoValor: {
    fontSize: 16,
    fontWeight: '700',
  },
  transacaoData: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
