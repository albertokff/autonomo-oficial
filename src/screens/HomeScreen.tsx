import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getResumoMensal } from '../database/database';

const { width } = Dimensions.get('window');

type Feeling = { emoji: string; label: string };
type DashboardCard = { label: string; value: string };
type Action = { label: string; icon: string };

const feelings: Feeling[] = [
  { emoji: '😊', label: 'Feliz' },
  { emoji: '😐', label: 'Neutro' },
  { emoji: '😞', label: 'Triste' },
  { emoji: '😡', label: 'Irritado' },
];

const mainActions: Action[] = [
  { label: 'Novo Serviço', icon: 'add-box' },
  { label: 'Novo Cliente', icon: 'person-add' },
  { label: 'Pendências', icon: 'error-outline' },
];

const extraActions: Action[] = [
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
  { label: 'Debug', icon: 'settings'}
];

async function fetchDashboardData(): Promise<{ agenda: number; atendidos: number; faturamento: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        agenda: 1,
        atendidos: 7,
        faturamento: 3250.5,
      });
    }, 1000);
  });
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([
    { label: 'Agenda', value: '...' },
    { label: 'Atendidos', value: '...' },
    { label: 'Faturamento', value: '...' },
  ]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? 0 : -width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [sidebarVisible, slideAnim]);

  useFocusEffect(
    useCallback(() => {
      async function loadDashboard() {
        try {
          const data = await getResumoMensal();
          setDashboardCards([
            { label: 'Agenda', value: data.totalMes.toString() },
            { label: 'Atendidos', value: data.feitosMes.toString() },
            { label: 'Faturamento Total', value: `R$ ${data.faturamentoTotal.toFixed(2).replace('.', ',')}` },
            { label: 'Faturado (feitos)', value: `R$ ${data.faturado.toFixed(2).replace('.', ',')}` },
          ]);
        } catch (error) {
          console.error('Erro ao carregar dados do dashboard:', error);
        }
      }
      loadDashboard();
    }, [])
  );

  const closeSidebar = () => setSidebarVisible(false);

  const handleOverlayPress = (e: GestureResponderEvent) => {
    if (e.target === e.currentTarget) {
      closeSidebar();
    }
  };

  function logout() {
    alert('Logout acionado');
  }

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
        <Text style={styles.greeting}>Olá, {'seja bem-vindo'}!</Text>

        {/* Cards do dashboard */}
        <View style={styles.cardsContainer}>
          {dashboardCards.map((card) => (
            <View key={card.label} style={styles.card}>
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

        {/* Ações principais */}
        <View style={styles.actionsContainer}>
          {mainActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              onPress={() => {
                switch (action.label) {
                  case 'Novo Serviço':
                    navigation.navigate('ServiceForm');
                    break;
                  case 'Novo Cliente':
                    navigation.navigate('ClientForm');
                    break;
                  case 'Pendências':
                    navigation.navigate('PendenciasScreen');
                    break;
                  default:
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

        {/* Extras */}
        <Text style={[styles.feelingsTitle, { marginTop: 30 }]}>Mais opções</Text>
        <View style={styles.actionsContainerExtra}>
          {extraActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCardExtra}
              onPress={() => {
                navigation.navigate(`${action.label.replace(' ', '')}Screen`);
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
      <Modal transparent visible={sidebarVisible} animationType="none" onRequestClose={closeSidebar}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleOverlayPress}>
          <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
            <Text style={styles.sidebarTitle}>Menu</Text>
            {/* Aqui você pode adicionar itens do menu */}
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
  greeting: { fontSize: 28, fontWeight: '600', marginBottom: 25, color: '#2e7d32' },
  cardsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginBottom: 40,
},
card: {
  backgroundColor: '#e9f5e9',
  width: '48%',
  marginBottom: 10,
  borderRadius: 12,
  padding: 15,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
},
  cardTitle: { fontSize: 16, fontWeight: '500', color: '#2e7d32' },
  cardValue: { fontSize: 20, fontWeight: '700', color: '#2e7d32' },
  feelingsContainer: { marginBottom: 30 },
  feelingsTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10, color: '#2e7d32' },
  emojisRow: { flexDirection: 'row', justifyContent: 'space-around' },
  emojiButton: { padding: 10, borderRadius: 8 },
  emojiSelected: { backgroundColor: '#c8e6c9' },
  emoji: { fontSize: 28 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  actionCard: {
    backgroundColor: '#2e7d32',
    width: 100,
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
  },
  actionCardText: { color: '#fff', fontWeight: '500', textAlign: 'center' },
  actionsContainerExtra: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCardExtra: {
    backgroundColor: '#e8f5e9',
    width: '30%',
    marginBottom: 15,
    alignItems: 'center',
    borderRadius: 12,
    padding: 8,
  },
  actionCardTextExtra: { color: '#2e7d32', fontSize: 12, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#2e7d32',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  sidebarTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 20 },
  sidebarItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4caf50',
  },
  sidebarText: { fontSize: 18 },
  logoutSidebar: { marginTop: 30, backgroundColor: '#d32f2f', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
});
