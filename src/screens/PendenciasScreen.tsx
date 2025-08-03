import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAllAgendamentos, marcarAgendamentoComoFeito, Agendamento } from '../database/agendamentosFIrebase';

export default function PendenciasScreen() {
  const [pendencias, setPendencias] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarPendencias = async () => {
    try {
      const agendamentos = await getAllAgendamentos();
      const naoFeitos = agendamentos.filter((a) => !a.feito);
      setPendencias(naoFeitos);
    } catch (error) {
      console.error('Erro ao carregar pendências:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolverPendencia = async (id: string) => {
    try {
      await marcarAgendamentoComoFeito(id);
      Alert.alert('Sucesso', 'Pendência resolvida!');
      carregarPendencias(); // atualiza a lista
    } catch (error) {
      console.error('Erro ao marcar como feito:', error);
      Alert.alert('Erro', 'Não foi possível resolver a pendência.');
    }
  };

    function formatarData(dataString: string): string {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}-${mes}-${ano}`;
    }


  useEffect(() => {
    carregarPendencias();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pendências</Text>
      {loading ? (
        <Text style={styles.loading}>Carregando...</Text>
      ) : pendencias.length === 0 ? (
        <Text style={styles.empty}>Nenhuma pendência encontrada.</Text>
      ) : (
        <FlatList
          data={pendencias}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.texto}>
                📅 {formatarData(item.data)} - 🕒 {item.horario}
              </Text>
              <Text style={styles.texto}>
                👤 {item.clienteSelecionado} - 💼 {item.servico}
              </Text>
              <Text style={styles.texto}>💰 R$ {item.valor}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => resolverPendencia(item.id)}
              >
                <Text style={styles.buttonText}>Resolver</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9f5e9', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32', marginBottom: 20 },
  loading: { textAlign: 'center', color: '#2e7d32' },
  empty: { textAlign: 'center', color: '#2e7d32' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  texto: { color: '#2e7d32', fontSize: 16, marginBottom: 4 },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
