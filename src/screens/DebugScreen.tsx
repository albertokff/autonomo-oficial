import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { limparDadosDoBancoFirebase } from '../utils/debugDbTools';

export default function DebugScreen() {

  return (
    <View style={styles.container}>
      <Button title="🧹 Limpar Dados" onPress={limparDadosDoBancoFirebase} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-around' },
});
