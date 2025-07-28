import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BuyAgainModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy Again</Text>
      <Text>This is the Buy Again modal screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
 
 