import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

export default function RelatorioScreen({ navigation }) {
  // Mock de dados
  const resumo = {
    totalAgendamentos: 28,
    totalServicos: 25,
    faturamento: 1500.00,
    mediaPorDia: 2.5,
    servicoMaisRealizado: 'Corte de Cabelo',
  };

  const relatoriosDetalhados = [
    { id: '1', titulo: 'Agendamentos por período', descricao: 'Veja todos os agendamentos por data' },
    { id: '2', titulo: 'Faturamento por período', descricao: 'Visualize quanto você faturou em determinado período' },
    { id: '3', titulo: 'Serviços por período', descricao: 'Confira quais serviços foram cadastrados' },
    { id: '4', titulo: 'Serviços mais realizados', descricao: 'Confira quais serviços são mais populares' },
    { id: '5', titulo: 'Clientes mais frequentes', descricao: 'Identifique seus clientes mais assíduos' },
    { id: '6', titulo: 'Horários mais movimentados', descricao: 'Descubra os horários de pico' },
  ];

  const handleDetalheRelatorio = (titulo) => {
    if (titulo === 'Serviços por período') {
        navigation.navigate('ServiceList')
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Relatórios & Estatísticas</Text>
      <Text style={styles.subtitle}>Visualize o desempenho do seu negócio</Text>

      {/* Cards de resumo */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardNumero}>{resumo.totalAgendamentos}</Text>
          <Text style={styles.cardLabel}>Agendamentos no mês</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumero}>{resumo.totalServicos}</Text>
          <Text style={styles.cardLabel}>Serviços realizados</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumero}>R$ {resumo.faturamento.toFixed(2)}</Text>
          <Text style={styles.cardLabel}>Faturamento</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumero}>{resumo.mediaPorDia}</Text>
          <Text style={styles.cardLabel}>Média por dia</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumero}>{resumo.servicoMaisRealizado}</Text>
          <Text style={styles.cardLabel}>Serviço + realizado</Text>
        </View>
      </View>

      {/* Filtros rápidos */}
      <Text style={styles.sectionTitle}>Filtros rápidos</Text>
      <View style={styles.filtrosContainer}>
        <TouchableOpacity style={styles.filtroButton}>
          <Text style={styles.filtroText}>Últimos 7 dias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filtroButton}>
          <Text style={styles.filtroText}>Este mês</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filtroButton}>
          <Text style={styles.filtroText}>Personalizado</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de relatórios detalhados */}
      <Text style={styles.sectionTitle}>Relatórios detalhados</Text>
      <FlatList
        data={relatoriosDetalhados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.relatorioItem}
            onPress={() => handleDetalheRelatorio(item.titulo)}
          >
            <Text style={styles.relatorioTitulo}>{item.titulo}</Text>
            <Text style={styles.relatorioDescricao}>{item.descricao}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Visualização gráfica simulada */}
      <Text style={styles.sectionTitle}>Gráfico (simulado)</Text>
      <View style={styles.graficoMock}>
        <Text style={styles.graficoText}>📊 Gráfico de faturamento / serviços aqui</Text>
      </View>

      {/* Botão para exportar */}
      <TouchableOpacity style={styles.buttonExportar}>
        <Text style={styles.buttonExportarText}>Exportar Relatório (PDF)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f5e9',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2e7d32',
  },
  subtitle: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: '#81c784',
    borderWidth: 1,
    elevation: 3,
  },
  cardNumero: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2e7d32',
  },
  cardLabel: {
    fontSize: 14,
    color: '#2e7d32',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
    marginTop: 20,
    marginBottom: 10,
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filtroButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filtroText: {
    color: '#fff',
    fontSize: 14,
  },
  relatorioItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderColor: '#81c784',
    borderWidth: 1,
  },
  relatorioTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  relatorioDescricao: {
    fontSize: 13,
    color: '#2e7d32',
  },
  graficoMock: {
    height: 150,
    backgroundColor: '#c8e6c9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  graficoText: {
    color: '#2e7d32',
    fontSize: 14,
  },
  buttonExportar: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonExportarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
