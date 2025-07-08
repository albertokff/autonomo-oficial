import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const feelings = [
  { emoji: '😊', label: 'Feliz' },
  { emoji: '😐', label: 'Neutro' },
  { emoji: '😞', label: 'Triste' },
  { emoji: '😡', label: 'Irritado' },
];

const dashboardCards = [
  { label: 'Agenda', value: '12' },
  { label: 'Atendidos', value: '5' },
  { label: 'Faturamento', value: 'R$ 2.340,00' },
];

const mainActions = [
  { label: 'Novo Serviço', icon: 'add-box' },
  { label: 'Novo Cliente', icon: 'person-add' },
  { label: 'Pendências', icon: 'error-outline' },
];

const extraActions = [
  { label: 'Agenda', icon: 'event' },
  { label: 'Relatórios', icon: 'bar-chart' },
  { label: 'Financeiro', icon: 'attach-money' },
  { label: 'Mensagem', icon: 'message' },
  { label: 'Configurações', icon: 'settings' },
  { label: 'Equipe', icon: 'group' },
  { label: 'Notificações', icon: 'notifications' },
  { label: 'Estoque', icon: 'inventory' },
  { label: 'Feedback', icon: 'feedback' },
  { label: 'Ajuda', icon: 'help-outline' },
];

export default function HomeScreen() {
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (sidebarVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [sidebarVisible, slideAnim]);

  const closeSidebar = () => setSidebarVisible(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setSidebarVisible(true)}
          style={styles.menuButton}
          accessibilityLabel="Abrir menu lateral"
        >
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      {/* Conteúdo principal */}
      <ScrollView style={styles.mainArea} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.greeting}>Olá, {user?.name || 'seja bem-vindo'}!</Text>

        {/* Cards do dashboard */}
        <View style={styles.cardsContainer}>
          {dashboardCards.map((card) => (
            <View
              key={card.label}
              style={styles.card}
              accessibilityLabel={`${card.label}: ${card.value}`}
            >
              <Text style={styles.cardTitle}>{card.label}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
            </View>
          ))}
        </View>

        {/* Seção sentimentos */}
        <View style={styles.feelingsContainer}>
          <Text style={styles.feelingsTitle}>Como você está se sentindo?</Text>
          <View style={styles.emojisRow}>
            {feelings.map((feeling) => (
              <TouchableOpacity
                key={feeling.label}
                style={[
                  styles.emojiButton,
                  selectedFeeling?.label === feeling.label && styles.emojiSelected,
                ]}
                onPress={() => setSelectedFeeling(feeling)}
                accessibilityLabel={`Sentimento: ${feeling.label}`}
              >
                <Text style={styles.emoji}>{feeling.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cards principais de ações */}
        <View style={styles.actionsContainer}>
          {mainActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              onPress={() => {
                if (action.label === 'Novo Serviço') {
                  navigation.navigate('ServiceForm');
                } else if (action.label === 'Novo Cliente') {
                  navigation.navigate('ClientForm');
                } else if (action.label === 'Pendências') {
                  navigation.navigate('PendenciasScreen')
                } else {
                  alert('Funcionalidade ainda não implementada!');
                }
              }}
              accessibilityLabel={`Ação principal: ${action.label}`}
            >
              <MaterialIcons name={action.icon} size={30} color="#fff" style={{ marginBottom: 8 }} />
              <Text style={styles.actionCardText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Novos cards extras */}
        <Text style={[styles.feelingsTitle, { marginTop: 30 }]}>Mais opções</Text>
        <View style={styles.actionsContainerExtra}>
          {extraActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCardExtra}
              onPress={() => {
                if (action.label === 'Agenda') {
                  navigation.navigate('AgendaScreen')
                } else if (action.label === 'Relatórios') {
                  navigation.navigate('RelatorioScreen')
                } else if (action.label === 'Financeiro') {
                  navigation.navigate('FinanceiroScreen')
                } else if (action.label === 'Mensagem') {
                  navigation.navigate('MensagemScreen')
                } else if (action.label === 'Notificações') {
                  navigation.navigate('NotificacaoScreen')
                } else if (action.label === 'Estoque') {
                  navigation.navigate('EstoqueScreen')
                } else if (action.label === 'Feedback') {
                  navigation.navigate('FeedbackScreen')
                } else if (action.label === 'Ajuda') {
                  navigation.navigate('AjudaScreen')
                } else {
                  alert('Funcionalidade ainda não implementada!')
                }
              }}
              accessibilityLabel={`Opção extra: ${action.label}`}
            >
              <MaterialIcons name={action.icon} size={28} color="#2e7d32" style={{ marginBottom: 6 }} />
              <Text style={styles.actionCardTextExtra}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Sidebar modal */}
      <Modal
        transparent
        visible={sidebarVisible}
        animationType="none"
        onRequestClose={closeSidebar}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={closeSidebar}
          accessibilityLabel="Fechar menu lateral"
        >
          <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
            <Text style={styles.sidebarTitle}>Menu</Text>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Dashboard">
              <Text style={styles.sidebarText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Meus Serviços">
              <Text style={styles.sidebarText}>Meus Serviços</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Perfil">
              <Text style={styles.sidebarText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Agenda">
              <Text style={styles.sidebarText}>Agenda</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Relatórios">
              <Text style={styles.sidebarText}>Relatórios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Financeiro">
              <Text style={styles.sidebarText}>Financeiro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Mensagens">
              <Text style={styles.sidebarText}>Mensagens</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Configurações">
              <Text style={styles.sidebarText}>Configurações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Equipe">
              <Text style={styles.sidebarText}>Equipe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Notificações">
              <Text style={styles.sidebarText}>Notificações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Estoque">
              <Text style={styles.sidebarText}>Estoque</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Feedback">
              <Text style={styles.sidebarText}>Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={closeSidebar} accessibilityLabel="Ir para Ajuda">
              <Text style={styles.sidebarText}>Ajuda</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sidebarItem, styles.logoutSidebar]}
              onPress={() => {
                closeSidebar();
                logout();
              }}
              accessibilityLabel="Sair do aplicativo"
            >
              <Text style={[styles.sidebarText, { color: '#fff' }]}>Sair</Text>
            </TouchableOpacity>
          </Animated.View>

        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 60,
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  menuButton: { padding: 8, marginRight: 15 },
  menuText: { fontSize: 28, color: '#fff' },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#fff' },
  mainArea: { flex: 1 },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 25,
    color: '#2e7d32',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#e9f5e9',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#388e3c',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
  },
  feelingsContainer: { marginBottom: 20 },
  feelingsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2e7d32',
  },
  emojisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  emojiSelected: { backgroundColor: '#a5d6a7' },
  emoji: { fontSize: 28 },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#2e7d32',
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    marginBottom: 10,
  },
  actionCardText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  actionsContainerExtra: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCardExtra: {
    backgroundColor: '#e9f5e9',
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCardTextExtra: {
    color: '#2e7d32',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#2e7d32',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  sidebarTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 20 },
  sidebarItem: { marginBottom: 15 },
  sidebarText: { color: '#fff', fontSize: 18 },
  logoutSidebar: { marginTop: 30 },
});
