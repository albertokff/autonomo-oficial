import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function NotificacaoScreen() {
  // Simulando notificações (você pode buscar da API depois)
  const notificacoes = [
    { id: 1, mensagem: 'Agendamento com Carla confirmado para amanhã às 14h.', lida: false },
    { id: 2, mensagem: 'Dica enviada para suas clientes hoje.', lida: true },
    { id: 3, mensagem: 'Novo pedido adicionado para cliente Ana.', lida: false },
    { id: 4, mensagem: 'Estoque de tecidos atualizado.', lida: true },
    { id: 5, mensagem: 'Agendamento concluído com sucesso ontem.', lida: true },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Notificações</Text>

      {notificacoes.map((item) => (
        <View
          key={item.id}
          style={[
            styles.notificationCard,
            !item.lida && styles.unreadNotification,
          ]}
        >
          <Text style={styles.notificationText}>{item.mensagem}</Text>
          {!item.lida && (
            <TouchableOpacity style={styles.marcarLidaButton}>
              <Text style={styles.marcarLidaText}>Marcar como lida</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef7ef',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: '#c8e6c9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  unreadNotification: {
    borderColor: '#66bb6a',
    backgroundColor: '#f1f8f1',
  },
  notificationText: {
    fontSize: 16,
    color: '#2e7d32',
    marginBottom: 8,
  },
  marcarLidaButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#2e7d32',
    borderRadius: 8,
  },
  marcarLidaText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
