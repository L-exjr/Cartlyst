import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecentlySearchedModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Searched</Text>
      <Text>This is the Recently Searched modal screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
 
 