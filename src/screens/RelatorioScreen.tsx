import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { getResumoMensalFromFirebase, getAgendamentosFeitos } from '../database/database';

// Ajuste de acordo com sua estrutura de rotas
type RootStackParamList = {
  RelatorioScreen: undefined;
  ServiceList: undefined;
  AgendamentosPorMesScreen: undefined;
  FaturamentoPorMesScreen: undefined;
  RelatorioServicosScreen: undefined;
  RelatorioClientesScreen: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RelatorioScreen'>;
  route: RouteProp<RootStackParamList, 'RelatorioScreen'>;
};

type Resumo = {
  totalAgendamentos: number;
  totalServicos: number;
  faturamento: number;
  mediaPorDia: number;
  servicoMaisRealizado: string;
};

type RelatorioDetalhado = {
  id: string;
  titulo: string;
  descricao: string;
};

export default function RelatorioScreen({ navigation }: Props) {
  const [resumo, setResumo] = useState<Resumo>({
    totalAgendamentos: 0,
    totalServicos: 0,
    faturamento: 0,
    mediaPorDia: 0,
    servicoMaisRealizado: '',
  });

  const relatoriosDetalhados: RelatorioDetalhado[] = [
    { id: '1', titulo: 'Agendamentos Por Mês', descricao: 'Veja todos os agendamentos por data' },
    { id: '2', titulo: 'Faturamento Por Mês', descricao: 'Visualize quanto você faturou em determinado período' },
    { id: '4', titulo: 'Serviços Mais Realizados', descricao: 'Confira quais serviços são mais populares' },
    { id: '5', titulo: 'Clientes Mais Assíduos', descricao: 'Identifique seus clientes mais assíduos' },
    { id: '6', titulo: 'Horários mais movimentados', descricao: 'Descubra os horários de pico' },
  ];

  const handleDetalheRelatorio = (titulo: string) => {
    if (titulo === 'Agendamentos Por Mês') {
      navigation.navigate('AgendamentosPorMesScreen');
    }

    if (titulo == 'Faturamento Por Mês') {
      navigation.navigate('FaturamentoPorMesScreen')
    }

    if (titulo == 'Serviços Mais Realizados') {
      navigation.navigate('RelatorioServicosScreen')
    }

    if (titulo == 'Clientes Mais Assíduos') {
      navigation.navigate('RelatorioClientesScreen')
    }
  };

  const aplicarFiltro = async (periodo: '7dias' | 'mes' | 'personalizado') => {
    const hoje = new Date();
    const ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    let inicio: Date, fim: Date;

    switch (periodo) {
      case '7dias':
        fim = hoje;
        inicio = new Date();
        inicio.setDate(hoje.getDate() - 6);
        break;
      case 'mes':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        fim = ultimoDiaDoMes;
        break;
      case 'personalizado':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 10);
        fim = hoje;
        break;
    }

    const inicioStr = inicio.toISOString().slice(0, 10);
    const fimStr = fim.toISOString().slice(0, 10);

    const resumo = await getResumoMensalFromFirebase(inicioStr, fimStr);
    const agendamentosFeitos = await getAgendamentosFeitos(inicioStr, fimStr);

    const diasComServico = new Set<string>();
    agendamentosFeitos.forEach(item => {
      const dia = item.data.split('T')[0]; // normaliza a data para yyyy-mm-dd
      diasComServico.add(dia);
    });

    const numeroDiasComServico = diasComServico.size;

    const mediaPorDia = numeroDiasComServico > 0
      ? Math.round((resumo.faturamentoTotal / 30) * 10) / 10
      : 0;

    setResumo({
      totalAgendamentos: resumo.totalMes,
      totalServicos: resumo.feitosMes,
      faturamento: resumo.faturamentoTotal,
      mediaPorDia,
      servicoMaisRealizado: resumo.servicoMaisRealizado,
    });
  };







  useEffect(() => {
    aplicarFiltro('mes'); // filtro padrão para carregar dados do mês atual
  }, []);


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
          <Text style={styles.cardNumero}>R$ {resumo.mediaPorDia.toFixed(2)}</Text>
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
        <TouchableOpacity style={styles.filtroButton} onPress={() => aplicarFiltro('7dias')}>
          <Text style={styles.filtroText}>Últimos 7 dias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filtroButton} onPress={() => aplicarFiltro('mes')}>
          <Text style={styles.filtroText}>Este mês</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filtroButton} onPress={() => aplicarFiltro('personalizado')}>
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
