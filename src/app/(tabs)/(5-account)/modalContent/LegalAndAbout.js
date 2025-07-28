import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LegalModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Legal & About</Text>
      <Text>This is the Legal & About modal screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
}); 
 
 
 