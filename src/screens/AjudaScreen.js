import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const helpTopics = [
  {
    id: 1,
    title: 'Como agendar um serviço?',
    content:
      'Para agendar um serviço, vá até a tela de agendamento, preencha os campos obrigatórios com os dados do cliente, serviço, data e horário, e clique em "Salvar Agendamento".',
  },
  {
    id: 2,
    title: 'Como visualizar relatórios?',
    content:
      'Acesse o menu de relatórios para ver os dados de agendamentos, financeiros e outros indicadores importantes do seu negócio.',
  },
  {
    id: 3,
    title: 'Como usar a central de mensagens?',
    content:
      'Na central de mensagens, você pode enviar mensagens programadas via WhatsApp para seus clientes, visualizar lembretes e enviar dicas de costura.',
  },
  {
    id: 4,
    title: 'Como controlar o estoque?',
    content:
      'Na tela de estoque, adicione, remova e visualize os materiais que você possui, ajudando a manter o controle dos seus insumos.',
  },
  {
    id: 5,
    title: 'Como enviar feedback?',
    content:
      'Na tela de feedback, você pode enviar sugestões, reportar problemas ou compartilhar ideias diretamente com os desenvolvedores do app.',
  },
];

export default function AjudaScreen() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Central de Ajuda</Text>
      {helpTopics.map(({ id, title, content }) => (
        <View key={id} style={styles.topicContainer}>
          <TouchableOpacity onPress={() => toggleExpand(id)} style={styles.topicHeader}>
            <Text style={styles.topicTitle}>{title}</Text>
            <Text style={styles.expandIcon}>{expandedId === id ? '-' : '+'}</Text>
          </TouchableOpacity>
          {expandedId === id && <Text style={styles.topicContent}>{content}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e9f5e9',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 25,
    textAlign: 'center',
  },
  topicContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#81c784',
    borderWidth: 1,
    overflow: 'hidden',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  topicTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2e7d32',
  },
  expandIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2e7d32',
  },
  topicContent: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
});
