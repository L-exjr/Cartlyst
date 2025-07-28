import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ListsModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lists and Registries</Text>
      <Text>This is the Lists and Registries modal screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
}); 

 
 