import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getAllServices, deleteService } from '../database/servicesFirebase';

export default function ServiceReport({ navigation }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [isFocused]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir o serviço "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteService(id);
              fetchServices(); // recarrega lista após exclusão
            } catch (error) {
              console.error('Erro ao excluir serviço:', error);
              Alert.alert('Erro', 'Não foi possível excluir o serviço.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.servicePrice}>R$ {item.price.toFixed(2)}</Text>
          {item.description ? (
            <Text style={styles.serviceDescription}>{item.description}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.name)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Serviços Cadastrados</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ServiceForm')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#d32f2f',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 2,
  },
});
