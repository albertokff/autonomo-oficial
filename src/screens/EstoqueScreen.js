import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function EstoqueScreen() {
  // Exemplo de dados do estoque
  const itensEstoque = [
    { id: 1, nome: 'Tecido floral azul', quantidade: 3, unidade: 'metros' },
    { id: 2, nome: 'Linha branca', quantidade: 12, unidade: 'bobinas' },
    { id: 3, nome: 'Zíper 20cm', quantidade: 1, unidade: 'peças' },
    { id: 4, nome: 'Botões médios', quantidade: 25, unidade: 'peças' },
    { id: 5, nome: 'Viés rosa', quantidade: 0, unidade: 'metros' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Estoque</Text>

        {itensEstoque.map((item) => (
          <View
            key={item.id}
            style={[
              styles.itemCard,
              item.quantidade <= 2 && styles.lowStockCard,
              item.quantidade === 0 && styles.outOfStockCard,
            ]}
          >
            <Text style={styles.itemName}>{item.nome}</Text>
            <Text style={styles.itemQuantidade}>
              {item.quantidade} {item.unidade}
            </Text>
            {item.quantidade === 0 ? (
              <Text style={styles.statusText}>Esgotado</Text>
            ) : item.quantidade <= 2 ? (
              <Text style={styles.statusText}>Estoque baixo</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Adicionar item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef7ef',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80, // espaço extra para não esconder o botão
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 20,
  },
  itemCard: {
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
  lowStockCard: {
    borderColor: '#ffa000',
    backgroundColor: '#fff8e1',
  },
  outOfStockCard: {
    borderColor: '#d32f2f',
    backgroundColor: '#ffebee',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 5,
  },
  itemQuantidade: {
    fontSize: 16,
    color: '#4e944f',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2e7d32',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 7,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
