import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAllServices } from '../database/database';

export default function ServiceList({ navigation }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadServices);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>R$ {Number(item.price).toFixed(2)}</Text>
      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum serviço cadastrado ainda.</Text>}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ServiceForm')}>
        <Text style={styles.addButtonText}>+ Novo Serviço</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#4CAF50', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  name: { fontSize: 18, fontWeight: '600', color: '#333' },
  price: { fontSize: 16, color: '#555', marginTop: 4 },
  description: { fontSize: 14, color: '#777', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 40, color: '#777' },
  addButton: { backgroundColor: '#4CAF50', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
